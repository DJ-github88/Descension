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
        description: 'We stand taller than other folk because the north demands it. Shoulders broad enough to carry what winter takes. Our skin bears the map of our lives—scars from blades, wind-burn from storms, the pale mark of cold that never leaves. Frost falls from our lips even in the warmth of southern lands, a breath that crystallizes into ghosts of the white we survived. We braid our hair with bone and iron because we are made of both. Our eyes hold the color of the winter sky: blue when the storm breaks, gray when the blizzard holds, pale green when the aurora dances. We trace our blood to warrior-kings who carved their names into glacier ice with hammers stained red. But we remember them not as stories, but as debts. Every clan carries burdens from before the common speech was born. Some carry ancient feuds, others sacred vows, still others the weight of kings who refused to die even when ice claimed their flesh. We are not merely human. The north remade us. Each winter hardened our flesh like steel. Each storm forged our will like weapons. We became something the cold recognizes as its own.',
        icon: 'fas fa-mountain',
        overview: `The wind screams outside our longhouse, carrying the voice of the glacier that buried my father and his father before him. Inside, the fire burns low—enough to see, not enough to warm. This is how we live. This is how we survive. My grandfather used to say that warmth makes you soft, that the north demands hardness because it intends to kill you. He survived five winters alone in the wastes before returning with his mind changed and his skin marked by frost that never faded. Now he's buried beneath the cairn stones outside, where the snow refuses to settle properly. The stones whisper if you listen close. Not lies exactly, but truths that would break lesser folk.

Our clans bind everything. You might think clan is family, but it's deeper. It's which ancestor you claim, which debts your blood owes, which feuds demand your death. The Bloodhammer clan traces to the first warrior-king who stood against the endless white and carved his kingdom from frozen waste with nothing but rage and a red-stained hammer. The Rune-Keepers claim descent from shaman-kings who walked into the deepest winter and returned with eyes that saw past and future woven together. The Frostbound... they say their scouts went too far into the eternal winter and came back changed, flesh hardened and cold become part of them. Each clan hates the others. Bloodhammers call Rune-Keepers whispering cowards who hide behind spirits. Rune-Keepers mock Bloodhammers as mindless beasts who've forgotten what it means to be human. Frostbound pity us both, looking down from their glacier peaks with eyes that barely remember what humanity feels like. But when the white comes, we all share the same fire and the same longhouse walls. The north doesn't care about clan feuds. It just kills anyone it can.

Children learn the clan web before they know their own names. Which bloodlines are bound by marriage-kin, which ones have spilled blood for five generations, which debts must be paid before honor can rest. I've seen six-year-olds recite feuds older than their grandfathers. We don't write things down often. The cold destroys paper. We carve our histories into runestones and speak them in tongues that predate common speech. Every rune tells a story. Every burial mound holds a debt. The longhouse fire doesn't just warm. It shows who owes what, which stories must be told tonight, which spirits need appeasing. When you sit at a Nordmark fire, you're sitting with everyone who ever sat there before you.

We don't take land. We claim it. Clan banners mark territory won through blood and winter, each banner a grave marker for those who died holding the ground. Survival requires strength in the north. Respect requires honor. But honor is a debt that grows heavier each generation. Wrongs unavenged. Sagas left unfinished. Blood debts passed down like heirlooms. I've seen marriages end over a blood-debt from three generations back. I've seen clan wars that lasted until everyone involved had forgotten why they started fighting. The traditions outlive empires because they work. Winter kills the weak. Only harsh ways keep folk alive up here.

When a Nordmark dies far from the longhouse fire, their spirit wanders the wastes seeking the light that leads to the ancestor halls. My grandmother claimed she saw her uncle's spirit, trapped in the ice for fifty years because he died raiding southern lands. She said the frost preserved his memory like meat in a cellar. But if you break a clan oath, that light never comes. Just endless white, wandering until the ice takes your name from memory itself. I've seen oathbreakers—they don't fear death. They fear being forgotten. They fear the cold that waits outside the longhouse walls, the cold that knows us all by name.`,
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
                        }
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
                                    description: 'Gain +5 slashing damage when below 50% HP',
                                    statModifier: {
                                        stat: 'slashing_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_bludgeoning_damage',
                                    name: 'Rage Bludgeoning Damage',
                                    description: 'Gain +5 bludgeoning damage when below 50% HP',
                                    statModifier: {
                                        stat: 'bludgeoning_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_piercing_damage',
                                    name: 'Rage Piercing Damage',
                                    description: 'Gain +5 piercing damage when below 50% HP',
                                    statModifier: {
                                        stat: 'piercing_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_ranged_damage',
                                    name: 'Rage Ranged Damage',
                                    description: 'Gain +5 ranged damage when below 50% HP',
                                    statModifier: {
                                        stat: 'ranged_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_defense',
                                    name: 'Reckless Defense',
                                    description: 'Lose 2 armor when below 50% HP',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_saves',
                                    name: 'Reckless Courage',
                                    description: 'Lose 2 to saving throws when below 50% HP',
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
                            type: 'long_rest',
                            value: 1
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
                culturalBackground: `The oldest sagas speak of the first shaman-king who walked alone into the deepest winter and returned changed—their eyes saw not the present but threads of past and future woven together. That first keeper learned to read omens in ice patterns on glass, to hear dead ancestors in the aurora's dance, to carve runes that hold memory itself. The Rune-Keepers trace their bloodline to this ancestor, carrying what they call a gift, though some whisper it is a curse.

Before their eighteenth winter, every Rune-Keeper undertakes the vision quest—not a rite of passage, but a breaking, a remaking. They are taken to frozen caves deep in the wastes, places where ice has never melted, where cold burns with an intensity that sears. Here, alone in darkness broken only by aurora-light through cracks in the ice, they spend days without food or fire, sustained only by visions granted by the ancestors.

When the visions come, and they always come, the runes get carved into their flesh with needles made from the bones of previous keepers. Each rune marks a story learned, a secret kept, a debt owed to the dead. The carving is slow, deliberate, and permanent—knowledge that cannot be unlearned. These runes don't fade. They grow deeper with age, scars piling up like pages in a book written in flesh. Sometimes overlapping, creating new patterns and new meanings.

Rune-Keeper longhouses are libraries rather than armories. Their walls are lined with shelves of carved bone tablets. Their floors are marked with runic circles that glow faintly in firelight. Here, sagas are preserved not just in words but in memory-stones that whisper if you know how to listen. They are historians keeping records spanning millennia, judges whose rulings carry the weight of ancestral precedent, mediators who see disputes through dead eyes.

Rituals let them commune with spirits bound to ice and storm, speaking with ancestors who haven't passed on but linger in the spaces between breaths, in the silence of deep winter. But it costs. Every time a Rune-Keeper peers into fate or communes with the dead, they lose a piece of themselves—a memory burned away, a feeling they can no longer name. Some forget what warmth feels like. Others forget what it meant to love or hate. The ancestors don't care about their souls. They care about what can be seen for them.

The Rune-Keepers view the Bloodhammer as mindless beasts who have forgotten what it means to be human, whose rage is just an excuse to avoid thinking about how empty their lives become between battles. When the fury fades, what is left? Bloodhammer become hollow. The Rune-Keepers, through their transformations, become something else—something that sees beyond the hunger, beyond the cold, beyond the endless white.

They view the Frostbound with a complex mixture of pity and recognition. The Frostbound look at their runes and say they're marked by the same cold that marked them, just in a different way. The Rune-Keepers see kinship—their runes come from visions and ancestors, the Frostbound's scars come from surviving where nothing should survive. Both are marked by the eternal winter, but while the Frostbound let the cold remake their flesh, the Rune-Keepers let it remake their minds.`,
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
                        }
                    },
                    {
                        id: 'ancestral_whispers_nordmark',
                        name: 'Ancestral Whispers',
                        description: 'Commune with ancestor spirits for guidance, gaining insight but owing them stories in return.',
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
                            type: 'short_rest',
                            value: 1
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

The sagas tell of scouts who went too far into the eternal winter, into places where cold doesn't just kill but transforms. They didn't return as they left—they came back changed, flesh hardened, breath no longer visible because their lungs learned to breathe the cold itself. The Frostbound claim descent from those altered scouts. Their bloodline carries the mark. Their tradition is one of the harshest.

Before they can take their place in the longhouse, every Frostbound spends three winters alone in the deepest wastes—places even Rune-Keepers won't go. These are not survival tests but initiations, a communion with cold so absolute it remakes the body. Through generations of this rite, their bloodline has adapted in ways that border on unnatural. Flesh grows harder each winter. Cold tolerance becomes legendary. Bodies shaped by the land itself.

Some say the eternal winter recognizes them, that the cold welcomes them home. Frostbound longhouses rise in the worst places—glacier peaks where wind never stops, valleys the sun barely reaches, places other Nordmark won't build. They are outposts, forward positions. Frostbound scout ahead, guide paths that only exist in winter, guard borders most can't even see. Their survival arts are passed down not from books, but from the land itself—how to read ice stories as they form, how to find food in frozen ground, how to endure cold that would shatter steel.

Endurance matters most. Honor is measured in winters survived, paths found through terrain that kills. Independence matters. In the deepest cold, relying on others means death.

But it costs. Each generation tolerates warmth less. Their hardened flesh cracks in temperatures others find comfortable. Skin splits wider. Bodies betray them in summer lands. Many Frostbound cannot leave the north—the transformation is too complete. Warmth becomes poison. Skin cracks and bleeds. Lungs struggle with air that holds heat. Some say their blood runs cold as ice, their hearts beat with glacier rhythm.

They are edge-dwellers, respected for their resilience but kept at distance. Something about the way their eyes barely focus on anything that isn't snow. The way their skin feels like stone that's been left out too long. Other Nordmark look at them and see what the cold does to those who stay too long. The Frostbound look back and see folk who have never truly met the north—not really. They fight it, bargain with it, live in its shadow. The Frostbound have let it in.

The Frostbound view the Bloodhammer as short-sighted warriors who fight the winter with rage and steel, but rage burns out and weapons break. The cold lasts forever. The Bloodhammer don't fight the white—they endure it for a while, then it takes them. The Frostbound became it.

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
                            effects: [{
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
                        }
                    },
                    {
                        id: 'winters_guidance_nordmark',
                        name: 'Winter\'s Guidance',
                        description: 'The eternal winter speaks to you, revealing safe paths through blizzards and predicting weather changes.',
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
                            type: 'short_rest',
                            value: 1
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
                                    description: 'Take double fire damage',
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
                        }
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

    corvani: {
        id: 'corvani',
        name: 'Corvani',
        description: 'The mystical Corvani of the fog-choked peaks have spent countless generations serving as bridges between the mundane world and whatever lies beyond the mist. Secure in their impregnable settlements clinging to cliffs where maps mean nothing and the veil between worlds grows thin, the Corvani rarely venture beyond the treacherous highland paths that only they can navigate. Even so, when the boundaries between realms began to fray and threats emerged from spaces between worlds, the Corvani offered their sight to the defense of all who stood against the darkness. The wise and unflinching Corvani proved to be the eyes of the alliance against otherworldly threats and helped warn of dangers that would have claimed the unprepared. Recently the Corvani rediscovered a series of ancient mist-oracles that held the key to the secrets of their lost heritage—prophecies spoken by ancestors who first dared to make bargains with entities that wear raven shapes. Driven to discover the truth about his people\'s fabled origins, the Seer Council of the Raven-Seers ordered that the Corvani shift their focus from tribal isolation to the preservation of the veil itself. The council helped to create the Mist-Guard\'s Circle, a group utterly devoted to plumbing the secrets of the thin places and delving out the truth of the Corvani\'s fabled existence. An integral part of the highland defense, the enigmatic Corvani have been called away to battle the forces that would pierce the veil and bring madness to all realms. In these perilous times, the defense of the border between worlds falls to brave Corvani like you. The spirits of the mist watch over you, and the veil itself is your strength. The future of your people is in your hands.',
        icon: 'fas fa-crow',
        overview: `The Corvani are mountain folk whose ancestors made pacts with things that dwell in the mists. Their raven-black markings aren't tattoos. They're inherited patterns that shift with each generation, darkening with each prophecy spoken, each glimpse through the veil. The markings mark those chosen by the old powers. They live in isolated tribal communities scattered across fog-choked peaks, villages built where the veil between worlds grows thin. The Corvani don't choose to see things others miss. It's in their blood, passed down through tribal lineages. They serve as guides, messengers, mediators between the mundane world and whatever lies beyond the mist.`,
        culturalBackground: `Corvani society runs on tribal bloodlines and old traditions. Their settlements cling to mist-shrouded peaks, cut off from the lowlands by paths that shouldn't exist and fog that never lifts. Each tribe traces its lineage to ancestors who made bargains with entities that wear raven shapes. Pacts that granted survival in exchange for service. The markings on their skin are inherited. They darken with each generation, each prophecy spoken, each glimpse of the other side. Tribal elders pass down the old ways. How to read omens in the mist. How to navigate paths that shouldn't exist. How to speak with things that don't belong in this world. Corvani children are raised knowing they'll inherit the sight. The burden. The duty to serve as bridges between realms. Tribal disputes settle through divination and mediation, seers reading futures in fog patterns. They trade in secrets and warnings. Their services are valuable but costly. Those who seek Corvani counsel pay in coin, blood, or pieces of their own fate.`,
        variantDiversity: 'The Corvani are divided into two major bloodlines: The Raven-Seers dedicate themselves to prophecy and fate-reading, serving as seers and advisors, while the Mist-Runners train as messengers and scouts, navigating the treacherous highland paths.',
        integrationNotes: {
            actionPointSystem: 'Corvani abilities often involve perception, divination, and mobility, offering unique tactical advantages in information gathering and positioning.',
            backgroundSynergy: 'Corvani excel in backgrounds that emphasize spirit, perception, and supernatural connections. Their prophetic abilities complement mystical and spiritual paths.',
            classCompatibility: 'Corvani make excellent spellcasters, scouts, and support characters. Their perception bonuses and divination abilities enhance classes that rely on information and foresight.'
        },
        meaningfulTradeoffs: 'Corvani variants gain powerful perception and divination abilities but often suffer from physical frailty or vulnerability to specific damage types. Their gifts come with compulsions and drawbacks.',
        baseTraits: {
            languages: ['Common', 'Corvid'],
            lifespan: '90-110 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '130-190 lbs',
            build: 'Slender and agile'
        },
        subraces: {
            oracle: {
                id: 'oracle_corvani',
                name: 'Raven Seer',
                description: 'Many Corvani secrets were lost to mists that swallow whole mountains, but the ancient oracles of Raven-Seers, carved into fog-shrouded peaks deep within the highlands, have never surrendered their sight to the veil. A marvel to the Corvani\'s skill at peering into futures, Raven-Seer sanctuaries were constructed in places where the veil grows thin: vast underground networks of seers, prophets, and fate-weavers. While the highland traditions have been weakened by centuries of isolation, the Raven-Seers of the Mist-Orales, led by Prophet-Keeper Veth Raven-Eyes, are weaving a new understanding of what lies beyond the mist.', the weight of visions. When they scry, their eyes go blank white and their breath forms mist patterns.',
                culturalBackground: `The Raven-Seers trace their lineage to the first seers who learned to read the future in mist patterns and hear prophecies in raven calls. Their tradition requires that every member undergo initiation rites during their sixteenth year. Nights alone in the fog where their markings deepen and their sight awakens. Raven-Seer markings shift and darken with each prophecy spoken, each future glimpsed. Their skin becomes a map of fates seen and warnings given. Members serve as seers, advisors, mediators. Reading omens for other bloodlines and lowland folk who seek their counsel. They practice ancient divination rituals passed down through generations. Scrying in mist pools. Reading patterns in fog. Interpreting the calls of ravens. But the sight exacts a price. Each vision chips away at their grip on reality. Minds fractured by too many futures seen. Children born with deep markings are trained from youth. Their education balances learning control and accepting the inevitable madness that comes with the gift. The bloodline values foresight and guidance. Honor measured in prophecies fulfilled and disasters prevented. They are the vision-keepers of Corvani society. Revered and feared for what they see.`,
                statModifiers: {
                    spirit: 3,
                    intelligence: 2,
                    constitution: -3
                },
                traits: [
                    {
                        id: 'prophetic_glimpse_corvani',
                        name: 'Prophetic Glimpse',
                        description: 'Advantage on one roll • 1d6 psychic damage',
                        level: 1,
                        icon: 'spell_holy_prophecy',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'damage'],
                        typeConfig: {
                            school: 'divination',
                            secondaryElement: 'time',
                            icon: 'spell_holy_prophecy',
                            tags: ['divination', 'future-sight', 'prophecy']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            effects: [
                                {
                                    id: 'prophetic_insight',
                                    name: 'Prophetic Insight',
                                    description: 'Advantage on one attack, save, or ability check',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'You glimpse possible futures'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        damageConfig: {
                            formula: '1d6',
                            damageType: 'direct',
                            elementType: 'psychic'
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'raven_sight_corvani',
                        name: 'Raven Sight',
                        description: 'Your bloodline\'s gift of glimpsing futures sharpens your senses to pierce illusions and see what others miss, but leaves your fractured mind vulnerable to psychic forces that echo the madness of too many visions.',
                        level: 1,
                        icon: 'ability_hunter_eagleeye',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'perception',
                            secondaryElement: 'detection',
                            icon: 'ability_hunter_eagleeye',
                            tags: ['perception', 'illusion-detection', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'enhanced_perception',
                                    name: 'Enhanced Perception',
                                    description: 'Advantage on Perception checks',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your senses are supernaturally keen'
                                    }
                                },
                                {
                                    id: 'illusion_detection',
                                    name: 'Illusion Detection',
                                    description: 'Detect illusions within 30 feet'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'psychic_vulnerability',
                                    name: 'Psychic Vulnerability',
                                    description: 'Disadvantage on saves against psychic damage'
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
                        }
                    },
                    {
                        id: 'fates_burden_corvani',
                        name: 'Fate\'s Burden',
                        description: 'The weight of glimpsing countless futures leaves your spirit thin, vulnerable to necrotic forces that extinguish unrealized destinies and psychic intrusions that shatter your fragile hold on reality.',
                        level: 1,
                        icon: 'spell_shadow_curseofsargeras',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'fate',
                            icon: 'spell_shadow_curseofsargeras',
                            tags: ['vulnerability', 'fate', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'necrotic_vulnerability',
                                    name: 'Necrotic Vulnerability',
                                    description: '50% more necrotic damage • Fate\'s burden'
                                },
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Psychic Vulnerability',
                                    description: 'Take 50% more psychic damage',
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
                        }
                    }
                ],
                languages: ['Common', 'Corvid', 'Ethereal'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 24, // Hardy from surviving treacherous peaks
                    mana: 32, // Enhanced perception from Raven Sight
                    ap: 3, // Balanced scouts
                    passivePerception: 15, // Enhanced perception from Raven Sight, seeing futures
                    swimSpeed: 15, // Survival in mountainous regions
                    climbSpeed: 20, // Mountain scouts, excellent climbers
                    visionRange: 60,
                    darkvision: 30,
                    initiative: 1 // Alert scouts
                },
                savingThrowModifiers: {
                    // Planar fluidity makes them hard to restrain but vulnerable to confusion
                    advantage: ['grappled'], // Not fully anchored to reality, hard to physically restrain
                    disadvantage: ['stun'] // Planar visions make them vulnerable to confusion
                }
            },
            scout: {
                id: 'scout_corvani',
                name: 'Mist Runner',
                description: 'Lean and wiry from constant movement through treacherous paths. Skin pale from endless fog, markings lighter than seers but still visible. Feet calloused from rock and ice. Eyes adapted to low light, pupils wider than normal. Many develop a habit of talking to themselves or the mist. Hair often damp with condensation.',
                culturalBackground: `The Mist-Runners claim descent from the first messengers who learned to walk paths through the mist that others cannot see. Their tradition requires that every member spend years training as runners. Learning to navigate fog-shrouded peaks where maps fail and compasses spin madly. Mist-Runners are raised from childhood to read the mist. Their instincts honed by generations of mountain navigation. They serve as messengers between isolated Corvani settlements. Guides for those who dare the highland paths. Members learn ancient techniques passed down through generations. How to read wind patterns. How to find paths in impenetrable fog. How to carry messages through territories where normal navigation fails. But the mist takes its toll. Prolonged exposure to the thick fog leaves them disoriented. Minds filled with whispers and shadows that may or may not be real. Many Mist-Runners develop strange habits. Speaking to the mist. Following paths that lead nowhere. The bloodline values duty and reliability. Honor measured in messages delivered and travelers guided safely. They are the pathfinders of Corvani society. Trusted messengers whose service keeps the isolated settlements connected.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    constitution: -2
                },
                traits: [
                    {
                        id: 'highland_navigation_corvani',
                        name: 'Highland Navigation',
                        description: 'Your ancestral knowledge of the highlands grants unparalleled navigation abilities in natural terrain.',
                        level: 1,
                        icon: 'ability_druid_dash',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'terrain',
                            icon: 'ability_druid_dash',
                            tags: ['navigation', 'movement', 'terrain', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Perfect Navigation',
                                    description: 'Cannot become lost in natural terrain',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Always know your exact location in natural environments'
                                    }
                                },
                                {
                                    name: 'Difficult Terrain Mastery',
                                    description: 'Move at full speed through difficult terrain',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Difficult terrain costs no extra movement'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'navigation',
                                name: 'Navigation',
                                description: 'Perfect knowledge of natural terrain and unhindered movement.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'raven_messenger_corvani',
                        name: 'Raven Messenger',
                        description: 'Send messages through ravens to any location you have personally visited.',
                        level: 1,
                        icon: 'spell_nature_ravenform',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'raven',
                            icon: 'spell_nature_ravenform',
                            tags: ['communication', 'messenger', 'raven']
                        },
                        utilityConfig: {
                            utilityType: 'communication',
                            selectedEffects: [{
                                id: 'messenger',
                                name: 'Messenger',
                                description: 'Send messages via ravens to any location you have visited.'
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
                            actionPoints: 1,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    },
                    {
                        id: 'mist_walker_corvani',
                        name: 'Mist Walker',
                        description: 'Step partially into the mists, becoming resistant to physical damage but vulnerable to radiant energies.',
                        level: 1,
                        icon: 'spell_nature_invisibilty',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'mist',
                            icon: 'spell_nature_invisibilty',
                            tags: ['mist', 'defense', 'vulnerability']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Physical Resistance',
                                    description: 'Resistance to bludgeoning, piercing, and slashing damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Take half damage from physical attacks'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Radiant Vulnerability',
                                    description: 'Take double damage from radiant sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 100,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 1,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    }
                ],
                languages: ['Common', 'Corvid', 'Sylvan'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 22,
                    mana: 26,
                    ap: 4, // Scouts/messengers need mobility and quick reactions
                    passivePerception: 3, // Excellent scouts, navigate fog-shrouded peaks
                    swimSpeed: 5, // Survival skills include water navigation
                    climbSpeed: 10, // Excellent climbers, navigate treacherous mountain paths
                    visionRange: 60,
                    darkvision: 30, // Eyes adapted to low light, pupils wider than normal
                    initiative: 2 // Scouts, quick to react
                },
                savingThrowModifiers: {
                    // Mist walkers navigate fog but are vulnerable to confusion
                    advantage: ['blinded'], // Comfortable navigating fog and low visibility
                    disadvantage: ['stun'] // Disoriented by mental confusion effects
                }
            }
        }
    },

    grimheart: {
        id: 'grimheart',
        name: 'Grimheart',
        description: 'Stout folk with flesh hardened like stone from generations in the deep. Skin grayish and rough, bones dense and heavy. Hands calloused and scarred from working metal and stone. Eyes adapted to darkness, pupils too wide for surface light. They move slow but steady, their weight settling like stone. Hair often dusted with mineral powder, clothes stained with earth and soot.',
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
                        }
                    },
                    {
                        id: 'earth_sense_grimheart',
                        name: 'Earth Sense',
                        description: 'Sense minerals, passages, and underground features within range.',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'stone_frailty_grimheart',
                        name: 'Stone Frailty',
                        description: 'Your stone-hardened flesh is vulnerable to acids that dissolve mineral matter.',
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
                                    description: 'Take 50% more acid damage',
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
                        }
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
                        description: 'Sacrifice yourself to protect allies, absorbing damage but taking extra harm from the effort.',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'deep_sight_grimheart',
                        name: 'Deep Sight',
                        description: 'Enhanced vision adapted to the darkness of the deep earth.',
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
                        }
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
                                    description: 'Take 50% more lightning damage',
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
                        }
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
                        }
                    },
                    {
                        id: 'forge_craft_grimheart',
                        name: 'Forge Craft',
                        description: '+1 weapon damage • +1 armor • 1 hour',
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
                                    description: 'Weapon gains +1 damage',
                                    statModifier: {
                                        stat: 'weapon_damage',
                                        magnitude: 1,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'enhanced_armor',
                                    name: 'Enhanced Armor',
                                    description: 'Armor gains +1 protection',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'stone_frailty_forgemaster',
                        name: 'Stone Frailty',
                        description: 'Your stone-hardened flesh is vulnerable to acids that dissolve mineral matter.',
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
                                    description: 'Take 50% more acid damage',
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
                        }
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

    vheil: {
        id: 'vheil',
        name: 'Vheil',
        description: 'Pale folk from border regions where reality grows thin. Skin never tans, stays white as bone. Eyes see layers others can\'t, pupils sometimes reflecting things that aren\'t there. Bodies thin and light, as if not fully anchored to this world. Hair colorless or silver-white. They move quietly, their footsteps making no sound on some surfaces. Touch feels cold, like touching mist.',
        icon: 'fas fa-ghost',
        overview: 'The Vheil are pale-skinned folk whose ancestors settled in border regions where the veil between worlds grows thin. Through generations of living in these liminal spaces, their bloodlines have been marked by the ethereal. Their skin never tanning. Their eyes seeing layers of reality others cannot perceive. They are organized into communities that follow the thin places. Settlements built where the mundane world borders the unseen. The Vheil don\'t choose to see spirits. It\'s in their blood, passed down through ancestral lines that have served as bridges between realms for centuries.',
        culturalBackground: `Vheil communities follow the thin places. Settlements built where the veil between worlds grows thin. Their camps are quiet affairs, lit by pale lanterns that cast no heat. Children taught from birth to recognize the signs of the other side. Each community traces its lineage to ancestors who first learned to commune with spirits. Traditions passed down through generations. Vheil children are raised knowing they'll inherit the sight. Learning to recognize when mist lingers too long. When shadows walk alone. When something unseen watches. Community elders pass down the old ways. How to speak with the dead. How to navigate the spaces between worlds. How to serve as mediators for the restless. They trade in guidance and mediation. Their services valuable but costly. Those who seek Vheil help pay in coin, warmth, or pieces of their own peace. Community disputes settle through spirit-counsel and the wisdom of elders who have seen too much. They are a people bound by duty and haunted by visions. Their role as bridges between worlds both gift and curse.`,
        variantDiversity: 'The Vheil are divided into two major bloodlines: The Spirit-Talkers dedicate themselves to communication with the dead and serving as intermediaries, while the Between-Walkers traverse the boundaries between planes and explore the spaces between worlds.',
        integrationNotes: {
            actionPointSystem: 'Vheil abilities focus on perception, communication with otherworldly entities, and brief planar transitions. Their ethereal nature provides unique utility and defensive options.',
            backgroundSynergy: 'Vheil excel in backgrounds emphasizing spirit, spirituality, and supernatural knowledge. Their connection to other planes complements mystical and divine paths.',
            classCompatibility: 'Vheil make excellent clerics, mediums, and support casters. Their ability to perceive hidden threats and communicate with spirits provides valuable party utility.'
        },
        meaningfulTradeoffs: 'Vheil gain powerful perception and planar abilities but suffer from physical frailty and mental strain from constant exposure to multiple realities. Their gifts can be overwhelming.',
        baseTraits: {
            languages: ['Common', 'Ethereal'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'4" - 6\'0"',
            weight: '110-160 lbs',
            build: 'Slender and ethereal'
        },
        subraces: {
            medium: {
                id: 'medium_vheil',
                name: 'Spirit Talker',
                description: 'Palest of all Vheil, skin nearly translucent. Eyes completely black, reflecting only the other side. Voices carry unnatural echoes, layers of sound as if multiple voices speak at once. Skin grows colder with each spirit communed. Many develop a habit of speaking to empty air. Fingers often show signs of frostbite despite never being in cold weather.',
                culturalBackground: `The Spirit-Talkers trace their lineage to the first mediums who learned to speak with the dead and commune with wandering spirits. Their tradition requires that every member undergo initiation rites during their fifteenth year. Nights spent in graveyards and thin places where their connection to the other side awakens. Spirit-Talker voices carry unnatural echoes. Normal conversation unsettles those who listen. A sign that spirits speak through them. Members serve as mediators, negotiators, guides. Helping the dead find peace and the living understand what lies beyond. They practice ancient rituals passed down through generations. How to call spirits. How to negotiate with the restless. How to sever connections before they consume you. But each conversation chips away at their humanity. Pale skin grows paler with each spirit they commune with. Eyes darkening until they reflect only what lies beyond. The bloodline values service and mediation. Honor measured in spirits laid to rest and connections severed before they consume. They are the bridge-builders of Vheil society. Both necessary and feared for what they become.`,
                statModifiers: {
                    spirit: 3,
                    intelligence: 2,
                    constitution: -2
                },
                traits: [
                    {
                        id: 'spirit_communion_vheil',
                        name: 'Spirit Communion',
                        description: 'Commune with spirits for information. Gain advantage on one Intelligence or Spirit check.',
                        level: 1,
                        icon: 'spell_shadow_haunting',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'ethereal',
                            icon: 'spell_shadow_haunting',
                            tags: ['communication', 'spirit', 'guidance']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Gain advantage on one Intelligence or Spirit check',
                            effects: [
                                {
                                    name: 'Spirit Guidance',
                                    description: 'Advantage on one Intelligence or Spirit check',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Spirits provide insight and knowledge'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'communication',
                                name: 'Communication',
                                description: 'Commune with nearby spirits to gain information or guidance.'
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
                            actionPoints: 2,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    },
                    {
                        id: 'ethereal_sight_vheil',
                        name: 'Ethereal Sight',
                        description: 'Can see into the Ethereal Plane and detect invisible creatures within 30 feet.',
                        level: 1,
                        icon: 'spell_shadow_eyeofkilrogg',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'perception',
                            secondaryElement: 'ethereal',
                            icon: 'spell_shadow_eyeofkilrogg',
                            tags: ['perception', 'ethereal', 'detection', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Ethereal Vision',
                                    description: 'Can see into the Ethereal Plane',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Perceive creatures and objects in the Ethereal Plane'
                                    }
                                },
                                {
                                    name: 'Invisibility Detection',
                                    description: 'Detect invisible creatures within 30 feet',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your sight pierces magical concealment'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'radiant_vulnerability_vheil',
                        name: 'Radiant Vulnerability',
                        description: 'Vulnerable to radiant damage (+50% damage) as your connection to the spirit realm makes you susceptible to purifying holy energies.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
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
                        }
                    }
                ],
                languages: ['Common', 'Ethereal', 'Celestial'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 18, // Nearly translucent, physically frail from spirit communion
                    mana: 36, // Strong spiritual connection grants extra mana
                    ap: 2, // More contemplative, less action-oriented (spirit communion takes time)
                    passivePerception: 15, // Ethereal Sight - can see into Ethereal Plane, detect invisible
                    swimSpeed: 20, // Not swimmers, calculated from speed
                    climbSpeed: 15, // Physically frail, not climbers
                    visionRange: 60,
                    darkvision: 0, // Can see ethereal, but not darkvision
                    initiative: -2 // Slow to react, focused on spirit realm
                },
                savingThrowModifiers: {
                    // Spirit communion enhances mental clarity but makes them vulnerable to paralysis
                    disadvantage: ['paralyze'], // Spirit realm connection vulnerable to paralysis effects
                    advantage: ['fear'] // Spirit communion resists fear effects
                }
            },
            walker: {
                id: 'walker_vheil',
                name: 'Between Walker',
                description: 'Forms blur at the edges, as if not fully present. Skin sometimes semi-transparent in certain light. Eyes flicker between normal and seeing through reality. Many have a habit of phasing slightly, their outline wavering. Hands sometimes pass through objects without meaning to. Movement is fluid, gliding rather than walking. Their presence feels unstable, like they could vanish at any moment.',
                culturalBackground: `The Between-Walkers claim descent from the first explorers who learned to step through the spaces between worlds. Their tradition requires that every member spend years training in the thin places. Learning to navigate boundaries where reality grows unstable. Between-Walkers are raised from childhood to sense planar rifts. Their instincts honed by generations of walking between worlds. They serve as messengers, guides, explorers. Traveling paths that exist only in the spaces between. Members learn ancient techniques passed down through generations. How to find gaps in reality. How to step through shadows that shouldn't exist. How to navigate the liminal spaces without getting lost. But walking between worlds takes its toll. Prolonged exposure leaves them disoriented. Forms blurring at the edges. Connection to any single reality weakening. Many Between-Walkers develop strange habits. Speaking to shadows. Following paths that lead nowhere. The bloodline values exploration and service. Honor measured in messages delivered and travelers guided safely through dangerous boundaries. They are the pathfinders of Vheil society. Trusted with tasks that require traversing impossible spaces.`,
                statModifiers: {
                    agility: 3,
                    intelligence: 2,
                    constitution: -3
                },
                traits: [
                    {
                        id: 'ethereal_step_vheil',
                        name: 'Ethereal Step',
                        description: 'Briefly step into the Ethereal Plane to avoid attacks.',
                        level: 1,
                        icon: 'spell_arcane_blink',
                        spellType: 'REACTION',
                        effectTypes: ['utility', 'defense'],
                        typeConfig: {
                            school: 'transmutation',
                            secondaryElement: 'ethereal',
                            icon: 'spell_arcane_blink',
                            tags: ['movement', 'ethereal', 'evasion', 'reaction']
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'planar_shift',
                                name: 'Planar Shift',
                                description: 'Step briefly into the Ethereal Plane to avoid damage.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        triggerConfig: {
                            global: {
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        triggerType: 'on_attack_targeted',
                                        conditions: {
                                            targetType: 'self'
                                        }
                                    }
                                ]
                            }
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'reality_anchor_vheil',
                        name: 'Reality Anchor',
                        description: 'Immune to forced planar travel and can stabilize dimensional rifts.',
                        level: 1,
                        icon: 'spell_holy_holyprotection',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'abjuration',
                            secondaryElement: 'planar',
                            icon: 'spell_holy_holyprotection',
                            tags: ['immunity', 'planar', 'stability', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Planar Immunity',
                                    description: 'Immune to forced planar travel',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'Cannot be forcibly banished or transported to other planes'
                                    }
                                },
                                {
                                    name: 'Rift Stabilization',
                                    description: 'Can stabilize dimensional rifts',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your presence calms unstable planar boundaries'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'force_vulnerability_vheil',
                        name: 'Force Vulnerability',
                        description: 'Vulnerable to force damage (+50% damage) as your tenuous connection to reality makes you susceptible to energies that disrupt planar boundaries.',
                        level: 1,
                        icon: 'spell_arcane_blast',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'force',
                            icon: 'spell_arcane_blast',
                            tags: ['vulnerability', 'force', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Force Vulnerability',
                                    description: 'Take 50% more force damage',
                                    statusEffect: {
                                        vulnerabilityType: 'force',
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
                        }
                    }
                ],
                languages: ['Common', 'Ethereal', 'Abyssal'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 20, // Forms blur at edges, tenuous reality connection makes them physically frail
                    mana: 34, // Strong planar connection grants enhanced mana
                    ap: 4, // Quick and agile, can step between planes - extra action point
                    passivePerception: 14, // Can sense planar rifts and navigate boundaries
                    swimSpeed: 18, // Can phase through water barriers
                    climbSpeed: 15, // Can phase through solid obstacles
                    visionRange: 65,
                    darkvision: 0,
                    initiative: 3 // Quick to react, fluid movement, gliding rather than walking
                },
                savingThrowModifiers: {
                    // Planar fluidity allows escape from restraints but vulnerability to stunning
                    advantage: ['grappled'], // Fluid movement allows escape from grapples
                    disadvantage: ['stun'] // Tenuous reality connection vulnerable to stunning effects
                }
            }
        }
    },

    mimir: {
        id: 'mimir',
        name: 'Mimir',
        description: 'People whose features never stay the same. Skin shifts subtly, faces blur when you look away. Eyes change color, sometimes reflecting whoever they last saw. Flesh feels like clay, malleable and unstable. Many avoid mirrors, unable to bear seeing their formless reflection. When they transform, their bones creak and shift audibly. They smell faintly of glass and polish.',
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
                        description: 'Copy appearance and voice of observed creatures. Gain advantage on disguise checks.',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'adaptive_form_mimir',
                        name: 'Adaptive Form',
                        description: 'Alter physical features for disguise or advantage on social checks.',
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
                            type: 'short_rest',
                            value: 1
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
                                    description: 'Take 50% more damage from silver weapons',
                                    statusEffect: {
                                        vulnerabilityType: 'silver',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
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
                        }
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
                id: 'broken_mimir',
                name: 'Shattered',
                description: 'Features shift randomly, never fully settling on one form. Eyes show multiple colors at once, fractured like stained glass. Movements are jerky, as if controlled by different minds. Many keep journals of memories they are trying to preserve. Speech patterns change mid-sentence. Some have physical fractures visible on their skin, lines where their form breaks apart. They avoid all reflective surfaces.',
                culturalBackground: `The Shattered trace their lineage to Mimir whose sense of self broke under the weight of too many transformations. Their tradition is one of recovery and memory-keeping. Communities built around preserving what fragments of identity remain. Shattered communities are quiet places of reflection. Members avoiding mirrors and focusing on the few memories they can hold onto. They practice ancient memory-keeping techniques. How to preserve identity fragments. How to resist personality bleed. How to piece together who they might have been. But their minds are kaleidoscopes of stolen memories and fading recollections. Personalities shifting with the light. A Shattered might act like a child one moment and a sage the next. Fractured mind making them unpredictable. They hoard shards of identity like precious gems. Desperately trying to piece together who they were before the breaking. The bloodline values memory and stability. Honor measured in fragments preserved and identities remembered. They are the memory-keepers of Mimir society. Pitied for their broken state but respected for what they remember.`,
                statModifiers: {
                    intelligence: 3,
                    spirit: 2,
                    agility: 1
                },
                traits: [
                    {
                        id: 'fractured_mind_mimir',
                        name: 'Fractured Mind',
                        description: 'Resistance to charm and fear effects due to mental fragmentation.',
                        level: 1,
                        icon: 'spell_shadow_mindrot',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'mental',
                            secondaryElement: 'defense',
                            icon: 'spell_shadow_mindrot',
                            tags: ['resistance', 'charm', 'fear', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Charm Resistance',
                                    description: 'Resistance to charm effects',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your fragmented mind is difficult to control'
                                    }
                                },
                                {
                                    name: 'Fear Resistance',
                                    description: 'Resistance to fear effects',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your fractured mind cannot focus on fear'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'memory_fragments_mimir',
                        name: 'Memory Fragments',
                        description: 'Access random knowledge or skills from fragmented memories. Gain advantage on one Intelligence or Spirit check.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'mental',
                            secondaryElement: 'memory',
                            icon: 'spell_holy_mindvision',
                            tags: ['knowledge', 'memory', 'mental']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Gain advantage on one Intelligence or Spirit check',
                            effects: [
                                {
                                    name: 'Memory Access',
                                    description: 'Access fragments of past knowledge',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Memories surface to provide insight'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'knowledge',
                                name: 'Knowledge',
                                description: 'Access fragments of absorbed memories to recall knowledge you may have never learned.'
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'psychic_vulnerability_mimir',
                        name: 'Psychic Vulnerability',
                        description: 'Vulnerable to psychic damage (+50% damage) as your fractured mind is susceptible to mental intrusions.',
                        level: 1,
                        icon: 'spell_shadow_psychichorrors',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'psychic',
                            icon: 'spell_shadow_psychichorrors',
                            tags: ['vulnerability', 'psychic', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Psychic Vulnerability',
                                    description: 'Take +50% damage from psychic sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Changeling', 'Deep Speech'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 26, // Fractured but physically intact
                    mana: 32, // Memory fragments grant enhanced mana
                    ap: 2, // Fractured mind, jerky movements - less action-oriented
                    passivePerception: 13, // Memory keepers, hoard fragments of knowledge
                    swimSpeed: 20, // Not swimmers, calculated from speed
                    climbSpeed: 15, // Jerky movements, not climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: -1 // Jerky movements, unpredictable - slower to react
                },
                savingThrowModifiers: {
                    // Fractured mind resistant to fear but vulnerable to confusion
                    disadvantage: ['stun'], // Fractured mind vulnerable to confusion
                    advantage: ['fear'] // Fractured mind resists fear
                }
            }
        }
    },

    briaran: {
        id: 'briaran',
        name: 'Briaran',
        description: 'Fae-touched folk with thorns growing from their skin like living contracts. Skin marked by thorny patterns that shift and bloom. Hair often intertwined with vines and thorns. Eyes carry an otherworldly glint, reflecting moonlight even in daylight. Hands bear scars from thorns that turn inward when promises break. They smell of roses and old blood. Their thorns respond to spoken words, growing when promises are made.',
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
        subraces: {
            courtly: {
                id: 'courtly_briaran',
                name: 'Oathbound',
                description: 'Thorns bloom beautifully, often growing flowers alongside the barbs. Skin marked by elegant thorn patterns that shift when contracts are made. Hands precise and careful, many bear small puncture wounds from thorns testing their own honesty. Eyes carry the weight of unbreakable promises. Speech patterns formal, every word chosen carefully. Their thorns serve as living lie detectors, drawing blood from their own hands when they speak false.',
                culturalBackground: `The Oathbound trace their lineage to the first Briaran who bound themselves to the noble fae courts. Bloodline marked by thorns that bloom with every promise made. Their tradition requires that every member learn the ancient art of contract-making. Apprenticeships spent studying the complex etiquette of fae courts. Oathbound courts are built around negotiation halls where bargains are made. Members serving as diplomats, mediators, deal-makers. They practice ancient techniques passed down through generations. How to craft binding promises. How to read intent in words. How to enforce contracts through thorn and pain. Their thorns serve as living lie detectors. An Oathbound's handshake can draw blood if intentions are false. But they pay dearly. Breaking their own promises causes their thorns to turn inward. Tearing at their flesh from within. The bloodline values honor and precision. Worth measured in contracts fulfilled and promises kept. They are the diplomats of Briaran society. Their word law but their freedom forever bound by the thorns that enforce it.`,
                statModifiers: {
                    charisma: 3,
                    intelligence: 2,
                    constitution: -2
                },
                traits: [
                    {
                        id: 'binding_oath_briaran',
                        name: 'Binding Oath',
                        description: 'Create magical contracts. Targets must succeed on Spirit save (DC 14) or be bound by terms. You are also bound by your own contracts.',
                        level: 1,
                        icon: 'spell_holy_prayerofhealing',
                        spellType: 'ACTION',
                        effectTypes: ['utility', 'debuff'],
                        typeConfig: {
                            school: 'enchantment',
                            secondaryElement: 'fae',
                            icon: 'spell_holy_prayerofhealing',
                            tags: ['contract', 'social', 'binding', 'fae']
                        },
                        utilityConfig: {
                            utilityType: 'contract',
                            selectedEffects: [{
                                id: 'binding',
                                name: 'Binding',
                                description: 'Create a magical contract that binds both parties to agreed terms.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'major'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Oath Bound',
                                    description: 'You are bound by your own contract terms',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Breaking the oath results in severe consequences'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            saveDC: 14,
                            saveType: 'spirit',
                            saveOutcome: 'negates',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'touch',
                            targetRestrictions: ['willing']
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            type: 'long_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'court_etiquette_briaran',
                        name: 'Court Etiquette',
                        description: 'Fae blood grants you perfect grace in the courts of nobility and fair folk.',
                        level: 1,
                        icon: 'spell_holy_divineprovidence',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'social',
                            secondaryElement: 'fae',
                            icon: 'spell_holy_divineprovidence',
                            tags: ['social', 'nobility', 'fae', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Court Etiquette',
                                    description: 'Advantage on social interactions with nobility and fae creatures',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your fae heritage grants insight into courtly behavior'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'iron_vulnerability_briaran_oathbound',
                        name: 'Iron Vulnerability',
                        description: 'Fae heritage leaves you vulnerable to cold iron (+50% damage from iron weapons).',
                        level: 1,
                        icon: 'inv_ingot_iron',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'iron',
                            icon: 'inv_ingot_iron',
                            tags: ['vulnerability', 'iron', 'fae', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Iron Vulnerability',
                                    description: 'Cold iron wounds your fae-touched flesh (+50% damage from iron weapons)',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Sylvan', 'Celestial'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 20, // Elegant but physically weaker from fae heritage
                    mana: 35, // Fae connection grants enhanced mana
                    ap: 3, // Diplomatic, standard AP
                    passivePerception: 13, // Precise and careful, read intent in words
                    swimSpeed: 10, // Not swimmers, calculated from speed
                    climbSpeed: 10, // Courtly, not climbers
                    visionRange: 50,
                    darkvision: 0,
                    initiative: 0 // Formal and careful, not quick to react
                },
                savingThrowModifiers: {
                    // Fae heritage makes them vulnerable to iron damage
                    disadvantage: ['poison'], // Vulnerable to iron poisoning from fae heritage
                    advantage: ['charm'] // Master diplomats resist social control
                }
            },
            wild: {
                id: 'wild_briaran',
                name: 'Thornscar',
                description: 'Skin covered in scars where thorns turned inward. Thorns grow twisted and jagged, broken from attempts to remove them. Hands calloused from fighting and survival. Eyes fierce and untamed. Many have thorns still embedded in old wounds, causing constant low pain. They move with primal grace, muscles built from living wild. Hair often tangled with briars and thorns they refuse to remove.',
                culturalBackground: `The Thornscar trace their lineage to Briaran who broke their fae contracts. Thorns turning inward and scarring their flesh as punishment. Their tradition is one of rejection and freedom. Communities built away from fae courts in wild groves where thorns grow wild. Thornscar settlements are primal places where nature magic runs free. Members serving as warriors, hunters, protectors of the wild. They practice ancient survival arts passed down through generations. How to fight with thorns. How to channel nature's fury. How to live free despite the scars. Their skin is a tapestry of old wounds. Each scar telling a story of obligation rejected and freedom won. But freedom comes at a cost. Their thorns still grow. Still bind. Still cause pain when promises are made. The bloodline values independence and strength. Honor measured in scars earned and chains broken. They are the wild ones of Briaran society. Free from court etiquette but forever marked by the thorns that turned against them.`,
                statModifiers: {
                    strength: 3,
                    constitution: 2,
                    agility: 2
                },
                traits: [
                    {
                        id: 'briar_form_briaran',
                        name: 'Briar Form',
                        description: 'Transform into thorny vines. Gain resistance to bludgeoning/slashing damage but become immobile.',
                        level: 1,
                        icon: 'spell_nature_thorns',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'transformation'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'transformation',
                            icon: 'spell_nature_thorns',
                            tags: ['transformation', 'defense', 'nature']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Physical Resistance',
                                    description: 'Resistance to bludgeoning and slashing damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your form becomes thorny vines'
                                    }
                                },
                                {
                                    name: 'Immobile',
                                    description: 'Cannot move while in briar form',
                                    statusEffect: {
                                        level: 'minor',
                                        description: 'Your roots anchor you in place'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: false
                        },
                        transformationConfig: {
                            transformationType: 'physical',
                            targetType: 'self',
                            duration: 1,
                            durationUnit: 'minutes',
                            power: 'moderate',
                            specialEffects: ['damage_resistance', 'immobile', 'thorns']
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'thorn_strike_briaran',
                        name: 'Thorn Strike',
                        description: 'Living thorns grown from fae bargains deal +1 damage and cause bleeding (1d4/round for 3 rounds).',
                        level: 1,
                        icon: 'ability_druid_ferociousbite',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'combat',
                            secondaryElement: 'nature',
                            icon: 'ability_druid_ferociousbite',
                            tags: ['combat', 'natural-weapons', 'bleeding', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Thorn Damage',
                                    description: 'Natural weapons deal +1 piercing damage',
                                    statModifier: {
                                        stat: 'weapon_damage',
                                        magnitude: 1,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    name: 'Bleeding Strike',
                                    description: 'Attacks cause bleeding (1d4 damage per round for 3 rounds)',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your thorns cause persistent bleeding wounds'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'iron_vulnerability_briaran_wild',
                        name: 'Iron Vulnerability',
                        description: 'Shattered fae pacts leave you vulnerable to cold iron and purifying flame (+50% damage from each).',
                        level: 1,
                        icon: 'inv_ingot_iron',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'iron',
                            icon: 'inv_ingot_iron',
                            tags: ['vulnerability', 'iron', 'fire', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Iron Vulnerability',
                                    description: 'Cold iron wounds you grievously (+50% damage from iron weapons)',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    name: 'Fire Vulnerability',
                                    description: 'Purifying flames burn away your fae heritage (+50% damage from fire)',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Sylvan'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 30, // Warriors, hunters, built from living wild - extra durability
                    mana: 22,
                    ap: 4, // Primal warriors, quick reactions - extra action point
                    passivePerception: 2, // Hunters, protectors of the wild
                    swimSpeed: 5, // Survival skills include water
                    climbSpeed: 10, // Primal grace, excellent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 2 // Fierce and untamed, quick to react
                },
                savingThrowModifiers: {
                    // Broken fae contracts make them vulnerable to iron and fire
                    disadvantage: ['poison'], // Vulnerable to iron's poisonous effects
                    advantage: ['fear'] // Warrior spirit resists fear
                }
            },
            dusk: {
                id: 'dusk_briaran',
                name: 'Dusk Walker',
                description: 'Thorns glow faintly in twilight, dimming in daylight and darkness. Skin changes tone with the time of day, darker at dusk. Eyes reflect both day and night, pupils that adjust unnaturally. They seem to fade slightly in bright light and deep dark. Movement is fluid, existing between moments. Their presence feels transient, like they could slip into shadow or light at any moment.',
                culturalBackground: `The Dusk-Walkers trace their lineage to Briaran who made bargains during the twilight hours. Binding themselves to the boundary between day and night. Their tradition requires that every member learn to navigate liminal spaces. Apprenticeships spent mastering the art of existing between worlds. Dusk-Walker communities are built in places where day meets night. Settlements thriving in the twilight hours when the fae courts are closest. They practice ancient boundary-walking techniques passed down through generations. How to exist in two worlds. How to negotiate during transition. How to make bargains that span day and night. Their thorns glow faintly in twilight. Blood running darker as the sun sets. Marking them as creatures of transition. But this boundary existence comes at a cost. They are weakened by both pure daylight and deepest night. Thriving only in the liminal hours. The bloodline values balance and transition. Honor measured in boundaries navigated and worlds bridged. They are the mediators of Briaran society. Existing between court and wild, day and night. Forever bound to the twilight that birthed them.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    spirit: 2
                },
                traits: [
                    {
                        id: 'twilight_step_briaran',
                        name: 'Twilight Step',
                        description: 'Teleport short distances through shadows. Only during dawn or dusk.',
                        level: 1,
                        icon: 'ability_rogue_shadowstep',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'transmutation',
                            secondaryElement: 'shadow',
                            icon: 'ability_rogue_shadowstep',
                            tags: ['teleport', 'shadow', 'movement', 'twilight']
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'teleport',
                                name: 'Teleport',
                                description: 'Teleport up to 30 feet through shadows during twilight hours.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'location',
                            rangeType: 'ranged',
                            rangeDistance: 30
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'duality_briaran',
                        name: 'Duality',
                        description: 'Existing between worlds grants you perfect clarity in twilight\'s embrace.',
                        level: 1,
                        icon: 'spell_shadow_twilight',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'perception',
                            secondaryElement: 'twilight',
                            icon: 'spell_shadow_twilight',
                            tags: ['stealth', 'perception', 'low-light', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Low Light Advantage',
                                    description: 'Advantage on stealth and perception checks in low light',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'You thrive in twilight conditions'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'radiant_necrotic_vulnerability_briaran',
                        name: 'Radiant Vulnerability',
                        description: 'Vulnerable to radiant damage (+50% damage) during daylight and necrotic damage (+50% damage) in darkness.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'twilight',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'necrotic', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability (Day)',
                                    description: 'Take 50% more radiant damage during daylight',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Necrotic Vulnerability (Night)',
                                    description: 'Take +50% damage from necrotic sources in darkness',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Sylvan', 'Umbral'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 20, // Exists between worlds, not particularly hardy
                    mana: 28, // Twilight connection grants some mana
                    ap: 4, // Quick and fluid, exists between moments - extra action point
                    passivePerception: 3, // Advantage on perception in low light, navigate boundaries
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 0, // Not climbers
                    visionRange: 60,
                    darkvision: 60, // Thrives in twilight, can see in low light
                    initiative: 3 // Fluid movement, exists between moments - quick to react
                },
                savingThrowModifiers: {
                    // Weakened by pure daylight and deepest night
                    disadvantage: ['blinded'], // Vulnerable to bright light extremes
                    advantage: ['stun'] // Fluid movement helps resist disorientation
                }
            }
        }
    },

    groven: {
        id: 'groven',
        name: 'Groven',
        description: 'Antlered forest folk with bark-like skin in patches. Hair grows like moss and vines. Antlers sprout from their heads, some small, some branching like trees. Eyes hold the green of deep forests. Feet calloused and tough, many walk barefoot even in winter. They smell of earth and growing things. Their presence makes plants grow faster nearby.',
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
        subraces: {
            guardian: {
                id: 'guardian_groven',
                name: 'Grove Guardian',
                description: 'Bark grows in patches across their skin, thickest on arms and chest. Antlers largest of all Groven, branching like ancient trees. Skin shows grain patterns like wood. Roots sometimes visible beneath their feet when they stand still. Many have moss growing in the crevices of their bark. They move slowly but with purpose, their steps settling like roots.',
                culturalBackground: `The Grove-Guardians trace their lineage to the first Groven who swore to protect ancient forests. Bloodline marked by deep bonds with specific groves. Their tradition requires that every member bond with a sacred grove during their sixteenth year. Flesh slowly growing bark as the bond deepens. Grove-Guardian settlements are built within the heart of ancient forests. Members serving as protectors, sentinels, living fortresses. They practice ancient guardian techniques passed down through generations. How to call roots from the earth. How to grow thorns as weapons. How to hear the forest warnings days before threats arrive. But this connection demands sacrifice. They cannot abide the cutting of living wood. Proximity to dead forests causes them physical pain. Many Grove-Guardians become hermits in their bonded groves. Bodies slowly becoming indistinguishable from the trees they protect. The bloodline values protection and duty. Honor measured in threats prevented and groves preserved. They are the shield-wall of Groven society. Their bond with nature unmatched but their freedom forever tied to the groves they guard.`,
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: -2
                },
                traits: [
                    {
                        id: 'forest_guardian_groven',
                        name: 'Forest Guardian',
                        description: 'Your bond with the ancient grove flows through your bark-like skin, granting you the forest\'s watchful eyes and the earth\'s unyielding defense when protecting what you hold sacred.',
                        level: 1,
                        icon: 'spell_nature_natureguard',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'protection',
                            icon: 'spell_nature_natureguard',
                            tags: ['defense', 'nature', 'detection', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'nature_sense',
                                    name: 'Nature Sense',
                                    description: 'Sense threats to natural areas within 1 mile'
                                },
                                {
                                    id: 'natures_shield',
                                    name: 'Nature\'s Shield',
                                    description: 'Gain +1 armor when defending nature',
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
                        utilityConfig: {
                            utilityType: 'divination',
                            effects: [{
                                id: 'nature_detection',
                                name: 'Nature Detection',
                                description: 'Sense threats to natural areas within 1 mile radius'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'antler_strike_groven',
                        name: 'Antler Strike',
                        description: 'Natural weapons deal +1 damage. Can charge through difficult terrain.',
                        level: 1,
                        icon: 'ability_druid_prowl',
                        spellType: 'PASSIVE',
                        effectTypes: ['damage', 'utility'],
                        typeConfig: {
                            school: 'combat',
                            secondaryElement: 'nature',
                            icon: 'ability_druid_prowl',
                            tags: ['combat', 'natural-weapons', 'charge', 'passive']
                        },
                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'piercing',
                            bonusDamage: 1
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'charge',
                                name: 'Charge',
                                description: 'Charge through difficult terrain without penalty.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'fire_vulnerability_groven',
                        name: 'Fire Vulnerability',
                        description: 'Vulnerable to fire damage (+50% damage) due to your connection to living wood.',
                        level: 1,
                        icon: 'spell_fire_flamestrike',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'fire',
                            icon: 'spell_fire_flamestrike',
                            tags: ['vulnerability', 'fire', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Fire Vulnerability',
                                    description: 'Take +50% damage from fire sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Druidic', 'Beast Speech'],
                speed: 35,
                baseStats: {
                    armor: 0, // Forest Guardian passive adds +1 when defending, so base is 0
                    hp: 35, // Bark-like skin, living fortresses - extra durability
                    mana: 20,
                    ap: 3, // Protectors, sentinels - standard AP
                    passivePerception: 3, // Nature Sense, hear forest warnings days before threats
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 5, // Can call roots from earth, decent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: -1 // Move slowly but with purpose, slower to react
                },
                savingThrowModifiers: {
                    // Living wood connection makes them vulnerable to fire but sturdy against physical harm
                    disadvantage: ['poison'], // Fire destroys living wood
                    advantage: ['paralyze'] // Sturdy bark resists paralysis
                }
            },
            wanderer: {
                id: 'wanderer_groven',
                name: 'Trail Walker',
                description: 'Lean and wiry from constant movement. Antlers smaller, often broken from travel. Feet heavily calloused, able to walk over rough terrain without pain. Eyes constantly scanning the horizon. Skin weathered by sun and wind. They carry the smell of distant places. Many have small scars from thorns and rocks. They seem to fade slightly when standing still, restless energy visible.',
                culturalBackground: `The Trail-Walkers trace their lineage to Groven who rejected grove bonds for the freedom of endless wandering. Bloodline marked by the call of the horizon. Their tradition requires that every member learn the ancient migration routes. Apprenticeships spent following seasonal paths that their ancestors walked. Trail-Walker communities are nomadic. Following herds and seasons across vast territories. Members serving as guides, scouts, messengers between distant groves. They practice ancient pathfinding techniques passed down through generations. How to read ley lines. How to find water in deserts. How to navigate by the stars and the earth energy. Their bodies adapt to long travel. Feet becoming calloused and sure. Senses sharpening to detect threats miles away. But the call to wander never stops. They become restless in settlements. Dreaming of open skies and untamed lands. The bloodline values freedom and exploration. Honor measured in paths walked and messages delivered. They are the wanderers of Groven society. Free from grove bonds but forever bound to the endless trail.`,
                statModifiers: {
                    agility: 4,
                    spirit: 2,
                    intelligence: 1
                },
                traits: [
                    {
                        id: 'seasonal_adaptation_groven',
                        name: 'Seasonal Adaptation',
                        description: 'Advantage on Survival checks during current season. Disadvantage during opposite season.',
                        level: 1,
                        icon: 'spell_nature_regenerate',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'adaptation',
                            icon: 'spell_nature_regenerate',
                            tags: ['survival', 'seasonal', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Seasonal Advantage',
                                    description: 'Advantage on Survival during current season',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'You are attuned to seasonal rhythms'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Seasonal Weakness',
                                    description: 'Disadvantage on Survival during opposite season',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The opposing season disrupts your natural attunement'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'pathfinder_groven',
                        name: 'Pathfinder',
                        description: 'Your wild blood knows every root and stone, guiding you through nature\'s labyrinth.',
                        level: 1,
                        icon: 'ability_druid_dash',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'navigation',
                            icon: 'ability_druid_dash',
                            tags: ['navigation', 'nature', 'passive']
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'navigation',
                                name: 'Navigation',
                                description: 'Cannot become lost in natural environments. Advantage on navigation checks.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'poison_vulnerability_groven',
                        name: 'Poison Vulnerability',
                        description: 'Vulnerable to poison damage (+50% damage) due to exposure to wild toxins.',
                        level: 1,
                        icon: 'spell_nature_nullifypoison_02',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'poison',
                            icon: 'spell_nature_nullifypoison_02',
                            tags: ['vulnerability', 'poison', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Poison Vulnerability',
                                    description: 'Take +50% damage from poison sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Druidic', 'Primordial'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 24, // Lean and wiry, not particularly hardy
                    mana: 26,
                    ap: 4, // Nomadic wanderers, quick reactions - extra action point
                    passivePerception: 3, // Eyes constantly scanning horizon, senses sharpened
                    swimSpeed: 5, // Survival skills include water
                    climbSpeed: 10, // Excellent climbers, navigate rough terrain
                    visionRange: 60, // Enhanced vision from constant travel
                    darkvision: 0,
                    initiative: 2 // Restless energy, quick to react
                },
                savingThrowModifiers: {
                    // Wild exposure makes them vulnerable to poison but nimble against restraints
                    disadvantage: ['poison'], // Vulnerable to wild toxins
                    advantage: ['restrained'] // Nimble wanderers escape restraints
                }
            },
            shaman: {
                id: 'shaman_groven',
                name: 'Spirit Speaker',
                description: 'Antlers decorated with bones and feathers. Eyes shift between normal and animal-like, pupils dilating unnaturally. Necklaces of animal teeth and bones clatter when they move. Skin marked with ritual scars from spirit-binding ceremonies. Many have animalistic mannerisms, twitches that mirror the spirits they commune with. Their voices sometimes carry animal sounds, growls or bird calls bleeding through.',
                culturalBackground: `The Spirit-Speakers trace their lineage to the first Groven shamans who learned to commune with the spirits of beasts and ancestors. Bloodline marked by deep spiritual connections. Their tradition requires that every member undergo vision quests during their eighteenth year. Learning to hear the voices of every animal that ever died. Spirit-Speaker communities are built around sacred circles where the boundary between worlds grows thin. Members serving as shamans, mediators, spirit-callers. They practice ancient rituals passed down through generations. How to summon spirit beasts. How to divine from animal bones. How to channel primal energies through their antlers. They wear necklaces of animal teeth and bones. Each one a connection to the spirits they call upon. But this communion comes at a cost. They share the beasts primal instincts. Sometimes losing themselves to animal rage or cunning. Many Spirit-Speakers live in isolation. Minds filled with too many voices to maintain normal relationships. The bloodline values wisdom and spiritual connection. Honor measured in spirits communed with and knowledge gained. They are the spirit-keepers of Groven society. Their connection to the other side unmatched but their sanity forever fractured by too many voices.`,
                statModifiers: {
                    spirit: 3,
                    intelligence: 2,
                    constitution: -2
                },
                traits: [
                    {
                        id: 'spirit_communion_groven',
                        name: 'Spirit Communion',
                        description: 'Commune with nature spirits. Gain advantage on one Nature or Spirit check.',
                        level: 1,
                        icon: 'spell_nature_spiritarmor',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'nature',
                            icon: 'spell_nature_spiritarmor',
                            tags: ['communion', 'spirit', 'nature']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Advantage on one Nature or Spirit check',
                            effects: [
                                {
                                    name: 'Spirit Guidance',
                                    description: 'Nature spirits provide insight',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Spirits share their spirit'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'communication',
                                name: 'Communication',
                                description: 'Commune with nature spirits to gain spirit about the natural world.'
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
                            actionPoints: 2,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    },
                    {
                        id: 'elemental_affinity_groven',
                        name: 'Elemental Affinity',
                        description: 'Channel elemental forces for minor effects.',
                        level: 1,
                        icon: 'spell_nature_elementalshields',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'elemental',
                            secondaryElement: 'nature',
                            icon: 'spell_nature_elementalshields',
                            tags: ['elemental', 'nature', 'utility']
                        },
                        utilityConfig: {
                            utilityType: 'elemental',
                            selectedEffects: [{
                                id: 'manipulation',
                                name: 'Manipulation',
                                description: 'Channel minor elemental effects.'
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'radiant_vulnerability_groven',
                        name: 'Radiant Vulnerability',
                        description: 'Vulnerable to radiant damage (+50% damage) due to your spiritual connection to nature.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
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
                        }
                    }
                ],
                languages: ['Common', 'Druidic', 'Elemental'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 18, // Spiritual connection makes them physically frail
                    mana: 38, // Strong spiritual connection grants enhanced mana
                    ap: 2, // Shamans, contemplative - less action-oriented
                    passivePerception: 14, // Commune with spirits, hear animal voices
                    swimSpeed: 18, // Natural affinity for water
                    climbSpeed: 20, // Can climb with primal grace
                    visionRange: 65,
                    darkvision: 0,
                    initiative: -1 // Minds filled with voices, slower to react
                },
                savingThrowModifiers: {
                    // Spiritual connection enhances clarity but makes them vulnerable to radiant damage
                    disadvantage: ['blinded'], // Vulnerable to radiant light from spiritual connection
                    advantage: ['fear', 'charm'] // Spirit communion enhances mental clarity and resistance
                }
            },
            lightfoot: {
                id: 'lightfoot_wildkin',
                name: 'Rootrunner',
                description: 'Smallest of all Groven, standing shorter than most. Antlers small and delicate, often hidden. Skin smoother, less bark-like. Feet quick and light, making little sound. Eyes dart constantly, always aware of surroundings. They blend into natural environments easily, becoming hard to spot when still. Hair often braided with small plants and flowers.',
                statModifiers: {
                    agility: 3,
                    charisma: 2,
                    constitution: -2
                },
                traits: [
                    {
                        id: 'naturally_stealthy_groven',
                        name: 'Naturally Stealthy',
                        description: 'Your bark-like skin and wild heritage let you vanish into the natural world.',
                        level: 1,
                        icon: 'ability_rogue_stealth',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'stealth',
                            secondaryElement: 'nature',
                            icon: 'ability_rogue_stealth',
                            tags: ['stealth', 'nature', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Natural Stealth',
                                    description: 'Advantage on Stealth checks in natural environments',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'You blend seamlessly into natural surroundings'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'lucky_groven',
                        name: 'Lucky',
                        description: 'Once per short rest, reroll a 1 on any d20 roll.',
                        level: 1,
                        icon: 'spell_holy_blessed',
                        spellType: 'REACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'luck',
                            secondaryElement: 'fate',
                            icon: 'spell_holy_blessed',
                            tags: ['luck', 'reroll', 'reaction']
                        },
                        utilityConfig: {
                            utilityType: 'reroll',
                            selectedEffects: [{
                                id: 'luck',
                                name: 'Luck',
                                description: 'Reroll a 1 on any d20 roll.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
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
                                        triggerType: 'on_roll_result',
                                        conditions: {
                                            result: 1
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'size_vulnerability_groven',
                        name: 'Size Vulnerability',
                        description: 'Vulnerable to damage from Large or larger creatures (+50% damage).',
                        level: 1,
                        icon: 'ability_warrior_charge',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'size',
                            icon: 'ability_warrior_charge',
                            tags: ['vulnerability', 'size', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Size Vulnerability',
                                    description: 'Take +50% damage from Large or larger creatures',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Halfling', 'Druidic'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: 20, // Smallest of all Groven, physically frail
                    mana: 8,
                    ap: 3, // Quick and light, standard AP
                    passivePerception: 2, // Eyes dart constantly, always aware
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 5, // Quick and light, decent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 2 // Quick and light, quick to react
                },
                savingThrowModifiers: {
                    // Small size makes them vulnerable to being grappled but agile in movement
                    disadvantage: ['grappled'], // Small size vulnerable to grappling
                    advantage: ['restrained'] // Agile and nimble, escapes restraints
                }
            }
        }
    },

    emberth: {
        id: 'emberth',
        name: 'Emberth',
        description: 'Folk with skin like cooled slag, dark and rough. Eyes glow with inner fire, pupils like banked coals. Hair often streaked with ash and soot. Body temperature runs hot, their touch can warm or burn. Many have scars from forge accidents and lava burns. They smell of smoke and hot metal. Their presence makes air shimmer with heat.',
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
                        description: 'Work metal without tools. Items gain +1 damage or armor.',
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
                            type: 'short_rest',
                            value: 1
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
                        }
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
                                    description: 'Take 50% more frost damage',
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
                        }
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
                        description: 'Leave a trail of embers for tracking or signaling.',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'ash_cloud_emberth',
                        name: 'Ash Cloud',
                        description: 'Create concealing ash cloud. Grants advantage on Stealth.',
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
                            type: 'short_rest',
                            value: 1
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
                                    description: 'Take +50% damage from frost sources'
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
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
                        description: 'Enter battle rage when reducing enemy to 0 HP. +2 attack, +1d6 fire damage for 1 minute.',
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
                                    description: '+1d6 fire damage to attacks',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'scarred_hide_emberth',
                        name: 'Scarred Hide',
                        description: '+1 Armor from toughened skin. Advantage on saves against fear.',
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
                        }
                    },
                    {
                        id: 'frost_vulnerability_warborn',
                        name: 'Frost Vulnerability',
                        description: 'Vulnerable to frost damage (+50% damage) as your inner fire can be quenched.',
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
                                    description: 'Take +50% damage from frost sources'
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
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
        description: 'Folk with eyes that gleam yellow like animals. Bodies that shift subtly, hints of the beast always visible. Hands sometimes show claws or fur. Teeth sharper than normal. They smell of animal musk and wild places. Many have scars from their first transformation. Movement carries predatory grace. They have trouble staying indoors for long.',
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
                        description: 'Transform into a predatory animal form, gaining enhanced physical abilities and natural weapons.',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'predators_instinct_vreken',
                        name: 'Predator\'s Instinct',
                        description: 'Enhanced senses allow you to track prey and sense emotional states, but the beast within may take control.',
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
                        }
                    },
                    {
                        id: 'cursed_vulnerability_vreken',
                        name: 'Cursed Vulnerability',
                        description: 'Your shapeshifting curse makes you vulnerable to silver weapons and radiant damage.',
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
                        }
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
                        description: 'Temporarily access beast abilities while maintaining control, but the internal struggle takes its toll.',
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'curse_resistance_vreken',
                        name: 'Curse Resistance',
                        description: 'Your struggle against the beast curse grants resistance to supernatural afflictions.',
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
                        }
                    },
                    {
                        id: 'iron_vulnerability_vreken',
                        name: 'Iron Vulnerability',
                        description: 'Iron weapons and frost damage exploit your chained nature, weakening your connection to the beast.',
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
                                    description: 'Take +50% damage from iron weapons',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    name: 'Frost Vulnerability',
                                    description: 'Take +50% damage from frost sources',
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
                        }
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
        description: 'Undead folk with flesh that refuses to fully decay. Skin pale and withered but not rotting. Eyes glow faintly with the light of unbroken oaths. Bodies show signs of age but never deteriorate further. They move slowly, their joints creaking like old doors. They smell of dust and old bones. Their touch is cold, like touching stone in winter.',
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
                description: 'Bodies most preserved of all Graveworn, decay slowed by proximity to treasures. Eyes constantly scanning, always watching. Hands often show wear from handling coins and gems. Many develop a habit of counting and organizing. Their gaze seems to follow anyone near their guarded items. They move stiffly, joints protesting after centuries of standing guard.',
                culturalBackground: `The Vault-Keepers trace their lineage to Graveworn who swore oaths to guard treasures until death. Bloodline marked by eternal guardianship of hoards and vaults. Their tradition requires that every member learn to appraise and protect treasures. Apprenticeships spent mastering the art of guarding what was sworn to protect. Vault-Keeper tombs are built around the treasures they guard. Members serving as eternal sentinels in forgotten vaults. They practice ancient guardianship techniques passed down through generations. How to ward against thieves. How to sense the worth of treasures. How to maintain vigilance for centuries. Their presence wards against thieves. Mere gaze causing shadows to deepen and locks to strengthen. But their obsession grows. They begin to see people as potential thieves. Protective instincts turning paranoid. Many Vault-Keepers live in isolation. Tombs becoming prisons of their own making. The bloodline values protection and dedication. Honor measured in treasures guarded and oaths kept. They are the guardians of Graveworn society. Their vigilance unmatched but their souls forever bound by vows that cannot be broken.`,
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    intelligence: 1
                },
                traits: [
                    {
                        id: 'treasure_sense_morthel',
                        name: 'Treasure Sense',
                        description: 'Detect valuable items within 120 feet and know their worth.',
                        level: 1,
                        icon: 'inv_misc_coin_01',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'detection',
                            secondaryElement: 'treasure',
                            icon: 'inv_misc_coin_01',
                            tags: ['detection', 'treasure', 'appraisal']
                        },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [{
                                id: 'treasure',
                                name: 'Treasure',
                                description: 'Detect valuable items within 120 feet and know their worth.'
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'undead_resilience_morthel',
                        name: 'Undead Resilience',
                        description: 'Immune to poison, disease, and exhaustion.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'undead',
                            secondaryElement: 'resilience',
                            icon: 'spell_shadow_deathsembrace',
                            tags: ['immunity', 'undead', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Poison Immunity',
                                    description: 'Immune to poison damage and effects',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your undead nature is unaffected by toxins'
                                    }
                                },
                                {
                                    name: 'Disease Immunity',
                                    description: 'Immune to disease',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your undead body cannot be infected'
                                    }
                                },
                                {
                                    name: 'Exhaustion Immunity',
                                    description: 'Immune to exhaustion',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your undead body needs no rest'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'radiant_vulnerability_morthel_hoarder',
                        name: 'Radiant Vulnerability',
                        description: 'Your undead essence rebels against the purifying light of life, making holy energies burn through your preserved form.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'undead', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take +50% damage from radiant sources',
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
                        }
                    }
                ],
                languages: ['Common', 'Necril', 'Draconic'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: 30, // Most preserved, decay slowed by proximity to treasures - extra durability
                    mana: 8,
                    ap: 2, // Move stiffly, joints protesting - less action-oriented
                    passivePerception: 3, // Eyes constantly scanning, always watching, Treasure Sense
                    swimSpeed: 0, // Undead, poor swimmers (bodies refuse to decay but not good in water)
                    climbSpeed: 0, // Move stiffly, not climbers
                    visionRange: 60,
                    darkvision: 60, // Undead, can see in darkness
                    initiative: -2 // Move stiffly, joints protesting - slow to react
                },
                savingThrowModifiers: {
                    // Undead nature makes them vulnerable to radiant but resistant to mental effects
                    disadvantage: ['blinded'], // Radiant damage harms undead eyes
                    advantage: ['fear'] // Undead resilience against fear
                }
            },
            scholar: {
                id: 'scholar_neth',
                name: 'Dust Scribe',
                description: 'Bodies covered in dust from handling ancient texts. Fingers stained with ink that never washes off. Eyes glow with accumulated knowledge. They move slowly, carefully, as if afraid to damage something fragile. Many have quills and scrolls always at hand. Their speech sometimes references ancient events as if they happened yesterday.',
                culturalBackground: `The Dust-Scribes trace their lineage to Graveworn who swore oaths to protect scrolls and secrets until the end of time. Bloodline marked by eternal preservation of knowledge. Their tradition requires that every member learn to preserve and archive knowledge. Apprenticeships spent mastering the art of maintaining perfect memory across centuries. Dust-Scribe tombs are built around libraries and archives. Members serving as eternal scholars in forgotten repositories. They practice ancient preservation techniques passed down through generations. How to maintain perfect memory. How to preserve texts through undeath. How to guard secrets that must never be lost. Their minds are vast repositories of forgotten lore. Capable of recalling any text they have read. They are patient researchers. Capable of spending centuries deciphering ancient mysteries. But this knowledge comes at a cost. They lose touch with current events. Minds filled with too many voices from the past. Many Dust-Scribes become reclusive scholars in forgotten libraries. Bodies slowly crumbling like the pages they protect. The bloodline values knowledge and preservation. Honor measured in secrets guarded and wisdom preserved. They are the archivists of Graveworn society. Their memory unmatched but their souls forever bound by oaths to preserve what others have forgotten.`,
                statModifiers: {
                    intelligence: 3,
                    spirit: 2,
                    strength: -2
                },
                traits: [
                    {
                        id: 'perfect_memory_morthel',
                        name: 'Perfect Memory',
                        description: 'Perfect recall of everything you\'ve read. Can learn languages and skills permanently.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'knowledge',
                            secondaryElement: 'undead',
                            icon: 'spell_holy_mindvision',
                            tags: ['memory', 'knowledge', 'undead', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Perfect Recall',
                                    description: 'Remember everything you have read',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'Your undead mind preserves all knowledge'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'deathless_vigil_morthel',
                        name: 'Deathless Vigil',
                        description: 'No need for sleep. Can work continuously for days.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'undead',
                            secondaryElement: 'endurance',
                            icon: 'spell_shadow_demonicfortitude',
                            tags: ['sleepless', 'undead', 'endurance', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'No Sleep Needed',
                                    description: 'You do not need to sleep',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your undead body requires no rest'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'radiant_vulnerability_morthel_scholar',
                        name: 'Radiant Vulnerability',
                        description: 'The spark of unlife within you recoils from the holy radiance that banishes the dead, searing through your preserved intellect.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'undead', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take +50% damage from radiant sources',
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
                        }
                    }
                ],
                languages: ['Common', 'Necril', 'All Ancient Languages'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: -5, // Bodies covered in dust, physically frail
                    mana: 10, // Perfect memory, vast repositories of knowledge - extra mana
                    ap: 2, // Move slowly, carefully - less action-oriented
                    passivePerception: 3, // Eyes glow with accumulated knowledge, perfect recall
                    swimSpeed: 0, // Undead, poor swimmers
                    climbSpeed: 0, // Move slowly, carefully, not climbers
                    visionRange: 60,
                    darkvision: 60, // Undead, can see in darkness
                    initiative: -2 // Move slowly, carefully - slow to react
                },
                savingThrowModifiers: {
                    // Undead nature makes them vulnerable to radiant but knowledgeable against confusion
                    disadvantage: ['blinded'], // Radiant damage harms undead eyes
                    advantage: ['stun'] // Vast knowledge protects against confusion
                }
            }
        }
    },

    volketh: {
        id: 'volketh',
        name: 'Volketh',
        description: 'Folk with skin scarred by lightning, the marks glowing faintly during storms. Hair often stands on end from static. Eyes sometimes flash with electrical light. Their presence makes air smell of ozone. Many have twitches and spasms from damaged nerves. They move with erratic energy, muscles responding to phantom electrical signals.',
        icon: 'fas fa-bolt',
        overview: 'The Volketh are people whose ancestors survived terrible storms. Those struck by lightning and lived. Or born during tempests that killed their families. Through generations of living in storm-prone regions, their bloodlines have been marked by electrical damage. Scarred skin that glows faintly during storms. Nervous systems permanently damaged by electrical burns passed down through bloodlines. They are organized into nomadic bands that follow storm patterns. Settlements built in the wake of thunderstorms. The Volketh do not choose to attract storms. It is their heritage, passed down through bloodlines that carry the storm damage.',
        culturalBackground: `Volketh society is built on nomadic bands that follow storm patterns. Communities organized around surviving the tempests that shaped their ancestors. Each band traces its lineage to survivors of legendary disasters. Farmers whose homes were struck. Sailors pulled from shipwrecks. Children who watched their families die in floods. Their camps huddle in the wake of thunderstorms. Tents pitched in muddy fields where lightning still crackles in the air. Band elders pass down the old ways. How to read storm signs. How to survive lightning strikes. How to find shelter when the sky turns deadly. Their skin scars glow during storms. Making them targets for superstitious folk who blame them for the weather. They do not control storms. They attract them. Their damaged bodies acting like lightning rods. Band disputes settle through storm-trials and the testimony of those who have survived the most strikes. They are a people bound by storm and survival. Their knowledge of weather unmatched but their bodies forever marked by the forces that shaped them.`,
        variantDiversity: 'The Volketh are divided into three major band bloodlines: The Lightning-Struck bear scars from direct strikes and act as living lightning rods, the Nerve-Wracked have nervous systems damaged by continuous electrical exposure, and the Wind-Broken survived hurricanes that scarred their lungs and minds.',
        integrationNotes: {
            actionPointSystem: 'Volketh abilities focus on lightning damage, mobility, and area control. Their electrical nature provides powerful offensive options but can be unpredictable.',
            backgroundSynergy: 'Volketh excel in backgrounds emphasizing survival, trauma, and disaster recovery. Their storm-scarred nature complements aggressive and mobile playstyles.',
            classCompatibility: 'Volketh make excellent elemental casters, mobile strikers, and warriors who channel their trauma. Their lightning abilities enhance classes that deal burst damage.'
        },
        meaningfulTradeoffs: 'Volketh gain powerful lightning abilities and high mobility but are vulnerable to grounding effects and struggle with fine control. Their damaged nervous systems make them unreliable.',
        baseTraits: {
            languages: ['Common', 'Auran', 'Primordial'],
            lifespan: '60-90 years',
            baseSpeed: 35,
            size: 'Medium',
            height: '5\'4" - 6\'0"',
            weight: '120-180 lbs',
            build: 'Jittery and energetic'
        },
        subraces: {
            thundercaller: {
                id: 'thundercaller_volketh',
                name: 'Lightning Struck',
                description: 'Scars form branching patterns like lightning across their skin. These scars glow during storms. Skin feels warm to the touch, like banked electricity. Eyes flash with electrical light when agitated. Their hair stands on end constantly. Many have burns where lightning entered and exited. Their scars ache before storms arrive.',
                culturalBackground: `The Lightning-Struck trace their lineage to Volketh who survived direct lightning strikes. Bloodline marked by scars that conduct electrical charge. Their tradition requires that every member learn to read storm signs from their own scars. Apprenticeships spent understanding how their damaged flesh reacts to atmospheric pressure. Lightning-Struck bands serve as weather-readers and storm-warners. Members acting as living lightning rods that can sense approaching tempests. They practice ancient survival techniques passed down through generations. How to ground themselves during strikes. How to read scar-pain as weather prediction. How to warn others before storms arrive. Their scars ache before storms. Damaged nerves reacting to atmospheric pressure changes. But this is not a gift. It is nerve damage that makes them suffer. The scars sometimes discharge static. Shocking those who touch them. During calm weather, the damaged nerves settle. But storms bring agony as their scars burn with phantom electricity. The bloodline values warning and protection. Honor measured in storms predicted and lives saved. They are the storm-readers of Volketh society. Their knowledge valuable but their bodies forever marked by the lightning that shaped them.`,
                statModifiers: {
                    charisma: 3,
                    constitution: 2,
                    strength: 1
                },
                traits: [
                    {
                        id: 'thunder_voice_volketh',
                        name: 'Thunder Voice',
                        description: 'Voice carries thunder power. Deal sonic damage and stun enemies.',
                        level: 1,
                        icon: 'spell_nature_thunderclap',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'debuff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'sonic',
                            icon: 'spell_nature_thunderclap',
                            tags: ['sonic', 'stun', 'damage']
                        },
                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'thunder',
                            formula: '2d6'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Stunned',
                                    description: 'Target is stunned for 1 round',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Thunder stuns the target'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 15
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'storm_presence_volketh',
                        name: 'Storm Presence',
                        description: 'Allies within 30 feet gain intimidation bonus.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'social',
                            icon: 'spell_nature_lightning',
                            tags: ['aura', 'intimidation', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Intimidating Presence',
                                    description: 'Allies gain intimidation bonus',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your storm-scarred presence inspires fear'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 30
                        }
                    },
                    {
                        id: 'grounding_vulnerability_volketh',
                        name: 'Grounding Vulnerability',
                        description: 'Vulnerable to effects that ground electricity (+50% damage from metal weapons and water attacks).',
                        level: 1,
                        icon: 'spell_nature_earthbind',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'grounding',
                            icon: 'spell_nature_earthbind',
                            tags: ['vulnerability', 'grounding', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Grounding Vulnerability',
                                    description: 'Take +50% damage from metal and water attacks',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 12, // Scarred by lightning but resilient
                    mana: 8, // Electrical energy grants some mana
                    ap: 3, // Storm-readers, standard AP
                    passivePerception: 13, // Read storm signs, scars ache before storms
                    swimSpeed: 15, // Grounding vulnerability makes swimming difficult
                    climbSpeed: 20, // Not climbers
                    visionRange: 65,
                    darkvision: 0,
                    initiative: 1 // Living lightning rods, quick to react
                },
                savingThrowModifiers: {
                    // Grounding vulnerability makes them susceptible to metal and water damage
                    disadvantage: ['poison'], // Vulnerable to grounding effects from metal and water
                    advantage: ['fear'] // Storm presence makes them intimidating
                }
            },
            lightningborn: {
                id: 'lightningborn_stormborn',
                name: 'Nerve Wracked',
                description: 'Constant twitches and spasms mark their movement. Eyes dart erratically, unable to focus long. Hands shake, making precise work difficult. Their reflexes are hyperactive, movements jerky. Skin shows burn marks from electrical exposure. Many have trouble speaking clearly, words interrupted by spasms. They move fast but uncontrolled.',
                culturalBackground: `The Nerve-Wracked trace their lineage to Volketh who were exposed to continuous electrical storms during childhood. Bloodline marked by permanently damaged nervous systems. Their tradition requires that every member learn to function despite neurological damage. Apprenticeships spent mastering control over twitchy reflexes. Nerve-Wracked bands serve as messengers and scouts. Members hyperactive reflexes allowing them to move quickly despite the damage. They practice ancient coping techniques passed down through generations. How to channel twitches into movement. How to think clearly despite electrical interference. How to function when nerves misfire. Their reflexes are hyperactive. Not fast by choice, but twitchy and uncontrolled. Muscles responding to phantom electrical signals. During calm weather, the damage settles and they can think clearly. But storms bring mental chaos as their damaged nerves short-circuit. Many Nerve-Wracked struggle with basic tasks. Nervous systems too damaged for precision work. The bloodline values adaptation and resilience. Honor measured in tasks completed despite the damage. They are the survivors of Volketh society. Their resilience unmatched but their bodies forever marked by currents that flowed through them too long.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'lightning_reflexes_volketh',
                        name: 'Lightning Reflexes',
                        description: 'Move at lightning speed in bursts, but become exhausted.',
                        level: 1,
                        icon: 'spell_nature_lightningoverload',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'movement',
                            icon: 'spell_nature_lightningoverload',
                            tags: ['movement', 'speed', 'lightning']
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'dash',
                                name: 'Dash',
                                description: 'Move at incredible speed for a short burst.'
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'chain_reaction_volketh',
                        name: 'Chain Reaction',
                        description: 'Attacks can arc to nearby enemies, but may hit allies.',
                        level: 1,
                        icon: 'spell_nature_chainlightning',
                        spellType: 'PASSIVE',
                        effectTypes: ['damage'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'chain',
                            icon: 'spell_nature_chainlightning',
                            tags: ['chain', 'lightning', 'damage', 'passive']
                        },
                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'lightning',
                            chainDistance: 10
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'water_vulnerability_volketh',
                        name: 'Water Vulnerability',
                        description: 'Vulnerable to water-based effects (+50% damage from water attacks).',
                        level: 1,
                        icon: 'spell_frost_waterbolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'water',
                            icon: 'spell_frost_waterbolt',
                            tags: ['vulnerability', 'water', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Water Vulnerability',
                                    description: 'Take +50% damage from water attacks',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 24, // Nerve damage, not particularly hardy
                    mana: 8,
                    ap: 4, // Hyperactive reflexes, move fast - extra action point
                    passivePerception: 1, // Eyes dart erratically, unable to focus long
                    swimSpeed: 0, // Water vulnerability, poor swimmers
                    climbSpeed: 5, // Hyperactive reflexes, decent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 4 // Hyperactive reflexes, quick to react (but uncontrolled)
                },
                savingThrowModifiers: {
                    // Nerve damage makes them vulnerable to stunning but agile against paralysis
                    disadvantage: ['stun'], // Nerve damage vulnerable to stunning
                    advantage: ['paralyze'] // Hyperactive reflexes resist paralysis
                }
            },
            tempest: {
                id: 'tempest_stormborn',
                name: 'Wind Broken',
                description: 'Breathing is labored, audible even at rest. Lungs scarred from pressure damage show in their chest movements. Skin sometimes shows signs of oxygen deprivation, bluish tint around lips. Their breath creates strange air currents when they exert themselves. Many have coughs that never fully heal. They tire easily but push through with determination.',
                culturalBackground: `The Wind-Broken trace their lineage to Volketh who survived hurricanes and tornadoes that destroyed everything they knew. Bloodline marked by damaged lungs from pressure changes and debris. Their tradition requires that every member learn to function despite respiratory damage. Apprenticeships spent mastering breathing techniques that compensate for scarred lung tissue. Wind-Broken bands serve as fighters and protectors. Members damaged breathing creating unintended air disturbances that confuse enemies. They practice ancient survival techniques passed down through generations. How to breathe despite damage. How to channel panic into strength. How to fight when lungs do not work properly. Their breathing creates strange air currents. Not from power but from scarred lung tissue that does not expand properly. Strong emotions trigger panic attacks that manifest as irregular breathing patterns. Which superstitious folk mistake for weather control. But this is not control. It is trauma response. Their bodies reacting to memories of wind and destruction. Many Wind-Broken develop severe anxiety disorders. Unable to cope with the sounds of wind or approaching storms. The bloodline values strength and survival. Honor measured in battles fought despite the damage. They are the fighters of Volketh society. Their resilience unmatched but their bodies forever marked by the storms that took their homes.`,
                statModifiers: {
                    strength: 4,
                    constitution: 2,
                    agility: 1
                },
                traits: [
                    {
                        id: 'storm_rage_volketh',
                        name: 'Storm Rage',
                        description: 'Enter berserk rage. +3 attack, +2d6 lightning damage, resistance to physical damage.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'ACTION',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'rage',
                            icon: 'ability_warrior_rampage',
                            tags: ['rage', 'lightning', 'combat']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            statModifiers: [
                                {
                                    id: 'rage_attack',
                                    name: 'Attack Bonus',
                                    magnitude: 3,
                                    magnitudeType: 'flat',
                                    category: 'combat'
                                }
                            ],
                            effects: [
                                {
                                    name: 'Lightning Damage',
                                    description: '+2d6 lightning damage',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'Your attacks crackle with lightning'
                                    }
                                },
                                {
                                    name: 'Physical Resistance',
                                    description: 'Resistance to physical damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Storm energy protects you'
                                    }
                                }
                            ],
                            durationValue: 1,
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'eye_of_the_storm_volketh',
                        name: 'Eye of the Storm',
                        description: 'Create zone of calm protecting allies, but cannot move.',
                        level: 1,
                        icon: 'spell_nature_nullifydisease',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'protection',
                            icon: 'spell_nature_nullifydisease',
                            tags: ['protection', 'zone', 'allies']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Calm Zone',
                                    description: 'Allies in zone are protected from storm effects',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The eye of the storm provides safety'
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
                                id: 'weather_control',
                                name: 'Weather Control',
                                description: 'Create a 20-foot radius zone of calm weather, protecting allies from storm effects.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 20
                        },
                        resourceCost: {
                            actionPoints: 2,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    },
                    {
                        id: 'pressure_vulnerability_volketh',
                        name: 'Pressure Vulnerability',
                        description: 'Hurricane-scarred lungs struggle against pressure changes that once nearly crushed them, leaving your body vulnerable to crushing forces that echo the storms of your ancestors.',
                        level: 1,
                        icon: 'ability_warrior_sunder',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'pressure',
                            icon: 'ability_warrior_sunder',
                            tags: ['vulnerability', 'pressure', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Pressure Vulnerability',
                                    description: 'Hurricane-damaged lungs make you vulnerable to crushing attacks that mirror the pressure changes that scarred your ancestors',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Auran'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 28, // Fighters and protectors, damaged lungs but determined - extra durability
                    mana: 8,
                    ap: 4, // Fighters, storm rage - extra action point
                    passivePerception: 1, // Not particularly perceptive
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 0, // Not climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 2 // Fighters, quick to react
                },
                savingThrowModifiers: {
                    // Damaged lungs make them vulnerable to poison but determined against exhaustion
                    disadvantage: ['poison'], // Damaged lungs vulnerable to poison
                    advantage: ['exhaustion'] // Fighters push through exhaustion
                }
            }
        }
    },

    drennar: {
        id: 'drennar',
        name: 'Drennar',
        description: 'Folk with bodies deformed by crushing pressure. Bones warped, joints that move wrong. Skin glows with bioluminescent patterns from infected scars. Eyes adapted to absolute darkness, pupils huge. They move slowly, joints protesting normal movement. Their bodies struggle with surface gravity. Many avoid bright light, their skin sensitive from deep dwelling.',
        icon: 'fas fa-water',
        overview: 'The Drennar are people whose ancestors survived underwater disasters. Miners trapped in flooded tunnels. Sailors dragged to crushing depths. Divers who stayed too long in the abyss. Through generations of living in pressure-damaged bodies, their bloodlines have been marked by deep-sea trauma. Deformed skeletons. Crushed organs. Skin that glows from bacterial infections passed down through generations. They are organized into communities built around abandoned mines and sunken wrecks. Settlements clustered where the pressure-damaged can survive. The Drennar do not choose to glow. It is their heritage, passed down through bloodlines that carry the corruption of deep-sea wounds.',
        culturalBackground: `Drennar society is built on communities clustered around abandoned mines and sunken wrecks. Settlements built where pressure-damaged bodies can survive. Each community traces its lineage to survivors of legendary disasters. Miners trapped in flooded tunnels. Sailors dragged to crushing depths. Divers who stayed too long in the abyss. Their settlements cluster in places where the crushing dark is familiar. Inhabitants living proof that some survive the depths. Though perhaps they should not have. Community elders pass down the old ways. How to survive pressure changes. How to read deep-sea currents. How to function despite deformed bodies. The glowing patterns on their skin are not decoration. They are infected scars from pressure injuries. Bioluminescent bacteria that colonized their damaged tissue. Passed down through generations. Their slow movements are not patience but permanent damage. Joints crushed by pressure. Bones that never healed right. Community disputes settle through pressure-trials and the testimony of those who have survived the deepest dives. They avoid the surface not from preference but necessity. Their deformed bodies struggle with normal gravity. Pressure-damaged lungs cannot handle thin air. They are a people bound by depth and survival. Their knowledge of the abyss unmatched but their bodies forever marked by the pressure that shaped them.`,
        variantDiversity: 'The Drennar are divided into three major community bloodlines: The Crush-Scarred bear permanent deformities from surviving the crushing abyss, the Abyss-Walkers adapted to deep-sea environments through generations of suffering, and the Pressure-Torn survived rapid pressure changes that left them unstable.',
        integrationNotes: {
            actionPointSystem: 'Drennar abilities focus on pressure manipulation, bioluminescence, and aquatic superiority. Their pressure-damaged bodies provide unique tactical options.',
            backgroundSynergy: 'Drennar excel in backgrounds emphasizing survival, endurance, and trauma recovery. Their deformed bodies create interesting challenges on land.',
            classCompatibility: 'Drennar make excellent ambush specialists, pressure mages, and patient strategists. Their abilities enhance classes that rely on positioning and control.'
        },
        meaningfulTradeoffs: 'Drennar gain powerful aquatic abilities and pressure resistance but suffer on land and in bright light. Their deformities make social interaction difficult.',
        baseTraits: {
            languages: ['Common', 'Aquan', 'Deep Speech'],
            lifespan: '150-200 years',
            baseSpeed: 25,
            size: 'Medium',
            height: '5\'8" - 6\'4"',
            weight: '180-280 lbs',
            build: 'Deformed and bulky'
        },
        subraces: {
            abyssal: {
                id: 'abyssal_drennar',
                name: 'Crush Scarred',
                description: 'Most deformed of all Drennar. Bodies twisted by pressure, bones visibly warped. Movement is slow and painful. Skin glows brightest, patterns marking old injuries. Many have permanently hunched postures. Their joints crack audibly when they move. They struggle to walk on land, their bodies shaped for the deep.',
                culturalBackground: `The Crush-Scarred trace their lineage to Drennar who survived depths that should have pulverized their bones. Bloodline marked by permanent deformities from crushing pressure. Their tradition requires that every member learn to function despite severe physical damage. Apprenticeships spent mastering movement with deformed skeletons and crushed organs. Crush-Scarred communities serve as deep-miners and abyss-explorers. Members able to survive depths that would kill others because their bodies are already broken. They practice ancient survival techniques passed down through generations. How to move with crushed vertebrae. How to function with damaged joints. How to survive what has already broken them. Their bodies are maps of injuries that never healed properly. Bones warped by forces that reshaped them. They can survive in the deep not from adaptation but because their bodies are already broken. What would kill others has already happened to them. Many Crush-Scarred become reclusive hermits. Unable to interact normally due to their deformities. The bloodline values endurance and survival. Honor measured in depths reached despite the damage. They are the deep-explorers of Drennar society. Their resilience unmatched but their bodies forever marked by the pressure that broke them.`,
                statModifiers: {
                    constitution: 4,
                    strength: 1,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'pressure_adaptation_drennar',
                        name: 'Pressure Adaptation',
                        description: 'Resistant to bludgeoning damage. Can survive any ocean depth.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'defense',
                            secondaryElement: 'pressure',
                            icon: 'spell_shadow_demonicfortitude',
                            tags: ['resistance', 'bludgeoning', 'pressure', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Bludgeoning Resistance',
                                    description: 'Resistance to bludgeoning damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your pressure-adapted body resists crushing blows'
                                    }
                                },
                                {
                                    name: 'Depth Survival',
                                    description: 'Can survive any ocean depth',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'No depth can crush your adapted form'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'abyssal_resilience_drennar',
                        name: 'Abyssal Resilience',
                        description: 'Resistant to frost and acid damage.',
                        level: 1,
                        icon: 'spell_nature_nullifydisease',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'defense',
                            secondaryElement: 'abyssal',
                            icon: 'spell_nature_nullifydisease',
                            tags: ['resistance', 'frost', 'acid', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Frost Resistance',
                                    description: 'Resistance to frost damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The deep frost no longer harms you'
                                    }
                                },
                                {
                                    name: 'Acid Resistance',
                                    description: 'Resistance to acid damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Deep-sea chemicals have toughened you'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'light_sensitivity_drennar',
                        name: 'Light Sensitivity',
                        description: 'Vulnerable to radiant damage (+50% damage) and blinded by daylight.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'light',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'light', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Daylight Blindness',
                                    description: 'Blinded by daylight',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Bright light overwhelms your adapted eyes'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Aquan', 'Deep Speech'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: 10, // Most deformed, bodies already broken - extra durability from adaptation
                    mana: 8,
                    ap: 2, // Move slowly and painfully - less action-oriented
                    passivePerception: 1, // Not particularly perceptive
                    swimSpeed: 20, // Adapted to deep-sea, excellent swimmers
                    climbSpeed: 0, // Bodies deformed, not climbers
                    visionRange: 60,
                    darkvision: 120, // Eyes adapted to absolute darkness
                    initiative: -2 // Move slowly and painfully - slow to react
                },
                savingThrowModifiers: {
                    // Light sensitivity makes them vulnerable to blinding but pressure-adapted against stunning
                    disadvantage: ['blinded'], // Light sensitivity causes blinding
                    advantage: ['stun'] // Pressure adaptation resists stunning
                }
            },
            trench: {
                id: 'trench_drennar',
                name: 'Abyss Walker',
                description: 'Bodies compressed from years in the deep. Bones denser, shorter stature. Eyes adapted to absolute darkness, pupils huge. Skin glows with bacterial patterns. They move awkwardly on land, their bodies shaped for pressure. Many have developed webbing between fingers and toes. Their senses are tuned to the deep, struggling on the surface.',
                culturalBackground: `The Abyss-Walkers trace their lineage to Drennar who were trapped in deep-sea environments for extended periods. Bloodline marked by slow adaptation to crushing pressure through generations. Their tradition requires that every member spend years in the deepest trenches. Learning to function in permanent darkness and crushing pressure. Abyss-Walker communities serve as deep-sea traders and abyss-guides. Members able to navigate crushing depths where others cannot survive. They practice ancient adaptation techniques passed down through generations. How to function with compressed bones. How to see in absolute darkness. How to survive through slow change. Their bodies changed through suffering. Bones compressing. Organs shifting. Senses rewiring to function in permanent darkness. Their bioluminescence is not control but infection. Glowing bacteria that colonized their pressure wounds. Making them visible targets in the dark. Many Abyss-Walkers become solitary because normal interaction is too painful. Deformed bodies making them outcasts. The bloodline values adaptation and endurance. Honor measured in depths survived and changes endured. They are the deep-navigators of Drennar society. Their adaptation unmatched but their bodies forever marked by the slow crushing that shaped them.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    constitution: 1
                },
                traits: [
                    {
                        id: 'bioluminescent_lure_drennar',
                        name: 'Bioluminescent Lure',
                        description: 'Create hypnotic light patterns to lure and confuse enemies.',
                        level: 1,
                        icon: 'spell_arcane_arcanepower',
                        spellType: 'ACTION',
                        effectTypes: ['debuff', 'control'],
                        typeConfig: {
                            school: 'illusion',
                            secondaryElement: 'light',
                            icon: 'spell_arcane_arcanepower',
                            tags: ['illusion', 'hypnotic', 'lure']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Hypnotized',
                                    description: 'Target is lured and confused',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The hypnotic patterns capture their attention'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            saveDC: 12,
                            saveType: 'spirit',
                            saveOutcome: 'negates',
                            canBeDispelled: false
                        },
                        controlConfig: {
                            controlType: 'mind_control',
                            strength: 'weak',
                            duration: 1,
                            durationUnit: 'rounds',
                            saveDC: 12,
                            saveType: 'spirit',
                            savingThrow: true,
                            effects: [{
                                id: 'confuse',
                                name: 'Lured',
                                description: 'Target is drawn toward the hypnotic lights and has disadvantage on attacks against you',
                                config: {
                                    controlLevel: 'distraction',
                                    mentalApproach: 'subtle'
                                }
                            }]
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 30
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'ambush_predator_drennar',
                        name: 'Ambush Predator',
                        description: 'Double damage on surprise attacks, but disadvantage in direct combat.',
                        level: 1,
                        icon: 'ability_rogue_ambush',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'combat',
                            secondaryElement: 'ambush',
                            icon: 'ability_rogue_ambush',
                            tags: ['ambush', 'surprise', 'combat', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Ambush Damage',
                                    description: 'Double damage on surprise attacks',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'You strike from the shadows with deadly precision'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Direct Combat Weakness',
                                    description: 'Disadvantage in direct combat',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'You struggle in face-to-face confrontations'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'surface_frailty_drennar',
                        name: 'Surface Frailty',
                        description: 'Vulnerable to radiant damage (+50% damage) and take damage in bright light.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'light',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'light', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Light Damage',
                                    description: '1d4 radiant damage per minute in bright light',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Bright light harms your adapted eyes'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Aquan', 'Deep Speech'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 32, // Bodies compressed, not particularly hardy
                    mana: 8,
                    ap: 4, // Deep-sea traders, quick reactions - extra action point
                    passivePerception: 3, // Senses tuned to the deep, bioluminescent lure
                    swimSpeed: 20, // Adapted to deep-sea, excellent swimmers
                    climbSpeed: 0, // Bodies compressed, not climbers
                    visionRange: 60,
                    darkvision: 120, // Eyes adapted to absolute darkness
                    initiative: 2 // Deep-sea traders, quick to react
                },
                savingThrowModifiers: {
                    // Surface frailty makes them vulnerable to radiant
                    disadvantage: ['blinded'], // Vulnerable to radiant light effects
                    advantage: ['restrained'] // Adapted to deep-sea, agile movement
                }
            },
            twilight: {
                id: 'twilight_drennar',
                name: 'Pressure Torn',
                description: 'Bodies show signs of violent pressure shifts. Eardrums often burst, hearing damaged. Lungs scarred, breathing labored. Skin shows patterns from pressure damage. They move carefully, as if every movement causes pain. Many have trouble with balance. Their bodies cannot settle in one environment for long.',
                culturalBackground: `The Pressure-Torn trace their lineage to Drennar who survived rapid pressure changes. Submarine disasters. Diving accidents. Sudden decompression. Bloodline marked by bodies damaged by violent shifts. Their tradition requires that every member learn to function despite constant pain. Apprenticeships spent mastering adaptation to pressure changes that cause agony. Pressure-Torn communities serve as boundary-walkers and pressure-mediators. Members able to move between depths that would kill others. They practice ancient survival techniques passed down through generations. How to function with burst eardrums. How to breathe with scarred lungs. How to survive despite blood vessel damage. Their bodies were damaged by the violent shifts. Eardrums burst. Lungs scarred. Blood vessels permanently damaged. They can function in different environments not from adaptation but because their bodies are already broken. They feel pain everywhere. Belonging nowhere. Many Pressure-Torn become wanderers not by choice but because they cannot stay anywhere long. The pressure changes cause them constant pain. The bloodline values resilience and boundary-walking. Honor measured in transitions survived despite the pain. They are the mediators of Drennar society. Their versatility unmatched but their bodies forever marked by the violent shifts that broke them.`,
                statModifiers: {
                    agility: 3,
                    intelligence: 2,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'adaptive_gills_drennar',
                        name: 'Adaptive Gills',
                        description: 'Can breathe both water and air.',
                        level: 1,
                        icon: 'spell_frost_summonwaterelemental',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'aquatic',
                            secondaryElement: 'adaptation',
                            icon: 'spell_frost_summonwaterelemental',
                            tags: ['breathing', 'aquatic', 'amphibious', 'passive']
                        },
                        utilityConfig: {
                            utilityType: 'environmental',
                            selectedEffects: [{
                                id: 'breathing',
                                name: 'Breathing',
                                description: 'Breathe both underwater and in air.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'chromatic_display_drennar',
                        name: 'Chromatic Display',
                        description: 'Change bioluminescent patterns for communication.',
                        level: 1,
                        icon: 'spell_arcane_arcanepower',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'communication',
                            secondaryElement: 'light',
                            icon: 'spell_arcane_arcanepower',
                            tags: ['communication', 'light', 'display']
                        },
                        utilityConfig: {
                            utilityType: 'communication',
                            selectedEffects: [{
                                id: 'visual',
                                name: 'Visual',
                                description: 'Communicate through changing light patterns.'
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
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'pressure_instability_drennar',
                        name: 'Pressure Instability',
                        description: 'Vulnerable to thunder damage (+50% damage) from pressure waves.',
                        level: 1,
                        icon: 'spell_nature_thunderclap',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'thunder',
                            icon: 'spell_nature_thunderclap',
                            tags: ['vulnerability', 'thunder', 'pressure', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Thunder Vulnerability',
                                    description: 'Take +50% damage from thunder sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Aquan'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 26, // Bodies damaged by violent pressure shifts, physically frail
                    mana: 8,
                    ap: 3, // Boundary-walkers, standard AP
                    passivePerception: 2, // Can move between depths, sense pressure changes
                    swimSpeed: 15, // Adaptive gills, decent swimmers
                    climbSpeed: 0, // Bodies damaged, not climbers
                    visionRange: 60,
                    darkvision: 60, // Adapted to different environments
                    initiative: 0 // Move carefully, as if every movement causes pain - not quick to react
                },
                savingThrowModifiers: {
                    // Pressure instability makes them vulnerable to thunder
                    disadvantage: ['stun'], // Vulnerable to thunder/pressure wave stunning effects
                    advantage: ['restrained'] // Boundary-walkers, can move between depths
                }
            }
        }
    },

    astren: {
        id: 'astren',
        name: 'Astren',
        description: 'Folk with eyes that reflect unfamiliar constellations. Skin shows patterns like star maps. Their touch leaves frost or heat depending on their origin. Bodies sometimes seem to flicker between states. They move with alien grace, sometimes appearing in places they were not moments before. Their presence makes reality feel thin.',
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
                description: 'Coldest touch of all Astren. Skin pale as starlight, eyes dark like the void. Their presence makes air feel thin. They seem to fade slightly at the edges. Many have trouble staying in one place. Their movements sometimes leave trails of shadow. They speak rarely, voices carrying echoes of empty space.',
                culturalBackground: `The Void-Walkers trace their lineage to Astren who fell from the empty spaces between stars. Bloodline marked by the cold void that birthed them. Their tradition requires that every member learn to navigate the spaces between reality. Apprenticeships spent mastering the art of walking paths that others cannot see. Void-Walker craters are built in places where the void touches earth. Members serving as navigators and seekers of hidden knowledge. They practice ancient void-walking techniques passed down through generations. How to step through shadows that are not there. How to hear the void whispers. How to find lost places in the emptiness. They claim the void speaks to them in the silence between heartbeats. Showing them paths through reality that others cannot see. But the void hungers. Prolonged use of their gifts leaves them feeling empty and disconnected. Many Void-Walkers become reclusive seekers of hidden knowledge. Minds filled with too much cosmic silence. The bloodline values knowledge and navigation. Honor measured in paths found and voids traversed. They are the navigators of Astren society. Their void-walking unmatched but their souls forever marked by the emptiness that birthed them.`,
                statModifiers: {
                    spirit: 4,
                    intelligence: 3,
                    agility: 1
                },
                traits: [
                    {
                        id: 'void_step_astren',
                        name: 'Void Step',
                        description: 'Teleport through the void between spaces.',
                        level: 1,
                        icon: 'spell_arcane_blink',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'void',
                            secondaryElement: 'teleport',
                            icon: 'spell_arcane_blink',
                            tags: ['teleport', 'void', 'movement']
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'teleport',
                                name: 'Teleport',
                                description: 'Step through the void to another location within 60 feet.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'major'
                        },
                        targetingConfig: {
                            targetingType: 'location',
                            rangeType: 'ranged',
                            rangeDistance: 60
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'cosmic_isolation_astren',
                        name: 'Cosmic Isolation',
                        description: 'Immune to mind-affecting effects and fear.',
                        level: 1,
                        icon: 'spell_shadow_antimagicshell',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'mental',
                            secondaryElement: 'cosmic',
                            icon: 'spell_shadow_antimagicshell',
                            tags: ['immunity', 'mind', 'fear', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Mind Immunity',
                                    description: 'Immune to mind-affecting effects',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your alien mind is beyond mortal manipulation'
                                    }
                                },
                                {
                                    name: 'Fear Immunity',
                                    description: 'Immune to fear',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'The void has shown you true terror'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'void_hunger_astren',
                        name: 'Void Hunger',
                        description: 'Vulnerable to necrotic damage (+50% damage) as the void within draws in death energies.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'necrotic',
                            icon: 'spell_shadow_deathsembrace',
                            tags: ['vulnerability', 'necrotic', 'void', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Necrotic Vulnerability',
                                    description: 'Take +50% damage from necrotic sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Celestial', 'Cosmic', 'Deep Speech'],
                speed: 30
            },
            sunborn: {
                id: 'sunborn_astren',
                name: 'Sun Bound',
                description: 'Skin warm to the touch, sometimes glowing faintly. Eyes bright like captured starlight. Their presence warms the air around them. Many have hair that seems to flicker like flame. They glow slightly, especially in darkness. Their touch can leave warmth behind. They move with radiant energy, never fully still.',
                culturalBackground: `The Sun-Bound trace their lineage to Astren who fell from dying stars. Bloodline marked by the stellar fire that birthed them. Their tradition requires that every member learn to channel solar energy. Apprenticeships spent mastering the art of controlling the stellar fire within. Sun-Bound craters are built in places where solar energy collects. Members serving as healers, warriors, beacons of light. They practice ancient solar techniques passed down through generations. How to ignite flames with a glance. How to heal with solar warmth. How to channel stellar radiance. Their skin burns warm to the touch even in winter. Presence inspiring hope in dark times. They claim the sun death screams taught them the value of light and warmth. Making them radiant beacons. But the stellar fire consumes them. They must rest in darkness to avoid burning out completely. Many Sun-Bound become wandering healers or warriors of light. Inner fire both blessing and burden. The bloodline values light and warmth. Honor measured in darkness dispelled and wounds healed. They are the beacons of Astren society. Their solar fire unmatched but their bodies forever marked by the dying stars that birthed them.`,
                statModifiers: {
                    strength: 2,
                    charisma: 3,
                    spirit: -2
                },
                traits: [
                    {
                        id: 'stellar_radiance_astren',
                        name: 'Stellar Radiance',
                        description: 'Emit intense light and heat. Damage nearby enemies.',
                        level: 1,
                        icon: 'spell_holy_innerfire',
                        spellType: 'ACTION',
                        effectTypes: ['damage'],
                        typeConfig: {
                            school: 'fire',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_innerfire',
                            tags: ['radiant', 'fire', 'aoe', 'damage']
                        },
                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'radiant',
                            formula: '2d6'
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 10
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'solar_healing_astren',
                        name: 'Solar Healing',
                        description: 'While in direct sunlight, you regain 1d4 + your proficiency bonus hit points at the start of each of your turns. This regeneration does not function while you are at 0 HP or unconscious.',
                        level: 1,
                        icon: 'spell_holy_renew',
                        spellType: 'PASSIVE',
                        effectTypes: ['healing'],
                        typeConfig: {
                            school: 'healing',
                            secondaryElement: 'solar',
                            icon: 'spell_holy_renew',
                            tags: ['healing', 'regeneration', 'solar', 'passive']
                        },
                        healingConfig: {
                            healingType: 'hot',
                            formula: '1d4 + proficiency',
                            hasHotEffect: true,
                            hotTickInterval: 1,
                            hotDuration: 'while in direct sunlight (no effect at 0 HP or while unconscious)'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'shadow_frailty_astren',
                        name: 'Shadow Frailty',
                        description: 'Vulnerable to necrotic damage (+50% damage) as darkness extinguishes your stellar fire.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'necrotic',
                            icon: 'spell_shadow_deathsembrace',
                            tags: ['vulnerability', 'necrotic', 'shadow', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Necrotic Vulnerability',
                                    description: 'Take +50% damage from necrotic sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Celestial', 'Ignan'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 10, // Stellar fire gives them some durability but consumes their spirit
                    mana: 15, // Moderate stellar energy grants some mana
                    ap: 3, // Radiant energy gives them standard action points
                    passivePerception: 12, // Stellar awareness enhances perception
                    swimSpeed: 5, // Not natural swimmers, water can quench their fire
                    climbSpeed: 5, // Not natural climbers
                    visionRange: 65,
                    darkvision: 0,
                    initiative: 1 // Radiant energy makes them quick to react
                },
                savingThrowModifiers: {
                    // Stellar fire provides advantage against cold and darkness effects
                    advantage: ['stun', 'fear'] // Inner fire resists cold shock and fear effects
                }
            },
            constellation: {
                id: 'constellation_astren',
                name: 'Star Mapped',
                description: 'Skin marked with patterns like constellations. These patterns sometimes glow faintly at night. Eyes reflect star patterns when they focus. Many have trouble focusing on immediate things. They move with purpose that seems driven by unseen forces. Their presence makes you feel watched by distant stars. Many wear robes that reveal their patterns.',
                culturalBackground: `The Star-Mapped trace their lineage to Astren who fell bearing the patterns of constellations. Bloodline marked by star-maps etched into their very essence. Their tradition requires that every member learn to read the patterns written in the heavens. Apprenticeships spent mastering the art of navigating by stars and reading fate in constellations. Star-Mapped craters are built under open skies where the stars are clearest. Members serving as astronomers, prophets, counselors. They practice ancient star-reading techniques passed down through generations. How to read fate in star patterns. How to navigate by the night sky. How to see the grand patterns in random events. Their skin bears the patterns of constellations. Souls mapped by the stars themselves. They claim the stars guide their fates. Showing them destinies written in the heavens. But this cosmic awareness overwhelms them. They struggle to focus on immediate concerns. Minds always reaching for the bigger picture. Many Star-Mapped become astronomers or prophets. Living under open skies. The bloodline values knowledge and prophecy. Honor measured in patterns read and fates understood. They are the seers of Astren society. Their star-reading unmatched but their minds forever fractured by patterns that cannot be unseen.`,
                statModifiers: {
                    spirit: 4,
                    intelligence: 3,
                    agility: 1
                },
                traits: [
                    {
                        id: 'star_reading_astren',
                        name: 'Star Reading',
                        description: 'Read fate in the stars. Gain advantage on one divination check.',
                        level: 1,
                        icon: 'spell_holy_prophecy',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'divination',
                            secondaryElement: 'cosmic',
                            icon: 'spell_holy_prophecy',
                            tags: ['divination', 'fate', 'stars']
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'fate',
                                name: 'Fate',
                                description: 'Read the patterns in the stars to divine the future.'
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
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'constellation_form_astren',
                        name: 'Constellation Form',
                        description: 'Transform into starlight. Become intangible but cannot affect physical world.',
                        level: 1,
                        icon: 'spell_arcane_blink',
                        spellType: 'ACTION',
                        effectTypes: ['transformation', 'buff'],
                        typeConfig: {
                            school: 'transmutation',
                            secondaryElement: 'starlight',
                            icon: 'spell_arcane_blink',
                            tags: ['transformation', 'intangible', 'starlight']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Starlight Form',
                                    description: 'Become intangible',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'You become made of pure starlight'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: true
                        },
                        transformationConfig: {
                            transformationType: 'elemental',
                            targetType: 'self',
                            duration: 1,
                            durationUnit: 'minutes',
                            power: 'major',
                            specialEffects: ['intangible', 'luminous', 'cannot_attack']
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 2,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    },
                    {
                        id: 'cosmic_strain_astren',
                        name: 'Cosmic Strain',
                        description: 'Vulnerable to psychic damage (+50% damage) as cosmic awareness makes you susceptible to mental intrusions.',
                        level: 1,
                        icon: 'spell_shadow_psychichorrors',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'psychic',
                            icon: 'spell_shadow_psychichorrors',
                            tags: ['vulnerability', 'psychic', 'cosmic', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Psychic Vulnerability',
                                    description: 'Take +50% damage from psychic sources',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Celestial', 'Cosmic'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 5, // Cosmic awareness makes them physically frail
                    mana: 12, // Strong connection to the stars grants enhanced mana
                    ap: 2, // Minds filled with cosmic patterns, less action-oriented
                    passivePerception: 13, // Cosmic awareness enhances perception
                    swimSpeed: 10, // Not natural swimmers
                    climbSpeed: 10, // Not natural climbers
                    visionRange: 60,
                    darkvision: 30,
                    initiative: -1 // Cosmic awareness makes them slower to react to immediate threats
                },
                savingThrowModifiers: {
                    // Cosmic awareness provides advantage against divination and mental effects
                    advantage: ['charm', 'fear', 'stun'] // Star reading resists mental control, fear, and confusion
                }
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
