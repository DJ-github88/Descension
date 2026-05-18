export const morthel = {
        id: 'morthel',
        name: 'Morthel',
        essence: 'Shadow-bound revenants',
        description: 'Our voices are the rustle of dead leaves in an empty hallway, thin and carrying the chill of the grave. We are the people of the long twilight, those whose shadows have grown longer than their bodies, reaching for the voids between the stars. Our skin is the color of bone beneath a clouded moon, and our touch is a promise of the stillness that awaits all things. We do not walk through the world so much as we haunt it, moving through the periphery of your vision like a half-remembered dream. The grief of a thousand years is etched into our features, a sorrow so deep it has become a kind of strength. We are the keepers of the forgotten names, the silent observers of the passing of ages. To look into our eyes is to see the end of the road, the final sunset that never quite fades into total night. We are not dead, but we have forgotten how to be truly alive.',
        icon: 'fas fa-skull',
        overview: 'The Neth are people whose ancestors swore impossible oaths. To guard treasures until mountains crumble. To protect secrets until stars fall. Through generations of these death-bound promises, their bloodlines have been marked by undeath. Bodies that refuse to decay. Minds that outlast centuries. Souls bound by vows that transcend death. They are organized into tomb-communities built around the graves they guard. Settlements clustered in mausoleums and necropolises. The Neth do not choose to be undead. It is their heritage, passed down through bloodlines that carry the weight of ancient oaths.',
        culturalBackground: `Neth society is built on tomb-communities organized around the graves and treasures they guard. Settlements clustered in mausoleums and necropolises. Each community traces its founding to ancestors who swore impossible vows. To guard treasures until the mountains crumble. To protect secrets until the stars fall from the sky. Their tombs are silent libraries of the dead. Walls inscribed with oaths that bind souls long after bodies have failed. Community elders pass down the old ways. How to maintain undead bodies. How to fulfill oaths that span centuries. How to guard what was sworn to protect. Death was supposed to release them. But their promises held tighter than any grave. Now they shuffle through eternal night. Flesh rotting but never failing. Minds sharp as the day they died. Community disputes settle through oath-readings and the testimony of those who have guarded longest. They speak of the living with distant pity. Remembering warmth and emotion like half-forgotten dreams. Some Neth embrace their immortality. Becoming patient strategists who outlast any enemy. Others claw at their own tombs. Desperate to complete their duties and finally rest. They are a people bound by oath and undeath. Their guardianship unmatched but their souls forever trapped by promises that cannot be broken.`,
        variantDiversity: 'The Neth are divided into three cursed bloodlines, each paying for their ancestors\' oaths in different coin: the Vault Keepers, whose gold has replaced their blood; the Lore Keepers, whose minds have become overcrowded mausoleums of memory; and the Wraiths, whose oaths were so absolute they dissolved their own flesh into shadow.',
        integrationNotes: {
            actionPointSystem: 'Morthel abilities are fueled by undeath itself — each power extracts a physical, mental, or existential toll. Their traits are designed around the principle that immortality is not a gift but a sentence.',
            backgroundSynergy: 'Morthel excel in backgrounds tied to guardianship, scholarship, or servitude. Their curses create deep roleplay hooks: compulsions, forbidden knowledge, and the slow dissolution of self.',
            classCompatibility: 'Vault Keepers suit tank and martial classes. Lore Keepers suit caster and support classes. Wraiths suit scout, assassin, and mobile classes. All suffer from radiant vulnerability that punishes positioning.'
        },
        meaningfulTradeoffs: 'Every Morthel power is paid for in flesh, memory, or existence. Vault Keepers are poisoned by the gold that empowers them. Lore Keepers cannot stop remembering — trauma accumulates into permanent Spirit loss. Wraiths dissolve further with each power used, losing the ability to interact with the physical world.',
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
                description: 'Their blood runs thick and golden in the veins — not metaphorically. Centuries of handling treasure, of sleeping on hoards, of pressing gold against preserved skin, and the metal found a way in. Dark veins of gilt thread beneath parchment-dry flesh, visible when the light catches them wrong. Eyes like polished coins that reflect lamplight in colors no living pupil produces. Hands stiff from centuries of counting — the knuckles swollen, the tendons calcified into shapes that favor gripping but resist releasing. They do not blink when they stare at something valuable. They cannot. The compulsive tally runs behind their eyes at all times: how much, where, who touched it last. Their breath carries the faint metallic taste of old copper. When they speak of treasure, their voices drop to a reverent whisper that is somehow more alive than anything else they say.',
                culturalBackground: 'The Vault-Keepers trace their lineage to Morthel who swore oaths to guard treasures until the mountains crumble. The gold seeped in through the skin over generations — first as a sheen, then as a stain, then as something that ran in the blood like a second pulse. Bloodline marked by eternal guardianship of hoards and vaults. Their tradition requires that every member learn to appraise and protect treasures. Apprenticeships spent mastering the art of guarding what was sworn to protect — and learning the terrible cost of the gold that now lives in their veins. Vault-Keeper tombs are built around the treasures they guard, members serving as eternal sentinels in forgotten vaults. They practice ancient guardianship techniques passed down through generations. How to ward against thieves. How to sense the worth of treasures. How to maintain vigilance for centuries without rest. But the gold is not passive. It demands to be near them. Vault-Keepers separated from treasure for too long begin to sicken, the gilt in their blood turning rancid. Many become paranoid, seeing thieves in the faces of their own children. The oldest Vault-Keepers are more metal than flesh — their joints lock into place like rusted mechanisms, their skin flakes in metallic scales, and they cannot stop counting. The gold counts them back.',
                statModifiers: { constitution: 2, strength: 1 },
                baseStats: { health: 14, mana: 2, actionPoints: 3, initiative: -1 },
                savingThrowModifiers: { advantage: ['fear', 'poison'], disadvantage: ['radiant_effects'] },
                traits: [
                    {
                        id: 'blood_gilt',
                        name: 'Blood-Gilt',
                        description: 'Bite down on a coin or gemstone from your inventory and swallow it — the metal dissolves into your blood in seconds, gilded plates pushing through your flesh like armor growing from the inside out. Your skin takes on a hammered-bronze sheen as calcified gold reinforces the bone beneath. The transformation is agonizing. Joints crack and lock as the gilt spreads through tendons, turning you into something between a soldier and a strongbox.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial', school: 'necrotic' },
                        buffConfig: {
                            buffType: 'damageMitigation',
                            effects: [
                                {
                                    id: 'gilt_armor',
                                    name: 'Gilt Plate',
                                    description: '+3 Armor for 3 rounds as gold calcifies beneath your skin',
                                    mechanicsText: '',
                                    statModifier: { stat: 'armor', magnitude: 3, magnitudeType: 'flat' }
                                }
                            ],
                            durationType: 'rounds',
                            durationValue: 3,
                            durationUnit: 'rounds'
                        },
                        debuffConfig: {
                            debuffType: 'movementImpairment',
                            effects: [
                                {
                                    id: 'calcified_joints',
                                    name: 'Calcified Joints',
                                    description: 'Movement speed halved — your joints have become lock mechanisms',
                                    mechanicsText: ''
                                }
                            ],
                            statPenalties: [
                                { stat: 'movement_speed', magnitude: -50, magnitudeType: 'percentage' }
                            ],
                            durationType: 'rounds',
                            durationValue: 3,
                            durationUnit: 'rounds'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['somatic'] },
                        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                        specialMechanics: {
                            escalationCost: 'Each use after the first per long rest also deals 1d6 necrotic damage to self. This damage cannot be healed until your next long rest — the gold is poisoning you from within, and your body cannot purge what has become part of you.',
                            resourceConsumed: '1 gold piece or gemstone from inventory'
                        }
                    },
                    {
                        id: 'grave_lock',
                        name: 'Grave-Lock',
                        description: 'Press your palm flat against any container, door, or barrier and whisper the old words. The oath pours out of you like blood from a wound, infusing the object with a seal that predates locksmithing. The lock that forms is not mechanical — it is a promise made manifest, and promises do not break. But you feel the lock as an extension of your own body. Every strike against it registers in your marrow like a hammer on your own bones.',
                        level: 1,
                        icon: 'inv_misc_key_06',
                        spellType: 'ACTION',
                        effectTypes: ['utility', 'debuff'],
                        typeConfig: { category: 'racial', school: 'arcane' },
                        utilityConfig: {
                            utilityType: 'security',
                            selectedEffects: [
                                { id: 'oath_lock', name: 'Oath-Lock', description: 'Seal any container, door, or barrier by touch. Cannot be picked or broken by mundane means. Only radiant damage or your own touch opens it.' },
                                { id: 'tamper_sense', name: 'Tamper Sense', description: 'You sense any attempt to open or damage a locked object, regardless of distance, as physical sensation in your hands.' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'sympathetic_pain',
                                    name: 'Sympathetic Pain',
                                    description: 'You take 1d4 psychic damage each time someone strikes a Grave-Locked object — the oath binds your pain to its integrity'
                                },
                                {
                                    id: 'vigilant_compulsion',
                                    name: 'Vigilant Compulsion',
                                    description: 'You cannot voluntarily rest within 100ft of an unlocked container holding valuables. Spirit checks at disadvantage near unguarded treasure until you lock it or leave range.'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'touch', targetRestrictions: ['object'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal', 'somatic'] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'deathless_vigil',
                        name: 'Deathless Vigil',
                        description: 'Your body does not sleep. It does not hunger. It does not breathe. Poison slides off preserved tissue like water off grave-stone, and disease finds nothing alive enough to infect. But the oath that sustains you is a hungry thing. It demands vigilance. It demands purpose. When you neglect your charge — when no hoard bears your name as its guardian — the oath turns inward and begins to gnaw.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'immunity',
                            effects: [
                                { id: 'poison_immune', name: 'Poison Immunity', description: 'Immune to poison damage and the poisoned condition', mechanicsText: '' },
                                { id: 'disease_immune', name: 'Disease Immunity', description: 'Immune to all diseases', mechanicsText: '' },
                                { id: 'exhaustion_immune', name: 'Exhaustion Immunity', description: 'Immune to exhaustion', mechanicsText: '' },
                                { id: 'no_biological_needs', name: 'Deathless Biology', description: 'No need to sleep, eat, or breathe', mechanicsText: '' }
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
                                    id: 'oath_hunger',
                                    name: 'Oath-Hunger',
                                    description: 'Lose 1 max HP permanently for every 24 hours spent without actively guarding a designated hoard. Designate one hoard per long rest. Lost HP returns only after 8 consecutive hours of resumed vigil — the oath literally digests your marrow when neglected.'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'hoarders_eye',
                        name: "Hoarder's Eye",
                        description: "Close your eyes and the gold in your blood sings. You sense every coin, every gemstone, every enchanted blade within sixty feet — their worth, their enchantment, whether they have been moved. Creatures carrying valuables glow like candle-flame behind your eyelids; they cannot surprise you. But the gold's song is jealous. It whispers that everyone is a thief. Everyone wants what is yours. For the next hour, every face you see is the face of someone reaching for your hoard.",
                        level: 1,
                        icon: 'inv_misc_coin_01',
                        spellType: 'ACTION',
                        effectTypes: ['utility', 'debuff'],
                        typeConfig: { category: 'racial', school: 'divination' },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [
                                { id: 'treasure_sense', name: 'Treasure Sense', description: 'Detect all valuable objects within 60ft. Know approximate worth, enchantment status, and recent disturbance.' },
                                { id: 'carrier_detection', name: 'Carrier Detection', description: 'Cannot be surprised by creatures carrying valuable items — they glow in your perception.' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        debuffConfig: {
                            debuffType: 'mentalEffect',
                            effects: [
                                {
                                    id: 'paranoid_gaze',
                                    name: 'Paranoid Gaze',
                                    description: 'For 1 hour, perceive all creatures as potential thieves. Spirit checks at disadvantage during any social interaction with creatures you have not known personally for at least one week. You count coins under your breath and cannot stop.'
                                }
                            ],
                            durationValue: 1,
                            durationType: 'hours',
                            durationUnit: 'hours',
                            canBeDispelled: true
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                    },
                    {
                        id: 'giltblood_bleed',
                        name: 'Gilt-Blood Bleed',
                        description: 'The gold in your veins is not inert — it is part of what holds you together, a metallic scaffolding that replaced rotted tissue centuries ago. Holy radiance does not merely burn you; it illuminates the treasure that has become your circulatory system. The light finds every coin you ever swallowed, every gemstone that fused with your bone, and makes them glow through your skin like a lantern made of flesh.',
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
                                    description: 'Holy radiance unravels the gilded bonds holding your preserved form together — sunlight burns the treasure in your blood',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'gilt_revelation',
                                    name: 'Gilt Revelation',
                                    description: 'When you take radiant damage, gold and gems in your inventory glow visibly through your skin for 1 round, illuminating a 10ft radius and revealing your position through total concealment — the light finds the treasure that lives in your veins'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    }
                ]
            },
            scholar: {
                id: 'scholar_neth',
                name: 'Lore Keeper',
                description: 'Their fingers are permanently stained — ink that shifts between black, silver, and deep violet, soaked so deep into the flesh over centuries that it has become part of the dermis. They write by reflex, filling any blank surface with text in languages that no living scholar can read. Eyes glow faintly with accumulated knowledge, irises like pages of dense script that rearrange when they focus on a new thought. They move through the world as if it were a library — carefully, reverently, terrified of damaging something fragile. When they speak, the voices of dead authors layer beneath their words like harmonic undertones, and sometimes they quote texts they have never physically encountered, drawing from the accumulated memory of their entire bloodline.',
                culturalBackground: 'The Lore Keepers trace their lineage to Morthel who swore oaths to protect scrolls and secrets until the end of time. The ink was the first thing to change — it stopped washing off, then it started spreading, then it began to write itself on their skin during sleep. Bloodline marked by eternal preservation of knowledge. Their tradition requires that every member learn to preserve and archive knowledge, and the cost of this duty is the gradual loss of the self beneath the accumulated weight of memory. Apprenticeships spent mastering the art of maintaining perfect memory across centuries, though "mastering" is a generous term — no Lore Keeper has ever learned to stop remembering. Lore Keeper tombs are built around libraries and archives, members serving as eternal scholars in forgotten repositories. They practice ancient preservation techniques passed down through generations. How to maintain perfect memory. How to preserve texts through undeath. How to guard secrets that must never be lost. Their minds are vast repositories of forgotten lore, capable of recalling any text they have ever read. They are patient researchers, capable of spending centuries deciphering ancient mysteries. But the texts do not remain silent. The dead authors whose works they carry speak through them, demand attention, refuse to be ignored. Every piece of knowledge they absorb adds another voice to the chorus, and the chorus never stops singing. The oldest Lore Keepers no longer know which thoughts are their own.',
                statModifiers: { intelligence: 2, wisdom: 1 },
                baseStats: { health: 10, mana: 5, actionPoints: 3, initiative: -1 },
                savingThrowModifiers: { advantage: ['charmed', 'stun'], disadvantage: ['radiant_effects'] },
                traits: [
                    {
                        id: 'whispered_index',
                        name: 'Whispered Index',
                        description: "Close your eyes and consult the screaming archive between your ears. Thousands of dead scholars claw for attention, but you seize one thread and pull — a creature's weakness, a secret they carry, a fear they have never spoken aloud. The knowledge comes with the taste of old parchment and the sensation of someone else's memories flooding your sinuses. But the archive is not a one-way river. What you draw from it, it draws from you in return — and the dead authors are always hungry for new material.",
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'ACTION',
                        effectTypes: ['detection', 'damage', 'buff'],
                        typeConfig: { category: 'racial', school: 'psychic' },
                        damageConfig: {
                            formula: '1d8',
                            damageTypes: ['psychic'],
                            resolution: 'DICE'
                        },
                        buffConfig: {
                            buffType: 'combatAdvantage',
                            effects: [
                                {
                                    id: 'exploit_knowledge',
                                    name: 'Exploit Knowledge',
                                    description: 'Next attack against the target this turn gains combat advantage — you know exactly where to strike'
                                }
                            ],
                            durationType: 'turns',
                            durationValue: 1,
                            durationUnit: 'turns'
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [
                                { id: 'weakness_revelation', name: 'Weakness Revelation', description: 'Learn one vulnerability, resistance, or immunity of target creature' },
                                { id: 'secret_revelation', name: 'Secret Revelation', description: 'Learn one secret, weakness, or fear of target creature' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60, targetRestrictions: ['enemy'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        specialMechanics: {
                            archiveCost: 'The dead authors in your skull extract a secret from YOUR past and speak it through your mouth. The GM reveals one piece of your backstory (or invents one) to all players. You cannot control what is spoken — the archive takes what it wants.'
                        }
                    },
                    {
                        id: 'tomerot_word',
                        name: 'Tome-Rot Word',
                        description: 'Shape a syllable that should never have been written — a sound harvested from forbidden texts, older than language, that was meant to remain ink on crumbling pages. When you speak it, the word tears through the air like a page being ripped from reality. The voices of dead scholars pour through the wound, filling the minds of all who hear with a thousand years of whispered commentary. The word is not selective. It tears at your own throat on the way out, and the ink bleeds from your tear ducts in thin black rivulets.',
                        level: 1,
                        icon: 'spell_shadow_curse',
                        spellType: 'ACTION',
                        effectTypes: ['control', 'damage'],
                        typeConfig: { category: 'racial', school: 'psychic' },
                        damageConfig: {
                            formula: '2d6',
                            damageTypes: ['psychic'],
                            resolution: 'DICE',
                            savingThrow: {
                                ability: 'spirit',
                                difficultyClass: 14,
                                saveOutcome: 'negates'
                            }
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'scholars_silence',
                                    name: "Scholar's Silence",
                                    description: 'Target cannot speak or cast verbal spells for 1 minute — the dead fill their mouth with whispers',
                                    mechanicsText: ''
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            savingThrow: {
                                ability: 'spirit',
                                difficultyClass: 14,
                                saveOutcome: 'negates'
                            }
                        },
                        targetingConfig: { targetingType: 'area', rangeType: 'self_centered', aoeShape: 'sphere', aoeParameters: { radius: 20 }, targetRestrictions: ['enemies'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 2, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        specialMechanics: {
                            selfDamage: 'You take 1d4 psychic damage as the forbidden word tears at your own throat. Ink visibly bleeds from your tear ducts for 1 round — no mechanical effect, but the horror is real.',
                            failBy5: 'Targets that fail the Spirit save by 5 or more take 2d6 psychic damage in addition to being silenced.'
                        }
                    },
                    {
                        id: 'palimpsest_mind',
                        name: 'Palimpsest Mind',
                        description: 'Your skull is a library that never closes and never discards a single volume. Every text you have ever read, every face you have ever seen, every scream you have ever heard — it is all still there, perfectly preserved beneath the ink-stained surface of your consciousness. You can learn any language by absorbing a text for an hour. You can recall the exact pattern of cracks in a ceiling you stared at three centuries ago. This is not a gift. This is a prison. The memories do not ask permission before moving in. When something traumatic crosses your senses, it etches itself into permanent residence, and every recollection adds another voice to the chorus that never, ever stops.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [
                                { id: 'perfect_recall', name: 'Perfect Recall', description: 'Perfect recall of everything ever read, seen, or heard — no detail fades, no page yellows', mechanicsText: '' },
                                { id: 'rapid_language', name: 'Osmotic Linguistics', description: 'Learn any language by studying a text for 1 hour — the grammar rearranges behind your eyes', mechanicsText: '' },
                                { id: 'knowledge_advantage', name: 'Scholarly Insight', description: 'Advantage on Intelligence checks (History, Arcana, Religion) — the dead authors whisper the answers', mechanicsText: '' }
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
                                    id: 'trauma_etching',
                                    name: 'Trauma Etching',
                                    description: 'You CANNOT forget. When you witness something traumatic (GM discretion), make a Spirit save DC 14 or be Stunned for 1 round as the memory sears itself permanently. Each failed save adds 1 to your Echo Count. At Echo Count 3: permanent -1 Spirit. At 6: -2 Spirit. At 9: -3 Spirit (minimum Spirit 1). Lost Spirit points can never be recovered — the memories have carved too deep.'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'deathless_sedentary',
                        name: 'Deathless Sedentary',
                        description: "Your body does not sleep. It sits. For hours, for days, for centuries — the posture of the eternal reader, spine curved over texts that crumble if you breathe too hard. This stillness is not rest. It is a discipline hammered into your bloodline over generations: the text demands absolute attention, and the text always gets what it demands. When you are still long enough, your body forgets it is alive. Attacks slide off you the way dust slides off a book that no one has opened in a hundred years. But if you move too much, if you break the communion with silence, the withdrawal begins.",
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'damageMitigation',
                            effects: [
                                { id: 'no_sleep', name: 'Deathless Wake', description: 'No need for sleep. Remain fully conscious during long rests.', mechanicsText: '' },
                                {
                                    id: 'stillness_armor',
                                    name: 'Stillness Armor',
                                    description: '+2 Armor while you have remained stationary (no movement, no actions) for 1+ consecutive hours — your body mimics death so perfectly that strikes lose their killing intent',
                                    mechanicsText: '',
                                    statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' }
                                },
                                { id: 'vigilant_rest', name: 'Vigilant Rest', description: 'Cannot be surprised while other party members sleep.', mechanicsText: '' }
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
                                    id: 'communion_demand',
                                    name: 'Communion Demand',
                                    description: "You MUST spend at least 1 hour per day in complete physical stillness — no movement, no speech, no actions. Missing this communion grants 1 level of exhaustion that can only be removed by completing the stillness, not by resting. The texts demand their reader's absolute attention."
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'radiant_erasure',
                        name: 'Radiant Erasure',
                        description: "Your mind is an archive, and holy light is a fire. Radiance does not merely burn your preserved flesh — it burns the texts stored within it. You can feel the pages curling and blackening behind your eyes as the light touches you, smell the acrid smoke of knowledge combusting inside your skull. Every blast of radiant energy is a library fire, and you are the building that burns.",
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
                                    description: 'Holy light burns the accumulated knowledge preserved in your undeath — radiance devours centuries of stored intellect like a library fire',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'knowledge_erasure',
                                    name: 'Knowledge Erasure',
                                    description: 'When you take radiant damage, the light burns away a piece of stored knowledge. Roll 1d4: (1) Lose proficiency in one random skill for 24 hours. (2) Forget one language for 24 hours. (3) Lose the advantage from Palimpsest Mind for 24 hours. (4) The GM reveals one secret you knew about an NPC/creature to that creature — they now know you knew. The radiance literally deletes pages from the archive of your mind.'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    }
                ]
            },
            wraith: {
                id: 'wraith_morthel',
                name: 'Wraith',
                description: 'The boundary between flesh and shadow blurred past recognition three generations ago. Their forms flicker at the edges like candle flames in a draft — sometimes translucent enough to see the wall through their ribs, sometimes solid enough to cast a shadow that is somehow darker than the absence of light should allow. Eyes burn with cold pale fire in a face that might have been handsome centuries ago, before the cheekbones cut through the skin like blade edges and the lips receded to colorless lines. Dark veins trace fractal patterns beneath translucent skin, pulsing with something blacker than blood — the visual residue of oaths so heavy they crushed bone into vapor. Ravens gather. They always gather. Three to twelve at any given moment, perched on shoulders, circling overhead, watching from fence-posts with eyes that reflect something other than the sky. The oldest Wraiths are barely visible in daylight — more memory than person, more promise than flesh.',
                culturalBackground: 'The Wraiths are the most cursed of all Morthel bloodlines, and they know it. Their ancestors swore oaths so binding, so absolute, so fundamentally incompatible with physical existence, that the weight of those promises began to literally unmake their bodies. Generation by generation, flesh gave way to shadow. Bone dissolved into something that was neither material nor immaterial — a substance that existed only because the oath demanded that someone exist to fulfill it. They are the inheritors of the Corvani tradition — the raven-speakers who once served as psychopomps, guiding souls between life and death. When the Corvani were folded into the Morthel, the raven-spirits followed, and now every Wraith carries a murder of phantom ravens in their shadow. The ravens are not pets. They are creditors. Each raven holds a fragment of the Wraith\'s soul as collateral against the ancestral oath, and the oldest Wraiths — those who have lost too many ravens, used too much of their fading substance — are barely more than the promise itself, a shape held together by nothing but obligation and a few remaining feathers. They practice the ancient arts of the between-places. How to fade through walls. How to speak with the recently dead. How to ride the shadows like roads. But the between-places take their toll. Each crossing leaves something behind — a fingernail that never grows back, the memory of a taste, the ability to feel warmth. The bloodline values restraint above all else, because the alternative is dissolution into something that was never meant to exist in the first place.',
                statModifiers: { agility: 2, charisma: 1 },
                baseStats: { health: 9, mana: 4, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['grappled', 'restrained'], disadvantage: ['radiant_effects'] },
                traits: [
                    {
                        id: 'between_the_places',
                        name: 'Between-the-Places',
                        description: "Reach into the space between heartbeats and pull yourself through it. Your form loses cohesion — flesh becomes suggestion, bone becomes memory, and you slide through solid matter like smoke through a keyhole. The world becomes translucent, its rules becoming suggestions you can choose to ignore. But the between-places are hungry. Each time you pass through, a little more of you stays behind. Your hands become lighter. Your footprints fade faster. Eventually, you will not be heavy enough to hold a sword, to lift a coin, to feel the weight of another person's hand.",
                        level: 1,
                        icon: 'spell_shadow_invisibility',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial', school: 'shadow' },
                        buffConfig: {
                            buffType: 'incorporeal',
                            effects: [
                                {
                                    id: 'pass_through',
                                    name: 'Phase Through Matter',
                                    description: 'Move through solid objects (not creatures) at half speed for 1 minute',
                                    mechanicsText: ''
                                },
                                {
                                    id: 'partial_resistance',
                                    name: 'Shadow Diffusion',
                                    description: 'Half damage from all non-magical, non-radiant sources — attacks pass through where flesh used to be',
                                    mechanicsText: ''
                                }
                            ],
                            durationType: 'rounds',
                            durationValue: 10,
                            durationUnit: 'rounds',
                            canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'no_physical_interaction',
                                    name: 'Displaced from Matter',
                                    description: 'Cannot interact with physical objects or make physical attacks while faded — your hands pass through what you try to hold'
                                },
                                {
                                    id: 'ejection_damage',
                                    name: 'Oath Ejection',
                                    description: 'If inside a solid object when the effect ends, you are violently ejected to the nearest open space and take 3d6 force damage as reality rejects you'
                                }
                            ],
                            durationType: 'rounds',
                            durationValue: 10,
                            durationUnit: 'rounds'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 2, components: ['verbal', 'somatic'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        specialMechanics: {
                            dissolutionCost: 'Each use permanently reduces carrying capacity by 5 lbs. Your form holds less of the world each time you pass through the between-places. This is cumulative and irreversible — you are literally becoming less real.'
                        }
                    },
                    {
                        id: 'corvani_ear',
                        name: 'Corvani Ear',
                        description: "Reach into your own shadow and pull forth a raven — not a living bird, but a fragment of your soul shaped into feathers and malice. The raven carries your eyes and ears to places your dissolving body cannot safely go. It sees what you cannot. It hears what you would rather not. And when it dies — when something destroys the soul-shard you sent into the world — you feel every feather separate from every bone, and the voice of whatever killed it whispers in your ear for hours afterward. The ravens remember. They always remember. And losing one costs more than pain.",
                        level: 1,
                        icon: 'inv_raven_hold',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: { category: 'racial', school: 'shadow' },
                        utilityConfig: {
                            utilityType: 'scouting',
                            selectedEffects: [
                                { id: 'remote_sight', name: 'Raven Eyes', description: 'See and hear through a phantom raven at any point within 1 mile that you have previously seen, for 10 minutes' },
                                { id: 'shadow_invisibility', name: "Shadow's Veil", description: 'Raven is invisible to all but you and other Morthel — it is made of your shadow, and shadows do not catch the eye of the living' }
                            ],
                            duration: 10,
                            durationUnit: 'minutes'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        specialMechanics: {
                            ravenDeath: "If the raven takes any damage, it dissolves instantly. You take 1d4 psychic damage and the raven's dying sensation imprints on you: you hear the voice of whatever destroyed it whispering in your ear for 1 hour, imposing disadvantage on Spirit checks. The ravens carry pieces of your soul — each one that dies takes a fragment you cannot recover."
                        }
                    },
                    {
                        id: 'shadow_road',
                        name: 'Shadow-Road',
                        description: "Where there is darkness, there is a road. You have known this since before you could walk — the shadows connect like veins beneath the skin of the world, and you can step from one to another without crossing the space between. You leave something behind each time: a dark stain on the ground where your shadow refuses to leave, lingering like a bruise on reality. Sometimes the stain is thick enough that others can feel it underfoot, the darkness clinging to their heels like grief.",
                        level: 1,
                        icon: 'ability_rogue_shadowstep',
                        spellType: 'PASSIVE',
                        effectTypes: ['movement'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [
                                { id: 'shadow_teleport', name: 'Shadow-Road Step', description: 'While in dim light or darkness, teleport up to 30ft to an unoccupied space also in dim light or darkness as a bonus action' },
                                { id: 'afterimage', name: 'Afterimage', description: 'Leave a shadowy afterimage at your origin point that lingers for 1 round — a dark smudge that stares in the direction you went' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        specialMechanics: {
                            shadowStain: "Each time you use Shadow-Road, roll 1d6. On a 1, the afterimage becomes semi-permanent difficult terrain lasting 1 minute — your own dissolving form staining the ground, making it harder for others to follow. These shadow-stains count as \"shadow\" for other Wraiths' Shadow-Road."
                        }
                    },
                    {
                        id: 'dissolution',
                        name: 'Dissolution',
                        description: "You are less than you were. Less than your parent was. Less than your grandparent was. Each generation, the oath eats another layer of substance from the bloodline — bone becoming vapor, blood becoming shadow, flesh becoming memory. What remains is resistant to the energies of death (you are too close to death already for it to harm you further) but vulnerable to everything that reminds reality you exist. Running water is the worst. The current catches at your dissolving edges and pulls, and you can feel pieces of yourself sloughing away downstream like ink bleeding off a page held under a waterfall. The ravens circle overhead, counting what remains.",
                        level: 1,
                        icon: 'spell_shadow_twilight',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'resistance',
                            effects: [
                                { id: 'necrotic_resistance', name: 'Death Resistance', description: 'Resistance to necrotic damage — you are too close to death already for it to harm you further', mechanicsText: '' }
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
                                    id: 'fading_form',
                                    name: 'Fading Form',
                                    description: '-1 maximum HP per character level (minimum 1 HP). Your body holds less life with each passing year — the oath digests what remains.'
                                },
                                {
                                    id: 'water_aversion',
                                    name: 'Water Aversion',
                                    description: 'FOLKLORE: You cannot cross running water without spending 2 AP (double movement cost). If forcibly submerged in running water, take 1d8 radiant damage per round as the current tears at your dissolving form. Still water (lakes, ponds) does not trigger this — only moving water. The old stories say running water carries spirits away to places they cannot return from.'
                                },
                                {
                                    id: 'raven_gathering',
                                    name: 'Raven Gathering',
                                    description: '3-12 ravens follow you at all times. They are not pets. They are creditors, holding fragments of your soul against the ancestral oath. Their presence is visible and unsettling.'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'luminescence_bleed',
                        name: 'Luminescence Bleed',
                        description: "You are made of shadow-stuff and unbreakable promises. Pure light does not merely burn you — it catalyzes the substance of your form, converting the darkness that constitutes you into a violent, involuntary radiance. When holy light touches you, your own shadow-stuff betrays you, bleeding luminescence in all directions and turning every hiding place within thirty feet into a beacon. There is nowhere to hide from a light that comes from inside you.",
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
                                    description: 'Pure radiant light catalyzes the shadow-stuff of your form — holy radiance converts what holds you together into burning luminescence',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'force_vulnerability',
                                    name: 'Force Vulnerability',
                                    description: 'Raw magical force tears at incorporeal forms — you are vulnerable to the fundamental energy that shapes reality itself',
                                    statusEffect: {
                                        vulnerabilityType: 'force',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    id: 'luminescence_bleed_effect',
                                    name: 'Luminescence Bleed',
                                    description: 'When you take radiant damage while in dim light or darkness, all dim light within 30ft becomes bright light for 1 round. Your form bleeds luminescence as shadow-stuff reacts to pure light — revealing your position and all creatures within range, breaking shadow/darkness-dependent abilities for 1 round.'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    }
                ]
            }
        }
};
