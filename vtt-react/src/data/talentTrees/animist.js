export const ANIMIST_THORNWARDEN = [
  {
    id: 'tw_t0_calcified_skeleton',
    name: 'Calcified Skeleton',
    description: 'Gain +1 DR per rank. When a totem is within 10ft, gain +5% physical resistance per rank. Defensive foundation.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'defensive'
  },
  {
    id: 'tw_t1_ribcage_prison',
    name: 'Ribcage Prison',
    description: 'Your bone-cage lockdowns last +1 round per rank. Trapped targets have -2 Agility per rank. Control.',
    icon: 'spell_nature_stranglevines',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'tw_t0_calcified_skeleton',
    category: 'control'
  },
  {
    id: 'tw_t1_runic_foundation',
    name: 'Runic Foundation',
    description: 'Rune carving costs 1 less HP per rank (minimum 0). Stationary stance generates +1 resonance at 15+ instead of 14+. Economy.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'tw_t0_calcified_skeleton',
    category: 'resonance_economy'
  },
  {
    id: 'tw_t2_thorn_wall',
    name: 'Thorn Wall',
    description: 'Your bone barriers deal 1d4 piercing damage per rank to enemies that touch them. Your runic walls block line of sight completely per rank. Control + Damage.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'tw_t1_ribcage_prison',
    category: 'damage'
  },
  {
    id: 'tw_t2_bone_anchor',
    name: 'Bone Anchor',
    description: 'When Runic Shatter triggers, reduce backlash by 1d10 per rank. Resistance to forced movement checks +2 per rank. Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'tw_t1_ribcage_prison',
    category: 'defensive'
  },
  {
    id: 'tw_t3_scarred_domain',
    name: 'Scarred Domain',
    description: 'Your runic zones double in area per rank. Enemies within zones have -10% magical resistance per rank. Control.',
    icon: 'inv_misc_scalesofjustice',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'tw_t2_thorn_wall',
    category: 'control'
  },
  {
    id: 'tw_t4_thornwarden_capstone',
    name: 'The Ironwood Cage',
    description: 'Once per combat, create an impenetrable bone cage around a target that cannot be destroyed for 3 rounds. All enemies within 20ft of the cage are slowed by 50%. Cost: 10 Resonance. Win condition.',
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
    description: 'Your beast summons deal +1 damage per rank to bleeding or trapped targets. Summon damage scales +5% per rank with Ancestral Resonance. Damage.',
    icon: 'ability_hunter_pet_attack',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'damage'
  },
  {
    id: 'sb_t1_curse_mastery',
    name: 'Curse Mastery',
    description: 'Curses generate +1 resonance per rank. Cursed enemies take +10% increased damage from all sources per rank. Resonance economy + Damage.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'sb_t0_starved_pack',
    category: 'resonance_economy'
  },
  {
    id: 'sb_t1_soul_siphon',
    name: 'Soul Siphon',
    description: 'When you kill a cursed enemy, heal 1d6 HP per rank and gain +2 resonance per rank. Sustain + Resonance economy.',
    icon: 'spell_shadow_lifedrain01',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'sb_t0_starved_pack',
    category: 'sustain'
  },
  {
    id: 'sb_t2_specter_link',
    name: 'Specter Link',
    description: 'Your summons share damage with you but gain +20% damage per rank. When a summon dies, explode for 2d6 necrotic per rank to adjacent enemies. Damage.',
    icon: 'spell_shadow_summonvoidwalker',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'sb_t1_curse_mastery',
    category: 'damage'
  },
  {
    id: 'sb_t2_ancestral_shroud',
    name: 'Ancestral Shroud',
    description: 'Gain +5% necrotic resistance per rank. When at 15+ resonance, the psychic damage from spirit demand is reduced by 1d4 per rank. Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'sb_t1_curse_mastery',
    category: 'defensive'
  },
  {
    id: 'sb_t3_death_loa_bargain',
    name: 'Death Loa Bargain',
    description: 'Loa invocations cost 1 less resonance per rank. When you invoke Baron Samedi, heal 2d8 HP per rank from the necrotic overflow. Win condition.',
    icon: 'ability_rogue_deadliness',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'sb_t2_specter_link',
    category: 'win_condition'
  },
  {
    id: 'sb_t4_spirit_binder_capstone',
    name: 'The Triune Devourer',
    description: 'Once per long rest, when a cursed enemy dies, automatically invoke Baron Samedi at half resonance cost and resurrect up to 2 fallen allies within 30ft. Cost: 5 Resonance. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'sb_t3_death_loa_bargain',
    category: 'win_condition'
  }
];

export const ANIMIST_STORMSCRIBE = [
  {
    id: 'ss_t0_galvanic_crown',
    name: 'Galvanic Crown',
    description: 'Your spells deal +1d4 lightning damage per rank when standing within 10ft of any totem. Lightning strikes chain to 1 additional target per rank at 2 ranks+. Damage.',
    icon: 'spell_lightning_lightningbolt01',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    category: 'damage'
  },
  {
    id: 'ss_t1_blood_brand',
    name: 'Blood Brand',
    description: 'When you carve an inscription onto an ally, the ally gains +1 to attack rolls per rank for 5 rounds. Self-damage reduced by 1 per rank. Support.',
    icon: 'ability_rogue_findweakness',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'ss_t0_galvanic_crown',
    category: 'support'
  },
  {
    id: 'ss_t1_healing_sap',
    name: 'Healing Sap',
    description: 'Your healing totems restore +1d4 HP per rank per tick. When a buffed ally deals damage, you gain +1 resonance per rank. Support + Resonance economy.',
    icon: 'spell_nature_healingway',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'ss_t0_galvanic_crown',
    category: 'resonance_economy'
  },
  {
    id: 'ss_t2_storm_inscription',
    name: 'Storm Inscription',
    description: 'Inscribed allies deal +1d4 additional lightning damage per rank on weapon strikes. Your lightning spells pierce 10% resistance per rank. Damage + Support.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'ss_t1_blood_brand',
    category: 'damage'
  },
  {
    id: 'ss_t2_runic_mend',
    name: 'Runic Mend',
    description: 'When you take self-damage from carving, heal the nearest ally for 1d4 per rank. If no ally is near, reduce the self-damage by 1d4 per rank. Support + Defensive.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'ss_t1_blood_brand',
    category: 'defensive'
  },
  {
    id: 'ss_t3_spirit_burst',
    name: 'Spirit Burst',
    description: 'Simbi and Erzulie invocations cost 1 less resonance per rank. After a spirit invocation, your next rune carving generates double resonance. Win condition.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'ss_t2_storm_inscription',
    category: 'win_condition'
  },
  {
    id: 'ss_t4_stormscribe_capstone',
    name: 'The Ancestral Convergence',
    description: 'Once per long rest, channel all three traditions simultaneously. Erupt 3 totems, inscribe all allies within 20ft, and invoke Simbi for a massive heal, all in a single turn. Cost: 15 Resonance. Win condition.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'ss_t3_spirit_burst',
    category: 'win_condition'
  }
];
