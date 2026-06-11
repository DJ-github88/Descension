export const emberth = {
    id: 'emberth',
    name: 'Emberth',
    essence: 'The cold-ash remnants of a dead cosmic fire',
    illustration: '/assets/images/races/emberth_illustration.png',
    illustrationCaption: 'An Emberth cinder-walker with basalt-dark, cooled charcoal skin and dreadlocks, holding a tiny, fading ember near their chest to absorb its precious heat.',
    cardFlavor: 'Cold-bodied remnants of a dead sun, they harvest external fire to keep their hearts from calcifying to stone.',
    description: `**[The Cinder-Born Clans]** — *Deep in the dark vaults of Sundale, a being of cold, soot-grey ash and cooled charcoal sits in absolute stillness, holding a fading geothermal shard to his chest to keep his heart-blood from seizing and turning into solid stone.*

Broad-shouldered and heavy, the Emberth do not possess internal body heat. Their bodies are made of dense, cold soot, ash, and basalt-dark charcoal, a legacy of being the cold residue of a dead cosmic sun. They do not sweat; their skin sheds a fine, dry powder of grey ash when they move or suffer stress. To survive, the Emberth must metabolic-harvest and hoard external thermal energy. Without regular exposure to volcanic calderas, geothermal vents, or forge-fires, their joints slowly seize, and their skin calcifies back into inert stone. 

They are forge-keepers not out of ritual devotion, but out of absolute metabolic necessity—an hour at the anvil is equivalent to a warm-blooded creature breathing or eating. Their eyes are enormous and sensitive, adapted to perceive heat gradients in the absolute darkness of the subterranean thermal vaults where they sheltered after Sol went dark. On the surface, they must wear thick, ash-tinted eye-cloths to prevent permanent blindness. They carry their history in the deep, deliberate burn-scars branded into their forearms at birth—not as decoration, but as thermal-conductive channels designed to distribute heat efficiently across their limbs.`,

    icon: 'fas fa-fire',
    overview: `When Sol spoke to the Emberth, it was never in words. The Sun-Speakers — the eldest cinder-keepers — crouched in the geothermal vents at dawn and received pulses of thermal radiation and fading heat-signatures that guided their great descent. They dug not to hide, but to survive, excavating the thermal deep beneath Sundale because they knew their bodies would freeze to lifeless soot under open winter skies.

The Emberth were already deep underground when the surface world froze. On the day Sol was bound beneath the earth's crust, every Sun-Speaker in every clan felt the cosmic fire die, receiving one final image: an ember held in cupped hands. Then cold. They call that ember the Solbrand — a small, eternal flame tended through centuries of darkness. It is not a holy relic; it is the primary thermal radiator of their entire vault capital, a fading piece of the primordial fire that keeps the entire population from calcifying into lifeless stone.

They emerged when Emberspire erupted, reclaiming the volcanic ashlands because the surface had warmed enough for them to range. They rebuilt their forge-clans around active calderas, resumed the old ways — sun-prayers at dawn to catch the faint heat, forge-work as metabolic survival, the Solbrand tended by an order of Sun-Speakers who listen every morning to a silence that grows colder every year. The Emberth are not forge-people because fire is in their blood; they are forge-people because they are cold, and without the forge, they die.`,

    culturalBackground: `Emberth society is organized into forge-clans bound to volcanic calderas — each clan tracing its lineage to one of the original Sun-Speakers who received the prophecy of descent. These clans are not factions or competing nations. They are bloodlines, each with its own ancestral forge, its own variant of the sun-prayers, and its own methods of heat conservation. Clan identity is worn visibly: every Emberth's forearms and shoulders are marked at birth with deliberate burn-scars applied by a heated obsidian stylus — a process called the Marking-Rite. The scars encode clan affiliation, trade specialization, and ancestor-lineage in a visual language that can be read by any Emberth at a glance. The marks darken with proximity to the Solbrand; Korr forge-marks are stark and crisp, while Thrask marks are fainter and blurred at the edges from generational distance from the ember. To deface a forge-mark is the severest crime.

Settlements are built around the forges — not as industry, but as altars. The forge is where the Solbrand is kept by the clan currently entrusted with its tending; where young Emberth are brought at dawn to learn stillness before they learn speech; where disputes are settled not by violence but by forge-trials — competitions of craft, endurance, or hours of uninterrupted silence before the flame. The skills vary by clan. The principle is the same: Sol's silence taught the Emberth patience, and patience is the highest virtue.

The surface ashlands are barely hospitable to anyone else — choking storms of volcanic particulate sweep across Sundale in seasons — but the Emberth breathe them comfortably. Their lungs adapted across generations of underground exile, developing thick mucosal membranes that filter ash from air. The cost: in clean, humid climates, their lungs grow sluggish and heavy. They breathe easiest in the smoke of their own forges. An Emberth in a forest is a soldier in enemy territory.

Their society is a meritocracy of craft and endurance, not birth. Those who work longest, forge finest, endure deepest silence rise highest. The weak are not cast out — they are pitied, supported, given simpler work, because weakness in one clan-member shames the entire bloodline. The greatest terror in Emberth culture is not death. It is the slow, permanent cooling of the Solbrand — a dimming that has been observed, denied, concealed, and whispered about across three generations. The clan that currently holds the Solbrand has been lying about its health. The other clans are beginning to splinter. What happens when the last ember of Sol goes out is a question no Emberth knows how to answer.`,

    variantDiversity: `The Emberth are divided into two bloodlines based on where their ancestors sheltered during the underground exile: the Korr of the Deep-Vault, who chose to wait near the Solbrand core and calcify their bodies to conserve thermal energy, and the Thrask of the High-Vault, who chose to venture onto the frozen surface border in heavy insulating wraps, burning their fading embers fast and intense.`,

    integrationNotes: {
        actionPointSystem: 'Emberth abilities focus on endurance, forge-craft, and patient combat. Their underground ancestry grants them stillness, ash-resistance, and dark-adapted senses — not fire magic, but the hard-earned adaptations of a people who survived the deep.',
        backgroundSynergy: 'Emberth excel in backgrounds emphasizing crafting, endurance, and spiritual devotion. Their sun-reverent culture and clan-mark identity complement paths of tradition, craft, and unyielding patience.',
        classCompatibility: 'The Korr favor Wardens (Monolith), Animists, and Augurs because their deep-vault isolation and practice of the Vault-Breath align with absolute physical stillness, the recording of fading lineages, and the quiet shamans who interpret the Solbrand\'s silent dimming. The Thrask favor Apex, Wardens, and Pyrofiends, using their cold-hardened bodies and surface mobility to range the frozen badlands, patrol volcanic border outposts, and harness raw lava-flow heat as a weapon.'
    },

    meaningfulTradeoffs: 'Emberth possess formidable physical endurance and ash-resistance but suffer fatigue in clean air and are deeply vulnerable to the cold — not because they are "fire people," but because their bodies adapted to geothermal heat and cannot shed warmth efficiently. Their dark-adapted eyes struggle in daylight. Their stillness is a cultural strength and a social liability among faster, more fidget-prone races.',

    baseTraits: {
        languages: ['Common', 'Sundari'],
        lifespan: '90-130 years',
        baseSpeed: 25,
        size: 'Medium',
        height: '5\'10" - 6\'4"',
        weight: '190-280 lbs',
        build: 'Broad-shouldered, heavy, deliberately still'
    },

    epicHistory: `
When Sol spoke, it was in heat and image — never words. The first Sun-Speakers learned to listen crouched in the volcanic vents at dawn, receiving fragments of sensation: the pressure of something descending, the cold that would follow, the great digging that must begin. These were not prophecies of doom. They were instructions. The Emberth obeyed. For centuries before the seven noble families gathered to discuss their desperate ritual, the Emberth were already excavating the thermal deep beneath Sundale — vast tunnel networks, geothermal chambers, forge-halls that could burn without sky.

When Sol was bound beneath the earth's crust, the Emberth were already underground. On the day of the binding, every Sun-Speaker in every clan received the same final image: an ember held in cupped hands. Then silence — a silence that has lasted since the age of the binding itself. The Emberth call that ember the Solbrand, and they have tended it through centuries of darkness, believing it to be Sol's last conscious fragment, the thread that connects their god's sleeping mind to the world it once nourished.

The centuries underground were not a hibernation. They were a civilization. The Emberth built forge-clans in the dark — bloodlines organized around ancestral forges, each clan tracing its origin to one of the original Sun-Speakers. They developed the forge-mark system, encoding clan identity, trade, and ancestor-lineage into deliberate burn-scar patterns on the forearms. They learned stillness — not as meditation, but as survival: in cramped tunnels where oxygen was scarce, children who could not sit motionless for hours simply did not survive to adulthood. They call this discipline the Vault-Breath, and it has become the foundation of Emberth spirituality.

When Keth-Amar breached the binding seal by devouring the six noble houses' heirs, the volcanic pressure that erupted across the world reached Sundale first. Emberspire exploded. The Wyrd bled from the cracks. And the Emberth — already beneath the eruption, already adapted to ash and heat and the long, grinding patience of the deep — emerged onto a surface they had not walked in generations. They reclaimed their ancestral ashlands. They rebuilt their forge-clans around the geothermal vents. They resumed the sun-prayers at dawn, the Vigil of the Solbrand, the old ways that had sustained them through centuries of darkness.

The Wars of Molten Earth came later — when surface kingdoms, desperate for volcanic resources, attempted to seize Emberth forge-clans by force. The Emberth fought not as a unified army but as two bloodlines with distinct ways of war. The clans held. The invaders burned. The Forge Accords were established in the aftermath: Emberth would never war against Emberth. All forges would serve all clans. The Solbrand would be held by a single tending-clan, rotated by covenant, never hoarded. The Accords have held for generations.

Now the Solbrand is dimming. The tending-clan has known for three generations and concealed it — executing shamans who spoke the truth, fabricating reports of stable brightness, maintaining their power by managing a lie that grows heavier every year. The other clans are beginning to splinter. Some demand transparency. Some accuse the tenders of causing the dimming through mismanagement. Some whisper that the dimming is Keth-Amar's slow victory — the last ember of Sol being consumed from within, like the god it came from. And some, the youngest and most reckless, whisper that the Solbrand was never Sol's gift at all — that it is Keth-Amar's tether, a feeding-line the predator left behind when it breached the seal, and that the Emberth have spent centuries tending the wrong fire.

The Emberth do not know which of these stories is true. They only know the ember is dying. And when it goes out, something will change — either Sol will finally wake, or Keth-Amar will finally finish its meal, or both. The End-Vigil is approaching, and no Sun-Speaker has received a vision to prepare them for it.
    `,

    notableFigures: [
        {
            name: 'Thaeron',
            title: 'Keeper of the Dimming Flame',
            portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
            backstory: `
The eldest living Sun-Speaker, Thaeron has tended the Solbrand for sixty years. His skin is dark as cooled basalt, cross-hatched with age-lines that trace the pattern of old lava-flows across his forearms. His eyes — enormous even for an Emberth, the pupils barely distinguishable from the near-black sclera — have stared into the Solbrand's light for so long that he claims to see colors in it that younger shamans cannot perceive. He does not speak of what those colors mean.

Thaeron belongs to the tending-clan — the bloodline currently entrusted with the Solbrand. He is the only living Emberth who has known for certain that the ember is dimming for more than fifty years. He has never told anyone. Not his apprentices. Not his clan-elders. Not the other forge-clans who demand transparency. His silence has preserved the Forge Accords through three generations of slow, incremental cooling. He believes — with the unshakeable certainty of a man who has spent six decades staring into dying fire — that revealing the truth would shatter Emberth civilization more completely than the dimming itself.

Thaeron does not believe the Solbrand is Keth-Amar's tether. But he also does not believe it is Sol's gift. He has a third theory — one he has never spoken aloud, one he barely allows himself to think — that the Solbrand is neither god nor predator but a test, and that the Emberth were never meant to tend it forever. They were meant to let it go. He cannot bring himself to test this theory, because testing it might mean watching the last ember of Sol die in his hands.
            `
        },
        {
            name: 'Vaelith',
            title: 'The Ash-Veiled',
            portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
            backstory: `
The most traveled living messenger of the forge-clans, Vaelith has crossed every volcanic wasteland in Sundale five times — on foot, alone, carrying nothing but a sealed message-tube and the marks of her clan. Her skin is lighter than most Emberth from decades of constant ash-wind exposure, the grain worn smooth across her shoulders where the storms hit hardest. Her eye-wraps are so permanently stained with volcanic ash that they have become part of her face; no living Emberth has seen her without them.

Vaelith is the only messenger trusted by all three forge-clan bloodlines. During the escalating tensions over the Solbrand's health, she has carried sealed accusations, denials, threats, and pleas between the clans — always sealed, always private, never read. The tending-clan trusts her because she has never broken a seal. The doubting-clans trust her because she has never been seen favoring the tenders. The truth is more complicated: Vaelith has been reading the seals anyway. Not the messages — the seals. She can tell by the way a clan presses its sigil into the cooling wax whether the hand that pressed it was trembling.

She keeps a private record — pressed ash-tablets, hidden in a fissure beneath the Solbrand's chamber — of every tremor she has felt, dated, catalogued. The tending-clan's hands have been trembling for eleven years.
            `
        }
    ],

    majorLocations: [
        {
            name: 'The Harath-Vault',
            description: `Carved radially into the volcanic throat of a dormant secondary caldera three miles from Emberspire sits the massive subterranean capital of the Emberth forge-clans. Carved out by the Sun-Speakers centuries before the sun's death, the Vault is a titanic, sprawling underground city of craftsmen, miners, and priests. Grated catwalks are suspended above hot, molten metal rivers that rush through the center of the pathways, acting as both the source of the city's immense heat and its primary defensive barrier. The sounds of hammers falling rings out through the hustle and bustle of the stone avenues.

At the Vault's absolute center is **The Great Forge**, where oversized obsidian anvils are worked diligently by craftsmen who barely break a sweat under the unbearable heat. In the inner ring sits **The Harath-Chamber**, a massive monastic sanctuary of pure basalt where the **Korr Sun-Speakers** kneel in six-hour shifts, practicing the Vault-Breath in absolute silence around the **Solbrand** — the stone bowl containing the last eternal ember of Sol. The outer rings contain the residential sectors and the alchemical laboratories of the **Fexric**, who trade alchemical reagents and gear-work for Emberth obsidian.`
        },
        {
            name: 'The Shyr',
            description: `A ninety-mile scar of cooling basalt, the Shyr serves as the Emberth's primary thoroughfare — a road of stone that walks itself as the lava cools and contracts into predictable fracture-patterns. The Shyr is not a wasteland. It is the Emberth's main artery of survival, where Thrask surface badland-rangers and miners build temporary volcanic outposts, constantly navigating shifting thermal vents and guarding the basalt trade roads from ice-pirates and freezing border beasts.`
        }
    ],

    currentCrisis: `
The Solbrand is dying — a truth the tending-clan (Korr) has concealed for three generations. The dimming has accelerated in the last decade, and the Sun-Speakers who attempted to speak openly were silenced. Those who remain have split into three camps:

The Risen hold to the old faith: Sol is sleeping, the ember is merely resting, and patience will be rewarded when the god rekindles and speaks again. They advocate for continued silence, continued waiting, continued devotion — the same path the Korr have walked for centuries. They control the tending-clan's official position.

The Sunderer — a smaller, heretical faction — believe the Solbrand was never Sol's gift at all. They argue that the ember is Keth-Amar's tether, a feeding-line the predator left embedded in Emberth culture so it could consume their devotion alongside their god's embers. They advocate extinguishing the Solbrand entirely and beginning a new covenant.

The Unwoven — named for the forge-marks they ritually defaced upon joining — have left both bloodlines entirely. They are scattered across Sundale, gathering fragments of the binding seal (the Sundered Monoliths) in the belief that if Keth-Amar's breach can be sealed, Sol may finally complete the Deepening and be reborn. They are regarded as dangerous fanatics by the tending-clan, as noble fools by the Sunderer, and as a quiet hope by the Thrask who fear the Solbrand's extinction.

The Thrask, who spend more time on the surface than any Korr, were the first to notice the evidence: ashfall shifting, vents cooling, the temperature dropping year by year. They are agitating for transparency. The Korr are refusing. The surface outposts and frontier settlements are caught between the two bloodlines, unsure which way the crisis will break.

Thaeron, the eldest Sun-Speaker, belongs to none of these camps. He has spent sixty years staring into the Solbrand's light, and he has seen something in it that does not match any faction's theology. He has told no one what he believes. He is waiting — as Emberth have always waited — for Sol to speak again and settle the matter. But Sol has been silent for centuries, and Thaeron is old, and the ember is dimming faster than anyone alive can explain.
    `,

    culturalPractices: `
The Marking-Rite is the foundation of Emberth identity. At birth, every Emberth's forearms and shoulders are marked by the clan's eldest Sun-Speaker using a heated obsidian stylus — deliberate burn-scars that encode three things: clan affiliation, trade specialization, and ancestor-lineage. The process is painful and brief. The child is not comforted during the marking; to cry out is normal, but to be soothed through the pain is considered a failure of the clan to prepare its young for the world. The marks darken with proximity to the Solbrand — Korr forge-marks are stark and crisp, while Thrask marks are fainter. This is not a flaw. It is a visible record of where the bloodline has stood in relation to Sol's ember across generations. To deface a forge-mark — cutting, burning over, or magically removing the scars — is the severest crime in Emberth legal code, considered equivalent to erasing the victim from living memory.

The Vault-Breath is the discipline of absolute stillness and thermal conservation. Children learn it before they learn speech: sitting motionless for increasing periods in the forge-halls, breathing in slow, deliberate cycles that conserve precious body heat and oxygen. An adult Emberth can remain perfectly still for six hours — the length of a standard Solbrand tending-shift. Outsiders find this deeply unsettling. Among Emberth, fidgeting is considered a sign of poor discipline, poor upbringing, or both. A guest who cannot sit still during a formal meeting has insulted the host, whether they know it or not.

The Eye-Wrap is a practical adaptation with profound cultural weight. Emberth eyes — enlarged during the underground exile to see in near-total darkness — are painfully sensitive to daylight. Every adult wears a strip of ash-tinted cloth wrapped across the eyes, dyed with volcanic particulate that filters sunlight to tolerable levels. The wrap is personalized: clan colors, trade-sigils, and achievement-marks are woven into the fabric. Removing an Emberth's eye-wrap without permission is a violation akin to stripping someone naked in public. Seeing an Emberth without their wrap is an intimacy reserved for family, bonded partners, and deathbed confessions.

The Solstice Vigil occurs once each year during the longest period of darkness. Every forge-clan extinguishes all flames except the Solbrand. The entire clan — from the eldest Sun-Speaker to the youngest child — sits in the Vault-Breath for twelve hours of uninterrupted silence, listening for Sol's voice in the ember. No one has heard anything for centuries. The Vigil continues because stopping it would mean admitting Sol is truly gone. At the Vigil's end, newborns receive their forge-marks from the heated stylus, and the clan's forges are relit from the Solbrand's flame — a ritual that binds every Emberth forge to the same source, the same vigil, the same silence.

Forge-trials settle disputes between clans. No Emberth may strike another Emberth in anger — this is the first clause of the Forge Accords, and violation means permanent exile. Disputes are instead resolved through competitions of craft, endurance, or stillness: who can forge the finest blade from raw obsidian, who can hold the Vault-Breath longest, who can recite the longest ancestor-lineage from memory without error. The nature of the trial is agreed upon by both parties. The loser accepts the verdict without appeal, because to dispute a forge-trial is to dispute the forge itself — and the forge is Sol's altar.
    `,

    baseTraits: {
        languages: ['Common', 'Sundari'],
        lifespan: '90-130 years',
        baseSpeed: 25,
        size: 'Medium',
        height: '5\'10" - 6\'4"',
        weight: '190-280 lbs',
        build: 'Broad-shouldered, heavy, deliberately still'
    },

    sharedTraits: [
        {
            id: 'vault_breath_emberth',
            name: 'The Vault-Breath',
            description: 'Your stillness is a weapon and a vulnerability — the discipline of centuries spent in oxygen-starved chambers, where every unnecessary motion burned air and lost precious thermal energy. You can hold yourself motionless for hours, conserving all heat, indistinguishable from volcanic stone, and the mental discipline this requires grants you advantage on saves against fear and charm. But the deep stillness cannot be shed quickly. When combat begins, you make initiative rolls with disadvantage. Your body needs a moment to remember that movement is permitted.',
            level: 1,
            icon: 'spell_arcane_teleportundercity',
            spellType: 'PASSIVE',
            effectTypes: ['buff', 'debuff'],
            typeConfig: {
                school: 'physical',
                secondaryElement: 'willpower',
                icon: 'spell_arcane_teleportundercity',
                tags: ['stillness', 'discipline', 'shared', 'passive']
            },
            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'vault_breath_discipline',
                        name: 'Forged Stillness',
                        description: 'Advantage on saving throws against fear and charm effects.',
                        statusEffect: { level: 'permanent', description: 'Advantage on fear and charm saves' }
                    }
                ],
                durationType: 'permanent',
                durationValue: 0,
                durationUnit: 'permanent',
                canBeDispelled: false
            },
            debuffConfig: {
                debuffType: 'statPenalty',
                effects: [
                    {
                        id: 'vault_breath_slowness',
                        name: 'Deep-Vault Slowness',
                        description: 'Disadvantage on initiative rolls. Your body needs a moment to warm up and move.',
                        statModifier: { stat: 'initiative', magnitude: -99, magnitudeType: 'disadvantage' }
                    }
                ],
                durationType: 'permanent',
                durationValue: 0,
                durationUnit: 'permanent',
                canBeDispelled: false
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        },
        {
            id: 'ash_lung_emberth',
            name: 'Ash-Lung',
            description: 'Your lungs are lined with thick mucosal membranes, developed across generations of underground exile to filter toxic ash and particulate. You are immune to the effects of volcanic ashstorms, dust-clogging, and gas-based environmental hazards that would suffocate other races. But in clean, humid environments, your lungs grow heavy and sluggish — they lack the dry soot they adapted to filter.',
            level: 1,
            icon: 'spell_shadow_mindflay',
            spellType: 'PASSIVE',
            effectTypes: ['buff', 'debuff'],
            typeConfig: {
                school: 'physical',
                secondaryElement: 'poison',
                icon: 'spell_shadow_mindflay',
                tags: ['respiration', 'ash-filter', 'shared', 'passive']
            },
            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'ash_lung_filtration',
                        name: 'Ash-Filter',
                        description: 'Immune to the effects of volcanic ash, dust-choking, and gas-based environmental hazards.',
                        statusEffect: { level: 'permanent', description: 'Immune to airborne choking hazards' }
                    }
                ],
                durationType: 'permanent',
                durationValue: 0,
                durationUnit: 'permanent',
                canBeDispelled: false
            },
            debuffConfig: {
                debuffType: 'statPenalty',
                effects: [
                    {
                        id: 'humidity_fatigue',
                        name: 'Humidity Fatigue',
                        description: 'Disadvantage on endurance and constitution checks in humid or rainforest climates. Your lungs grow heavy in clean, damp air.',
                        statModifier: { stat: 'constitution_endurance', magnitude: -99, magnitudeType: 'disadvantage' },
                        conditions: { climate: 'humid' }
                    }
                ],
                durationType: 'permanent',
                durationValue: 0,
                durationUnit: 'permanent',
                canBeDispelled: false
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        }
    ],

    subraces: {
        korr: {
            id: 'korr_emberth',
            name: 'Korr',
            illustration: '/assets/images/races/korr_illustration.png',
            illustrationCaption: 'A Korr Emberth forge-keeper sitting in absolute, calcified stillness in deep-vault volcanic heat, conserving every drop of thermal energy.',
            tooltipSummary: 'Volcano-hearted guardians who draw warmth from the deep earth, slow and steady, their bodies ash-lunged but implacable.',
            description: 'The fewest and the most isolated. Korr bodies are calcified for absolute stillness — elongated lungs that conserve thermal energy, metabolisms so slow their pulses are barely perceptible, and eyes enlarged to perceive the faint heat in absolute darkness. Their skin is the deepest basalt-dark, cooled charcoal texture, untouched by daylight. They move like people who have forgotten why movement matters. Their Vault-Breath can extend to twelve hours — double the standard — and older Korr report that time itself feels different in the deep, that centuries pass like seasons, and that the cold ash of their bodies is a language they are still learning to translate.',
            culturalBackground: `The Korr trace their lineage to the Sun-Speakers who answered Sol's silence with absolute patience. When the other clans asked what they would contribute to the survival effort, the Korr answered: meaning. They would wait. For centuries, the other two clans fed them, protected them, and carried geothermal fuel down into the Deep-Vault where the air was too thin for anyone but a Korr to breathe, because the Korr were the Emberth's connection to the dying heat. Without them, the survival effort had no purpose.

The Korr are the smallest bloodline and the most politically powerful. They hold the Solbrand. They interpret the silence. They officiate the Solstice Vigil and apply the newborn's forge-marks and determine — through decades of listening — whether a given omen means war or peace or nothing at all. Their word is final, because no other clan can perform the tending. The Vault-Breath required to endure the Deep-Vault for more than an hour is a Korr-specific adaptation; a Thrask who attempts the full vigil risks freezing.

The current crisis is a Korr crisis. The tending-clan has concealed the Solbrand's dimming for three generations, and the Sun-Speakers are no longer unified. Some still believe Sol will speak again. Some believe the ember is Keth-Amar's tether and must be extinguished. Some — the Unwoven — have defaced their marks and left the Deep-Vault entirely. Thaeron, the eldest Korr, has told no one what he believes. He is still listening.`,
            statModifiers: {
                spirit: 2,
                intelligence: 1,
                constitution: -1
            },
            traits: [
                {
                    id: 'listening_dark_korr',
                    name: 'The Listening Dark',
                    description: 'Generations in the Solbrand\'s light have reshaped your vision entirely. You perceive heat gradients in darkness — treating dim light as bright within 30 feet and total darkness as dim light within 60. But your eyes have forgotten daylight — even with your wraps, you suffer disadvantage on all sight-based perception checks in bright light.',
                    level: 1,
                    icon: 'ability_rogue_shadowstrikes',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'shadow',
                        secondaryElement: 'perception',
                        icon: 'ability_rogue_shadowstrikes',
                        tags: ['darkvision', 'heat-sight', 'daylight-penalty', 'passive']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'korr_heat_gradient',
                                name: 'Heat-Sight',
                                description: 'Treat dim light as bright within 30ft and total darkness as dim light within 60ft. Perceive residual heat traces.',
                                statusEffect: { level: 'permanent', description: 'Enhanced dark vision with heat perception' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statPenalty',
                        effects: [
                            {
                                id: 'korr_daylight_pain',
                                name: 'Daylight Pain',
                                description: 'Disadvantage on all sight-based perception checks in bright light.',
                                statModifier: { stat: 'perception_sight', magnitude: -99, magnitudeType: 'disadvantage' },
                                conditions: { lightLevel: 'bright' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'solbrand_pulse_korr',
                    name: 'The Solbrand\'s Pulse',
                    description: 'You feel the Solbrand regardless of distance — a pressure at the base of your skull, a rhythm beneath your heartbeat. When within one mile of the ember, gain advantage on spirit checks. But during moments when the ember gutters (DM discretion), you suffer -2 to concentration checks. The pain in your skull is the pain of the ember. You cannot separate them.',
                    level: 1,
                    icon: 'spell_fire_flameblades',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'holy',
                        secondaryElement: 'fire',
                        icon: 'spell_fire_flameblades',
                        tags: ['solbrand', 'spirit', 'proximity', 'passive']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'solbrand_near',
                                name: 'Ember Proximity',
                                description: 'Advantage on spirit checks when within 1 mile of the Solbrand',
                                statusEffect: { level: 'conditional', description: 'Advantage on spirit checks near the Solbrand' },
                                conditions: { solbrandProximity: true }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statPenalty',
                        effects: [
                            {
                                id: 'solbrand_dimming',
                                name: 'Shared Dimming',
                                description: '-2 to concentration checks when the Solbrand gutters during moments of crisis',
                                statModifier: { stat: 'concentration', magnitude: -2, magnitudeType: 'flat' },
                                conditions: { solbrandDimming: true }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'deep_curse_korr',
                    name: 'Deep-Curse',
                    description: 'The oxygen-starved vaults that sheltered your ancestors claimed a permanent toll. -5ft movement speed. Your bone density makes you sink in water — you cannot swim. The cold that your people fled seeps into your marrow more readily than into other Emberth: disadvantage on saving throws against cold effects. The Deep-Vault kept you alive. It also kept you fragile.',
                    level: 1,
                    icon: 'spell_frost_chillingbolt',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'frost',
                        secondaryElement: 'curse',
                        icon: 'spell_frost_chillingbolt',
                        tags: ['drawback', 'cold-weakness', 'slow', 'cursed', 'passive']
                    },
                    debuffConfig: {
                        debuffType: 'curse',
                        effects: [
                            {
                                id: 'deep_slow',
                                name: 'Vault-Weight',
                                description: '-5ft movement speed. Your bones are dense from the deep.',
                                statModifier: { stat: 'speed', magnitude: -5, magnitudeType: 'flat' }
                            },
                            {
                                id: 'deep_cold_weak',
                                name: 'Cold-Seeped',
                                description: 'Disadvantage on saving throws against cold effects.',
                                statusEffect: { level: 'permanent', description: 'Disadvantage on cold saves' }
                            },
                            {
                                id: 'deep_sink',
                                name: 'Stone-Blood',
                                description: 'Cannot swim. You sink in water.',
                                statusEffect: { level: 'permanent', description: 'Swim speed is 0; you sink' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                }
            ],
            languages: ['Common', 'Sundari'],
            speed: 20,
            baseStats: {
                armor: 0,
                hp: 24,
                mana: 32,
                ap: 3,
                passivePerception: 3,
                swimSpeed: 0,
                climbSpeed: 0,
                visionRange: 90,
                darkvision: 120,
                initiative: -1
            },
            savingThrowModifiers: {
                disadvantage: ['constitution'],
                advantage: ['charm', 'fear']
            }
        },
        thrask: {
            id: 'thrask_emberth',
            name: 'Thrask',
            illustration: '/assets/images/races/thrask_illustration.png',
            illustrationCaption: 'A Thrask Emberth surface badland-ranger insulated in thick ashy cloth wraps, holding an obsidian weapon and scouting for geothermal vents.',
            tooltipSummary: 'Border-blooded halfbreeds who walk the line between fire and ice, ash-skimming the volcanic scree with obsidian-grafted limbs.',
            description: 'The most surface-adapted and the most mobile. Thrask bodies have shorn hair and are wrapped in heavy ash-insulating cloths to retain what little heat they possess. Their skin is sallow grey to dark charcoal-brown. Their ash-filtering lungs are weaker than the Korr\'s — adapted for the thin, cold air of the surface border rather than the thick particulate of the Mid-Vault. They are the only Emberth who can survive extended periods above ground by foraging for active geothermal vents and coal-veins, though they must move constantly to keep their blood moving and prevent their limbs from freezing. They move like people who have forgotten why stillness was ever necessary.',
            culturalBackground: `The Thrask trace their lineage to the hunters who answered Sol's silence with vigilance. They worked the High-Vault — the tunnels nearest the frozen surface — ranging into the dead world above to hunt what survived the freeze and salvage active coal deposits. Without them, the other clans would have frozen in their sleep.

The Thrask are the Emberth's connection to the surface, even now that the surface has been partially reclaimed. They map the ash-wastes, scout the frontier, and carry message-tubes between outposts. Vaelith, the most trusted messenger of the clans, is a Thrask.

The Thrask were the first to notice the evidence of the Solbrand's dimming. They spend more time on the surface, and they see the volcanic vents cooling and the glaciers encroaching. They are agitating for transparency and access to secondary heat resources. The Korr are refusing, fearing a panicked exodus that would deplete the Vault's core thermal grid.`,
            statModifiers: {
                agility: 2,
                strength: 1,
                intelligence: -1
            },
            traits: [
                {
                    id: 'border_blood_thrask',
                    name: 'Border-Blood',
                    description: 'Generations of hunting the frozen surface border have granted you partial resistance to the one thing that kills your people fastest. Advantage on saving throws against cold weather and environmental cold effects. Your body learned to survive the cold by burning hotter — disadvantage on saving throws against heat effects and extreme heat. You are a creature of thresholds, and the threshold cuts both ways.',
                    level: 1,
                    icon: 'spell_frost_frostward',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'frost',
                        secondaryElement: 'fire',
                        icon: 'spell_frost_frostward',
                        tags: ['cold-resistance', 'heat-vulnerability', 'border', 'passive']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'thrask_cold_resist',
                                name: 'Cold-Grounded',
                                description: 'Advantage on saving throws against cold weather and environmental cold effects.',
                                statusEffect: { level: 'permanent', description: 'Advantage on cold saves' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statPenalty',
                        effects: [
                            {
                                id: 'thrask_heat_weak',
                                name: 'Heat-Vulnerable',
                                description: 'Disadvantage on saving throws against heat effects and extreme heat.',
                                statusEffect: { level: 'permanent', description: 'Disadvantage on heat saves' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'ash_skimmer_thrask',
                    name: 'Ash-Skimmer',
                    description: 'You have spent decades running across sliding volcanic scree and unstable ash-dunes. You treat non-magical difficult terrain caused by snow, ice, ash, or loose stone as normal terrain. In addition, when you take the dash action, you can make a leap of up to 15 feet as part of your movement without requiring a running start — your splay-toed feet launch you across the drifts with ease.',
                    level: 1,
                    icon: 'ability_rogue_sprint',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff'],
                    typeConfig: {
                        school: 'physical',
                        secondaryElement: 'movement',
                        icon: 'ability_rogue_sprint',
                        tags: ['skirmish', 'terrain-bypass', 'leap', 'passive']
                    },
                    buffConfig: {
                        buffType: 'movementEnhancement',
                        effects: [
                            {
                                id: 'ash_skimming',
                                name: 'Scree-Runner',
                                description: 'Ignore non-magical difficult terrain from snow, ice, ash, or loose stone. Leap up to 15ft during Dash without a start.',
                                statusEffect: { level: 'permanent', description: 'Ignore winter difficult terrain; 15ft standing leap on Dash' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'obsidian_graft_thrask',
                    name: 'Obsidian Striker',
                    description: 'Your clan-marks on your forearms are reinforced with volcanic obsidian flakes. When you strike with an unarmed attack, you deal 1d4 slashing damage instead of bludgeoning, and once per short rest, when you score a critical hit with a melee attack, you can cause the obsidian to splinter inside the wound: the target takes an additional 1d6 piercing damage and is afflicted with deep bleeding, taking 1d4 damage at the start of its turn for 3 turns or until it spends 1 AP to tend the wound. Splintering the obsidian causes you 1d2 piercing damage as the flakes break from your own flesh.',
                    level: 1,
                    icon: 'inv_stone_02',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'physical',
                        secondaryElement: 'earth',
                        icon: 'inv_stone_02',
                        tags: ['combat', 'obsidian', 'bleed', 'recoil', 'passive']
                    },
                    buffConfig: {
                        buffType: 'combatEnhancement',
                        effects: [
                            {
                                id: 'obsidian_strikes',
                                name: 'Obsidian Blade',
                                description: 'Unarmed strikes deal 1d4 slashing damage.',
                                statusEffect: { level: 'permanent', description: 'Unarmed strikes deal 1d4 slashing' }
                            }
                        ],
                        durationType: 'permanent',
                        durationValue: 0,
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'obsidian_splinter_bleed',
                                name: 'Obsidian Bleeding',
                                description: 'Target takes 1d6 piercing damage and 1d4 bleeding damage at start of its turn for 3 turns. You take 1d2 piercing damage.',
                                statusEffect: { penaltyType: 'bleed_damage', bleedingFormula: '1d4', duration: 3, recoilFormula: '1d2' }
                            }
                        ],
                        targetRestriction: 'critical_target'
                    },
                    targetingConfig: { targetingType: 'single_target', rangeType: 'melee', rangeDistance: 5 },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                }
            ],
            languages: ['Common', 'Sundari'],
            speed: 25,
            baseStats: {
                armor: 0,
                hp: 26,
                mana: 16,
                ap: 3,
                passivePerception: 14,
                swimSpeed: 10,
                climbSpeed: 20,
                visionRange: 60,
                darkvision: 60,
                initiative: 2
            },
            savingThrowModifiers: {
                disadvantage: ['cold_effects'],
                advantage: ['fear', 'intimidation']
            }
        }
    }
};
