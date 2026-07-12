/**
 * Spellguard Class Data
 *
 * "Flesh stitched to radioactive metal. We are the tombs of their old powers."
 *
 * Complete class information for the Spellguard - the Silence-Scarred Aegis.
 * A catastrophic magical sponge that absorbs volatile enemy spells into their own 
 * mutilated flesh, suffering severe internal radiation to protect allies before
 * detonating that stored energy back at the caster.
 *
 * ?? EXCLUSIVE DOMAIN: The Spellguard is the only class that can physically intercept
 * magical attacks meant for allies and store the raw leyline energy inside their own body.
 */

export const SPELLGUARD_DATA = {
 restrictions: {
   "allowedSubraces": [
     "velun_neth",
     "thalren_human",
     "solvarn_human",
     "korr_emberth",
     "thrask_emberth"
   ],
   "hardBlocks": [
     "myrathil",
     "ordan_human",
     "groven",
     "briaran"
   ],
   "narrativeUnlock": true,
   "justification": "Requires access to Emberspire's volcanic forge-tradition and the Solbrand's residual energy. The Neth Velun provide precise magical cancellation. Thalren provide anti-Wyrd paranoia."
 },

 /**
  * Subrace Variants, the Spellguard dismantles incoming magic, and how they dismantle
  * it depends on what tradition of "understanding magic" they inherited. The Neth cancel
  * it legally. The Thalren defuse it like a Wyrd-trap. The Solvarn shield it like a
  * tomb-guard. The Emberth intercept it like a forge-rupture.
  */
 subraceVariants: {
  velun_neth: {
   subraceName: 'Velun Neth',
   title: 'The Clause-Canceller',
   reframe: `The <LoreLink termId="neth">Velun Neth</LoreLink> understand magic as *contract*, and a Spellguard among them cancels incoming spells by *drafting the annulment*, identifying the hostile magic's clause-structure and filing the counter-instrument before it lands. To a Velun Spellguard, a fireball is just an aggressively-worded offer, and the correct response is a timely rejection on procedural grounds.`,
   signatureAbility: {
    name: 'Clause-Annulment',
    description: `Incoming spells are canceled through legal-inversion rather than raw absorption; the Spellguard files the annulment, and the magic fails on its own terms. The process is precise and low-radiation, the Velun take on far less Silence Resonance than absorbing variants, but fails entirely against magic with no clause-structure (wild Wyrd, primal forces).`
   },
   currentCrisisAngle: `The rising ambient magic is, to the Velun, a *jurisdictional overload*, too many spells in the air, too many clauses to parse in real time. The Velun Spellguards are the most radiation-resistant variant, but they are being drowned in paperwork: the annulments cannot be drafted fast enough to keep pace with a world whose magic level is spiking.`,
   signatureQuote: {
    text: '"Your fireball is poorly drafted. I have filed an objection. It will not arrive. The objection was sustained."',
    speaker: 'Canceller Vel-Ossar',
    context: 'A Velun Spellguard, intercepting a court-mage\'s assault on procedural grounds'
   }
  },

  thalren_human: {
   subraceName: 'Thalren',
   title: 'The Wyrd-Defuser',
   reframe: `The <LoreLink termId="skald">Thalren</LoreLink> have spent eight centuries paranoid about the Wyrd-horrors born from human fear, and a Spellguard among them defuses incoming magic the way a sapper defuses a trap, slowly, suspiciously, expecting a second trigger. The Thalren are the tradition's most *cautious* variant: they assume every spell has a backup, and they are usually right.`,
   signatureAbility: {
    name: 'Trap-Defusal',
    description: `Incoming spells are disarmed through methodical structural analysis, the Spellguard identifies the spell's trigger, payload, and failsafe, then neutralizes each in sequence. Slower than absorption or annulment, but the only method that reliably catches layered/contingent spells that would detonate on a hasty counter.`
   },
   currentCrisisAngle: `The rising ambient magic is producing spells the Thalren's paranoia cannot fully parse, magic with *no visible structure*, wild and structureless, the kind the Wyrd itself uses. The Thalren Spellguards, trained to find traps in everything, are being driven to breakdown by magic that has no trap to find because it has no design at all.`,
   signatureQuote: {
    text: '"Every spell has a second trigger. Every spell. This one has none, and that is the most dangerous second trigger I have ever failed to find."',
    speaker: 'Defuser Thal-Veyr',
    context: 'A Thalren Spellguard, confronting the first wild-magic eruption he could not parse'
   }
  },

  solvarn_human: {
   subraceName: 'Solvarn',
   title: 'The Tomb-Aegis',
   reframe: `The <LoreLink termId="house_solvan">Solvarn</LoreLink> have stood vigil over <LoreLink termId="emberspire">Sol's tomb</LoreLink> for eight centuries, and a Spellguard among them treats incoming magic as *another eruption from the buried star*, something to be shielded, contained, and held until it cools. The Solvarn are the tradition's pure *sponges*, absorbing magic the way a tomb-wall absorbs the volatile resonance of an imprisoned spirit.`,
   signatureAbility: {
    name: 'Tomb-Shielding',
    description: `Incoming spells are absorbed raw into the Spellguard's flesh, then contained, held in the body until they can be vented or redirected. The Solvarn take on the most Silence Resonance of any variant, but they can absorb the largest single bursts, having practiced against Solbrand-scale eruptions their whole lives.`
   },
   currentCrisisAngle: `The rising ambient magic is, to the Solvarn, a familiar enemy, this is what their ancestors shielded against. But the scale is wrong: the ambient level is approaching Solbrand-volatility *everywhere*, and the Solvarn Spellguards, trained for rare spikes, are being asked to sustain tomb-level absorption *continuously*. Several have begun glowing so brightly they cannot hide, and the Dawn Vigil has begun "recruiting" them as walking beacons.`,
   signatureQuote: {
    text: '"I was built to catch a star\'s death-rattle once a season. Now the whole world hums at that frequency. I am a tomb-wall asked to be a sky. I cannot be a sky."',
    speaker: 'Aegis Sol-Varen',
    context: 'A Solvarn Spellguard, glowing too brightly to enter Merrowport unnoticed'
   }
  },

  korr_emberth: {
   subraceName: 'Korr Emberth',
   title: 'The Silent-Guard',
   reframe: `The <LoreLink termId="emberth">Korr Emberth</LoreLink> tend the Solbrand in wordless silence, and a Spellguard among them intercepts magic from a state of <LoreLink termId="vault_breath">Vault-Breath</LoreLink> stillness, the same meditative suspension they use to tend the buried star. The Korr are the tradition's *steadiest* variant: their interception happens in the gaps between heartbeats, in a stillness so absolute that incoming magic has nothing to push against.`,
   signatureAbility: {
    name: 'Silent-Intercept',
    description: `Magical interception is performed from a state of metabolic stillness, the Spellguard slows their own vitals to near-zero, becoming a silence that incoming magic *falls into* rather than strikes. The Korr intercept with the least collateral damage and the quietest profile, but cannot intercept while moving.`
   },
   currentCrisisAngle: `The rising ambient magic makes stillness *unsafe*, the ambient radiation accumulates in a stationary body faster than a moving one, and the Korr's Silent-Intercept is becoming a liability. The Korr Spellguards, masters of stillness, are being forced to *move* for the first time in their tradition's history, and the movement is breaking their meditation.`,
   signatureQuote: {
    text: '"I caught magic by being the silence it fell into. Now the silence itself is radioactive, and I must move to survive. I have forgotten how to walk and guard at once."',
    speaker: 'Keeper Kor-Vesh the Still',
    context: 'A Korr Spellguard, taking her first step mid-intercept in forty years of service'
   }
  },

  thrask_emberth: {
   subraceName: 'Thrask Emberth',
   title: 'The Forge-Shield',
   reframe: `The <LoreLink termId="emberth">Thrask Emberth</LoreLink>, badland rangers, intercept magic the way they intercept forge-ruptures in the field: practically, violently, on the move. The Thrask are the tradition's *mobile* variant, deflecting and redirecting rather than absorbing, treating incoming magic as a thermal hazard to be angled away from the party rather than caught.`,
   signatureAbility: {
    name: 'Rupture-Deflection',
    description: `Incoming spells are deflected or redirected rather than absorbed, the Spellguard angles the magic away using alchemical shield-surfaces, the way a forge-ranger angles a thermal vent. The Thrask take on the least Silence Resonance, but cannot fully neutralize a spell, only redirect it (sometimes back at the caster, sometimes into the terrain).`
   },
   currentCrisisAngle: `The rising ambient magic cannot be *deflected*, it is everywhere, ambient, with no vector to angle away. The Thrask Forge-Shields, masters of redirection, are helpless against a hazard that has no direction. Several have begun abandoning deflection for desperate absorption, a technique they were never trained for, and the radiation sickness is spreading through the badland garrisons.`,
   signatureQuote: {
    text: '"I redirect what has a direction. This has no direction. I am a shield-wall against the weather. You cannot parry the sky."',
    speaker: 'Ranger Thrak-Vess',
    context: 'A Thrask Spellguard, abandoning his shield-surface to absorb his first spell'
   }
  }
 },


 id : "spellguard",
 name: "Spellguard",
 icon: "fas fa-shield-alt",
 role: "Silence-Scarred Aegis",
 damageTypes: ["arcane", "storm", "blight"],

 spellPools: {
  1: ["sg_void_siphon", "sg_entropic_aegis", "sg_refract_kinetic", "sg_leyline_rift", "spellguard_arcane_radiation", "spellguard_kinetic_fragility", "spellguard_aegis_beacon", "spellguard_ley_reading", "spellguard_aegis_ward", "spellguard_glow_lantern"],
  2: ["sg_agonizing_intercept", "sg_shattered_mirror_ward", "sg_warding_ribcage", "spellguard_resonance_discharge", "spellguard_disenchant"],
  3: ["sg_void_suppression", "sg_entropic_supernova", "sg_tomb_of_the_aegis"],
  4: ["sg_violent_purge", "sg_leyline_blackout"],
  5: ["sg_cosmic_unraveling"]
 },

 livingOrder: {
  orderName: 'The Aegis',
  founder: {
   name: '<LoreLink termId="damon">Damon</LoreLink>',
   status: `Dead, five centuries. The <LoreLink termId="emberth">Emberth</LoreLink> blacksmith who blocked a solar flare with an alchemical tower shield during Sol's entombment. His hands froze in rigid shielding posture; the shield is preserved in the <LoreLink termId="emberspire">Emberspire</LoreLink> forge-keeps, still faintly humming.`,
   note: `<LoreLink termId="damon">Damon</LoreLink> treated magical defense as engineering, not artistry. The Aegis still trains in his method: identify the spell's structure, dismantle it before it arrives, redirect the residue. His one unbreakable rule, *a Spellguard who absorbs what they cannot dismantle is a weapon pointed at their own line*, is now being violated daily.`
  },
  currentLeader: {
   name: '<LoreLink termId="thrak-damos">Bulwark-Captain Thrak-Damos</LoreLink>',
    title: 'Warden of the Silence-Scars',
   characterization: `A Thrask Emberth veteran whose forearms are latticed with absorbed-magic scars that glow through his sleeves. He leads the Aegis from the forge-keeps and enforces <LoreLink termId="damon">Damon</LoreLink>'s method with drill-sergeant discipline. He is a pragmatist who is watching his entire engineering discipline fail against a threat, ambient magic with no structure, that <LoreLink termId="damon">Damon</LoreLink> never imagined.`
  },
  headquarters: { name: 'The Shield-Forge Keeps, Emberspire', locationId: 'emberspire' },
  crisisConnection: `<LoreLink termId="thrak-damos">Thrak-Damos</LoreLink> is watching the Aegis's foundational method collapse: ambient magic has no structure to dismantle, no vector to redirect. The Spellguards' Silence Resonance is filling faster than they can purge, and the Arcane Saturation radiation-bursts are striking their own lines. He has begun ordering his Spellguards to *absorb*, <LoreLink termId="damon">Damon</LoreLink>'s forbidden technique, because there is nothing left to dismantle. The order that defined itself by precision is being reduced to a wall of sponges, and <LoreLink termId="thrak-damos">Thrak-Damos</LoreLink> considers this the death of his craft even if his Spellguards survive.`
 },

 worldFriction: [
  { region: 'everywhere-else', status: 'valued', consequence: 'Magical defense is in universal demand, a Spellguard can find paid work in any settlement within a day. The Wyrd-bleed and rising ambient magic have made them the most actively recruited class in the known world.', workaround: 'The same glow that makes them valued makes them unable to hide: a Spellguard cannot pass unnoticed, take a rear-guard position, or avoid being the first target. Their welcome is inseparable from their exposure.' },
  { region: 'sundale', location: 'emberspire', status: 'conscripted', consequence: 'The Dawn Vigil claims authority over all Spellguards within Sundale as "shield-assets of the Reforging"; refusal of Vigil secondment is treated as obstruction of a sacred war.' }
 ],

 overview: {
   originStory: `A spellguard absorbs magic into their own flesh. Not as a trick or a technique, but as the foundational act of a tradition born at the moment the sun was buried.

The first was Damon, an Emberth blacksmith working the forge-keeps during the Binding. When Sol was forced into the vault beneath Sundale, the dying star convulsed, a solar flare erupting through the caldera that would have incinerated every worker in the forge-levels. Damon raised an alchemical tower shield and took the flare directly. He was not desecrating Sol's light. He was shielding his fellow workers from a dying star's death-throes. What Damon absorbed was not sacred radiance but Sol's scream.

The solar energy permanently scarred his flesh and left his veins humming with volatile trapped mana. His hands froze in rigid shielding posture. He spent the rest of his life refining the principle: identify the structure of incoming magic, dismantle what can be dismantled, absorb what cannot, and redirect the rest. His unbreakable rule: "A spellguard who absorbs what they cannot dismantle is a weapon pointed at their own line."

Each subrace absorbs differently. The Velun Neth cancel spells through legal inversion, a fireball is an aggressively-worded offer, the response is rejection on procedural grounds. Lowest radiation intake, but fails against wild Wyrd with no structure. The Thalren defuse magic like a sapper defuses a trap, identifying trigger, payload, and failsafe, neutralizing each in sequence. Only method that reliably catches layered spells. The Solvarn absorb raw into flesh, practice-tested against Solbrand-scale eruptions. Most Resonance intake but can absorb the largest single bursts. The Korr Emberth intercept from Vault-Breath stillness, becoming a silence that magic falls into. Steadiest but cannot move while intercepting. The Thrask Emberth deflect and redirect, treating magic as thermal hazard to be angled away. Lowest Resonance but cannot fully neutralize.

Ambient magic levels are rising as the Wyrd bleeds faster. Spellguards fill with Silence Resonance faster than they can purge. Some enter Arcane Saturation, spontaneous Radiation Bursts harming everyone nearby. The current leader, Bulwark-Captain Thrak-Damos, is ordering absorption, Damon's forbidden technique, because there is nothing left to dismantle.`,
  title: "The Spellguard",
  subtitle: "The Silence-Scarred Aegis",

  quickOverview: {
   title: "Visceral Overview",
    content: `**Who they are**: A silence-scarred aegis whose flesh is a blistered tomb for absorbed magic. They are not a shining knight  -  their specialized armor is permanently scarred by the radioactive fallout of every spell they have devoured. They stand between their party and the apocalypse, dragging raw leylines into their own lungs.

**The hook**: Physically intercept lethal magical attacks meant for allies, absorb the spell-energy into your body as volatile Silence Resonance, then violently detonate the radiation back at the enemy. You are a magical sponge that reflects destruction.

**The cost**: Holding unspent Resonance burns you from the inside  -  melting your maximum HP and dealing internal blight damage each round you fail to purge it. Your hyper-specialized refraction armor leaves you catastrophically vulnerable to mundane physical strikes  -  a single swing of an executioner's axe can shatter your brittle shell.

**Bring one for**: The ultimate magical shield  -  no other class can step in front of a spell meant for an ally, absorb its full force into their own body, and throw it back at the caster with interest.`,
  },

  description: `A spellguard absorbs magic into their own flesh. Not as a trick or a technique, but as the foundational act of a tradition born at the moment the sun was buried.`,

  roleplayIdentity: {
   title: "Roleplay Identity",
   content: `**HISTORY: THE GENESIS**
The spellguard's aetheric aegis was forged during the binding of Aex in the volcanic calderas of <LoreLink termId="sundale">Sundale</LoreLink>. An arcanist named **Damon** absorbed the explosive backdraft to prevent his lords from being vaporized during the solar binding. The price of this high-risk shield was vascular scarring. Damon's hands blistered, and his veins hummed with volatile energy, leaving him raw to the touch.

**CITIES & CIVIL RECEPTION**
Spellguards are given places of honor as elite guards in the Canopy-Ledger of Atropolis and the keep of <LoreLink termId="greymark_keep">Greymark Keep</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="neth">Velun Neth</LoreLink> and the Thalren humans.

**NOTABLE FIGURES**
* **Damon the Iron-Handed**: The legendary blacksmith whose shield absorbed the first flares of the dying sun.
* **Elysia Silver-Vein**: A Velun Neth sentinel who stabilized the barrier chambers during the first Breach.`
  },

  signatureQuote: {
   text: '"The solar flare hit my shield, not my face. The radiation entered my veins, not my lord\'s. That is the job. You stand between the apocalypse and the people you are paid to protect, and you do not flinch."',
   speaker: 'Damon the Iron-Handed',
   context: 'His account of the solar binding, recorded by a Scribe-Sentinel'
  },

  philosophy: {
   coreTenet: 'Magic is a poison that must be filtered through a willing vessel. The Spellguard does not stop magic, they absorb it, contain it, and convert it into a form that can be safely released. They are the filter between arcane catastrophe and the people who would be destroyed by it.',
   relationship: 'A Spellguard\'s power comes from their unique biology, a vascular system permanently scarred by absorbed magical radiation. The scars are not damage; they are adaptive tissue. Every spell absorbed creates new pathways for future absorption. The body learns to process magic the way a liver learns to process alcohol. This is why Spellguards cannot stop, the moment they stop absorbing, the accumulated radiation begins to break down the adaptive tissue, and they lose their protection.',
   paradox: 'The Spellguard is immune to magic, and utterly vulnerable to everything else. Their specialized refraction plates, designed to channel arcane energy safely, are brittle against physical force. A blade can kill them. A fall can kill them. A single, well-aimed arrow can kill them. They are the ultimate defense against wizards and the easiest target for anyone with a crossbow. They must rely on their allies to protect them from the mundane threats so they can protect their allies from the magical ones.'
  },

  currentCrisis: `The ambient magic levels are rising, and the Spellguards cannot keep up. For centuries, the background radiation of the world\'s magic was low enough that Spellguards could absorb occasional spikes and vent the excess. But with the Wyrd bleeding faster and the Sundered Monoliths cracking, the ambient magic level has increased sharply.

Spellguards are reporting that their Silence Resonance is filling faster than they can purge it. Some are entering a state of "Arcane Saturation", their bodies cannot process the incoming magic fast enough, and they are suffering spontaneous Radiation Bursts that harm everyone nearby. For the first time, some Spellguards are retiring voluntarily, choosing to face the withdrawal symptoms rather than risk becoming bombs. The remaining active Spellguards are stretched thin, and a single catastrophic failure could devastate a settlement.`,

  meaningfulTradeoffs: `To be a Spellguard is to glow. The absorbed magic in their veins emits a faint, visible light, a pale blue luminescence visible through the skin. Spellguards cannot hide in darkness. Cannot surprise anyone. Cannot pass unnoticed through a crowd. They are always visible, always identifiable, always the first target. Children in some settlements play a game called "find the glow", they hide from the Spellguard, who must find them using their superior radiation sense. The Spellguard always finds them. That is the problem.`,

  classSpecificLocations: [
   {
    name: 'The Deflection Halls',
    locationId: 'greymark-keep',
    description: 'A series of stone chambers beneath Greymark Keep, reinforced with lead-lined walls, where Spellguards train by absorbing controlled bursts of magical energy. The training chambers are marked by scorch patterns, residual evidence of thousands of absorbed spells. The newest chamber, built for the current crisis, is already showing signs of structural fatigue.',
    purpose: 'Training facility and radiation detox center',
    status: 'Active, operating at maximum capacity'
   }
  ],
  combatRole: {
   title: "Combat Role",
   content: `**Primary Role**: The ultimate magical sponge and reflector  -  the only class that intercepts lethal spells meant for allies, drinks the raw energy into its own flesh, and detonates it back at the caster.

**Strengths**:
- Exclusive magical interception: physically absorb spells aimed at allies and store the energy as Silence Resonance
- Reflect/repurpose: vent stored resonance as devastating return-fire or as barriers
- Hard counter to enemy casters  -  the more magic thrown at the party, the more dangerous you become
- Prismatic barriers and refraction can shelter allies from an arcane assault

**Weaknesses**:
- Kinetic Fragility: +50% bludgeoning and physical damage  -  a mundane axe, mace, or crossbow bolt is your hard counter; any martial flanker shreds you.
- Arcane Radiation: holding unspent Silence Resonance burns your max HP and deals blight every round you fail to purge it  -  vent or melt.
- Purge or Pop: silenced, CC'd, or denied a target, the resonance builds to a spontaneous Radiation Burst that harms everyone nearby, allies included.
- Anti-Mage, Not Anti-Steel: built to eat magic, not weapons  -  a fight with no casters leaves you a fragile liability.
- Glowing (social): absorbed magic emits pale blue light through your skin  -  you cannot hide, sneak, or pass unnoticed; you are always visible, always identifiable, always the first target for a sniper.
- Reliant on Allies: you need your party to handle mundane threats so you can handle the magical ones  -  isolated, you are a glowing, brittle mark.`
  },
 },

  // Resource System
 resourceSystem: {
  title: "Silence Resonance & Arcane Radiation",
  subtitle: "The Anatomy of a Meltdown",

  description: `You are a living silence-battery. Incoming magical damage does not harm your exterior,it is pulled inside you, converting into **Silence Resonance** (tracked as AEP). However, this energy is highly radioactive.

**The Resource Mechanics**:
- **Silence Resonance (AEP 0-100)**: Generated by absorbing spells, intercepting magic, or ripping mana from targets using *Silence Siphon*. 
- **Arcane Radiation**: If you end your round with unspent Silence Resonance, you suffer internal burns. You take blight damage equal to (Resonance / 10), rounded down. Your maximum HP is reduced by this same amount until you complete a long rest.
- **Physical Fragility**: Your body is a specialized magical sponge. You suffer a permanent +50% vulnerability to all Bludgeoning and Physical damage.`,

  cards: [
   {
    title: "Silence Resonance (AEP)",
    stats: "0-100 Capacity",
    details:
     "The volatile fuel. Generates when you absorb magic or siphon mana. Used to power your devastating purges and shields.",
   },
   {
    title: "Arcane Radiation",
    stats: "End of Round Strain",
    details:
     "Unspent Resonance / 10 = Blight Damage and Max HP Reduction. You must continuously purge the energy to survive.",
   },
   {
    title: "Physical Fragility",
    stats: "+50% Vulnerability",
    details:
     "Catastrophically weak to Bludgeoning and Slashing. Kinetic trauma shatters your silence-glass bones.",
   },
  ],

  generationTable: {
   headers: ["Action", "Resonance Change", "The Toll"],
   rows: [
    ["Absorb Magical Damage", "+1 per damage", "Energy fills your lungs"],
     ["Silence Siphon (Melee)", "+15 Resonance", "Siphoning magic from their veins"],
    ["Agonizing Intercept", "Absorb Ally's Damage", "Internal temperature spikes"],
    ["Violent Purge", "-All Resonance", "Radiation clears, flesh cools"],
   ],
  },

  usage: {
   momentum:
    "Absorb enemy spells to fill your Resonance, but immediately look for a way to purge it. Do not let the radiation fester in your body.",
   flourish:
    "When ambushed by physical attackers, use 'Refract Kinetic' to harden your shell, even though it spikes your internal necrotic strain.",
  },

  overheatRules: {
   title: "Critical Meltdown (100 Resonance)",
   content: `If you reach exactly 100 Silence Resonance, your containment fails completely.
1. **The Rupture**: You instantly explode, dealing 10d6 storm damage to ALL creatures within 30 feet (including allies).
2. **The Burnout**: You are reduced to 1 HP, your maximum HP is halved, and you are incapacitated for 1 round.
3. **The Reset**: Your Resonance resets to 0. You must never let the reactor breach.`,
  },

  strategicConsiderations: {
   title: "The Kinetic Death Sentence",
   content: `Do not try to tank physical monsters. A giant with a club is your hard counter. If a creature deals heavy bludgeoning or physical damage, you will melt instantly due to your +50% vulnerability. Fall back and let a dedicated tank or the Berserker handle the meat,you are here for the magic.`,
  },

  playingInPerson: {
   title: "Physical Radiation Trackers",
   subtitle: "The Glowing Cores",
   content: `Use the following physical props to track the agony:
- **Resonance Dial**: A d100 (tens and ones die) to track your current Silence Resonance.
- **Black Tokens**: Place a black token on your character sheet every time your max HP drops from Arcane Radiation.
- **The Meltdown Warning**: If your dial crosses 80, stand your miniature up on a red base to warn the party of an imminent explosion.`,
  },
 },

 specializations: {
  title: "Radiation Protocols",
  subtitle: "Three Methods of Containing the Apocalypse",

  description: `Spellguards must choose how their body processes the lethal radiation of Silence Resonance.`,

  sharedPassive: {
   name: "Brittle Kinetic Shell",
   icon: "Slashing/Crushing Blow",
   description:
    "Your silence-glass plating repels magic but shatters under physical trauma. You have +50% vulnerability to all Bludgeoning and Physical damage.",
  },

  specs: [
   { id : "arcane_warden",
     name: "Silence-Scarred Bastion",
    icon: "Force/Force Field",
    color: "#1E3A8A",
    theme: "Maximum Containment",

    description: `**The flesh is a vault. Lock the radiation inside.**
    
Bastions focus entirely on intercepting damage meant for their allies, converting their own body into a localized black hole for enemy magic. They generate Resonance faster and endure the radiation longer.`,

    playstyle:
     "Heavy ally protection, spell interception, delayed detonation",

    strengths: [
     "Generates 1.5x Resonance from absorbed magic",
     "Can intercept spells from greater distances",
     "Radiation damage is delayed by 1 round",
    ],

    weaknesses: [
     "Lowest personal damage output",
     "Incredibly reliant on healers to fix radiation burns",
     "When they finally purge, it hits allies too",
    ],

    passiveAbility: {
     name: "Lead-Lined Ribcage",
     icon: "Force/Force Field",
     description:
      "You generate 1.5x Resonance from absorbed magical damage. The blight damage from Arcane Radiation is halved, though the max HP reduction remains full.",
    },

    keyAbilities: [
     "Gravity Well, Pull all magical projectiles in a 40ft radius into your own chest.",
     "Stasis Lock, Freeze your own blood to temporarily ignore Arcane Radiation.",
    ],

    recommendedFor:
     "Players who want to play the ultimate sacrificial protector, literally jumping on magical grenades.",
   },

   { id : "spell_breaker",
    name: "Entropic Eraser",
    icon: "Arcane/Magical Cross Emblem 2",
    color: "#4C1D95",
    theme: "Violent Refraction",

    description: `**Do not hold the poison. Expel it back.**
    
Erasers specialize in bouncing magic back before it can fully settle in their lungs. They focus on precise reflections, treating enemy casters like mirrors.`,

    playstyle:
     "High-risk reflections, anti-mage dueling, rapid purging",

    strengths: [
     "Reflected spells deal 125% damage",
     "Can counterspell with pure force",
     "Excellent at shutting down single high-value targets",
    ],

    weaknesses: [
     "Struggles against AoE magic",
     "Requires perfect reaction timing",
     "Highly susceptible to physical ambushes while reflecting",
    ],

    passiveAbility: {
     name: "Shattered Mirror Plating",
     icon: "Arcane/Magical Cross Emblem 2",
     description:
      "Successfully reflecting a spell immediately purges 20 Silence Resonance and restores 1d8 HP.",
    },

    keyAbilities: [
      "Silence Refraction, Reflect a spell, but the physical strain scorches your vision.",
     "Mirror's Edge, Shatter your Silence-armor to unleash a flurry of reflective shards.",
    ],

    recommendedFor:
     "Players who want to punish enemy casters by turning their own apocalyptic spells against them.",
   },

   { id : "mana_reaver",
    name: "Leyline Devourer",
    icon: "Necrotic/Drain Soul",
    color: "#581C87",
    theme: "Vampiric Starvation",

    description: `**If they will not cast, we will rip it from their veins.**
    
Devourers do not wait to be hit. They aggressively charge enemy casters, physically tearing the mana from their bodies and converting it into devastating localized explosions.`,

    playstyle:
     "Aggressive melee anti-mage, mana starvation, constant purging",

    strengths: [
     "Drains 2x mana on all melee attacks",
     "Does not need enemy spells to generate Resonance",
     "Incredible single-target lockdown",
    ],

    weaknesses: [
     "Must remain in melee range, exposing them to physical attacks",
     "Self-inflicts heavy blight damage to fuel attacks",
     "Zero long-range presence",
    ],

    passiveAbility: {
      name: "Starving Silence",
     icon: "Necrotic/Drain Soul",
     description:
      "Your melee attacks drain 2d4 mana instead of 1d4. If a target has 0 mana, you instead drain their maximum HP.",
    },

    keyAbilities: [
     "Sunder Leyline, A devastating strike that cripples the target's ability to cast spells.",
     "Black Hole Collapse, Consume the mana of everyone in the room, creating a singularity.",
    ],

    recommendedFor:
     "Players who want to aggressively hunt and execute enemy spellcasters before they can even chant a spell.",
   },
  ],
 },

 // ========================================
 // SPELLGUARD SPELLS
 // ========================================
 exampleSpells: [
  // ========================================
  // PASSIVES (LEVEL 1)
  // ========================================
  { id : "spellguard_arcane_radiation",
   name: "Arcane Radiation",
   description:
    "The magic you absorb is radioactive poison. At the end of your round, if you hold unspent Silence Resonance, you take blight damage equal to (Resonance / 10), rounded down. Your maximum HP is permanently reduced by this same amount until you complete a long rest.",
   level: 1,
   spellType: "PASSIVE",
   icon: "Necrotic/Necrotic Decay 1",
   effectTypes: ["passive"],
   typeConfig: {
    school: "blight",
    icon: "Necrotic/Necrotic Decay 1",
    tags: ["passive", "weakness", "radiation"],
   },
   targetingConfig: { targetingType: "self" },
   resourceCost: { actionPoints: 0, mana: 0 },
   resolution: "AUTOMATIC",
   tags: ["passive", "spellguard", "weakness"],
  },
  { id : "spellguard_kinetic_fragility",
   name: "Brittle Kinetic Shell",
   description:
    "Your silence-glass plating and flesh are hyper-specialized to absorb energy, rendering you catastrophically vulnerable to physical trauma. You suffer a permanent +50% vulnerability to all Bludgeoning and Physical damage.",
   level: 1,
   spellType: "PASSIVE",
   icon: "Slashing/Crushing Blow",
   effectTypes: ["passive"],
   typeConfig: {
    school: "physical",
    icon: "Slashing/Crushing Blow",
    tags: ["passive", "weakness", "vulnerability"],
   },
   targetingConfig: { targetingType: "self" },
   resourceCost: { actionPoints: 0, mana: 0 },
   resolution: "AUTOMATIC",
   tags: ["passive", "spellguard", "weakness"],
  },

  // ========================================
  // LEVEL 1 SPELLS
  // ========================================
  { id : "sg_void_siphon",
    name: "Silence Siphon",
   description:
    "A brutal melee strike that physically rips raw magic out of the target. Deals 1d8 physical and 1d8 storm damage. If the target is a spellcaster, they lose 2d4 mana. Generates +15 Silence Resonance as the raw magic enters your bloodstream.",
   level: 1,
   spellType: "ACTION",
   icon: "Necrotic/Drain Soul",
   effectTypes: ["damage", "utility"],

   typeConfig: {
    school: "storm",
    secondaryElement: "storm",
    icon: "Necrotic/Drain Soul",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "single",
    rangeType: "melee",
    rangeDistance: 5,
    targetRestrictions: ["enemies"],
   },

   resourceCost: {
    actionPoints: 1,
    mana: 4,
    classResource: {
     type: "arcane_energy_points",
     cost: -15, 
    },
    components: ["somatic"],
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

   resolution: "DICE",

   damageConfig: {
    formula: "1d8 + 1d8",
    damageTypes: ["physical", "storm"],
    resolution: "DICE",
   },

   utilityConfig: {
    utilityType: "resource_drain",
    selectedEffects: [
     { id : "mana_tear",
      name: "Mana Tear",
      description: "Target loses 2d4 mana. You generate 15 Silence Resonance.",
     },
    ],
   },

   tags: ["melee", "drain", "resonance generation", "spellguard"],
  },

  { id : "sg_entropic_aegis",
   name: "Entropic Aegis",
   description:
    "Shards of volatile silence crystal erupt from your skin, forming a barrier that absorbs 4d8 damage for 1 minute. Every time the shield absorbs damage, it generates 2 Silence Resonance as the magic leaks into you. If shattered by a kinetic attack, it detonates inwardly, dealing 2d6 physical damage to you.",
   level: 1,
   spellType: "ACTION",
   icon: "Force/Force Field",
   effectTypes: ["buff"],

   typeConfig: {
    school: "storm",
    icon: "Force/Force Field",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "self",
    rangeType: "self",
   },

   resourceCost: {
    actionPoints: 1,
    mana: 4,
    classResource: {
     type: "arcane_energy_points",
     cost: 10,
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

   resolution: "AUTOMATIC",

   buffConfig: {
    buffType: "damageMitigation",
    effects: [
     { id : "void_barrier",
       name: "Silence Barrier",
      description:
       "Absorbs 4d8 damage. Generates 2 Resonance per hit absorbed. Self-inflicts 2d6 slashing if broken by physical attacks.",
      mechanicsText: "Absorb 4d8",
     },
    ],
    durationValue: 1,
    durationType: "minutes",
    durationUnit: "minutes",
   },

   tags: ["shield", "defense", "spellguard"],
  },

  { id : "sg_refract_kinetic",
   name: "Refract Kinetic",
   description:
    "A desperate survival technique. You harden your physical shell by channeling radiation into your bones. For 1 round, your +50% physical vulnerability is suppressed, and you gain +2 DR. However, the internal friction deals 1d4 blight damage to you instantly.",
   level: 1,
   spellType: "ACTION",
   icon: "Slashing/Crushing Blow",
   effectTypes: ["buff", "damage"],

   typeConfig: {
    school: "blight",
    icon: "Slashing/Crushing Blow",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "self",
    rangeType: "self",
   },

   resourceCost: {
    actionPoints: 1,
    mana: 6,
    classResource: {
     type: "arcane_energy_points",
     cost: 10,
    },
    components: ["somatic"],
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

   resolution: "AUTOMATIC",

   buffConfig: {
    buffType: "statModifier",
    effects: [
     { id : "kinetic_hardening",
      name: "Kinetic Hardening",
      description: "Suppresses physical vulnerability and grants +2 DR.",
      mechanicsText: "+2 DR",
     },
    ],
    durationValue: 1,
    durationType: "rounds",
    durationUnit: "rounds",
   },
   
   damageConfig: {
    formula: "1d4",
    damageTypes: ["blight"],
    resolution: "AUTOMATIC",
   },

   tags: ["defense", "survival", "self damage", "spellguard"],
  },

  { id : "sg_leyline_rift",
   name: "Leyline Rift",
   description:
    "Tear through the spatial leylines to instantly teleport up to 30 feet to an enemy caster. The violent transition generates +10 Silence Resonance, but the friction rips your flesh, dealing 1d6 blight damage to yourself.",
   level: 1,
   spellType: "ACTION",
   icon: "Force/Explosion Burst",
   effectTypes: ["utility", "damage"],

   typeConfig: {
    school: "arcane",
    icon: "Force/Explosion Burst",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "single",
    rangeType: "ranged",
    rangeDistance: 30,
    targetRestrictions: ["enemies"],
   },

   resourceCost: {
    actionPoints: 1,
    mana: 4,
    classResource: {
     type: "arcane_energy_points",
     cost: -10,
    },
    components: ["verbal"],
   verbalText: "Spellguard!",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

   resolution: "AUTOMATIC",

   utilityConfig: {
    utilityType: "movement",
    selectedEffects: [
     { id : "spatial_tear",
      name: "Spatial Tear",
      description: "Teleport adjacent to target enemy.",
     },
    ],
   },
   
   damageConfig: {
    formula: "1d6",
    damageTypes: ["blight"],
    resolution: "AUTOMATIC",
   },

   tags: ["mobility", "teleport", "self damage", "spellguard"],
  },

  // ========================================
  // LEVEL 2 SPELLS
  // ========================================
  { id : "sg_agonizing_intercept",
    name: "Silence Intercept",
   description:
    "When an ally within 15 feet is targeted by a spell, you instantly leap into its path, becoming the new target. The magical impact is fully absorbed into your body, generating Silence Resonance equal to the damage it would have dealt. The intense radiation feedback scorches your vision, blinding you until the end of your next turn.",
   level: 2,
   spellType: "REACTION",
   icon: "Force/Force Field",
   effectTypes: ["utility", "debuff"],

   typeConfig: {
    school: "storm",
    icon: "Force/Force Field",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "single",
    rangeType: "ranged",
    rangeDistance: 15,
    targetRestrictions: ["allies"],
   },

   resourceCost: {
    actionPoints: 1,
    mana: 6,
    classResource: {
     type: "arcane_energy_points",
     cost: 0,
    },
    components: ["somatic"],
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

   resolution: "AUTOMATIC",

   utilityConfig: {
    utilityType: "protection",
    selectedEffects: [
     { id : "spell_magnet",
      name: "Spell Magnet",
      description: "Intercept spell targeting ally. Absorb its damage as Silence Resonance.",
     },
    ],
   },
   
   debuffConfig: {
    debuffType: "statusEffect",
    effects: [
     { id : "strain_blindness",
      name: "Strain Blindness",
      description: "You are blinded by the radiation feedback.",
      mechanicsText: "Blinded",
     },
    ],
    statusEffects: [{ id : "blinded", level: 1 }],
    durationValue: 1,
    durationType: "rounds",
    durationUnit: "rounds",
   },

   tags: ["reaction", "interception", "spellguard"],
  },

  { id : "sg_shattered_mirror_ward",
   name: "Shattered Mirror Ward",
   description:
    "Raise an agonizing barrier of spatial refraction. When targeted by a spell, reflect it back at the caster for 100% damage. The violent refraction inflicts internal burns, dealing 1d8 blight damage to your own organs.",
   level: 2,
   spellType: "REACTION",
   icon: "Arcane/Magical Cross Emblem 2",
   effectTypes: ["utility", "damage"],

   typeConfig: {
    school: "arcane",
    icon: "Arcane/Magical Cross Emblem 2",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "self",
    rangeType: "self",
   },

   resourceCost: {
    actionPoints: 1,
    mana: 6,
    classResource: {
     type: "arcane_energy_points",
     cost: 15,
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

   resolution: "AUTOMATIC",

   utilityConfig: {
    utilityType: "protection",
    selectedEffects: [
     { id : "mirror_refract",
      name: "Mirror Refraction",
      description: "Reflect incoming spell back at the caster (100% damage).",
     },
    ],
   },
   
   damageConfig: {
    formula: "1d8",
    damageTypes: ["blight"],
    resolution: "AUTOMATIC",
   },

   tags: ["reaction", "reflection", "self damage", "spellguard"],
  },

  // ========================================
  // LEVEL 3 SPELLS
  // ========================================
  { id : "sg_warding_ribcage",
   name: "Warding Ribcage",
   description:
    "Call forth spectral, radioactive rib-like structures to encase allies within 15 feet. Grants a shield absorbing 4d6 damage. Every time an ally's shield absorbs damage, you take 2 blight damage from the feedback link, but gain 2 Silence Resonance.",
   level: 3,
   spellType: "ACTION",
   icon: "Necrotic/Drain Soul",
   effectTypes: ["buff"],

   typeConfig: {
    school: "storm",
    icon: "Necrotic/Drain Soul",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "area",
    rangeType: "self_centered",
    areaShape: "circle",
    areaSize: 15,
    targetRestrictions: ["allies"],
   },

   resourceCost: {
    actionPoints: 1,
    mana: 10,
    classResource: {
     type: "arcane_energy_points",
     cost: 20,
    },
    components: ["verbal", "somatic", "material"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

   resolution: "AUTOMATIC",

   buffConfig: {
    buffType: "damageMitigation",
    effects: [
     { id : "ribcage_shield",
      name: "Ribcage Shield",
      description: "Absorbs 4d6 damage. Spellguard takes 2 blight damage and gains 2 Resonance per hit.",
      mechanicsText: "Absorb 4d6",
     },
    ],
    durationValue: 1,
    durationType: "minutes",
    durationUnit: "minutes",
   },

   tags: ["aoe", "shield", "feedback", "spellguard"],
  },

  { id : "sg_void_suppression",
    name: "Silence Suppression",
   description:
     "Instantly choke a spell at its source by filling the target's lungs with silence ash. Force an Intelligence save. On fail, their spell is countered, and you absorb Resonance equal to the spell's level � 10.",
   level: 3,
   spellType: "REACTION",
   icon: "Arcane/Magical Cross Emblem 2",
   effectTypes: ["utility", "control"],

   typeConfig: {
    school: "blight",
    icon: "Arcane/Magical Cross Emblem 2",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "single",
    rangeType: "ranged",
    rangeDistance: 60,
    targetRestrictions: ["enemies"],
   },

   resourceCost: {
    actionPoints: 1,
    mana: 10,
    classResource: {
     type: "arcane_energy_points",
     cost: 15,
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

   resolution: "SAVE",

   utilityConfig: {
    utilityType: "disruption",
    selectedEffects: [
     { id : "counter_spell",
      name: "Counter Spell",
      description: "Interrupt target's spell casting.",
     },
    ],
   },
   
   controlConfig: {
    controlType: "silence",
    effects: [
     { id : "lung_ash",
      name: "Ash in Lungs",
      description: "Spell countered on failed save.",
     },
    ],
    savingThrow: {
     ability: "intelligence",
     difficultyClass: 14,
     saveOutcome: "negates",
    },
    duration: 0,
    durationUnit: "instant",
   },

   tags: ["reaction", "counterspell", "spellguard"],
  },

  // ========================================
  // LEVEL 4 SPELLS
  // ========================================
  { id : "sg_entropic_supernova",
   name: "Entropic Supernova",
   description:
    "A devastating purge of radiation. Unleash a blinding eruption of stored energy, dealing 6d8 storm damage to all enemies in a 20-foot radius (Agility save for half). Enemies who fail their save are blinded by silence radiation for 1 round.",
   level: 4,
   spellType: "ACTION",
   icon: "Force/Explosion Burst",
   effectTypes: ["damage", "debuff"],

   typeConfig: {
    school: "storm",
    icon: "Force/Explosion Burst",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "area",
    rangeType: "self_centered",
    areaShape: "circle",
    areaSize: 20,
    targetRestrictions: ["enemies"],
   },

   resourceCost: {
    actionPoints: 1,
    mana: 14,
    classResource: {
     type: "arcane_energy_points",
     cost: 40,
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

   resolution: "SAVE",

   damageConfig: {
    formula: "6d8",
    damageTypes: ["storm"],
    resolution: "SAVE",
    savingThrow: {
     ability: "agility",
     difficultyClass: 15,
     saveOutcome: "half_damage",
    },
   },

   debuffConfig: {
    debuffType: "statusEffect",
    effects: [
     { id : "supernova_blind",
      name: "Radiation Blindness",
      description: "Blinded by the violent purge.",
      mechanicsText: "Blinded",
     },
    ],
    statusEffects: [{ id : "blinded", level: 1 }],
    durationValue: 1,
    durationType: "rounds",
    durationUnit: "rounds",
   },

   tags: ["aoe", "purge", "detonation", "spellguard"],
  },

  // ========================================
  // LEVEL 5 SPELLS
  // ========================================
  { id : "sg_tomb_of_the_aegis",
   name: "Tomb of the Aegis",
   description:
    "Encase yourself in a solid tomb of blackened silence crystal. You gain complete immunity to all damage and effects for 1 round, but cannot act. At the start of your next turn, the tomb violently shatters, dealing 4d6 physical damage to you and all adjacent creatures.",
   level: 5,
   spellType: "ACTION",
   icon: "Force/Force Field",
   effectTypes: ["buff", "damage"],

   typeConfig: {
    school: "storm",
    icon: "Force/Force Field",
    castTime: 1,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "self",
    rangeType: "self",
   },

   resourceCost: {
    actionPoints: 1,
    mana: 18,
    classResource: {
     type: "arcane_energy_points",
     cost: 50,
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

   resolution: "AUTOMATIC",

   buffConfig: {
    buffType: "invulnerability",
    effects: [
     { id : "void_tomb",
       name: "Silence Tomb",
      description: "Immune to all damage and effects. Cannot take actions.",
      mechanicsText: "Invulnerability",
     },
    ],
    durationValue: 1,
    durationType: "rounds",
    durationUnit: "rounds",
   },
   
   damageConfig: {
    formula: "4d6",
    damageTypes: ["physical"],
    resolution: "AUTOMATIC",
   },

   tags: ["defense", "immunity", "self damage", "spellguard"],
  },
  
  { id : "sg_violent_purge",
   name: "Violent Purge",
   description:
    "A cataclysmic blast of arcane radiation to save your own life from a meltdown. Expel ALL your Silence Resonance (minimum 30 required). Deals storm damage equal to (Silence Resonance � 1.5) to all creatures within 20 feet, including your allies.",
   level: 5,
   spellType: "ACTION",
   icon: "Force/Explosion Burst",
   effectTypes: ["damage"],

   typeConfig: {
    school: "storm",
    icon: "Force/Explosion Burst",
    castTime: 2,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "area",
    rangeType: "self_centered",
    areaShape: "circle",
    areaSize: 20,
    targetRestrictions: ["any"],
   },

   resourceCost: {
    actionPoints: 2,
    mana: 10,
    classResource: {
     type: "arcane_energy_points",
     cost: 100, 
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },

   resolution: "DICE",

   damageConfig: {
    formula: "AEP * 1.5",
    damageTypes: ["storm"],
    resolution: "DICE",
   },

   tags: ["ultimate", "purge", "aoe", "spellguard"],
  },

  // ========================================
  // LEVEL 6-10 SPELLS (Selected High-Tier Purges)
  // ========================================
  { id : "sg_leyline_blackout",
   name: "Leyline Blackout",
   description:
     "Absolute suppression of the dimensional leylines. Creates a 60-foot zone of oppressive gravity that suppresses all spells, magic items, and magical effects for 5 rounds. Casting this strains your vocal cords, silencing you for 1 minute.",
   level: 7,
   spellType: "ACTION",
   icon: "Void/Black Hole",
   effectTypes: ["utility", "debuff"],

   typeConfig: {
    school: "blight",
    icon: "Void/Black Hole",
    castTime: 2,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "area",
    rangeType: "self_centered",
    areaShape: "circle",
    areaSize: 60,
    targetRestrictions: ["any"],
   },

   resourceCost: {
    actionPoints: 2,
    mana: 26,
    classResource: {
     type: "arcane_energy_points",
     cost: 35,
    },
    components: ["verbal", "somatic"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

   resolution: "AUTOMATIC",

   utilityConfig: {
    utilityType: "environment",
    selectedEffects: [
     { id : "anti_magic_field",
      name: "Anti-Magic Field",
      description: "Suppresses all magic in the area.",
     },
    ],
   },
   
   debuffConfig: {
    debuffType: "statusEffect",
    effects: [
     { id : "torn_vocal_cords",
      name: "Torn Vocal Cords",
      description: "You are silenced by the immense physical strain.",
      mechanicsText: "Silenced",
     },
    ],
    statusEffects: [{ id : "silenced", level: 1 }],
    durationValue: 1,
    durationType: "minutes",
    durationUnit: "minutes",
   },

   tags: ["zone", "anti magic", "ultimate", "spellguard"],
  },

  { id : "sg_cosmic_unraveling",
   name: "Cosmic Unraveling",
   description:
    "Instantly end all magical phenomena on the battlefield, regardless of power level or origin. The sheer volume of magic consumed instantly puts you into Critical Meltdown, reducing you to 1 HP and shattering your armor.",
   level: 10,
   spellType: "ACTION",
   icon: "Void/Black Hole",
   effectTypes: ["utility", "damage"],

   typeConfig: {
    school: "blight",
    icon: "Void/Black Hole",
    castTime: 3,
    castTimeType: "IMMEDIATE",
   },

   targetingConfig: {
    targetingType: "area",
    rangeType: "self_centered",
    areaShape: "circle",
    areaSize: 200,
    targetRestrictions: ["any"],
   },

   resourceCost: {
    actionPoints: 3,
    mana: 40,
    classResource: {
     type: "arcane_energy_points",
     cost: 100,
    },
    components: ["verbal", "somatic", "material"],
   verbalText: "Spellguard!",
   somaticText: "Channel spellguard through gesture",
   },

   cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

   resolution: "AUTOMATIC",

   utilityConfig: {
    utilityType: "disruption",
    selectedEffects: [
     { id : "absolute_dispel",
      name: "Absolute Dispel",
      description: "Dispels EVERYTHING. No saves. No exceptions.",
     },
    ],
   },
   
   damageConfig: {
    formula: "Current_HP - 1",
    damageTypes: ["blight"],
    resolution: "AUTOMATIC",
   },

   tags: ["ultimate", "dispel", "suicide", "spellguard"],
  },

   {
    "id": "spellguard_aegis_beacon",
    "name": "Aegis Beacon",
    "description": "Tap your steel chest plate, causing your armor to gleam with a brilliant silver light. This projects a narrow beam of intense light that functions as a distress beacon or flashes to illuminate a dark cavern.",
    "level": 2,
    "spellType": "ACTION",
    "icon": "Radiant/Radiant Divinity",
    "typeConfig": {
     "school": "arcane",
     "icon": "Radiant/Radiant Divinity",
     "tags": [
      "utility",
      "roleplay",
      "spellguard"
     ],
     "castTime": 1,
     "castTimeType": "IMMEDIATE"
    },
    "targetingConfig": {
     "targetingType": "self",
     "rangeType": "self"
    },
    "resourceCost": {
     "actionPoints": 1,
     "resourceTypes": [
      "mana"
     ],
     "resourceValues": {
      "mana": 4
     },
     "components": [
      "somatic"
     ],
     "somaticText": "Tap your gauntlet firmly against your breastplate twice, a metallic chime ringing out"
    },
    "resolution": "NONE",
    "effectTypes": [
     "utility"
    ],
    "utilityConfig": {
     "utilityType": "conjuration",
     "selectedEffects": [
      {
       "id": "aegis_beacon_glow",
       "name": "Aegis Illumination",
       "description": "Your chest plate projects a 60-foot cone of bright silver light for 1 hour. It functions as a distress beacon visible up to 5 miles away in open air."
      }
     ],
     "duration": 1,
     "durationUnit": "hours",
     "concentration": false,
     "power": "minor"
    },
    "cooldownConfig": {
     "cooldownType": "turn_based",
     "cooldownValue": 0
    },
    "tags": [
     "utility",
     "roleplay",
     "spellguard"
    ]
   },
   // ===== NON-COMBAT / ARCANE-ABSORBENT UTILITY (the magic sponge, out of combat) =====
  {
   id: "spellguard_ley_reading",
   name: "Ley-Reading",
   description: "Open your scarred senses and read the magic in a place or object. For the duration you perceive active spells, enchantments, lingering spell-residue, magical traps, leylines, and the school and rough strength of each  -  glowing like heat-shimmer only you can see. Out of combat.",
   level: 1, spellType: "ACTION", icon: "Arcane/Spellcasting Aura",
   typeConfig: { school: "arcane", icon: "Arcane/Spellcasting Aura", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","detection","investigation","spellguard"] },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 3 }, components: ["somatic"], somaticText: "Press scarred palms together and let the old burns listen" },
   resolution: "NONE", effectTypes: ["utility"],
   utilityConfig: { utilityType: "perception", selectedEffects: [ { "id": "ley_reading_sight", "name": "Arcane Sight", "description": "For 10 minutes see active spells, enchantments, magical traps, residue, and leylines within 60 ft, plus each effect's school and rough strength.", "mechanicsText": "See magic/enchantments/traps/leylines + school/strength, 10 min." } ], duration: 10, durationUnit: "minutes", power: "minor" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   tags: ["utility","detection","investigation","spellguard"]
  },
  {
   id: "spellguard_aegis_ward",
   name: "Aegis-Ward",
   description: "Raise a tuned prismatic barrier over a doorway, threshold, object, or small area that drinks incoming spells the way you do  -  absorbing hostile magic and weak magical traps before they can pass. It does not stop steel or bodies, only spells, and it cracks once it has drunk its fill. Out of combat.",
   level: 1, spellType: "ACTION", icon: "Arcane/Ebon Blaze",
   typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", castTime: 10, castTimeType: "MINUTES", tags: ["utility","ward","exploration","rest","spellguard"] },
   targetingConfig: { targetingType: "area", rangeType: "touch", rangeDistance: 0, areaType: "circle", areaSize: 15 },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 6 }, components: ["verbal","somatic"], somaticText: "Lay a sheet of refraction across the threshold and hum it into tune" },
   resolution: "NONE", effectTypes: ["utility"],
   utilityConfig: { utilityType: "ward", selectedEffects: [ { "id": "aegis_ward_drink", "name": "Spell-Drinking Ward", "description": "A 15 ft barrier absorbs hostile spells and weak magical traps crossing it (disarming the trap) until it has drunk a set amount, then cracks. Does not bar physical objects or creatures.", "mechanicsText": "Barrier absorbs spells/disarms magic traps; not physical." } ], duration: 8, durationUnit: "hours", power: "moderate" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   tags: ["utility","ward","exploration","rest","spellguard"]
  },
  {
   id: "spellguard_resonance_discharge",
   name: "Resonance Discharge",
   description: "Dump stored Silence Resonance into a mechanism, magical lock, construct, or device  -  powering it, overloading it, forcing a jammed magical mechanism, or blasting open an arcane seal. Pure energetic fuel drawn straight from spells you have already eaten. Out of combat.",
   level: 2, spellType: "ACTION", icon: "Arcane/Spiral Vortex",
   typeConfig: { school: "arcane", icon: "Arcane/Spiral Vortex", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","investigation","spellguard"] },
   targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
   resourceCost: { actionPoints: 1, resourceTypes: [], resourceValues: {}, classResource: { type: "void_resonance", cost: 3 }, components: ["somatic"], somaticText: "Grip the mechanism and pour the eaten magic back out" },
   resolution: "AUTOMATIC", effectTypes: ["utility"],
   utilityConfig: { utilityType: "conjuration", selectedEffects: [ { "id": "resonance_discharge_fuel", "name": "Eaten Fuel", "description": "Power, overload, force, or blast one magical mechanism/lock/seal/construct using 3 stored Silence Resonance. Spend resonance you already absorbed  -  no mana cost.", "mechanicsText": "Power/overload a magical mechanism; costs 3 stored resonance." } ], power: "moderate" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   tags: ["utility","exploration","investigation","spellguard"]
  },
  {
   id: "spellguard_disenchant",
   name: "Disenchant",
   description: "Drain the magic out of an enchanted object into your own flesh  -  temporarily suppressing its enchantment (a magic trap goes inert, a ward drops, a cursed item sleeps, a glowing alarm dims) and feeding the spent power into you as Silence Resonance. The magic returns when you stop feeding on it. Out of combat.",
   level: 2, spellType: "ACTION", icon: "Arcane/Ebon Blaze",
   typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", castTime: 1, castTimeType: "MINUTES", tags: ["utility","investigation","exploration","spellguard"] },
   targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 8 }, components: ["somatic"], somaticText: "Clamp your scarred hand over the object and breathe its magic in" },
   resolution: "AUTOMATIC", effectTypes: ["utility"],
   utilityConfig: { utilityType: "protection", selectedEffects: [ { "id": "disenchant_drain", "name": "Magic Leeched", "description": "Suppress one object's enchantment for up to 10 minutes (magic trap inert, ward down, cursed item quiet, alarm dimmed); gain 1 Silence Resonance from the drained magic. Magic returns when the suppression ends.", "mechanicsText": "Suppress one object's enchantment 10 min; gain 1 resonance." } ], duration: 10, durationUnit: "minutes", power: "major" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   tags: ["utility","investigation","exploration","spellguard"]
  },
  {
   id: "spellguard_glow_lantern",
   name: "Glow-Lantern",
   description: "Let the magic in your veins surface as steady pale-blue light. Shape and brighten it to illuminate a 30 ft radius, or dampen it to a dim pulse (you can never go fully dark, but you can stop glowing like a beacon). The light is calm and carries a faint soothing quality against magically-induced dread. Out of combat.",
   level: 1, spellType: "ACTION", icon: "Arcane/Spellcasting Aura",
   typeConfig: { school: "arcane", icon: "Arcane/Spellcasting Aura", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","rest","spellguard"] },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 0, resourceTypes: [], resourceValues: {}, components: ["somatic"], somaticText: "Will the trapped light up under the skin, or push it back down" },
   resolution: "NONE", effectTypes: ["utility"],
   utilityConfig: { utilityType: "environment", selectedEffects: [ { "id": "glow_lantern_shape", "name": "Shaped Glow", "description": "Brighten your innate glow to steady 30 ft light, or dampen it to a dim pulse (never fully dark). The light grants advantage vs magically-induced fear/dread to those within it.", "mechanicsText": "Brighten/dampen innate glow (30 ft light); advantage vs magic fear." } ], duration: 1, durationUnit: "hours", power: "minor" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   tags: ["utility","exploration","rest","spellguard"]
  }
 ],
};
