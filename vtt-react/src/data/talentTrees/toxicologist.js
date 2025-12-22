// ============================================
// TOXICOLOGIST TALENT TREES
// ============================================

export const TOXICOLOGIST_VENOMANCER = [
  // Venomous Core: The central toxin reservoir
  {
    id: 'venom_core_toxin',
    name: 'Venomous Core',
    description: 'Your body becomes a reservoir of deadly toxins. Gain +1d6 poison damage per rank to weapon attacks. When you take damage, you can spend 1 reaction to secrete venom that deals 1d8 poison damage per rank to adjacent enemies.',
    icon: 'ability_rogue_deadlybrew',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Venom Channels: Spreading toxin pathways
  {
    id: 'venom_channels_poison',
    name: 'Venom Channels',
    description: 'Your toxins flow through specialized channels. Poison effects you apply have advantage on saves and last 2 additional rounds per rank. Enemies poisoned by you take 1d4 poison damage per rank at the start of their turns.',
    icon: 'spell_nature_corrosivebreath',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'venom_core_toxin',
  },
  {
    id: 'venom_channels_neurotoxin',
    name: 'Neurotoxin Channels',
    description: 'Your venom affects the nervous system. Poisoned enemies have disadvantage on attack rolls and skill checks. Critical hits with poison weapons apply the stunned condition for 1 round per rank.',
    icon: 'ability_rogue_deviouspoisons',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'venom_core_toxin',
  },

  // Venom Network: Interconnected toxin distribution
  {
    id: 'venom_network_hemotoxin',
    name: 'Hemotoxin Network',
    description: 'Your toxins attack the bloodstream. Poisoned enemies take maximum poison damage from your effects. When you poison an enemy, adjacent enemies take 1d6 poison damage per rank.',
    icon: 'spell_nature_nullifydisease',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'venom_channels_poison',
  },
  {
    id: 'venom_network_toxin_mastery',
    name: 'Toxin Mastery',
    description: 'You become a master of all poisons. All poison damage you deal is doubled. You can apply two different poison effects to the same weapon. Poison immunity grants you advantage on all saves.',
    icon: 'ability_rogue_deadlybrew',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['venom_channels_poison', 'venom_channels_neurotoxin'],
  },
  {
    id: 'venom_network_cytotoxin',
    name: 'Cytotoxin Network',
    description: 'Your toxins destroy cells at a molecular level. Poisoned enemies cannot regenerate hit points. When a poisoned enemy dies, it explodes in a 10-foot radius, dealing 2d8 poison damage per rank to nearby enemies.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'venom_channels_neurotoxin',
  },

  // Venom Nexus: Central toxin processing hub
  {
    id: 'venom_nexus_lethal_injection',
    name: 'Lethal Injection',
    description: 'Your venom becomes instantly lethal. Once per turn when you hit with a poison weapon, you can inject a lethal dose. Target takes 4d10 poison damage immediately and is poisoned for 1 minute per rank.',
    icon: 'ability_rogue_dualweild',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'venom_network_hemotoxin',
  },
  {
    id: 'venom_nexus_toxin_synthesis',
    name: 'Toxin Synthesis',
    description: 'You can synthesize any poison instantly. You know all poison recipes and can create custom poisons with any combination of effects. Poisons you create have +2 to their save DCs per rank.',
    icon: 'inv_misc_herb_16',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'venom_network_toxin_mastery',
  },
  {
    id: 'venom_nexus_venom_cloud',
    name: 'Venom Cloud',
    description: 'You can exhale a cloud of deadly venom. Create a 30-foot radius cloud centered on you. All enemies in the cloud take 3d8 poison damage per rank and are poisoned for 3 rounds.',
    icon: 'ability_druid_disembowel',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'venom_network_cytotoxin',
  },

  // Venom Matrix: Advanced toxin distribution system
  {
    id: 'venom_matrix_apex_predator',
    name: 'Apex Predator',
    description: 'You become the ultimate venomous predator. All creatures within 30 feet take 2d6 poison damage per rank at the start of their turns if they are below half health. You are immune to all poisons and diseases.',
    icon: 'ability_hunter_pet_spider',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'venom_nexus_lethal_injection',
  },
  {
    id: 'venom_matrix_toxin_overload',
    name: 'Toxin Overload',
    description: 'Your venom overwhelms all defenses. Poison effects you apply ignore poison immunity and resistance. Enemies cannot be immune to your poisons, and resistance is reduced to half effectiveness.',
    icon: 'spell_nature_acid_01',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'venom_nexus_toxin_synthesis',
  },

  // Venom Apocalypse: Ultimate toxin manifestation
  {
    id: 'venom_apocalypse_toxic_nova',
    name: 'Toxic Nova',
    description: 'Unleash a nova of pure venom. All enemies within 50 feet take 6d12 poison damage per rank. Poisoned enemies take double damage and are stunned for 1 minute. You are immune to all effects for the duration.',
    icon: 'spell_nature_acid_01',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'venom_matrix_apex_predator',
  },
  {
    id: 'venom_apocalypse_toxin_god',
    name: 'Toxin God',
    description: 'You transcend into a being of pure venom. You can cast Toxic Nova at will, all your attacks apply lethal poison automatically, and enemies within 100 feet cannot heal while poisoned by you.',
    icon: 'ability_rogue_deadlybrew',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'venom_matrix_toxin_overload',
  },

  // Ultimate Venom: The final toxin evolution
  {
    id: 'venom_ultimate_toxic_ascension',
    name: 'Toxic Ascension',
    description: 'You become living venom incarnate. All damage you deal becomes poison damage, enemies cannot survive being poisoned by you, and you can control all poisons and toxins within 1 mile.',
    icon: 'ability_rogue_deadlybrew',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['venom_apocalypse_toxic_nova', 'venom_apocalypse_toxin_god', 'venom_nexus_venom_cloud'],
  }
];

export const TOXICOLOGIST_GADGETEER = [
  // Mechanical Core: The central gear mechanism
  {
    id: 'gadget_core_mechanical',
    name: 'Mechanical Core',
    description: 'Your body houses intricate machinery. Gain proficiency with all tools and advantage on checks to repair or modify mechanical devices. You can spend 1 1 action point to deploy a simple contraption.',
    icon: 'inv_misc_wrench_01',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Gear Assembly: Component integration points
  {
    id: 'gadget_assembly_spring_mechanism',
    name: 'Spring Mechanism',
    description: 'Your gadgets become spring-loaded. Contraptions you deploy have +10 feet of trigger range per rank and can be triggered as reactions. You gain +1 to initiative rolls.',
    icon: 'inv_misc_gear_01',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'gadget_core_mechanical',
  },
  {
    id: 'gadget_assembly_power_cell',
    name: 'Power Cell',
    description: 'Your gadgets draw power from your life force. Contraptions deal +1d6 damage per rank and can be overcharged for double damage (but break after one use).',
    icon: 'inv_battery_02',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'gadget_core_mechanical',
  },

  // Contraption Network: Interconnected device systems
  {
    id: 'gadget_network_trap_matrix',
    name: 'Trap Matrix',
    description: 'Your traps form a deadly network. When one trap triggers, all traps within 20 feet have advantage on their next trigger. You can have up to 6 active contraptions per rank.',
    icon: 'inv_misc_enggizmos_03',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'gadget_assembly_spring_mechanism',
  },
  {
    id: 'gadget_network_device_mastery',
    name: 'Device Mastery',
    description: 'You become a master of all mechanical devices. You can modify any non-magical device or weapon as an action. Modified items gain +2 to attack/damage rolls and can have one additional property.',
    icon: 'inv_misc_wrench_01',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['gadget_assembly_spring_mechanism', 'gadget_assembly_power_cell'],
  },
  {
    id: 'gadget_network_explosive_array',
    name: 'Explosive Array',
    description: 'Your explosives become devastating. Explosive contraptions deal +2d6 fire damage per rank in +10 foot radius. Enemies in the blast radius are pushed back 10 feet.',
    icon: 'inv_misc_bomb_05',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'gadget_assembly_power_cell',
  },

  // Engineering Hub: Central device manufacturing
  {
    id: 'gadget_hub_precision_engineering',
    name: 'Precision Engineering',
    description: 'Your contraptions become surgically precise. All contraptions ignore half cover and three-quarters cover. Enemies cannot gain advantage on saves against your contraptions.',
    icon: 'inv_misc_gear_02',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'gadget_network_trap_matrix',
  },
  {
    id: 'gadget_hub_automation_core',
    name: 'Automation Core',
    description: 'Your gadgets operate autonomously. Contraptions can move 30 feet per round and can attack or activate independently. You can command up to 3 contraptions per rank as a 1 action point.',
    icon: 'inv_misc_punchcards_yellow',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'gadget_network_device_mastery',
  },
  {
    id: 'gadget_hub_chain_reaction',
    name: 'Chain Reaction',
    description: 'Your contraptions create devastating chain reactions. When a contraption triggers, it can cause up to 2 other contraptions within 30 feet to trigger immediately, dealing full damage.',
    icon: 'inv_misc_bomb_04',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'gadget_network_explosive_array',
  },

  // Invention Matrix: Advanced technological systems
  {
    id: 'gadget_matrix_field_generator',
    name: 'Field Generator',
    description: 'You can create force fields with your gadgets. Create a 20-foot radius field that blocks projectiles and forces. The field lasts 1 minute per rank and can be moved as an action.',
    icon: 'inv_misc_enggizmos_04',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'gadget_hub_precision_engineering',
  },
  {
    id: 'gadget_matrix_master_inventor',
    name: 'Master Inventor',
    description: 'You can invent any mechanical device. Create custom contraptions with any combination of effects. Custom contraptions have +2 to all effects and cannot be dispelled by non-magical means.',
    icon: 'inv_misc_wrench_02',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'gadget_hub_automation_core',
  },

  // Technological Singularity: Ultimate mechanical evolution
  {
    id: 'gadget_singularity_swarm_intelligence',
    name: 'Swarm Intelligence',
    description: 'Your contraptions develop hive mind intelligence. All your contraptions share senses within 100 feet and can coordinate attacks. Each contraption gains +2 armor and can take reactions.',
    icon: 'inv_misc_enggizmos_02',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'gadget_matrix_field_generator',
  },
  {
    id: 'gadget_singularity_mechanical_god',
    name: 'Mechanical God',
    description: 'You transcend into a being of pure machinery. You can cast any contraption effect at will, all mechanical devices obey your commands, and you can rebuild destroyed contraptions instantly.',
    icon: 'inv_misc_wrench_01',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'gadget_matrix_master_inventor',
  },

  // Ultimate Technology: The final mechanical evolution
  {
    id: 'gadget_ultimate_technological_singularity',
    name: 'Technological Singularity',
    description: 'You become living technology incarnate. All machines within 1 mile are under your control, you can create any device instantly, and your contraptions cannot be destroyed by any means.',
    icon: 'inv_misc_enggizmos_01',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['gadget_singularity_swarm_intelligence', 'gadget_singularity_mechanical_god', 'gadget_hub_chain_reaction'],
  }
];

export const TOXICOLOGIST_SABOTEUR = [
  // Disruption Core: The central chaos generator
  {
    id: 'sabotage_core_disruption',
    name: 'Disruption Core',
    description: 'Your presence sows chaos and disorder. Enemies within 30 feet have disadvantage on concentration saves per rank. You can spend 1 1 action point to create a zone of confusion in a 10-foot radius.',
    icon: 'ability_rogue_wrongfullyaccused',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Interference Field: Electromagnetic disruption patterns
  {
    id: 'sabotage_field_electromagnetic',
    name: 'Electromagnetic Interference',
    description: 'Your sabotage creates electronic chaos. Magical devices within 20 feet malfunction, requiring a DC 15 Intelligence save per rank to function. Spells targeting you have disadvantage.',
    icon: 'spell_arcane_arcane01',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'sabotage_core_disruption',
  },
  {
    id: 'sabotage_field_psychological',
    name: 'Psychological Warfare',
    description: 'Your sabotage breaks minds before bodies. Enemies affected by your abilities have disadvantage on Spirit saves and cannot benefit from morale bonuses. Fear effects last twice as long.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'sabotage_core_disruption',
  },

  // Sabotage Network: Interconnected disruption systems
  {
    id: 'sabotage_network_system_failure',
    name: 'System Failure',
    description: 'Your sabotage causes cascading failures. When you disable an enemy ability, all similar abilities are also disabled for 1 round per rank. Critical hits with sabotage effects affect all enemies within 15 feet.',
    icon: 'inv_misc_wrench_01',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'sabotage_field_electromagnetic',
  },
  {
    id: 'sabotage_network_debuff_mastery',
    name: 'Debuff Mastery',
    description: 'You become a master of weakening enemies. All debuffs you apply cannot be dispelled by spells of 5th level or lower. Enemies affected by multiple debuffs take 1d6 psychic damage per debuff per rank.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['sabotage_field_electromagnetic', 'sabotage_field_psychological'],
  },
  {
    id: 'sabotage_network_morale_breaker',
    name: 'Morale Breaker',
    description: 'Your sabotage destroys enemy resolve. Enemies you debuff cannot benefit from bardic inspiration or similar morale effects. Affected enemies have disadvantage on death saves.',
    icon: 'ability_warrior_warcry',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'sabotage_field_psychological',
  },

  // Chaos Nexus: Central disruption processing
  {
    id: 'sabotage_nexus_total_shutdown',
    name: 'Total Shutdown',
    description: 'You can completely disable an enemy. Target creature cannot take actions or reactions for 2 rounds per rank. During this time, they have vulnerability to all damage and cannot be healed.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'sabotage_network_system_failure',
  },
  {
    id: 'sabotage_nexus_chaos_engine',
    name: 'Chaos Engine',
    description: 'Your sabotage creates unpredictable chaos. When you apply a debuff, roll a d6: 1-2 (empower debuff), 3-4 (random additional effect), 5-6 (debuff affects all enemies within 20 feet).',
    icon: 'spell_misc_drink',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'sabotage_network_debuff_mastery',
  },
  {
    id: 'sabotage_nexus_pandemonium',
    name: 'Pandemonium',
    description: 'Your presence creates total disorder. Enemies within 30 feet cannot benefit from flanking, pack tactics, or coordinated attacks. Allies of affected enemies have disadvantage on attacks.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'sabotage_network_morale_breaker',
  },

  // Disruption Matrix: Advanced sabotage systems
  {
    id: 'sabotage_matrix_reality_glitch',
    name: 'Reality Glitch',
    description: 'Your sabotage warps reality itself. Enemies you debuff have their attacks miss 25% of the time per rank, regardless of modifiers. They cannot critically hit while affected.',
    icon: 'spell_arcane_portaldalaran',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'sabotage_nexus_total_shutdown',
  },
  {
    id: 'sabotage_matrix_chaos_lord',
    name: 'Chaos Lord',
    description: 'You become the embodiment of disorder. You can apply any debuff effect at will to enemies within 60 feet. Debuffs you apply are permanent until dispelled by a wish spell or similar magic.',
    icon: 'ability_rogue_wrongfullyaccused',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'sabotage_nexus_chaos_engine',
  },

  // Apocalypse of Chaos: Ultimate disruption manifestation
  {
    id: 'sabotage_apocalypse_system_crash',
    name: 'System Crash',
    description: 'Trigger a total system failure in reality. All enemies within 50 feet are stunned for 1 minute per rank. During this time, they cannot take actions, reactions, or 1 action points.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'sabotage_matrix_reality_glitch',
  },
  {
    id: 'sabotage_apocalypse_chaos_god',
    name: 'Chaos God',
    description: 'You ascend to godhood through pure disruption. You can cast System Crash at will, all creatures within 100 feet cannot benefit from any beneficial effects, and reality warps around your whims.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'sabotage_matrix_chaos_lord',
  },

  // Ultimate Chaos: The final disruption evolution
  {
    id: 'sabotage_ultimate_chaos_ascension',
    name: 'Chaos Ascension',
    description: 'You become living chaos incarnate. All order ceases to exist around you, enemies cannot coordinate actions, beneficial magic fails automatically, and you can unravel any effect with a thought.',
    icon: 'ability_rogue_wrongfullyaccused',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['sabotage_apocalypse_system_crash', 'sabotage_apocalypse_chaos_god', 'sabotage_nexus_pandemonium'],
  }
];
