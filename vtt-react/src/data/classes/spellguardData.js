import { UTILITY_SPELLS } from '../spells/utilitySpells';
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
      "korr_solari",
      "thrask_solari"
    ],
   "hardBlocks": [
     "myrathil",
     "ordan_human",
     "groven",
     "florae"
   ],
   "narrativeUnlock": true,
   "justification": "Requires access to Emberspire's volcanic forge-tradition and Sol's Breath's residual energy. The Nethien provide precise magical cancellation. Thalren provide anti-Wyrd paranoia."
 },

 /**
  * Subrace Variants, the Spellguard dismantles incoming magic, and how they dismantle
  * it depends on what tradition of "understanding magic" they inherited. The Nethien cancel
   * it legally. The Thalren defuse it like a Wyrd-trap. The Solari shield it like a
  * tomb-guard. The Solari intercept it like a forge-rupture.
  */
 
  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // Protective gear and weapon loadouts per canonical compendium.
  equipment: {
   weapons: ['sword', 'mace', 'warhammer'],
   protectiveGear: ['reinforced_cuirass', 'shield', 'heavy_plate'],
   offHand: ['shield', 'tome', 'orb']
  },
subraceVariants: {
  velun_neth: {
   subraceName: 'Nethien',
   title: 'The Clause-Canceller',
   reframe: `The <LoreLink termId="neth">Nethien</LoreLink> understand magic as *contract*, and a Spellguard among them cancels incoming spells by *drafting the annulment*, identifying the hostile magic's clause-structure and filing the counter-instrument before it lands. To a Nethien Spellguard, a fireball is just an aggressively-worded offer, and the correct response is a timely rejection on procedural grounds.`,
   signatureAbility: {
    name: 'Clause-Annulment',
    description: `Incoming spells are canceled through legal-inversion rather than raw absorption; the Spellguard files the annulment, and the magic fails on its own terms. The process is precise and low-radiation, the Nethien take on far less Arcane Energy Points (AEP) than absorbing variants, but fails entirely against magic with no clause-structure (wild Wyrd, primal forces).`
   },
   currentCrisisAngle: `The rising ambient magic is, to the Nethien, a *jurisdictional overload*, too many spells in the air, too many clauses to parse in real time. The Nethien Spellguards are the most radiation-resistant variant, but they are being drowned in paperwork: the annulments cannot be drafted fast enough to keep pace with a world whose magic level is spiking.`,
   signatureQuote: {
    text: '"Your fireball is poorly drafted. I have filed an objection. It will not arrive. The objection was sustained."',
    speaker: 'Canceller Vel-Ossar',
    context: 'A Nethien Spellguard, intercepting a court-mage\'s assault on procedural grounds'
   }
  },

  thalren_human: {
   subraceName: 'Thalren',
   title: 'The Wyrd-Defuser',
   reframe: `The <LoreLink termId="skald">Thalren</LoreLink> have spent nearly two centuries paranoid about the Wyrd’s intrusions, and a Spellguard among them defuses incoming magic the way a sapper defuses a trap, slowly, suspiciously, expecting a second trigger. The Thalren are the tradition's most *cautious* variant: they assume every spell has a backup, and they are usually right.`,
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

   korr_solari: {
    subraceName: 'Hollow-Solari - Thyrm',
   title: 'The Silent-Guard',
   reframe: `The <LoreLink termId="solari">Hollow-Solari</LoreLink> tend Sol's Breath in wordless silence, and a Spellguard among them intercepts magic from a state of <LoreLink termId="vault_breath">Vault-Breath</LoreLink> stillness, the same meditative suspension they use to tend the buried star. The Hollow-Solari are the tradition's *steadiest* variant: their interception happens in the gaps between heartbeats, in a stillness so absolute that incoming magic has nothing to push against.`,
   signatureAbility: {
    name: 'Silent-Intercept',
    description: `Magical interception is performed from a state of metabolic stillness, the Spellguard slows their own vitals to near-zero, becoming a silence that incoming magic *falls into* rather than strikes. The Hollow-Solari intercept with the least collateral damage and the quietest profile, but cannot intercept while moving.`
   },
   currentCrisisAngle: `The rising ambient magic makes stillness *unsafe*, the ambient radiation accumulates in a stationary body faster than a moving one, and the Hollow-Solari's Silent-Intercept is becoming a liability. The Hollow-Solari Spellguards, masters of stillness, are being forced to *move* for the first time in their tradition's history, and the movement is breaking their meditation.`,
   signatureQuote: {
    text: '"I caught magic by being the silence it fell into. Now the silence itself is radioactive, and I must move to survive. I have forgotten how to walk and guard at once."',
    speaker: 'Keeper Kor-Vesh the Still',
    context: 'A Hollow-Solari Spellguard, taking her first step mid-intercept in forty years of service'
   }
  },

  thrask_solari: {
    subraceName: 'Waste-Solari - Thyrm',
   title: 'The Forge-Shield',
   reframe: `The <LoreLink termId="solari">Waste-Solari</LoreLink>, badland rangers, intercept magic the way they intercept forge-ruptures in the field: practically, violently, on the move. The Waste-Solari are the tradition's *mobile* variant, deflecting and redirecting rather than absorbing, treating incoming magic as a thermal hazard to be angled away from the party rather than caught.`,
   signatureAbility: {
    name: 'Rupture-Deflection',
    description: `Incoming spells are deflected or redirected rather than absorbed, the Spellguard angles the magic away using alchemical shield-surfaces, the way a forge-ranger angles a thermal vent. The Waste-Solari take on the least Arcane Energy Points (AEP), but cannot fully neutralize a spell, only redirect it (sometimes back at the caster, sometimes into the terrain).`
   },
   currentCrisisAngle: `The rising ambient magic cannot be *deflected*, it is everywhere, ambient, with no vector to angle away. The Waste-Solari Forge-Shields, masters of redirection, are helpless against a hazard that has no direction. Several have begun abandoning deflection for desperate absorption, a technique they were never trained for, and the radiation sickness is spreading through the badland garrisons.`,
   signatureQuote: {
    text: '"I redirect what has a direction. This has no direction. I am a shield-wall against the weather. You cannot parry the sky."',
    speaker: 'Ranger Thrak-Vess',
    context: 'A Waste-Solari Spellguard, abandoning his shield-surface to absorb his first spell'
   }
  }
 },


 id : "spellguard",
  classResource: {
    type: "aep",
    base: 0,
    max: 100,
    generationNote: "Aetheric Energy Potential absorbed from hostile spells and magical impacts.",
    criticalThresholds: { meltdown: 100 },
    mechanicsNote: "At 100 AEP, a Meltdown triggers, violently venting raw arcane energy in a 30ft radius and damaging both allies and enemies."
  },
 name: "Spellguard",
 icon: "fas fa-shield-alt",
 role: "Silence-Scarred Aegis",
 damageTypes: ["arcane", "storm", "blight"],

 spellPools: {
  1: ["spg_aegis_ward", "sg_void_siphon", "sg_entropic_aegis", "sg_refract_kinetic", "sg_leyline_rift", "spellguard_ley_reading", "spellguard_aegis_ward", "spellguard_glow_lantern"],
  2: ["spg_spell_break", "sg_agonizing_intercept", "sg_shattered_mirror_ward", "spellguard_aegis_beacon", "spellguard_resonance_discharge", "spellguard_disenchant"],
  3: ["sg_warding_ribcage", "sg_void_suppression", "sg_containment_cycle", "sg_spell_riposte"],
  4: ["sg_kinetic_discharge", "sg_null_field_bastion", "sg_entropic_supernova", "sg_spellward_bond"],
  5: ["sg_radiation_quench", "sg_tomb_of_the_aegis", "sg_violent_purge", "sg_prism_cocoon"],
  6: ["sg_prismatic_mirror_bastion", "sg_anti_magic_shackle", "sg_kinetic_reversal", "sg_scrying_blackout"],
  7: ["sg_overload_shockwave", "sg_leyline_blackout", "sg_saturation_flush", "sg_entropy_lance"],
  8: ["sg_fortress_of_nullification", "sg_warding_verge", "sg_mirror_phalanx", "sg_ley_fracture_hammer"],
  9: ["sg_leyline_devourer_nova", "sg_void_anchor", "sg_resonance_bastion", "sg_devouring_grasp"],
  10: ["sg_singularity_aegis", "sg_cosmic_unraveling", "sg_criticality_halo", "sg_echo_exodus"],
 },

 livingOrder: {
  orderName: 'The Aegis',
  founder: {
   name: '<LoreLink termId="damon">Damon</LoreLink>',
       status: `Dead, four and a half centuries. The <LoreLink termId="solari">Solari</LoreLink> blacksmith who blocked a solar flare with an alchemical tower shield during Sol's entombment. His hands froze in rigid shielding posture; the shield is preserved in the <LoreLink termId="emberspire">Emberspire</LoreLink> forge-keeps, still faintly humming.`,
   note: `<LoreLink termId="damon">Damon</LoreLink> treated magical defense as engineering, not artistry. The Aegis still trains in his method: identify the spell's structure, dismantle it before it arrives, redirect the residue. His one unbreakable rule, *a Spellguard who absorbs what they cannot dismantle is a weapon pointed at their own line*, is now being violated daily.`
  },
  currentLeader: {
   name: '<LoreLink termId="thrak-damos">Bulwark-Captain Thrak-Damos</LoreLink>',
    title: 'Warden of the Silence-Scars',
   characterization: `A Waste-Solari veteran whose forearms are latticed with absorbed-magic scars that glow through his sleeves. He leads the Aegis from the forge-keeps and enforces <LoreLink termId="damon">Damon</LoreLink>'s method with drill-sergeant discipline. He is a pragmatist who is watching his entire engineering discipline fail against a threat, ambient magic with no structure, that <LoreLink termId="damon">Damon</LoreLink> never imagined.`
  },
  headquarters: { name: 'The Shield-Forge Keeps, Emberspire', locationId: 'emberspire' },
  crisisConnection: `<LoreLink termId="thrak-damos">Thrak-Damos</LoreLink> is watching the Aegis's foundational method collapse: ambient magic has no structure to dismantle, no vector to redirect. The Spellguards' Arcane Energy Points (AEP) are filling faster than they can purge, and the Arcane Saturation radiation-bursts are striking their own lines. He has begun ordering his Spellguards to *absorb*, <LoreLink termId="damon">Damon</LoreLink>'s forbidden technique, because there is nothing left to dismantle. The order that defined itself by precision is being reduced to a wall of sponges, and <LoreLink termId="thrak-damos">Thrak-Damos</LoreLink> considers this the death of his craft even if his Spellguards survive.`
 },

 worldFriction: [
    { region: 'bryngloom-forest', status: 'revered', consequence: 'Atropolis magistrates hire Spellguards as the premier defense against rogue covenant-weavers and eldritch breaches.', workaround: 'Register with the High Citadel Defense Council.' },
    { region: 'frostwood-reach', status: 'allied', consequence: 'Thalren sentinels station Spellguards on the Ironwood Palisade to catch and deflect aerial Wyrd projectiles.', workaround: 'Present sentinel military credentials.' },
    { region: 'sundale', status: 'honored', consequence: 'Solvan smiths prioritize forging rune-tower shields for Spellguards in exchange for anti-magic warding around star-forges.', workaround: 'None needed in artisan quarters.' },
    { region: 'emberspire', status: 'distrusted', consequence: 'Magma shamans fear that Spellguard refraction shields will siphon geothermal energy from thermal vents.', workaround: 'Keep shields grounded when traversing calderas.' }
  ],

  overview: {
   originStory: `A spellguard absorbs magic into their own flesh. Not as a trick or a technique, but as the foundational act of a tradition born at the moment the sun was buried.

The first was Damon, a Solari blacksmith working the forge-keeps during the Great Binding. When Sol was forced into the vault beneath Sundale, the dying star convulsed, a solar flare erupting through the caldera that would have incinerated every worker in the forge-levels. Damon raised an alchemical tower shield and took the flare directly. He was not desecrating Sol's light. He was shielding his fellow workers from a dying star's death-throes. What Damon absorbed was not sacred radiance but Sol's scream.

The solar energy permanently scarred his flesh and left his veins humming with volatile trapped mana. His hands froze in rigid shielding posture. He spent the rest of his life refining the principle: identify the structure of incoming magic, dismantle what can be dismantled, absorb what cannot, and redirect the rest. His unbreakable rule: "A spellguard who absorbs what they cannot dismantle is a weapon pointed at their own line."

Each subrace absorbs differently. The Nethien cancel spells through legal inversion, a fireball is an aggressively-worded offer, the response is rejection on procedural grounds. Lowest radiation intake, but fails against wild Wyrd with no structure. The Thalren defuse magic like a sapper defuses a trap, identifying trigger, payload, and failsafe, neutralizing each in sequence. Only method that reliably catches layered spells. The Solari absorb raw into flesh, practice-tested against Sol's Breath-scale eruptions. Most Resonance intake but can absorb the largest single bursts. The Hollow-Solari intercept from Vault-Breath stillness, becoming a silence that magic falls into. Steadiest but cannot move while intercepting. The Waste-Solari deflect and redirect, treating magic as thermal hazard to be angled away. Lowest Resonance but cannot fully neutralize.

Ambient magic levels are rising as the Wyrd bleeds faster. Spellguards fill with Arcane Energy Points (AEP) faster than they can purge. Some enter Arcane Saturation, spontaneous Radiation Bursts harming everyone nearby. The current leader, Bulwark-Captain Thrak-Damos, is ordering absorption, Damon's forbidden technique, because there is nothing left to dismantle.`,
  title: "The Spellguard",
  subtitle: "The Silence-Scarred Aegis",

  quickOverview: {
    title: "Class Overview",
    content: `**Who they are**: The Spellguard is an anti-magic juggernaut and living arcane lightning rod whose body is warded to devour enemy spells. You don't fear enemy mages—you step directly into their spell paths, absorb their magic into your own lungs, and detonate it back in their faces.

**The hook**: Your signature mechanic is **Spell Interception & Redirection**: you can catch incoming enemy spells, absorb their elemental damage into your warded aegis, and store the energy to fire back as weaponized arcane shockwaves.

**The resource bar & costs**: Your resource bar is **Arcane Energy Points (AEP)**, filled by absorbing enemy spells and channeling defensive wards. You vent AEP through explosive counter-attacks and prismatic barrier bursts. Holding max AEP too long causes internal radiation strain, forcing you to vent your power regularly.

**Bring one for**: The ultimate anti-caster tank, protecting your party from catastrophic magic and turning the enemy's biggest spells into your own greatest weapons.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: "Practitioners carry a profound cultural and physical responsibility, marked by their tradition's unique legacy and societal perceptions."
    },
    combatRole: {
      title: "Combat Role",
      content: "Radioactive anti-magic fortress who intercepts hostile spells, converts magical energy into AEP and Silence Resonance, and discharges kinetic shockwaves."
    },
    playstyle: {
      title: "Playstyle & Turn 1 Flow",
      content: "**Your Turn 1 in Combat**:\n1. **Deploy Fortress Shield**: Stand in front of the party with `Aegis Barrier` ready.\n2. **Absorb Incoming Magic**: Intercept hostile spells to charge your AEP and Silence Resonance pools.\n3. **Discharge Before Meltdown**: Vent stored energy into `Kinetic Discharge` or `Radiation Quench` before hitting 100 AEP."
    }
  },

  description: `A spellguard absorbs magic into their own flesh. Not as a trick or a technique, but as the foundational act of a tradition born at the moment the sun was buried.`,

  roleplayIdentity: {
   title: "Roleplay Identity",
   content: `**HISTORY: THE GENESIS**
The spellguard's aetheric aegis was forged during the entombment of Sol in the volcanic calderas of <LoreLink termId="sundale">Sundale</LoreLink>. An arcanist named **Damon** absorbed the explosive backdraft to prevent his lords from being vaporized during the solar binding. The price of this high-risk shield was vascular scarring. Damon's hands blistered, and his veins hummed with volatile energy, leaving him raw to the touch.

**CITIES & CIVIL RECEPTION**
Spellguards are given places of honor as elite guards in the Canopy-Ledger of Atropolis and the keep of <LoreLink termId="greymark_keep">Greymark Keep</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="neth">Nethien</LoreLink> and the Thalren humans.

**NOTABLE FIGURES**
* **Damon the Iron-Handed**: The legendary blacksmith whose shield absorbed the first flares of the dying sun.
* **Elysia Silver-Vein**: A Nethien sentinel who stabilized the barrier chambers during the first Breach.`
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

  currentCrisis: `The ambient magic levels are rising, and the Spellguards cannot keep up. For centuries, the background radiation of the world's magic was low enough that Spellguards could absorb occasional spikes and vent the excess. But with the Wyrd bleeding faster and the Sundered Monoliths cracking, the ambient magic level has increased sharply.

Spellguards are reporting that their Arcane Energy Points (AEP) are filling faster than they can purge it. Some are entering a state of "Arcane Saturation", their bodies cannot process the incoming magic fast enough, and they are suffering spontaneous Radiation Bursts that harm everyone nearby. For the first time, some Spellguards are retiring voluntarily, choosing to face the withdrawal symptoms rather than risk becoming bombs. The remaining active Spellguards are stretched thin, and a single catastrophic failure could devastate a settlement.`,

  meaningfulTradeoffs: `To be a Spellguard is to glow. The absorbed magic in their veins emits a faint, visible light, a pale blue luminescence visible through the skin. Spellguards cannot hide in darkness. Cannot surprise anyone. Cannot pass unnoticed through a crowd. They are always visible, always identifiable, always the first target. Children in some settlements play a game called "find the glow", they hide from the Spellguard, who must find them using their superior radiation sense. The Spellguard always finds them. That is the problem.`,

  classSpecificLocations: [
   {
    name: 'The Deflection Halls',
    locationId: 'greymark_keep',
    description: 'A series of stone chambers beneath Greymark Keep, reinforced with lead-lined walls, where Spellguards train by absorbing controlled bursts of magical energy. The training chambers are marked by scorch patterns, residual evidence of thousands of absorbed spells. The newest chamber, built for the current crisis, is already showing signs of structural fatigue.',
    purpose: 'Training facility and radiation detox center',
    status: 'Active, operating at maximum capacity'
    },
      {
     name: 'The Iron-Handed Shrine',
     locationId: 'iron_handed_shrine',
     description: 'A furnace shrine cut into the Harath-Vault\'s upper galleries, where Damon\'s shield is kept: a fist of slag fused to a length of forearm-bone, mounted on an anvil that has not been struck in two hundred years. Aegis recruits swear their first oath with both palms flat against the slag, and the Keepers of the Rule read Damon\'s First Rule aloud at every binding. They have stopped reading it this year; two galleries up, Thrak-Damos\'s standing order teaches recruits to absorb what cannot be dismantled, and the Keepers have not yet decided whether obedience is heresy or the Rule\'s last amendment.',
     purpose: 'Relic shrine and oath-site of the Aegis; where the tradition\'s founding rule is kept, and where it is quietly breaking',
     status: 'Active and divided, recruits swearing on the slag either way'
    },
    {
     name: 'The Dimming Yards',
     locationId: 'dimming_yards',
     description: 'A row of lead-walled cooling cells in the Vulkars\' Karst badlands, built where the wind can carry an unshielded burst away from anything that matters. Spellguards who have held too much Silence Resonance are sent here to dim: a cot, a bell, and a lamp-line painted around the cell. When the glow falls below the line, they are cleared to leave. The keepers are all retired Spellguards, the only people who can stand the radiance without masks, and they do not ask the oldest residents why the bells have stopped ringing. A surveyor\'s crew has been quietly staking out ground for new rows that no one has asked for.',
     purpose: 'Resonance quarantine and hospice; where the tradition\'s last discipline (vent or melt, but do it where the wind can take it) is practiced in silence',
     status: 'Active and expanding, against the keepers\' stated wishes'
    }
  ],
  combatRole: {
   title: "Combat Role",
   content: `**Primary Role**: The ultimate magical sponge and reflector  -  the only class that intercepts lethal spells meant for allies, drinks the raw energy into its own flesh, and detonates it back at the caster.

**Strengths**:
- Exclusive magical interception: physically absorb spells aimed at allies and store the energy as Arcane Energy Points (AEP)
- Reflect/repurpose: vent stored AEP as devastating return-fire or as barriers
- Hard counter to enemy casters  -  the more magic thrown at the party, the more dangerous you become
- Prismatic barriers and refraction can shelter allies from an arcane assault

**Weaknesses**:
- Kinetic Fragility: +50% smashing and slicing damage  -  a mundane axe, mace, or crossbow bolt is your hard counter; any martial flanker shreds you.
- Arcane Radiation: holding unspent Arcane Energy Points (AEP) burns your max HP and deals blight every round you fail to purge it  -  vent or melt.
- Purge or Pop: silenced, CC'd, or denied a target, the AEP builds to a spontaneous Radiation Burst that harms everyone nearby, allies included.
- Anti-Mage, Not Anti-Steel: built to eat magic, not weapons  -  a fight with no casters leaves you a fragile liability.
- Glowing (social): absorbed magic emits pale blue light through your skin  -  you cannot hide, sneak, or pass unnoticed; you are always visible, always identifiable, always the first target for a sniper.
- Reliant on Allies: you need your party to handle mundane threats so you can handle the magical ones  -  isolated, you are a glowing, brittle mark.`
  },

    playstyle: {
      title: "Playstyle & Turn 1 Flow",
      content: "**Your Turn 1 in Combat**:\n1. **Raise Arcane Bulwark**: Deploy `Aegis Barrier` or `Shield Bash` to position between enemy spellcasters and vulnerable allies.\n2. **Absorb Incoming Magic**: Take spell damage on purpose to build Arcane Energy Points (AEP) and Silence Resonance.\n3. **Discharge Kinetic Shockwaves**: Spend high AEP on explosive counter-strikes like `Kinetic Discharge` or `Radiation Quench` before reaching Critical Meltdown at 100 AEP."
    },
 },

  // Resource System
 resourceSystem: {
  title: "Resonance: The Spell Absorber",
  subtitle: "How Your Resource Works (Beginner's Guide)",

  description: `**1. What is it? (The Spell Absorber)**
Resonance (0–100) measures hostile magical energy captured and stored in your radioactive fortress shield.

**2. How do I build it?**
- Block or intercept hostile spells with your tower shield (+10 to +30 Resonance).
- Stand in enemy area-of-effect hazard fields to absorb raw magic (+10 per round).

**3. How do I spend it & what is the catch?**
- Discharge stored Resonance as concussive kinetic shockwaves, anti-magic fields, and party shielding.
- **The Catch (AEP Meltdown)**: If Resonance hits **100** without being vented, your shield suffers a containment breach, radiating dangerous feedback to adjacent creatures.`,

  cards: [
   {
    title: "Arcane Energy Points (AEP)",
    stats: "0-100 Capacity",
    details:
     "The volatile fuel. Generates when you absorb magic or siphon mana. Used to power your devastating purges and shields.",
   },
   {
    title: "Arcane Radiation",
    stats: "End of Round Strain",
    details:
     "Unspent AEP / 10 = Blight Damage and Max HP Reduction. You must continuously purge the energy to survive.",
   },
   {
    title: "Physical Fragility",
    stats: "+50% Vulnerability",
    details:
     "Catastrophically weak to smashing and slicing. Kinetic trauma shatters your silence-glass bones.",
   },
  ],

  generationTable: {
   headers: ["Action", "AEP Change", "The Toll"],
   rows: [
    ["Absorb Magical Damage", "+1 per damage", "Energy fills your lungs"],
     ["Silence Siphon (Melee)", "+15 AEP", "Siphoning magic from their veins"],
    ["Agonizing Intercept", "Absorb Ally's Damage", "Internal temperature spikes"],
    ["Violent Purge", "-All AEP", "Radiation clears, flesh cools"],
   ],
  },

  usage: {
   momentum:
    "Absorb enemy spells to fill your AEP, but immediately look for a way to purge it. Do not let the radiation fester in your body.",
   flourish:
    "When ambushed by physical attackers, use 'Refract Kinetic' to harden your shell, even though it spikes your internal blight strain.",
  },

  overheatRules: {
   title: "Critical Meltdown (100 AEP)",
   content: `If you reach exactly 100 Arcane Energy Points (AEP), your containment fails completely.
1. **The Rupture**: You instantly explode, dealing 10d6 storm damage to ALL creatures within 30 feet (including allies).
2. **The Burnout**: You are reduced to 1 HP, your maximum HP is halved, and you are incapacitated for 1 round.
3. **The Reset**: Your AEP resets to 0. You must never let the reactor breach.`,
  },

  strategicConsiderations: {
   title: "The Kinetic Death Sentence",
   content: `Do not try to tank physical monsters. A giant with a club is your hard counter. If a creature deals heavy smashing or slicing damage, you will melt instantly due to your +50% vulnerability. Fall back and let a dedicated tank or the Berserker handle the meat,you are here for the magic.`,
  },

  playingInPerson: {
   title: "Physical Radiation Trackers",
   subtitle: "The Glowing Cores",
   content: `Use the following physical props to track the agony:
- **AEP Dial**: A d100 (tens and ones die) to track your current Arcane Energy Points (AEP).
- **Black Tokens**: Place a black token on your character sheet every time your max HP drops from Arcane Radiation.
- **The Meltdown Warning**: If your dial crosses 80, stand your miniature up on a red base to warn the party of an imminent explosion.`,
  },
 },

 specializations: {
  title: "Radiation Protocols",
  subtitle: "Three Methods of Containing the Apocalypse",

  description: `Spellguards must choose how their body processes the lethal radiation of Arcane Energy Points (AEP).`,

  sharedPassive: {
   name: "Resonance",
   icon: "Slashing/Crushing Blow",
   description:
    "Your silence-glass plating repels magic but shatters under martial trauma. You have +50% vulnerability to all smashing and slicing damage.",
  },

  specs: [
   { id : "arcane_warden",
     name: "Silence-Scarred Bastion",
    icon: "Force/Force Field",
    color: "#1E3A8A",
    theme: "Maximum Containment",

    description: `**The flesh is a vault. Lock the radiation inside.**
    
Bastions focus entirely on intercepting damage meant for their allies, converting their own body into a localized black hole for enemy magic. They generate AEP faster and endure the radiation longer.`,

    playstyle:
     "Heavy ally protection, spell interception, delayed detonation",

    strengths: [
     "Generates 1.5x AEP from absorbed magic",
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
      "You generate 1.5x AEP from absorbed magical damage. The blight damage from Arcane Radiation is halved, though the max HP reduction remains full.",
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
      "Successfully reflecting a spell immediately purges 20 Arcane Energy Points (AEP) and restores 1d8 HP.",
    },

    keyAbilities: [
      "Silence Refraction, Reflect a spell, but the physical strain scorches your vision.",
     "Mirror's Edge, Shatter your Silence-Aegis to unleash a flurry of reflective shards.",
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
     "Does not need enemy spells to generate AEP",
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

    // ===== EXPANDED SPELLGUARD SPELLBOOK (LEVELS 4-10) =====
    {
      id: "sg_kinetic_discharge",
      name: "Kinetic Discharge",
      description: "Vent stored AEP into a 20ft frontal cone of compressed kinetic force, dealing storm damage and knocking enemies back 15ft.",
      level: 4,
      spellType: "ACTION",
      icon: "Lightning/Lightning Bolt",
      effectTypes: ["damage", "control"],
      typeConfig: { school: "storm", icon: "Lightning/Lightning Bolt", tags: ["damage", "cone", "storm", "knockback", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "cone", rangeType: "melee", rangeDistance: 5, areaSize: 20, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 6 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "3d8 + strength", damageTypes: ["storm"], resolution: "DICE" },
      controlConfig: {
        controlType: "forcedMovement",
        duration: 0,
        durationUnit: "instant",
        effects: [
          { id: "kinetic_discharge_knockback", name: "Kinetic Knockback", description: "Enemies in the cone are knocked back 15ft.", config: { movementType: "push", distance: 15 } }
        ]
      },
      tags: ["damage", "cone", "storm", "knockback", "spellguard"]
    },
    {
      id: "sg_null_field_bastion",
      name: "Null Field Bastion",
      description: "Create a 10ft anti-magic zone around yourself. Allies inside gain +4 to saves against spells and 50% spell damage reduction for 2 rounds.",
      level: 4,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff", "defense"],
      typeConfig: { school: "arcane", icon: "Radiant/Radiant Golden Shield", tags: ["buff", "aoe", "defense", "anti_magic", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self", areaType: "circle", areaSize: 10, targetRestrictions: ["ally", "self"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id: "null_field_bastion_ward", name: "Null Field", description: "Allies inside gain +4 to saves against spells and 50% spell damage reduction for 2 rounds.", mechanicsText: "+4 saves vs spells; 50% spell damage reduction, 2 rounds." }
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      tags: ["buff", "aoe", "defense", "anti_magic", "spellguard"]
    },
    {
      id: "sg_radiation_quench",
      name: "Radiation Quench",
      description: "Vent dangerous Silence Resonance from your plating, purging all debuffs from yourself and dealing heavy storm damage to all adjacent enemies.",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      effectTypes: ["damage", "cleansing"],
      typeConfig: { school: "storm", icon: "Force/Explosion Burst", tags: ["damage", "aoe", "cleanse", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self", areaType: "circle", areaSize: 10, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "4d8 + strength", damageTypes: ["storm"], resolution: "DICE" },
      tags: ["damage", "aoe", "cleanse", "spellguard"]
    },
    {
      id: "sg_prismatic_mirror_bastion",
      name: "Prismatic Mirror Bastion",
      description: "Reflect a targeted hostile spell back at the caster, dealing full spell damage plus storm backlash to the attacking mage.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["damage", "defense"],
      typeConfig: { school: "arcane", icon: "Radiant/Radiant Golden Shield", tags: ["reaction", "reflect", "defense", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 40, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 9 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "5d8 + strength", damageTypes: ["arcane", "storm"], resolution: "DICE" },
      tags: ["reaction", "reflect", "defense", "spellguard"]
    },
    {
      id: "sg_anti_magic_shackle",
      name: "Anti-Magic Shackle",
      description: "Clamp cold-iron leyline cuffs onto an enemy within 30ft. The target is Silenced and cannot cast spells or use magical abilities for 2 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Bludgeoning/Hammer",
      effectTypes: ["control", "debuff"],
      typeConfig: { school: "arcane", icon: "Bludgeoning/Hammer", tags: ["silence", "debuff", "single_target", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 9 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      controlConfig: {
        controlType: "silenced",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          { id: "anti_magic_shackle_silence", name: "Leyline Cuffs", description: "The target is silenced and cannot cast spells or use magical abilities.", config: { duration: 2, durationUnit: "rounds" } }
        ]
      },
      debuffConfig: {
        debuffType: "abilityDisable",
        effects: [
          { id: "anti_magic_shackle_lockout", name: "Magical Lockout", description: "Spells and magical abilities are disabled for 2 rounds.", mechanicsText: "Magical ability lockout, 2 rounds." }
        ],
        durationValue: 2,
        durationUnit: "rounds"
      },
      tags: ["silence", "debuff", "single_target", "spellguard"]
    },
    {
      id: "sg_overload_shockwave",
      name: "Overload Shockwave",
      description: "Detonate 50 stored AEP into a 30ft kinetic shockwave. Deals heavy storm damage and knocks all enemies prone.",
      level: 7,
      spellType: "ACTION",
      icon: "Lightning/Lightning Bolt",
      effectTypes: ["damage", "control"],
      typeConfig: { school: "storm", icon: "Lightning/Lightning Bolt", tags: ["damage", "aoe", "storm", "knockdown", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self", areaType: "circle", areaSize: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 11 }, classResource: { type: "arcane_energy_points", cost: 50 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "6d10 + strength * 2", damageTypes: ["storm"], resolution: "DICE" },
      controlConfig: {
        controlType: "knockdown",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          { id: "overload_shockwave_prone", name: "Knocked Prone", description: "All enemies in the 30ft blast are knocked prone.", config: { saveType: "strength", duration: 1, durationUnit: "rounds" } }
        ]
      },
      tags: ["damage", "aoe", "storm", "knockdown", "spellguard"]
    },
    {
      id: "sg_fortress_of_nullification",
      name: "Fortress of Nullification",
      description: "Anchor into the earth. Become immune to all magical damage, forced movement, and crowd control for 2 rounds, absorbing all spells in 20ft.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff", "defense"],
      typeConfig: { school: "arcane", icon: "Radiant/Radiant Golden Shield", tags: ["buff", "invulnerable", "defense", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 13 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      buffConfig: {
        buffType: "immunity",
        effects: [
          { id: "fortress_nullification_anchor", name: "Anchored Fortress", description: "Immune to all magical damage, forced movement, and crowd control for 2 rounds; absorbs all spells within 20ft.", mechanicsText: "Magical damage/forced movement/CC immunity; absorbs spells within 20ft, 2 rounds." }
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      tags: ["buff", "invulnerable", "defense", "spellguard"]
    },
    {
      id: "sg_leyline_devourer_nova",
      name: "Leyline Devourer Nova",
      description: "Devour all magical energy in a 40ft radius. Strips all enemy buffs, drains enemy spellcasters of mana, and deals massive arcane damage.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Quick Step",
      effectTypes: ["damage", "dispel", "aoe"],
      typeConfig: { school: "arcane", icon: "Arcane/Quick Step", tags: ["damage", "aoe", "dispel", "apocalypse", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self", areaType: "circle", areaSize: 40, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 15 } },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: { formula: "8d10 + strength * 2", damageTypes: ["arcane"], resolution: "DICE" },
      tags: ["damage", "aoe", "dispel", "apocalypse", "spellguard"]
    },
    {
      id: "sg_singularity_aegis",
      name: "Singularity Aegis",
      description: "Form an anti-magic black hole in your fortress shield for 3 rounds. Swallows all hostile projectiles and reflects 100% of absorbed spell damage to enemies.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff", "ultimate"],
      typeConfig: { school: "arcane", icon: "Radiant/Radiant Golden Shield", tags: ["buff", "ultimate", "defense", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 18 } },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "retaliation",
        effects: [
          { id: "singularity_aegis_reflect", name: "Singularity Aegis", description: "Swallows all hostile projectiles and reflects 100% of absorbed spell damage back at enemies for 3 rounds.", mechanicsText: "Absorb projectiles; reflect 100% absorbed spell damage, 3 rounds." }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      tags: ["buff", "ultimate", "defense", "spellguard"]
    },
  
    ...UTILITY_SPELLS,
    // SIGNATURE UTILITY SPELLS (CLASSIC WOW UTILITY NICHE)
  { id: "spg_aegis_ward",
   name: "Aegis Ward",
   description: "Instantly raise a prismatic barrier granting +3 Passive DR against an incoming strike.",
   level: 1,
   spellType: "REACTION",
   icon: "Utility/Barred Shield",
   effectTypes: ["buff"],
   typeConfig: { school: "arcane", icon: "Radiant/Radiant Golden Shield", tags: ["utility", "reaction", "shield", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 1, mana: 0 },
   resolution: "NONE",
   buffConfig: {
     buffType: "damageMitigation",
     effects: [
       { id: "aegis_ward_dr", name: "Prismatic Barrier", description: "Grants +3 Passive DR against the incoming strike.", mechanicsText: "+3 Passive DR." }
     ],
     durationType: "instant"
   },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   tags: ["utility", "shield", "spellguard"]
  },
  { id: "spg_spell_break",
   name: "Spell Break",
   description: "Interrupt an enemy casting a spell within 30 ft by detonating a ward charge, forcing the spell to fail.",
   level: 2,
   spellType: "REACTION",
   icon: "Arcane/Conjure Elements",
   effectTypes: ["control"],
   typeConfig: { school: "arcane", icon: "Arcane/Spiral Vortex", tags: ["utility", "counterspell", "spell_break", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemy"] },
   resourceCost: { actionPoints: 1, mana: 0 },
   resolution: "NONE",
   controlConfig: {
     controlType: "silenced",
     duration: 0,
     durationUnit: "instant",
     effects: [
       { id: "spell_break_counterspell", name: "Spell Broken", description: "The spell fails and is countered at its source.", config: { saveType: "intelligence" } }
     ]
   },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   tags: ["utility", "counterspell", "spellguard"]
  },
  // ========================================
  // PASSIVES (LEVEL 1)
  // ========================================
  { id : "spellguard_arcane_radiation",
   name: "Arcane Radiation",
   description:
    "Absorbed magic is radioactive poison: at your turn's end, unspent AEP deals blight equal to (AEP / 10, rounded down) and reduces max HP by the same until a long rest.",
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
    "Your silence-glass plating is hyper-specialized for absorbing energy, leaving you catastrophically vulnerable to martial trauma: permanent +50% vulnerability to all smashing and slicing damage.",
   level: 1,
   spellType: "PASSIVE",
   icon: "Slashing/Crushing Blow",
   effectTypes: ["passive"],
   typeConfig: {
    school: "smashing",
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
    "A brutal melee strike that rips raw magic from the target: 1d8 physical and 1d8 storm. A spellcaster also loses 2d4 mana. Generates +15 AEP as the raw magic enters your blood.",
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
    damageTypes: ["smashing", "stabbing", "slicing", "storm"],
    resolution: "DICE",
   },

   utilityConfig: {
    utilityType: "resource_drain",
    selectedEffects: [
     { id : "mana_tear",
      name: "Mana Tear",
      description: "Target loses 2d4 mana. You generate 15 Arcane Energy Points (AEP).",
     },
    ],
   },

   tags: ["melee", "drain", "resonance generation", "spellguard"],
  },

  { id : "sg_entropic_aegis",
   name: "Entropic Aegis",
   description:
    "Volatile silence crystal absorbs 4d8 damage for 1 minute, generating 2 AEP per absorb. If shattered by a kinetic attack, it detonates inwardly for 2d6 smashing to you.",
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
       "Absorbs 4d8 damage. Generates 2 AEP per hit absorbed. Self-inflicts 2d6 slicing if broken by martial attacks.",
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
    "A desperate survival technique: channel radiation into your bones for 1 round, suppressing your +50% smashing/slicing vulnerability and gaining +2 DR. Internal friction deals 1d4 blight instantly.",
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
      description: "Suppresses smashing/slicing vulnerability and grants +2 DR.",
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
    "Tear the spatial leylines to instantly teleport up to 30ft to an enemy caster. The violent transition generates +10 AEP, but friction rips your flesh for 1d6 blight to yourself.",
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
    "When an ally within 15ft is targeted by a spell, leap into its path as the new target: the impact is fully absorbed, generating AEP equal to its damage. Feedback blinds you until your next turn ends.",
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
      description: "Intercept spell targeting ally. Absorb its damage as Arcane Energy Points (AEP).",
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
    "Raise an agonizing barrier of spatial refraction: when targeted by a spell, reflect it back at the caster for 100% damage. The refraction inflicts internal burns, dealing 1d8 blight to your organs.",
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
    "Spectral rib structures encase allies within 15ft, granting a shield absorbing 4d6 damage. Each time a shield absorbs, you take 2 blight from the feedback link but gain 2 AEP.",
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
      description: "Absorbs 4d6 damage. Spellguard takes 2 blight damage and gains 2 AEP per hit.",
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
     "Choke a spell at its source, filling the target's lungs with silence ash. Force an Intelligence save; on a fail their spell is countered, and you absorb AEP equal to its level x 10.",
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
    "A devastating purge: unleash a blinding eruption of stored energy, dealing 6d8 storm to all enemies in 20ft (Agility half). Failing enemies are blinded by silence radiation 1 round.",
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
    "Encase yourself in silence crystal: complete immunity to all damage and effects for 1 round, but you cannot act. The shattering tomb deals 4d6 smashing to you and adjacent creatures.",
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
    damageTypes: ["smashing", "stabbing", "slicing"],
    resolution: "AUTOMATIC",
   },

   tags: ["defense", "immunity", "self damage", "spellguard"],
  },
  
  { id : "sg_violent_purge",
   name: "Violent Purge",
   description:
    "A cataclysmic blast to save your life from meltdown: expel ALL AEP (minimum 30), dealing storm damage equal to (AEP x 1.5) to all creatures within 20ft, including allies.",
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
     "Suppression of dimensional leylines: a 60ft zone of oppressive gravity suppresses all spells, magic items, and magical effects for 5 rounds. Casting strains your voice, silencing you 1 minute.",
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
    "Instantly end all magical phenomena on the battlefield, regardless of power or origin. The sheer volume consumed puts you into Critical Meltdown: reduced to 1 HP with defensive plating shattered.",
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
    "description": "Tap your steel chest plate so it gleams with silver light, projecting a narrow beam that serves as a distress beacon or illuminates a dark cavern.",
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
   description: "Open your scarred senses to magic in a place or object: perceive active spells, enchantments, residue, magical traps, and leylines, glowing like heat-shimmer only you can see. Out of combat.",
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
   description: "Raise a tuned prismatic barrier over a doorway, object, or small area that drinks incoming spells and weak traps; it stops spells, not steel, and cracks once full. Out of combat.",
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
   description: "Dump stored AEP into a mechanism, lock, construct, or device: power or overload it, force a jammed mechanism, or blast an arcane seal. Out of combat.",
   level: 2, spellType: "ACTION", icon: "Arcane/Spiral Vortex",
   typeConfig: { school: "arcane", icon: "Arcane/Spiral Vortex", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","investigation","spellguard"] },
   targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
   resourceCost: { actionPoints: 1, resourceTypes: [], resourceValues: {}, classResource: { type: "arcane_energy_points", cost: 3 }, components: ["somatic"], somaticText: "Grip the mechanism and pour the eaten magic back out" },
   resolution: "AUTOMATIC", effectTypes: ["utility"],
   utilityConfig: { utilityType: "conjuration", selectedEffects: [ { "id": "resonance_discharge_fuel", "name": "Eaten Fuel", "description": "Power, overload, force, or blast one magical mechanism/lock/seal/construct using 3 stored Arcane Energy Points (AEP). Spend AEP you already absorbed  -  no mana cost.", "mechanicsText": "Power/overload a magical mechanism; costs 3 stored AEP." } ], power: "moderate" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   tags: ["utility","exploration","investigation","spellguard"]
  },
  {
   id: "spellguard_disenchant",
   name: "Disenchant",
   description: "Drain an enchanted object's magic into your flesh, suppressing the enchantment (trap inert, ward down, cursed item asleep) and gaining AEP. It returns when you stop feeding. Out of combat.",
   level: 2, spellType: "ACTION", icon: "Arcane/Ebon Blaze",
   typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", castTime: 1, castTimeType: "MINUTES", tags: ["utility","investigation","exploration","spellguard"] },
   targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 8 }, components: ["somatic"], somaticText: "Clamp your scarred hand over the object and breathe its magic in" },
   resolution: "AUTOMATIC", effectTypes: ["utility"],
   utilityConfig: { utilityType: "protection", selectedEffects: [ { "id": "disenchant_drain", "name": "Magic Leeched", "description": "Suppress one object's enchantment for up to 10 minutes (magic trap inert, ward down, cursed item quiet, alarm dimmed); gain 1 Arcane Energy Point (AEP) from the drained magic. Magic returns when the suppression ends.", "mechanicsText": "Suppress one object's enchantment 10 min; gain 1 AEP." } ], duration: 10, durationUnit: "minutes", power: "major" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   tags: ["utility","investigation","exploration","spellguard"]
  },
  {
   id: "spellguard_glow_lantern",
   name: "Glow-Lantern",
   description: "Let the magic in your veins surface as pale-blue light: brighten to a 30ft radius or dampen to a pulse (you can never go fully dark). The glow soothes magically-induced dread. Out of combat.",
   level: 1, spellType: "ACTION", icon: "Arcane/Spellcasting Aura",
   typeConfig: { school: "arcane", icon: "Arcane/Spellcasting Aura", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","rest","spellguard"] },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 0, resourceTypes: [], resourceValues: {}, components: ["somatic"], somaticText: "Will the trapped light up under the skin, or push it back down" },
   resolution: "NONE", effectTypes: ["utility"],
   utilityConfig: { utilityType: "environment", selectedEffects: [ { "id": "glow_lantern_shape", "name": "Shaped Glow", "description": "Brighten your innate glow to steady 30 ft light, or dampen it to a dim pulse (never fully dark). The light grants advantage vs magically-induced fear/dread to those within it.", "mechanicsText": "Brighten/dampen innate glow (30 ft light); advantage vs magic fear." } ], duration: 1, durationUnit: "hours", power: "minor" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
   tags: ["utility","exploration","rest","spellguard"]
  },

  { id : "sg_containment_cycle",
   name: "Containment Cycle",
   description: "Spend 15 AEP to run a controlled bleed-off. For 3 rounds, Arcane Radiation deals no damage and you vent 10 AEP at the start of each of your turns. Meltdown cannot trigger while active.",
   level: 3,
   spellType: "ACTION",
   icon: "Force/Energy Coil",
   effectTypes: ["utility"],
   typeConfig: { school: "storm", icon: "Force/Energy Coil", tags: ["utility", "aep", "containment", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 10 }, classResource: { type: "arcane_energy_points", cost: 15 }, components: ["somatic"], somaticText: "Vent the pressure through ritualized breathing and a grinding palm-drill into your own chest" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   resolution: "AUTOMATIC",
   utilityConfig: { utilityType: "restoration", selectedEffects: [ { id : "containment_bleedoff", name: "Controlled Bleed-Off", description: "Arcane Radiation is suppressed and you vent 10 AEP at the start of each turn for 3 rounds. Meltdown cannot trigger.", mechanicsText: "No radiation damage; vent 10 AEP/turn; Meltdown suppressed 3 rounds." } ], duration: 3, durationUnit: "rounds" },
   tags: ["utility", "containment", "aep", "spellguard"]
  },
  { id : "sg_spell_riposte",
   name: "Spell Riposte",
   description: "Hurl a spent spell's afterimage back at its caster for 3d8 storm + arcane damage. Spirit save DC 15 or silenced for 1 round. Trigger: a spell hits you or an ally within 15 ft. Gain 10 AEP.",
   level: 3,
   spellType: "REACTION",
   icon: "Arcane/Magical Duel",
   effectTypes: ["damage", "control"],
   typeConfig: { school: "arcane", secondaryElement: "storm", icon: "Arcane/Magical Duel", tags: ["damage", "control", "reflection", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 40, targetRestrictions: ["enemies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 10 }, classResource: { type: "arcane_energy_points", cost: -10 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Snap the afterimage off your scarred forearm and hurl it back" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   resolution: "DICE",
   damageConfig: { formula: "3d8 + intelligence", damageTypes: ["arcane", "storm"], resolution: "DICE" },
   controlConfig: { controlType: "silenced", effects: [ { id : "riposte_silence", name: "Choked Chant", description: "Silenced for 1 round on a failed Spirit save.", mechanicsText: "Silenced 1 round (Spirit DC 15 negates)." } ], savingThrow: { ability: "spirit", difficultyClass: 15, saveOutcome: "negates" }, duration: 1, durationUnit: "rounds" },
   tags: ["reaction", "reflection", "control", "spellguard"]
  },
  { id : "sg_spellward_bond",
   name: "Spellward Bond",
   description: "Bond an ally for 3 rounds. The first hostile spell each round that targets them redirects to you, deals half damage, and grants AEP equal to the damage prevented. Costs 10 AEP.",
   level: 4,
   spellType: "ACTION",
   icon: "Utility/Bound Shield",
   effectTypes: ["buff"],
   typeConfig: { school: "arcane", icon: "Utility/Bound Shield", tags: ["buff", "interception", "ally", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 12 }, classResource: { type: "arcane_energy_points", cost: 10 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Bind a filament of silence-glass from your palm to the ally's shadow" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   resolution: "AUTOMATIC",
   buffConfig: { buffType: "triggeredEffect", effects: [ { id : "spellward_bond_redirect", name: "Spellward Bond", description: "The first hostile spell each round redirects to the Spellguard at half damage; the Spellguard gains AEP equal to the damage prevented.", mechanicsText: "First hostile spell per round redirected at 50% damage; gain prevented damage as AEP. 3 rounds." } ], durationValue: 3, durationType: "rounds", durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true },
   tags: ["buff", "interception", "protection", "spellguard"]
  },
  { id : "sg_prism_cocoon",
   name: "Prism Cocoon",
   description: "Instantly encase an ally in silence-glass. Until the start of their next turn they are immune to spell damage and hostile spell effects but restrained. You take 1d8 blight and gain 15 AEP.",
   level: 5,
   spellType: "REACTION",
   icon: "Force/Force Shield",
   effectTypes: ["buff"],
   typeConfig: { school: "arcane", icon: "Force/Force Shield", tags: ["buff", "reaction", "ally", "immunity", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 16 }, classResource: { type: "arcane_energy_points", cost: 20 }, components: ["somatic"], somaticText: "Clap a shard-shell of refracting glass around the ally's silhouette" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
   resolution: "AUTOMATIC",
   buffConfig: { buffType: "invulnerability", effects: [ { id : "prism_cocoon_shell", name: "Prism Cocoon", description: "Immune to spell damage and hostile spell effects until the start of the target's next turn. The target is restrained for the duration.", mechanicsText: "Spell immunity until their next turn; restrained. Caster: 1d8 blight, +15 AEP." } ], durationValue: 1, durationType: "rounds", durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true },
   tags: ["reaction", "protection", "immunity", "spellguard"]
  },
  { id : "sg_kinetic_reversal",
   name: "Kinetic Reversal",
   description: "Drive a kinetic counter through a caster's stance for 4d10 smashing + storm damage. If they have cast a spell since your last turn, add 3d8 storm and knock them back 10 ft. Gain 10 AEP.",
   level: 6,
   spellType: "ACTION",
   icon: "Lightning/Shock",
   effectTypes: ["damage"],
   typeConfig: { school: "storm", secondaryElement: "smashing", icon: "Lightning/Shock", tags: ["damage", "melee", "anti_caster", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 14 }, classResource: { type: "arcane_energy_points", cost: -10 }, components: ["somatic"], somaticText: "Snap the momentum out of the caster's gesture and drive it back through their ribs" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   resolution: "DICE",
   damageConfig: { formula: "4d10 + strength", damageTypes: ["smashing", "storm"], resolution: "DICE" },
   tags: ["melee", "anti_caster", "kinetic", "spellguard"]
  },
  { id : "sg_scrying_blackout",
   name: "Scrying Blackout",
   description: "Flood a 30 ft area with leyline static for 1 minute: divination cannot see in or out, enemies inside cannot teleport, and allies gain +4 to saves against scrying and divination.",
   level: 6,
   spellType: "ACTION",
   icon: "Utility/Senses Closed Eye",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Utility/Senses Closed Eye", tags: ["utility", "anti_scrying", "zone", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 30, targetRestrictions: ["any"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 16 }, classResource: { type: "arcane_energy_points", cost: 10 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Grind a palm across your eyes and push the silence outward in a ring" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
   resolution: "AUTOMATIC",
   utilityConfig: { utilityType: "environment", selectedEffects: [ { id : "scrying_blackout_field", name: "Leyline Static", description: "Divination cannot see into or out of the area; enemies inside cannot teleport; allies gain +4 to saves against scrying and divination.", mechanicsText: "Blocks divination in/out; no teleport for enemies; allies +4 vs scrying/divination. 1 minute." } ], duration: 1, durationUnit: "minutes", concentration: false, power: "major" },
   tags: ["utility", "anti_scrying", "zone", "spellguard"]
  },
  { id : "sg_saturation_flush",
   name: "Saturation Flush",
   description: "Vent 40 AEP in one controlled purge. Heal 3d8 + spirit HP and erase all maximum-HP loss suffered from Arcane Radiation. Purely restorative; deals no damage.",
   level: 7,
   spellType: "ACTION",
   icon: "Force/Absorb Energy",
   effectTypes: ["healing"],
   typeConfig: { school: "storm", icon: "Force/Absorb Energy", tags: ["healing", "aep", "recovery", "spellguard"], castTime: 2, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 20 }, classResource: { type: "arcane_energy_points", cost: 40 }, components: ["somatic"], somaticText: "Open every silence-scar at once and let the stored pressure bleed down to nothing" },
   cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
   resolution: "DICE",
   healingConfig: { formula: "3d8 + spirit", healingType: "direct", resolution: "DICE" },
   tags: ["healing", "recovery", "aep", "spellguard"]
  },
  { id : "sg_entropy_lance",
   name: "Entropy Lance",
   description: "Fire a 60 ft lance of unravelling energy for 5d10 + intelligence arcane damage to all in line. Each target loses one spell buff, and you gain 5 AEP per buff stripped.",
   level: 7,
   spellType: "ACTION",
   icon: "Force/Energy Beam 2",
   effectTypes: ["damage", "utility"],
   typeConfig: { school: "arcane", icon: "Force/Energy Beam 2", tags: ["damage", "line", "dispel", "spellguard"], castTime: 2, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "line", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 20 }, classResource: { type: "arcane_energy_points", cost: 0 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Level an open palm and let the leylines fold into a single cutting line" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   resolution: "DICE",
   damageConfig: { formula: "5d10 + intelligence", damageTypes: ["arcane"], resolution: "DICE" },
   utilityConfig: { utilityType: "disruption", selectedEffects: [ { id : "entropy_lance_strip", name: "Unravel Buffs", description: "Each target hit loses one spell buff. You gain 5 AEP for each buff stripped.", mechanicsText: "Strip one buff per target; +5 AEP per buff stripped." } ], power: "major" },
   tags: ["damage", "line", "disruption", "spellguard"]
  },
  { id : "sg_warding_verge",
   name: "Warding Verge",
   description: "Plant a 15 ft spell-devouring threshold for 1 minute. The first hostile spell crossing it is absorbed entirely, granting you AEP equal to its damage. Allies inside gain +3 DR against spells.",
   level: 8,
   spellType: "ACTION",
   icon: "Force/Radiating Barrier",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Force/Radiating Barrier", tags: ["utility", "ward", "interception", "spellguard"], castTime: 2, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, areaShape: "circle", areaSize: 15, targetRestrictions: ["allies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 22 }, classResource: { type: "arcane_energy_points", cost: 20 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Sketch a ring of silence-glass sigils and drive them into the ground" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
   resolution: "AUTOMATIC",
   utilityConfig: { utilityType: "protection", selectedEffects: [ { id : "warding_verge_absorb", name: "Spell-Devouring Verge", description: "The first hostile spell crossing the verge is absorbed entirely; you gain AEP equal to its damage. Allies inside gain +3 DR against spells.", mechanicsText: "Absorb first hostile spell (gain its damage as AEP); allies +3 spell DR. 1 minute." } ], duration: 1, durationUnit: "minutes", concentration: false, power: "major" },
   tags: ["utility", "ward", "protection", "spellguard"]
  },
  { id : "sg_mirror_phalanx",
   name: "Mirror Phalanx",
   description: "Raise a mirror phalanx for 2 rounds: allies within 15 ft reflect 50% of spell damage taken back at the caster as arcane. You gain 5 AEP each time this reflects.",
   level: 8,
   spellType: "ACTION",
   icon: "Utility/Shattered Shield",
   effectTypes: ["buff"],
   typeConfig: { school: "arcane", icon: "Utility/Shattered Shield", tags: ["buff", "retaliation", "ally", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 15, targetRestrictions: ["allies", "self"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 24 }, classResource: { type: "arcane_energy_points", cost: 15 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Raise a lattice of shattered mirror-plates around the formation" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
   resolution: "AUTOMATIC",
   buffConfig: { buffType: "retaliation", effects: [ { id : "mirror_phalanx_reflect", name: "Mirror Phalanx", description: "Allies within 15 ft reflect 50% of spell damage taken back at the caster as arcane damage.", mechanicsText: "Reflect 50% of spell damage taken as arcane; the Spellguard gains 5 AEP per reflection. 2 rounds." } ], durationValue: 2, durationType: "rounds", durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true },
   tags: ["buff", "retaliation", "protection", "spellguard"]
  },
  { id : "sg_ley_fracture_hammer",
   name: "Ley-Fracture Hammer",
   description: "Slam a hammer wreathed in fractured leyline force for 6d8 smashing + 2d8 storm damage. Destroy all magical barriers on the target; Spirit save DC 16 or dazed for 1 round. Gain 10 AEP.",
   level: 8,
   spellType: "ACTION",
   icon: "General/Concussion",
   effectTypes: ["damage", "debuff"],
   typeConfig: { school: "smashing", secondaryElement: "storm", icon: "General/Concussion", tags: ["damage", "melee", "anti_ward", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 24 }, classResource: { type: "arcane_energy_points", cost: -10 }, components: ["somatic"], somaticText: "Bleed the stored leyline charge down the haft and into the striking head" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   resolution: "SAVE",
   damageConfig: { formula: "6d8 + strength", damageTypes: ["smashing", "storm"], resolution: "SAVE" },
   debuffConfig: { debuffType: "statusEffect", effects: [ { id : "fracture_daze", name: "Fractured Focus", description: "Dazed for 1 round on a failed Spirit save.", mechanicsText: "Dazed 1 round (Spirit DC 16 negates)." } ], savingThrow: { ability: "spirit", difficultyClass: 16, saveOutcome: "negates" }, durationValue: 1, durationType: "rounds", durationUnit: "rounds", canBeDispelled: true },
   tags: ["melee", "anti_ward", "smashing", "spellguard"]
  },
  { id : "sg_void_anchor",
   name: "Void Anchor",
   description: "Anchor a caster to the leylines for 3 rounds. Spirit save DC 17 or they are silenced and pinned in place; each teleport attempt deals 2d10 arcane feedback damage to them.",
   level: 9,
   spellType: "ACTION",
   icon: "Utility/Chained",
   effectTypes: ["control"],
   typeConfig: { school: "arcane", icon: "Utility/Chained", tags: ["control", "silence", "anti_teleport", "spellguard"], castTime: 2, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"] },
   resourceCost: { actionPoints: 2, resourceTypes: ["mana"], resourceValues: { mana: 30 }, classResource: { type: "arcane_energy_points", cost: 25 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Drive a fist downward and nail the caster's magic to the leylines" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
   resolution: "SAVE",
   controlConfig: { controlType: "lockdown", effects: [ { id : "void_anchor_lock", name: "Ley-Pinned", description: "Silenced and unable to teleport for 3 rounds. Teleport attempts deal 2d10 arcane feedback.", mechanicsText: "Silenced + no teleport 3 rounds (Spirit DC 17 negates); teleport attempts take 2d10 arcane." } ], savingThrow: { ability: "spirit", difficultyClass: 17, saveOutcome: "negates" }, duration: 3, durationUnit: "rounds" },
   tags: ["control", "lockdown", "anti_caster", "spellguard"]
  },
  { id : "sg_resonance_bastion",
   name: "Resonance Bastion",
   description: "Overload your aegis into a 20 ft bastion for 1 round: allies inside are immune to spell damage and hostile spell effects. You immediately gain 30 AEP and take 3d8 blight.",
   level: 9,
   spellType: "ACTION",
   icon: "Utility/Fortress Castle",
   effectTypes: ["buff"],
   typeConfig: { school: "arcane", icon: "Utility/Fortress Castle", tags: ["buff", "immunity", "ally", "overload", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 20, targetRestrictions: ["allies", "self"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 30 }, classResource: { type: "arcane_energy_points", cost: -30 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Force the core wide open and hold the breach with both hands" },
   cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
   resolution: "AUTOMATIC",
   buffConfig: { buffType: "immunity", effects: [ { id : "resonance_bastion_field", name: "Resonance Bastion", description: "Allies within 20 ft are immune to spell damage and hostile spell effects.", mechanicsText: "Spell immunity for allies in 20 ft, 1 round. Caster: +30 AEP, 3d8 blight." } ], durationValue: 1, durationType: "rounds", durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true },
   tags: ["buff", "immunity", "protection", "overload", "spellguard"]
  },
  { id : "sg_devouring_grasp",
   name: "Devouring Grasp",
   description: "Seize a caster for 6d10 + strength storm damage and drain all their remaining mana, adding +1 damage per mana drained. Gain AEP equal to half the mana drained (max 25).",
   level: 9,
   spellType: "ACTION",
   icon: "Utility/Grab",
   effectTypes: ["damage", "utility"],
   typeConfig: { school: "storm", icon: "Utility/Grab", tags: ["damage", "melee", "drain", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemies"] },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 26 }, classResource: { type: "arcane_energy_points", cost: 0 }, components: ["somatic"], somaticText: "Sink scarred fingers into the caster's chest and pull the leyline out through the wound" },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   resolution: "DICE",
   damageConfig: { formula: "6d10 + strength", damageTypes: ["storm"], resolution: "DICE" },
   utilityConfig: { utilityType: "resource_drain", selectedEffects: [ { id : "devouring_grasp_drain", name: "Mana Devoured", description: "Drain all remaining mana from the target, adding +1 damage per mana drained. Gain AEP equal to half the mana drained (max 25).", mechanicsText: "Drain all target mana; +1 damage per mana; +1 AEP per 2 mana drained, max 25." } ], power: "major" },
   tags: ["melee", "drain", "anti_caster", "spellguard"]
  },
  { id : "sg_criticality_halo",
   name: "Criticality Halo",
   description: "Hold your core at criticality for 3 rounds: Meltdown cannot trigger and enemies within 15 ft take 4d8 storm at the start of each of your turns. When it ends, vent 50 AEP.",
   level: 10,
   spellType: "ACTION",
   icon: "Force/Energy Core",
   effectTypes: ["buff", "damage"],
   typeConfig: { school: "storm", icon: "Force/Energy Core", tags: ["buff", "damage", "meltdown", "aura", "spellguard"], castTime: 2, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "self", rangeType: "self" },
   resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 35 }, classResource: { type: "arcane_energy_points", cost: 20 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Clamp the breach open and let the core light bleed through every scar" },
   cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
   resolution: "AUTOMATIC",
   buffConfig: { buffType: "custom", effects: [ { id : "criticality_halo_containment", name: "Contained Criticality", description: "Meltdown cannot trigger. Enemies within 15 ft take 4d8 storm damage at the start of each of your turns.", mechanicsText: "No Meltdown 3 rounds; 4d8 storm to enemies within 15 ft each turn; vent 50 AEP at end." } ], durationValue: 3, durationType: "rounds", durationUnit: "rounds", concentrationRequired: false, canBeDispelled: false },
   damageConfig: { formula: "4d8", damageTypes: ["storm"], resolution: "AUTOMATIC" },
   tags: ["buff", "damage", "meltdown", "spellguard"]
  },
  { id : "sg_echo_exodus",
   name: "Echo Exodus",
   description: "Teleport yourself and allies within 20 ft up to 60 ft away, leaving a silence-echo duplicate behind. The next 2 spells targeting the echo are absorbed, granting you 15 AEP each.",
   level: 10,
   spellType: "ACTION",
   icon: "Arcane/Open Portal",
   effectTypes: ["utility"],
   typeConfig: { school: "arcane", icon: "Arcane/Open Portal", tags: ["utility", "teleport", "decoy", "spellguard"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 20, targetRestrictions: ["allies", "self"] },
   resourceCost: { actionPoints: 2, resourceTypes: ["mana"], resourceValues: { mana: 40 }, classResource: { type: "arcane_energy_points", cost: 10 }, components: ["verbal", "somatic"], verbalText: "Spellguard!", somaticText: "Fold the party through a leyline seam and leave a glowing afterimage in place" },
   cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
   resolution: "AUTOMATIC",
   utilityConfig: { utilityType: "teleportation", selectedEffects: [ { id : "echo_exodus_shift", name: "Leyline Exodus", description: "Teleport yourself and allies within 20 ft up to 60 ft. A silence-echo duplicate remains and absorbs the next 2 spells targeting it, granting you 15 AEP each.", mechanicsText: "Mass teleport 60 ft; echo absorbs next 2 spells (+15 AEP each)." } ], duration: 1, durationUnit: "rounds", power: "major" },
   tags: ["utility", "teleport", "decoy", "spellguard"]
  }
 ],
};

SPELLGUARD_DATA.spells = SPELLGUARD_DATA.exampleSpells;
export const SPELLGUARD_SPELLS = SPELLGUARD_DATA.spells;
