export const ANIMIST_THORNWARDEN = [
  {
    id: 'tw_t0_calcified_skeleton',
    name: 'Calcified Skeleton',
    description: 'Bryngloom fungal threads weave through bone to fortify the frame. Gain +1 DR per rank. When a totem is within 10ft, gain +5% physical resistance per rank. Defensive foundation.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'defensive'
  },
  {
    id: 'tw_t1_ribcage_prison',
    name: 'Ribcage Prison',
    description: 'Spirits of the deep swamp animate bone to ensnare the living. Your bone-cage lockdowns last +1 round per rank. Trapped targets have -2 Agility per rank. Control.',
    icon: 'spell_nature_stranglevines',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'tw_t0_calcified_skeleton',
    category: 'control'
  },
  {
    id: 'tw_t1_runic_foundation',
    name: 'Runic Foundation',
    description: 'Ancestral spirits guide the carver\'s hand to conserve life essence. Rune carving costs 1 less HP per rank (minimum 0). Stationary stance generates +1 resonance at 15+ instead of 14+. Economy.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'tw_t0_calcified_skeleton',
    category: 'resonance_economy'
  },
  {
    id: 'tw_t2_thorn_wall',
    name: 'Thorn Wall',
    description: 'Fungal growths burst from hallowed earth to form razor barricades. Your bone barriers deal 1d4 piercing damage per rank to enemies that touch them. Your runic walls block line of sight completely per rank. Control + Damage.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'tw_t1_ribcage_prison',
    category: 'damage'
  },
  {
    id: 'tw_t2_bone_anchor',
    name: 'Bone Anchor',
    description: 'Root-like spirits bind the Bryngloom shaman to the swamp\'s unyielding earth. When Runic Shatter triggers, reduce backlash by 1d10 per rank. Resistance to forced movement checks +2 per rank. Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'tw_t1_ribcage_prison',
    category: 'defensive'
  },
  {
    id: 'tw_t3_scarred_domain',
    name: 'Scarred Domain',
    description: 'The Bryngloom\'s fungal corruption spreads across the battlefield, choking arcane energy. Your runic zones double in area per rank. Enemies within zones have -10% magical resistance per rank. Control.',
    icon: 'inv_misc_scalesofjustice',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'tw_t2_thorn_wall',
    category: 'control'
  },
  {
    id: 'tw_t4_thornwarden_capstone',
    name: 'The Ironwood Cage',
    description: 'Ancestral totems erupt with petrified mycelium to imprison the mightiest foe. Once per combat, create an impenetrable bone cage around a target that cannot be destroyed for 3 rounds. All enemies within 20ft of the cage are slowed by 50%. Cost: 10 Resonance. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'tw_t3_scarred_domain',
    category: 'win_condition'
  }
];

export const ANIMIST_SPIRIT_BINDER = [
  {
    id: 'sb_t0_starved_pack',
    name: 'Starved Pack',
    description: 'Hungry spirits of the Bryngloom mire answer the shaman\'s call with savage fury. Your beast summons deal +1 damage per rank to bleeding or trapped targets. Summon damage scales +5% per rank with Ancestral Resonance. Damage.',
    icon: 'ability_hunter_pet_attack',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'damage'
  },
  {
    id: 'sb_t1_curse_mastery',
    name: 'Curse Mastery',
    description: 'Swamp spirits amplify the sting of every hex laid upon the wicked. Curses generate +1 resonance per rank. Cursed enemies take +10% increased damage from all sources per rank. Resonance economy + Damage.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'sb_t0_starved_pack',
    category: 'resonance_economy'
  },
  {
    id: 'sb_t1_soul_siphon',
    name: 'Soul Siphon',
    description: 'Fungal roots drink deep from the life force of the fallen. When you kill a cursed enemy, heal 1d6 HP per rank and gain +2 resonance per rank. Sustain + Resonance economy.',
    icon: 'spell_shadow_lifedrain01',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'sb_t0_starved_pack',
    category: 'sustain'
  },
  {
    id: 'sb_t2_specter_link',
    name: 'Specter Link',
    description: 'The Bryngloom binds summoner and spirit in a pact of shared pain and vengeance. Your summons share damage with you but gain +20% damage per rank. When a summon dies, explode for 2d6 necrotic per rank to adjacent enemies. Damage.',
    icon: 'spell_shadow_summonvoidwalker',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'sb_t1_curse_mastery',
    category: 'damage'
  },
  {
    id: 'sb_t2_ancestral_shroud',
    name: 'Ancestral Shroud',
    description: 'Mists of the Bryngloom wrap the shaman in spectral fungi that ward against decay. Gain +5% necrotic resistance per rank. When at 15+ resonance, the psychic damage from spirit demand is reduced by 1d4 per rank. Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'sb_t1_curse_mastery',
    category: 'defensive'
  },
  {
    id: 'sb_t3_death_bargain',
    name: 'Bone-Choir Bargain',
    description: 'Ancient ancestors stir in the Bryngloom depths, offering power to those who dare negotiate. Spirit invocations cost 1 less resonance per rank. When you invoke the Bone-Choir, heal 2d8 HP per rank from the necrotic overflow. Win condition.',
    icon: 'ability_rogue_deadliness',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'sb_t2_specter_link',
    category: 'win_condition'
  },
  {
    id: 'sb_t4_spirit_binder_capstone',
    name: 'The Triune Ancestors',
    description: 'The Bryngloom\'s eldest spirits return what death took. Once per long rest, when a cursed enemy dies, automatically invoke the Bone-Choir at half resonance cost and resurrect up to 2 fallen allies within 30ft. Cost: 5 Resonance. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
        requires: 'sb_t3_death_bargain',
    category: 'win_condition'
  }
];

export const ANIMIST_STORMSCRIBE = [
  {
    id: 'ss_t0_galvanic_crown',
    name: 'Galvanic Crown',
    description: 'Storm spirits of the Bryngloom crackle through the air around every raised totem. Your spells deal +1d4 lightning damage per rank when standing within 10ft of any totem. Lightning strikes chain to 1 additional target per rank at 2 ranks+. Damage.',
    icon: 'spell_lightning_lightningbolt01',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'damage'
  },
  {
    id: 'ss_t1_blood_brand',
    name: 'Blood Brand',
    description: 'Fungal spirits seal the shaman\'s offering into the flesh to empower allies. When you carve an inscription onto an ally, the ally gains +1 to attack rolls per rank for 5 rounds. Self-damage reduced by 1 per rank. Support.',
    icon: 'ability_rogue_findweakness',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'ss_t0_galvanic_crown',
    category: 'support'
  },
  {
    id: 'ss_t1_healing_sap',
    name: 'Healing Sap',
    description: 'Mycelial networks carry restorative energy from the Bryngloom\'s heart to those in need. Your healing totems restore +1d4 HP per rank per tick. When a buffed ally deals damage, you gain +1 resonance per rank. Support + Resonance economy.',
    icon: 'spell_nature_healingway',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'ss_t0_galvanic_crown',
    category: 'resonance_economy'
  },
  {
    id: 'ss_t2_storm_inscription',
    name: 'Storm Inscription',
    description: 'Lightning-infused spore patterns sear into the weapons of the faithful. Inscribed allies deal +1d4 additional lightning damage per rank on weapon strikes. Your lightning spells pierce 10% resistance per rank. Damage + Support.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'ss_t1_blood_brand',
    category: 'damage'
  },
  {
    id: 'ss_t2_runic_mend',
    name: 'Runic Mend',
    description: 'Bryngloom spirits divert the shaman\'s pain toward the wounds of nearby companions. When you take self-damage from carving, heal the nearest ally for 1d4 per rank. If no ally is near, reduce the self-damage by 1d4 per rank. Support + Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'ss_t1_blood_brand',
    category: 'defensive'
  },
  {
    id: 'ss_t3_spirit_burst',
    name: 'Spirit Burst',
    description: 'The Bryngloom\'s ancient voices surge forth, demanding less tribute for their mighty favor. Spore-Mother and Rune-Singer invocations cost 1 less resonance per rank. After a spirit invocation, your next rune carving generates double resonance. Win condition.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'ss_t2_storm_inscription',
    category: 'win_condition'
  },
  {
    id: 'ss_t4_stormscribe_capstone',
    name: 'The Ancestral Convergence',
    description: 'Every Bryngloom ancestor rises as one to weave storm, bone, and spirit into a single cataclysmic harmony. Once per long rest, channel all three traditions simultaneously. Erupt 3 totems, inscribe all allies within 20ft, and invoke the Spore-Mothers for a massive heal, all in a single turn. Cost: 15 Resonance. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'ss_t3_spirit_burst',
    category: 'win_condition'
  }
];
