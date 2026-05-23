export const hrym = {
    id: 'hrym',
    name: 'Hrym',
    essence: 'The Breath-Takers',
    illustration: '/assets/images/races/hrym_illustration.png',
    illustrationCaption: 'A towering Hrym warrior wreathed in ice-crusted furs, breath curling into frost even in temperate air.',
    description: 'We do not shiver. Our breath freezes in summer. Our skin holds the cold like a wound that never closed — every Hrym born from mothers who gave their warmth to us and took nothing back. The south calls us dead men walking. They are wrong, but not by much. We descended from starving refugees who consumed their own dead in a blizzard that lasted three winters. The cold entered us through that first meal. It has never left. We live now in the hollow bones of an elder city, frozen mid-calamity, its machines still humming beneath our feet. We have learned to work some of its metals. The rest terrifies us. We do not speak of parentage because asking "Who is your mother?" is asking "How did you kill her?" Our orphans raise orphans. Our dead are eaten so the hunger does not accumulate. The south owes us blood-debts from wars they stopped acknowledging. The Archive keeps our secrets. The cold recognizes us as its own.',
    gradient: 'linear-gradient(135deg, #8B7355 0%, #A0522D 100%)',
    icon: 'fas fa-mountain',
    overview: `The wind screams outside our longhouse, carrying a voice older than memory. Inside, the frost-fungus jars cast pale blue light across faces that have forgotten what warmth feels like. We don't build fires to get warm. We build them to remember what we gave up.

We are the descendants of the Hunger Pact — starving refugees who fled into the eternal winter, and when the blizzard cornered them with no food and no mercy, they made a choice. They consumed their own dead. The cold entered through that flesh. It has been in our blood ever since.

You can tell a Hrym at any distance. Our breath freezes even in southern heat — a constant crystalline plume that never stops. Our skin feels like stone left in shadow: cold to the touch, resistant to warmth, never quite alive. A Hrym handshake feels like gripping a corpse. We are not dead. But the cold inside us remembers what it cost to stay alive.

Our children are born into a world where their first act is to take. The Milk-Grief kills more Hrym mothers than war, than winter, than every frost-beast in the wastes. The infant's inherited hunger drains the mother faster than her body can compensate. Within the first year, nearly half our mothers are dead. So we do not ask "Who is your mother?" That question means "How did you fail her?" Children are raised communally by the elder-watchmen. No one knows their parents. No one asks.

We do not write things down often. The cold destroys paper. We carve our histories into runestones and speak them in tongues that predate common speech. Every rune tells a story. Every burial mound holds a debt.

When a Hrym dies far from the longhouse fire, their spirit wanders the wastes seeking the light that leads to the ancestor halls. But if you break a clan oath, that light never comes. Just endless white, wandering until the ice takes your name from memory itself. I have seen oathbreakers — they do not fear death. They fear being forgotten. They fear the cold that waits outside the longhouse walls, the cold that knows us all by name.

The Frozen Archive shelters us. A dead civilization's capital city, flash-frozen mid-calamity, its streets paved with the bones of those who died before we were a people. We live in its hollow spaces — repurposed halls, half-buried in ice, machines that still hum after ten thousand years without maintenance. We have learned to work some of its metals. We forge weapons from alloys we do not fully understand. But there are halls we do not enter. Doors that have never opened. A hum beneath the ice that changes pitch when something stirs deep below. We tell outsiders we understand the Archive. We are lying. We are terrified of the day something stops working and we cannot fix it.

The Neth scholars know some of our secrets — they trade knowledge for Archive access, the only outsiders we trust near the old machines. The southern kingdoms owe us blood-debts from the War of Thousand Screams that they have never fully paid. They sent grain, then stopped. Swords, then cheaper ones. Now they treat us with guilty hostility — the kind of rudeness that comes from knowing you owe someone and hoping they leave before you have to acknowledge it.

But we survive. We always survive. The cold recognizes us. It will not let us go.`,

    variantDiversity: 'The Hrym are divided into three bloodlines descended from the original clan structure: The Bloodhammer chose the Archive\'s forge-halls and carry the Hunger Pact as physical rage. The Rune Keepers chose the library-halls and preserve ancient memory at the cost of their own. The Frostbound were never a choice — they are the gelid-born infants who survived the Milk-Grief but emerged permanently colder, pushed to the margins by both Bloodhammer and Rune Keeper societies, forming their own culture from exile.',

    baseTraits: {
        languages: ['Common', 'Old Nord', 'Runic'],
        lifespan: '80-120 years',
        baseSpeed: 30,
        size: 'Medium',
        height: '6\'0" - 7\'0"',
        weight: '180-280 lbs',
        build: 'Tall, broad-shouldered, permanently cold to the touch'
    },

    sharedTraits: [
        {
            id: 'blood_debt_hrym',
            name: 'Blood Debt',
            description: 'At character creation, declare one Blood Debt: an unresolved feud, a sacred vow, or an unpaid favor stretching back to the Hunger Pact. When facing a situation directly related to your debt, gain +2 to all rolls. When facing a situation that contradicts or dishonors the debt, suffer -2 to all rolls. This debt can never be fully resolved — only replaced by a new one of equal weight.',
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
                        statModifier: { stat: 'all_rolls', magnitude: 2, magnitudeType: 'flat' },
                        conditions: { bloodDebtAligned: true }
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
                        statModifier: { stat: 'all_rolls', magnitude: -2, magnitudeType: 'flat' },
                        conditions: { bloodDebtContradicted: true }
                    }
                ],
                durationValue: 0,
                durationType: 'permanent',
                durationUnit: 'permanent',
                canBeDispelled: false
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        },
        {
            id: 'unfinished_name_hrym',
            name: 'The Unfinished Name',
            description: 'Every Hrym is born with a name missing a syllable. At character creation, choose the kind of act that will earn it: a life you save, an enemy you end personally, a secret you uncover about the Frozen Archive, or a winter survived alone. Until the name is complete, other Hrym can sense the incompleteness — you suffer -1 to all Presence-based checks against Hrym NPCs. The GM will reveal the missing syllable when the defining act is completed.',
            level: 1,
            icon: 'spell_frost_chainsofice',
            spellType: 'PASSIVE',
            effectTypes: ['debuff'],
            typeConfig: {
                school: 'frost',
                secondaryElement: 'spirit',
                icon: 'spell_frost_chainsofice',
                tags: ['identity', 'social', 'passive', 'shared']
            },
            debuffConfig: {
                debuffType: 'socialPenalty',
                effects: [
                    {
                        id: 'incomplete_presence',
                        name: 'Unfinished Presence',
                        description: '-1 to all Presence-based checks when interacting with Hrym NPCs. They can sense the missing syllable in your name.',
                        statModifier: { stat: 'charisma', magnitude: -1, magnitudeType: 'flat' },
                        conditions: { npcRace: 'hrym', appliesToChecks: ['persuasion', 'intimidation', 'deception', 'performance'] }
                    }
                ],
                durationValue: 0,
                durationType: 'permanent',
                durationUnit: 'permanent',
                canBeDispelled: false
            },
            utilityConfig: {
                utilityType: 'custom',
                selectedEffects: [{
                    id: 'earned_name',
                    name: 'Name Completed',
                    description: 'When your defining act is completed, the missing syllable appears in your breath-frost. The penalty is permanently removed. Your full name is recognized by the cold itself.'
                }],
                duration: 0,
                durationUnit: 'instant',
                power: 'major'
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        }
    ],

    epicHistory: `The First Breaking came before memory was written. Ancient frost lords descended from the eternal ice, their hunger for warmth absolute and terrible. For three generations, the southern kingdoms fell one by one — castle walls shattered like glass, armies frozen in mid-charge, entire bloodlines extinguished in a single night of screaming winds.
    
    During the War of Thousand Screams, Hrym warriors held the Frostgate Pass alone while southern armies mustered. They died in the thousands — not to steel, but to the cold that waited until they had killed every enemy before turning on them. The survivors returned changed. Their skin held the pale mark of frost that never faded.
    
    The southern kingdoms sent grain, then stopped. Better swords, then cheaper ones. The debt was never fully paid. The Hrym remember. The Hrym always remember.
    
    Now the Grand Alliance calls armies east to face a new shadow. The mountain passes stand undefended. The Archive hums with machines that have not stopped in ten thousand years. The frost lords stir again beneath the ice. And the Hrym stand where they have always stood — alone, in the cold, unpaid.`,

    notableFigures: [
        {
            name: 'Varr Hold-Name',
            title: 'The Only Finished Man',
            portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
            backstory: `The oldest living Hrym and the only one to earn his full name while still breathing. Most Hrym receive their missing syllable on their deathbed, if at all. Varr earned his at forty winters by breaching a sealed Archive vault that no one had opened since the city froze. He has never spoken of what was inside. The frost-syllable that completes his name appears in his breath whenever he speaks it aloud — a pale glyph that hangs in the air for six heartbeats before fading. He spends his days hearing disputes between clan elders, his judgments harsh but unquestionable. His eyes are the color of old ice. His skin has the texture of stone that has been frozen and thawed more times than memory can count. He has refused every call from the south — every alliance, every trade offer, every scholar's petition. When asked why, he exhales, watches the glyph form, and says nothing.`
        },
        {
            name: 'Yrsa Bone-Needle',
            title: 'Keeper of the Erased',
            portraitIcon: 'Armor/Head/head-split-orange-faceplate-helmet',
            backstory: `The most senior Rune Keeper alive. Her body is so covered in memory-runes that only her eyelids and the corners of her lips remain unscarred. She has forgotten more than most Hrym will ever learn — literally. She cannot remember her own mother's face. She cannot name her first child. She traded those memories for knowledge the Archive demanded in payment, and the Archive does not negotiate. When she speaks, she sometimes stops mid-sentence and stares at nothing — the memory she was reaching for is no longer there. Children are brought to her from across the northern territories. She touches their faces and names their ancestors back seven generations, reciting debts and feuds from before the Hunger Pact itself. But when asked about her own past, she touches the rune on her left palm and says: "I paid for that already. It is gone." She answers all outsiders the same way: "The north remembers what you choose to forget. But I am forgetting myself, one secret at a time, and when I am empty the Archive will finally own someone completely."`
        },
        {
            name: 'Skarde Ice-Eater',
            title: 'He Who Survived the Full Pact',
            portraitIcon: 'Ability Warrior/Ability Warrior - Ravager',
            backstory: `A Bloodhammer berserker who experienced the Hunger Pact's full expression. During a blizzard that lasted six weeks, his hunting party was cut off from the clan in the deepest wastes. He was the only survivor. What he consumed to stay alive, he has never spoken aloud — but his eyes are permanently red, not only in rage, and his breath-frost carries dark flecks that could be dried blood or could be shadow. Other Bloodhammer fear him. He doesn't mind. He spends most of his time alone at the Frostgate Pass, watching the horizon for the frost lords' return. The Rune Keepers have offered to read his runes. He refused. "The Pact already read me," he said. "It liked what it found." He is the only living Hrym who has been inside the Hunger-Vaults twice. He will not say why he went back.`
        },
        {
            name: 'Nal First-Cold',
            title: 'The Living Monument',
            portraitIcon: 'Spell Frost/Spell Frost - Frostbolt',
            backstory: `Believed to be the first gelid-born child who survived to adulthood — the first Frostbound. She is over two hundred years old. Her body temperature is so low that snow accumulates on her skin rather than melting. She is essentially a living ice sculpture, moving with deliberate, geological slowness — a shift of her hand taking minutes, a turn of her head taking an hour. She no longer speaks with a voice. She communicates through frost-glyphs she exhales onto surfaces, which Rune Keepers can read. She has been doing this so long that the Gelid-Caverns have a dedicated alcove for her frost-messages — centuries of them, layered like sediment, the older ones still legible beneath the newer ones. She is not a leader. She is a monument. Every Frostbound visits her once, to place a hand against her frozen cheek and feel what they themselves are slowly becoming. She does not acknowledge them. But the frost-glyph she exhales when each one leaves always carries their name — complete and finished, the missing syllable somehow known to her alone.`
        }
    ],

    majorLocations: [
        {
            name: 'The Frozen Archive',
            description: `The capital city of a civilization that died before the Hrym were a people. Flash-frozen mid-calamity, its halls are lit by machines that have not stopped humming in ten thousand years. The Hrym live in its hollow spaces — repurposing ancient forges, libraries, and war-rooms as longhouses. Some halls have never been opened. Some doors are sealed from the inside. The temperature never rises above freezing, and the hum beneath the ice changes pitch when something stirs deep below. The Archive is their greatest secret, shared only with trusted Neth scholars who trade knowledge for access. Every Hrym who enters feels the city's attention shift in a way that cannot be proven but is never doubted.`
        },
        {
            name: 'The Hunger-Vaults',
            description: `The deepest chambers of the Archive where the original cannibal feasts occurred — not in barbarism, but in desperation so absolute it reshaped a bloodline. The walls are covered in ancient handprints, not painted or carved, but burned into the stone by blood flash-frozen so quickly it etched the rock at a molecular level. The temperature in these vaults never rises above freezing, even when the Archive's machines surge. The air tastes of iron and the faint sweetness of meat preserved too long. Every Hrym visits once, on their sixteenth winter, to touch the wall where the Pact was sealed and understand — physically, viscerally — what their ancestors chose so their bloodline could continue. Some refuse. No one judges them. Everyone understands.`
        },
        {
            name: "Mother's Rest",
            description: `The communal longhouse where Milk-Grief orphans are raised. It is the only structure in any Hrym settlement with no clan banner, no forge-mark, no rune-circle at the threshold. The fire burns lower here than anywhere else — a deliberate choice, because warmth makes the children think of what they never had. Elder-watchmen speak in whispers. The walls are lined with small carved bone tokens, each one representing a child who survived their first year without a mother. The tokens outnumber the living children three to one. Children here are taught that they belong to the clan, not to individuals, and that asking "Who is my mother?" is the same as asking "How did you fail her?" Most learn to stop wondering. Some never do.`
        },
        {
            name: 'The Gelid-Caverns',
            description: `Natural ice caves on the northern periphery of the Archive where Frostbound infants were traditionally left by families who could not bear to keep a child that felt like a corpse. The walls are honeycombed with shallow alcoves — some barely large enough for an infant — worn smooth by centuries of small bodies huddling in the dark. The cavern floor in front of each alcove is polished to a shine by decades of small feet that paced while waiting for someone who never came back. The Frostbound call this place the First Cradle. Every Frostbound returns here once in their life, to stand in the alcove where they were left and exhale. The frost does not form on these walls. Something in the ice remembers what happened here and will not participate. At the deepest point of the caverns sits Nal First-Cold, motionless, her frost-glyphs layering the walls like ancient sediment.`
        },
        {
            name: 'Frostgate Pass',
            description: `The narrowest crossing through the northern mountains, defended for three hundred years. Its walls are lined with the armor of those who died holding it — not as decoration, but because the cold preserves everything, and removing the dead from their post felt like admitting they had surrendered it. Skarde Ice-Eater stands watch here alone most nights. The wind screams through the pass eternally, carrying the battle cries of everyone who ever fell. And somewhere deep in the ice beneath the pass, something is listening. It has been listening since the First Breaking. It is patient. It always has been.`
        }
    ],

    currentCrisis: `The Grand Alliance has marched east, leaving the northern passes undefended. The forge-clans send their best warriors away, leaving only the elderly and the young. Southern caravans probe the borders, their spies seeking the Archive's secrets. The frost lords stir again beneath the eternal ice. And somewhere deep in the Archive, a machine that has been humming for ten thousand years has changed its pitch. The Rune Keepers do not know what this means. They are afraid to find out.`,

    culturalPractices: `Before your sixteenth winter, you forge your own weapon. The tradition is older than memory, born in the days when the Hunger Pact's first survivors had no steel to spare. The forging happens in silence under the aurora, the metal quenched not in water but in snow that has never melted. When the steel cools, you mark it with your own blood. Only when it tastes an enemy's life does the ritual complete.

Bloodhammer longhouses are armories — walls lined with hammers and axes from warriors long dead, each weapon telling the story of a life lived in the shadow of the eternal ice. Rune Keeper longhouses are libraries — shelves of carved bone-tablets, runic circles that glow faintly in the dark, memory-stones that whisper if you know how to listen. Frostbound shelters are outposts at the edge of the world — places where the cold has no mercy and neither do its children.

The dead are not buried. The Hunger Pact demands they be consumed, their flesh reclaimed so the accumulated hunger does not poison future generations. Young Hrym increasingly refuse this rite, creating a growing schism between tradition and revulsion. Those who are not consumed are sealed in the Archive's deepest chambers, where the cold preserves them as it has preserved everything else.

When a Hrym earns their full name — the missing syllable finally revealed — their breath-frost briefly spells it in the air. The cold settles around them differently. They feel finished. Many earn their name on their deathbed. Some never earn it at all.`,

    subraces: {
        berserker: {
            id: 'bloodhammer_hrym',
            name: 'Bloodhammer',
            description: 'The first ancestor chose the Archive\'s forge-halls. Their hunger manifests as rage — a furnace that runs on pain and answers every wound with a blow. Muscles built from swinging hammers through bone. Scars map every fight they\'ve survived. When the fury takes them, their eyes burn red and their breath comes in visible gouts, even in the heat of battle. They are the "purest" Hrym, the ones who believe survival meant fighting rather than thinking or adapting.',
            culturalBackground: `The Bloodhammer trace their descent to the ancestor who chose the Archive's armory — a hall of forge-remnants, ancient hammers, alloys that no modern smith can replicate. Their blood carries the Hunger Pact in its rawest form: not as a quiet memory, but as physical rage that surfaces when the body is pushed past its limits.

Before your sixteenth winter, you forge your own weapon. Hammer or axe. It becomes your life. The forging happens in silence under the aurora. When the steel cools, you mark it with your own blood. Only when it tastes an enemy's life does the ritual complete. The weapon becomes you — every notch a memory, every chip a story for the longhouse fire.

Bloodhammer society values strength above all. Honor is measured in kills counted, enemies crushed, songs sung where the ancestors listen. Blood feuds are settled in dawn duels fought with weapons that have never lost. Insults are answered with steel. Mercy is shown only to those who have earned it through their own strength.

They view the Rune Keepers as whisperers who hide behind spirits and old books while real warriors do the bleeding. They pity the Frostbound but refuse to acknowledge them as true Hrym — a gelid-born child born to a Bloodhammer mother is sent to the margins without ceremony. The hunger does not make room for weakness.

But the rage takes its toll. The berserker rituals passed down through generations change you permanently. When the fury breaks, you return to yourself hollowed out — your humanity burned away. Many Bloodhammer die young, not from enemy steel but from hearts that give out under the strain of sustaining anger that was never meant to be permanent.`,
            statModifiers: { strength: 3, constitution: 2, charisma: -3 },
            traits: [
                {
                    id: 'frost_rage_hrym',
                    name: 'Frost Rage',
                    description: 'When death draws near, the ancient hunger awakens — flooding your veins with glacial fury that turns your strikes to ice and hardens your flesh against steel, but leaves you hollow when it fades.',
                    level: 1,
                    icon: 'ability_warrior_rampage',
                    spellType: 'ACTION',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'frost',
                        icon: 'ability_warrior_rampage',
                        tags: ['rage', 'combat', 'frost', 'berserker']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'frost_melee_damage',
                                name: 'Frost Strikes',
                                description: 'Your melee attacks deal an additional 1d8 frost damage',
                                statModifier: { stat: 'frost_damage_melee', magnitude: '1d8', magnitudeType: 'dice' }
                            },
                            {
                                id: 'physical_resistance',
                                name: 'Frozen Hide',
                                description: 'Your flesh hardens like ice, granting 50% resistance to physical damage',
                                statModifier: { stat: 'physical_resistance', magnitude: 50, magnitudeType: 'percentage' }
                            },
                            {
                                id: 'prone_immunity',
                                name: 'Unshakable',
                                description: 'You are immune to being knocked prone while the rage endures'
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
                                description: 'Healing spells cannot target you while raging; only potions from an adjacent ally, regeneration, or killing blows restore health.'
                            },
                            {
                                id: 'rage_crash',
                                name: 'Hollow Aftermath',
                                description: 'After Frost Rage ends, suffer -2 to all Strength and Constitution checks until you complete a short rest. The Hunger Pact burns bright but leaves nothing behind — you are hollowed out, shaking, pale. The ancestors paid for this fury in flesh and you are paying it forward in exhaustion.',
                                statModifier: { stat: 'strength_constitution_checks', magnitude: -2, magnitudeType: 'flat' },
                                conditions: { postRage: true, resolvedBy: 'short_rest' }
                            }
                        ],
                        durationValue: 1,
                        durationType: 'minutes',
                        durationUnit: 'minutes',
                        canBeDispelled: false
                    },
                    triggerConfig: {
                        requiredConditions: { healthBelow: 50 }
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 1, mana: 0, components: ['verbal'] },
                    cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 }
                },
                {
                    id: 'consuming_strike_hrym',
                    name: 'Hunger Reclaimed',
                    description: 'The Pact left teeth in your blood. When you feed, it rewards you. When you starve, it gnaws. Consume raw flesh to remember what your ancestors survived — but go too long without and the hunger begins eating you from the inside.',
                    level: 1,
                    icon: 'spell_shadow_unholystrength',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'physical',
                        secondaryElement: 'spirit',
                        icon: 'spell_shadow_unholystrength',
                        tags: ['hunger', 'consumption', 'passive']
                    },
                    buffConfig: {
                        buffType: 'custom',
                        customDescription: 'After consuming raw flesh from a recently slain creature (short rest action), gain +1d4 to weapon damage rolls for 1 hour. The Hunger Pact remembers what you ate.',
                        effects: [
                            {
                                id: 'hunger_damage_bonus',
                                name: 'Fed Fury',
                                description: 'After consuming raw flesh: +1d4 bonus to weapon damage rolls for 1 hour. The flesh must be consumed within 10 minutes of the creature\'s death.',
                                statModifier: { stat: 'weapon_damage', magnitude: '1d4', magnitudeType: 'dice' }
                            }
                        ],
                        durationValue: 1,
                        durationType: 'hours',
                        durationUnit: 'hours',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statPenalty',
                        effects: [
                            {
                                id: 'starvation_penalty',
                                name: 'The Gnawing',
                                description: 'If you go 24 hours without consuming raw flesh from a living creature, your body remembers what starvation meant to your ancestors. Suffer -1 to Strength and Constitution until you feed. The Pact does not ask politely — it simply begins taking back what it lent.',
                                statModifier: { stat: 'strength', magnitude: -1, magnitudeType: 'flat' },
                                additionalStatModifier: { stat: 'constitution', magnitude: -1, magnitudeType: 'flat' },
                                conditions: { starved: true, starvedDuration: 24, starvedDurationUnit: 'hours', resolvedByFeeding: true }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'burning_hunger_hrym',
                    name: 'Burning Hunger',
                    description: 'The hunger that fuels your rage leaves you vulnerable to flames that mirror your inner fire, and psychic intrusions that prey upon the fractured mind left behind when the fury subsides. The Pact giveth, and the Pact taketh away.',
                    level: 1,
                    icon: 'spell_fire_soulburn',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'curse',
                        secondaryElement: 'fire',
                        icon: 'spell_fire_soulburn',
                        tags: ['vulnerability', 'passive']
                    },
                    debuffConfig: {
                        debuffType: 'vulnerability',
                        effects: [
                            {
                                id: 'damage_vulnerability_fire',
                                name: 'Fire Vulnerability',
                                description: 'The inner rage that sustains you makes you vulnerable to external flames. 50% vulnerability to fire damage.',
                                statusEffect: { vulnerabilityType: 'fire', vulnerabilityPercent: 50 }
                            },
                            {
                                id: 'damage_vulnerability_psychic',
                                name: 'Psychic Vulnerability',
                                description: 'Your fractured mind, shaped by berserker rages, cannot resist psychic intrusions. 50% vulnerability to psychic damage.',
                                statusEffect: { vulnerabilityType: 'psychic', vulnerabilityPercent: 50 }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                }
            ],
            languages: ['Common', 'Old Nord', 'Runic'],
            speed: 30,
            baseStats: {
                armor: 0,
                hp: 32,
                mana: 18,
                ap: 4,
                passivePerception: 12,
                swimSpeed: 15,
                climbSpeed: 15,
                visionRange: 55,
                darkvision: 0,
                initiative: 2
            },
            savingThrowModifiers: {
                disadvantage: ['stun'],
                advantage: ['fear']
            }
        },

        skald: {
            id: 'rune_keeper_hrym',
            name: 'Rune Keeper',
            description: 'The first ancestor chose the Archive\'s library-halls. Their hunger manifests as an endless thirst for knowledge — a quieter hunger than the Bloodhammer\'s rage, but no less insatiable. Flesh marked with bone-needle runes that glow faintly in the dark. Eyes that hold the weight of accumulated memory, irises shifting like dense script when they focus on a new thought. When they speak, the voices of dead scholars layer beneath their words like harmonic undertones, and sometimes they quote texts they have never physically encountered.',
            culturalBackground: `The Rune Keepers trace their descent to the ancestor who chose the Archive's libraries — vast halls of preserved memory-stones, glyphs from a dead world, machines that catalogued knowledge beyond comprehension. Their blood carries the Hunger Pact as a thirst for understanding that can never be satisfied.

Before their eighteenth winter, every Rune Keeper undertakes the vision quest. They are taken to frozen caves deep in the wastes where ice has never melted, left alone for days without food or fire. When the visions come — and they always come — the runes get carved into their flesh with needles made from the bones of previous keepers. Each rune marks a story learned, a secret kept, a debt owed to the dead.

The carving is slow, deliberate, and permanent. These runes do not fade. They grow deeper with age, scars piling up like pages in a book written in flesh. Some forget what warmth feels like. Others forget what it meant to love or hate. The knowledge they preserve does not ask permission before moving in.

Rune Keeper longhouses are libraries rather than armories. Walls lined with bone-tablets, floors marked with runic circles, memory-stones that whisper if you know how to listen. They are historians keeping records spanning millennia, judges whose rulings carry the weight of ancestral precedent, mediators who see disputes through dead eyes.

They view the Bloodhammer as necessary but ultimately doomed — the rage burns out, the body gives up, and what remains? The Rune Keepers preserve what outlasts flesh. They view the Frostbound with a complex mixture of pity and recognition. Both are marked by what the cold remade of them — the Rune Keepers through their runes, the Frostbound through their bodies.

The Neth scholars from the south occasionally visit their libraries. These are the only outsiders permitted near the Archive's memory-stones — a trust earned through centuries of shared scholarship and mutual recognition that some knowledge is too dangerous for those who have not paid for it in flesh.`,
            statModifiers: { spirit: 3, intelligence: 2, strength: -2 },
            traits: [
                {
                    id: 'runic_inscription_hrym',
                    name: 'Runic Inscription',
                    description: 'Carve a rune into a surface with the needle you inherited from your predecessor. The Archive\'s glyphs answer to those who have paid for them in flesh.',
                    level: 1,
                    icon: 'spell_shadow_coneofsilence',
                    spellType: 'ACTION',
                    effectTypes: ['buff', 'utility'],
                    typeConfig: {
                        school: 'frost',
                        secondaryElement: 'arcane',
                        icon: 'spell_shadow_coneofsilence',
                        tags: ['rune', 'warding', 'divination']
                    },
                    buffConfig: {
                        buffType: 'custom',
                        customDescription: 'Carve a rune. Choose one: Rune of Warding (10ft zone, ally entering gains protection from next status effect, 1 min), Rune of Wrath (attach to weapon, next attack deals 2d8 frost + slow 10ft), or Rune of Sight (see through from up to 1 mile, max 2 active).',
                        effects: [
                            {
                                id: 'rune_of_warding',
                                name: 'Rune of Warding',
                                description: 'Carve a protective rune. Allies entering the 10ft zone gain protection from the next status effect. Lasts 1 minute.'
                            },
                            {
                                id: 'rune_of_wrath',
                                name: 'Rune of Wrath',
                                description: 'Enchant a weapon with frost. Next attack deals 2d8 frost damage and slows target 10ft for 1 round.',
                                statModifier: { stat: 'frost_damage_weapon', magnitude: '2d8', magnitudeType: 'dice' }
                            },
                            {
                                id: 'rune_of_sight',
                                name: 'Rune of Sight',
                                description: 'Carve a scrying rune. See through it from up to 1 mile away. Maximum 2 active runes.'
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
                            id: 'runic_carving',
                            name: 'Rune Carving',
                            description: 'Carve a rune into a surface to create a magical effect. The Archive remembers what you inscribed.'
                        }],
                        duration: 0,
                        durationUnit: 'instant',
                        power: 'moderate'
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 2, mana: 8, components: ['verbal', 'somatic'] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                    specialMechanics: {
                        memoryCost: 'Each time you carve a rune, you permanently forget one minor memory — a name you once knew, a face from childhood, the taste of a meal you will never taste again. Track your forgotten memories. At 5 accumulated, suffer a permanent -1 to Charisma checks. At 10, another -1. The Archive\'s glyphs answer to those who have paid for them in flesh and memory. There is no known way to recover what you surrender.'
                    }
                },
                {
                    id: 'ancestral_echo_hrym',
                    name: 'Ancestral Echo',
                    description: 'The spirits of your predecessors linger at the edge of fate. When fortune turns against you with the cruelest roll, they reach through the veil — but they will not reach again without tribute.',
                    level: 1,
                    icon: 'spell_holy_divineintervention',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'frost',
                        secondaryElement: 'spirit',
                        icon: 'spell_holy_divineintervention',
                        tags: ['reroll', 'ancestral', 'passive']
                    },
                    buffConfig: {
                        buffType: 'custom',
                        customDescription: 'Reroll a natural 1 on any saving throw. Must take the new result. Once per long rest. After use, you must perform a 10-minute tribute ritual at a longhouse fire within 24 hours or the ancestors will not answer again.',
                        effects: [
                            {
                                id: 'ancestral_reroll',
                                name: 'Ancestral Intervention',
                                description: 'When you roll a natural 1 on a saving throw, you may reroll it. Must take the new result. Once per long rest.'
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'resourcePenalty',
                        effects: [
                            {
                                id: 'ancestral_tribute',
                                name: 'Spirit Debt',
                                description: 'After using Ancestral Echo, perform a 10-minute tribute ritual at a longhouse fire or runestone within 24 hours. If unpaid, the ability is disabled until tribute is given. Three unpaid debts disable it until a 1-hour Seance ritual is performed.'
                            }
                        ],
                        durationValue: 24,
                        durationType: 'hours',
                        durationUnit: 'hours',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 }
                },
                {
                    id: 'runescarred_hrym',
                    name: 'Runescarred',
                    description: 'The bone-needle scars covering your flesh are visible and deeply unsettling. Non-Hrym NPCs react with Suspicion — disadvantage on the first Persuasion or Deception check with any NPC who can see your scars. Your own people recognize the sacrifice these marks represent.',
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
                                description: 'Disadvantage on first Persuasion or Deception check with non-Hrym NPCs who can see your runescars. Hrym NPCs are unaffected — they know what these scars cost.'
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                }
            ],
            languages: ['Common', 'Old Nord', 'Runic'],
            speed: 30,
            baseStats: {
                armor: 0,
                hp: 16,
                mana: 38,
                ap: 2,
                passivePerception: 14,
                swimSpeed: 10,
                climbSpeed: 20,
                visionRange: 60,
                darkvision: 0,
                initiative: -1
            },
            savingThrowModifiers: {
                advantage: ['fear'],
                disadvantage: ['charm']
            }
        },

        icewalker: {
            id: 'frostbound_hrym',
            name: 'Frostbound',
            description: 'They were not a choice. They are the gelid-born — infants who survived the Milk-Grief but emerged permanently colder, their body temperature never rising above glacial. Cast out by both Bloodhammer and Rune Keeper families who could not bear to keep a child that felt like a corpse, they formed their own culture from exile. Their flesh is hard and cold to the touch. Their breath does not mist — their lungs learned to breathe the cold itself. Their heartbeat is slow, patient, inexorable. They are the unwanted children of all Hrym.',
            culturalBackground: `The sagas do not celebrate the Frostbound. They were never mentioned in the old songs. The gelid-born infants — those who survived the Milk-Grief but emerged permanently changed — were not a subrace at first. They were accidents. A Bloodhammer mother dies nursing, the infant lives but stays cold. A Rune Keeper mother survives but the child is gelid-born — skin like stone, breath invisible, heartbeat once every ten seconds. These children were given to the margins. Left at the edges of longhouses. Sent to tend the farthest watch-fires where no one would have to look at them.

Over centuries, they found each other. The outcast children grew up together, then raised each other's children. A culture formed from exile — not by choice, but by necessity. They built their shelters on glacier peaks where the wind never stops and the sun barely reaches. They scouted the deepest wastes. They guarded borders most Hrym could not even see.

Every Frostbound spends three winters alone in the deepest wastes before they can take their place. This is not a survival test. It is a communion — the cold that made them what they are, acknowledged and accepted. Through generations of this rite, their bloodline has adapted in ways that border on unnatural. Their flesh grows harder each winter. Cold tolerance becomes immunity. Bodies shaped by the land itself.

But it costs. Each generation tolerates warmth less. Their hardened flesh cracks in temperatures others find comfortable. Many Frostbound cannot leave the north — the transformation is too complete. Warmth becomes poison. Skin cracks and bleeds. Lungs struggle with air that holds heat.

They view the Bloodhammer with a kind of patient disinterest. The Bloodhammer's rage burns hot and burns out. The Frostbound endure. They view the Rune Keepers with recognition — both are marked by something that changed what it means to be human. But the Rune Keepers chose their transformation. The Frostbound were made.

The Neth scholars occasionally seek out Frostbound scouts for expeditions into the deep wastes where no one else survives. These partnerships are brief, practical, and rarely discussed afterward. The Frostbound do not trust the warmth-walkers. But they appreciate being seen — briefly — as something other than what their parents threw away.`,
            statModifiers: { constitution: 3, spirit: 2, charisma: -3 },
            traits: [
                {
                    id: 'deep_frost_hrym',
                    name: 'Deep Frost',
                    description: 'The deepest wastes claimed your bloodline before you drew your first breath — a gift passed down from the gelid-born mother whose body failed her. The cold recognizes its own and will not harm you. But warmth does not recognize you either. Fire healing, hot meals, the comfort of a sun-warmed stone — these things belong to the living, and the cold inside you has forgotten what living feels like.',
                    level: 1,
                    icon: 'spell_frost_frozenorb',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'utility', 'debuff'],
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
                                description: 'Complete immunity to frost damage. The cold does not harm you — it recognizes its own.',
                                statusEffect: { level: 'extreme', description: 'Take no damage from frost sources' }
                            },
                            {
                                id: 'weather_endurance',
                                name: 'Weather Endurance',
                                description: 'Immunity to exhaustion from frost weather. You survive in arctic conditions indefinitely without shelter or supplies.',
                                statusEffect: { level: 'moderate', description: 'Never suffer exhaustion from frost weather' }
                            },
                            {
                                id: 'ice_strider',
                                name: 'Ice Strider',
                                description: 'Snow and ice are never difficult terrain for you.',
                                statusEffect: { level: 'moderate', description: 'Ignore difficult terrain from snow and ice' }
                            },
                            {
                                id: 'deep_frost_armor',
                                name: 'Frozen Stance',
                                description: 'Standing still on ice for 1 round grants +2 armor until you move more than 10ft.',
                                statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' },
                                conditions: { terrain: ['ice'], stationary: true, duration: 1, breaksOn: { moveDistance: 10 } }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'restriction',
                        effects: [
                            {
                                id: 'warmth_rejection',
                                name: 'Warmth Rejection',
                                description: 'Fire-based healing spells restore only half HP to you. Campfires and warm meals provide no rest benefits — your body has forgotten how to accept warmth. In warm or hot climates, you have disadvantage on all saving throws. The cold protected you. The cold will not let warmth back in.'
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
                            { id: 'arctic_survival', name: 'Arctic Survival', description: 'Survive in arctic conditions indefinitely without shelter or supplies' },
                            { id: 'snow_tracks', name: 'Trackless Snow', description: 'Leave no tracks in snow' }
                        ],
                        duration: 0,
                        durationUnit: 'instant',
                        power: 'major'
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'frozen_heart_hrym',
                    name: 'Frozen Heart',
                    description: 'Your heart beats once every ten seconds. The cold has taken too much — you cannot feel what others feel, and their warmth cannot reach the place inside you where the cold lives. You are not broken. You are insulated.',
                    level: 1,
                    icon: 'spell_frost_chainsofice',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff', 'buff'],
                    typeConfig: {
                        school: 'frost',
                        secondaryElement: 'spirit',
                        icon: 'spell_frost_chainsofice',
                        tags: ['morale', 'immunity', 'passive']
                    },
                    debuffConfig: {
                        debuffType: 'moraleBlock',
                        effects: [
                            {
                                id: 'morale_immunity',
                                name: 'Emotional Void',
                                description: 'Cannot benefit from morale effects: Bardic Inspiration, Paladin auras, Guidance, Bless, and any emotional or spiritual buff. The cold does not amplify. It only takes.'
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    buffConfig: {
                        buffType: 'statusEffectBuff',
                        effects: [
                            {
                                id: 'fear_immunity',
                                name: 'Fearless',
                                description: 'Immune to fear effects. You have already lost everything you were afraid to lose.',
                                statusEffect: { level: 'extreme', description: 'Immune to fear' }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'heat_frailty_hrym',
                    name: 'Heat Frailty',
                    description: 'Your bloodline, forged in the deepest cold, cannot endure unnatural warmth. Your flesh cracks in temperatures others find comfortable. The sun is an enemy your ancestors never learned to fight.',
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
                                id: 'damage_vulnerability_fire',
                                name: 'Fire Vulnerability',
                                description: 'Your frost-bound blood boils and ruptures when exposed to flames. 100% vulnerability to fire damage.',
                                statusEffect: { vulnerabilityType: 'fire', vulnerabilityPercent: 100 }
                            },
                            {
                                id: 'heat_damage',
                                name: 'Heat Sickness',
                                description: '1d4 fire damage per hour in warm or hot climates. Your body was never meant to hold heat.'
                            },
                            {
                                id: 'climate_disorientation',
                                name: 'Climate Weakness',
                                description: 'Disadvantage on all checks and saves in warm or hot climates. The south is not your home. It never will be.'
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                }
            ],
            languages: ['Common', 'Old Nord', 'Runic'],
            speed: 30,
            baseStats: {
                armor: 0,
                hp: 28,
                mana: 20,
                ap: 4,
                passivePerception: 14,
                swimSpeed: 20,
                climbSpeed: 20,
                visionRange: 60,
                darkvision: 30,
                initiative: 1
            },
            savingThrowModifiers: {
                advantage: ['exhaustion'],
                disadvantage: ['charm']
            }
        }
    }
};
