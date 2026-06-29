# Mythrill Class Depth — Revised & Critically Assessed

## What Changed and Why

This revision fixes problems found in critical assessment:

| Problem | Fix |
|---|---|
| Spellguard specs all generate from enemy magic = useless vs non-casters | Added baseline passive generation for all specs, bonus sources stay spec-specific |
| Berserker Warlord builds from allies taking damage = passive, roots for friends to suffer | Changed to generates from BOTH dealing and taking damage at lower rates (leads from the front) |
| Berserker Blind Fury = may attack allies = table friction | Replaced with cannot be healed by allies at high Blood-Heat (already in existing data, no PvP) |
| Augur Harbinger/Hierophant CANNOT generate one resource at all = too rigid | Changed to generates the off-resource at 1/3 rate instead of zero |
| Apex Prey Mentality (3+ enemies = disadvantage) conflicts with Bladestorm who wants to be surrounded | Replaced with Tunnel Vision (over-focusing one target makes you Exposed to others) |
| Minstrel Instrument Dependency = total shutdown if disarmed | Softened to reduced effectiveness, can improvise with any object |
| Matchup-dependent specs (Iron Verdict, Iron Dancer, Dissonance) | Added baseline generation so they always produce SOMETHING |
| Prophet's Curse too easily avoided (just don't predict) | Changed to trigger passively when enemies save against your spells |
| Niche weaknesses (polymorph, swimming, bleed-only) | Replaced with more frequent triggers |

---

## 1. Arcanoneer

**Assessment**: Specs are clean and distinct. Banking mechanic on Sphere Architect is strong enough to offset fewer dice. Quirk is too passive — spell identification is utility, not identity.

**Resource**: Sphere Matrix

### Specs
- **Prism Mage** — bonus spheres for casting the SAME element consecutively (streak: +1 per consecutive cast, max +3). Spend 2 identical spheres to overload a pure combo (+50%)
- **Entropy Weaver** — bonus spheres when Wild Magic Surge triggers (+2). Spend 1 Chaos sphere to reroll any die
- **Sphere Architect** — rolls 3d8 (fewer) but can BANK 3 spheres between turns. Spend 2 banked to cast any combo as a free action

### Quirk: Mana Resonance
Your body has adapted to channel magic constantly. You regenerate 1 mana per round in combat (even without casting). This makes you the only class with passive mana recovery — but it also means your body hums with arcane energy, making you detectable by magical sensing at twice the normal range.

### Weakness: Mana-Anchored
Your basic attacks cost 1 mana. At 0 mana, basic attacks deal half damage. You are mentally trained, not physically — without your magical reserves, you are a scholar swinging a stick.

---

## 2. Animist

**Assessment**: Spirit Binder has a runaway loop risk (specters generate resonance → summon more specters). Defiled Ground weakness is too punishing for dungeon-heavy campaigns. Quirk is niche.

**Resource**: Ancestral Resonance (0-20)

### Specs
- **Thornwarden** — builds from enemies attacking creatures inside your totem network (+2). Spend 5 to make a totem pulse 3d6 primal in 10ft
- **Spirit Binder** — builds from specters dealing damage (+3, max +6 per round to prevent runaway). Spend 4 to summon an extra specter (over cap, 1 round)
- **Stormscribe** — builds from inscribed allies dealing damage (+2). Spend 3 to refresh an ally's inscription duration

### Quirk: Ancestral Communion
During a short rest, you can enter a 10-minute trance to ask one yes/no question of your ancestors about the immediate area (is it safe ahead, is this object cursed, did someone die here recently). The answer is always truthful but sometimes cryptic.

### Weakness: Spirit Erosion Fatigue
At 15+ Resonance, you take 1d6 wyrd damage at the start of each turn (your body is a conduit for too many spirits). This damage cannot be reduced by resistances. You must spend resonance or suffer — hoarding is punished.

---

## 3. Apex

**Assessment**: Prey Mentality directly conflicts with Bladestorm (wants to be surrounded). Quirk is too campaign-dependent.

**Resource**: Quarry Marks (max 3)

### Specs
- **Bladestorm** — builds from chaining to NEW targets (+1 per new target). Spend 3 to throw glaive 360° (all enemies in 10ft)
- **Beastmaster** — companion generates its own marks on attacks. Spend 2 to command companion to intercept an attack meant for an ally
- **Shadowblade** — stealth attacks generate 2 marks. Spend 3 to Vanish (invisible 1 round, breaks on action)

### Quirk: Marked for Death
When you study a creature for 1 round (no attacks), you learn its lowest saving throw, damage vulnerability, and current HP. This makes you the ultimate tactician — but you sacrifice a turn of combat to gain the information.

### Weakness: Tunnel Vision
When you attack the same target 3+ consecutive times, you become Exposed to damage from all OTHER enemies (+50% damage taken from anyone you are not focused on). Your predatory focus is absolute but it blinds you to peripheral threats. (Rewards target-switching, synergizes with Bladestorm's chain mechanic.)

---

## 4. Augur

**Assessment**: "CANNOT generate one resource" is too rigid. Harbinger can't heal until something dies. Hierophant can't deal proactive damage. Both feel broken in boss fights with one target. Gore-Sight weakness is too narrow.

**Resource**: Benediction (0-15) + Malediction (0-15)

### Specs
- **Auspex** — every spell generates 1 BN AND 1 ML equally. At 10/10, spend all to cast any spell free
- **Harbinger** — spells generate ML at full rate, BN at 1/3 rate. Spend 5 ML to ignore all enemy resistances for 1 round
- **Hierophant** — spells generate BN at full rate, ML at 1/3 rate. Spend 5 BN to make all allies in 15ft Guarded against all damage for 2 rounds (-25% damage taken)

### Quirk: Haruspex's Eye
When you damage a creature with a spell, you see a brief flash of their next intended action (what they plan to do next turn). This gives you a tactical preview — you know what's coming before it happens.

### Weakness: Sanguine Dependency
Your omens require fresh blood as a material component. Each spell costs 1 HP to cast (in addition to mana). If you are at 0 HP, you cannot cast — your well is dry. This makes the Augur the only caster who literally pays blood for every spell.

---

## 5. Berserker

**Assessment**: Pain Is Fuel quirk is excellent. Warlord's generation was too passive. Blind Fury causes table friction. Both fixed.

**Resource**: Blood-Heat (0-100)

### Specs
- **Savage** — builds from DEALING damage (+2/hit, +5/crit). At 80+, spend 20 to make the target Exposed to your next attack (+50% damage, bypasses equipment DR and resistances)
- **Juggernaut** — builds from TAKING damage (+3/hit taken). At 40+, spend 10 Blood-Heat to gain flat damage reduction: each 2 Blood-Heat spent reduces incoming hits by 1 damage (max -10 per hit) for 2 rounds
- **Warlord** — builds from BOTH dealing and taking damage (+1 each way — versatile but slower per source). Spend 10 to grant one ally +2d6 on their next attack

### Quirk: Pain Is Fuel
When you take damage from an external source, you may choose to take +50% damage from that hit. If you do, gain that much Blood-Heat. Deliberate tactical choice — you let the blow land harder to fuel your rage.

### Weakness: Fury's Rejection
At 80+ Blood-Heat, your body rejects all external healing. Spells, potions, and abilities from allies have no effect on you. You can only heal through your own abilities or by dropping below 80 Blood-Heat. (Already exists in Boiling Veins — codified as the class-wide weakness. No PvP friction.)

---

## 6. Chronarch

**Assessment**: Cleanest design in the roster. All 3 specs are distinct, intuitive, and playable. Chronal Drag is an excellent weakness. No changes needed.

**Resource**: Time Shards (0-10) + Temporal Strain

### Specs
- **Arc of Stasis** — builds from CC landing (+1 per freeze/slow/stun). Spend 3 to freeze an additional target on next CC
- **Arc of Displacement** — builds from teleporting (+1 per teleport). Spend 2 to teleport again as free action (chain blink)
- **Arc of Rewinding** — builds from healing (+1 per 5 HP rewound). Spend 4 to rewind an ally's entire last turn

### Quirk: Temporal Sense
Cannot be surprised. Always know exact time. Sense temporal distortions within 60ft.

### Weakness: Chronal Drag
Each round of combat, movement drops 5ft (cumulative, max -25ft). Resets after combat. You slow the longer you manipulate time.

---

## 7. False Prophet

**Assessment**: Truth Aversion is excellent. Cultist's ritual-based generation is slow to start. Lie Detector quirk could trivialize social encounters.

**Resource**: Madness Points (0-20)

### Specs
- **Voidcaller** — builds from DAMAGE spells (1d4 per cast). At 15+, spend 5 to auto-crit your next damage spell
- **Deceiver** — builds from CONTROL spells (1d4 per charm/fear/confusion cast). At 12+, spend 4 to hit 2 targets with next control spell
- **Cultist** — builds from ANY spell cast while a ritual is active (+1 per round per active ritual, AND +1 per spell cast). At 18+, spend all Madness to instantly complete a ritual with double effect

### Quirk: Empathetic Static
You sense the emotional state of any creature within 30ft (afraid, angry, deceptive, calm). This is not mind-reading — you feel what they feel, not what they think. Advantage on Insight checks.

### Weakness: Truth Aversion
Each verifiable, undeniable truth you speak aloud deals 1 wyrd damage per sentence. You compulsively hedge, mislead, and reframe. This is not a choice — it is woven into your mind by Keth-Amar. (In combat, this rarely matters. In social/investigation scenes, it creates real tension — the party needs information, but you physically cannot just tell the truth plainly.)

---

## 8. Gambit

**Assessment**: Solid specs. Karmic Magnet punishes players for allies' bad rolls — feels unfair. Quirk is standard.

**Resource**: Fortune Points (spec-variable cap) + Karmic Debt

### Specs
- **Probability Savant** — FP from consistent plays (+1 per successful save, +1 per hit). Spend 3 FP to force enemy reroll a successful save
- **High Roller** — FP from self-damage (+2 per self-damage instance). Spend 5 FP + take 2d6 self-damage to double next spell's dice
- **Karmic Weaver** — FP from link activations (+1 per linked target damaged). Spend 4 FP to link 2 enemies (one takes damage, other takes half)

### Quirk: Fate's Favorite
Once per long rest, reroll any single d20. Must keep the new result.

### Weakness: Cosmic Interest
Whenever you spend Fortune Points, you gain 1 Karmic Debt per 3 FP spent. Karmic Debt gives you -1 to all saves per 5 Debt. Debt decays at 1 per short rest. (The house always collects. Your power is borrowed, and the interest compounds. This makes FP spending a real decision, not just a resource to dump.)

---

## 9. Harbinger

**Assessment**: Prophet's Curse is too easily avoided. Fate Rift rewards passivity. Otherwise solid.

**Resource**: Mayhem (0-30) + Prophecy Counters

### Specs
- **Wild Prophet** — builds from area spells (+1 per enemy hit). Spend 10 Mayhem to enlarge next area spell by +10ft radius
- **Death's Seer** — builds from single-target spells (+2 per hit). Spend 8 Mayhem to guarantee crit on next single-target spell
- **Fate Rift** — builds from BOTH casting (+1 per spell) AND prophecies remaining unfulfilled (+1 per round per active prophecy). Spend 15 to detonate all prophecies at once

### Quirk: Doom Sense
Sense any creature below 15% HP within 60ft. Advantage on Insight to predict creature actions.

### Weakness: Backlash Channel
When an enemy succeeds on a saving throw against your spell, you take 1 wyrd damage per Mayhem you currently hold (max 5). Your prophecies are not free — when reality resists them, the pressure returns to you. (Triggers frequently in combat — every enemy save costs you.)

---

## 10. Inquisitor

**Assessment**: Iron Verdict is useless against non-casters. Consecration is situational.

**Resource**: Authority (0-10)

### Specs
- **Witch Hammer** — builds from stealth attacks (+2) and demon kills (+3). Spend 4 to recall all demons to your position (1d6 each in 5ft on arrival)
- **Iron Verdict** — baseline +1 Authority per round. BONUS +3 per spell countered/absorbed. Spend 5 to enlarge anti-magic zone to 30ft for 1 round
- **Hollow Saint** — builds from moving toward enemies (+1 per 10ft). Spend 3 for +20ft speed and slow immunity for 1 round

### Quirk: Demonic Witness
Bound demons share senses. Advantage on Perception in darkness. Detect supernatural creatures within 30ft by scent.

### Weakness: Silver Sensitivity
Silver weapons make you Exposed to their damage (+50%). Silver is the universal anti-supernatural material, and your demonic bindings make you partially supernatural. (Silver weapons are common — merchants, guards, and witch hunters carry them.)

---

## 11. Lunarch

**Assessment**: Sanguine Warden's forced shift removes player agency. Light Sensitivity is generic.

**Resource**: Sanity Erosion / Full Moon cycle

### Specs
- **Hollow Sentinel** — voluntary shift (1d8 blight + mana). Full Moon 3 rounds: attacks treat the target as Exposed (+50% damage), crits on 18-20
- **Void Caller** — voluntary shift (1d8 blight + mana). Full Moon 2 rounds: spells cost 50% less mana, +2d8 wyrd
- **Sanguine Warden** — voluntary shift OR auto-shift at 25% HP (safety valve). Full Moon 3 rounds: melee attacks heal 50% of damage dealt, Delirium table is gentler (no ally-attack results)

### Quirk: Phase Sight
You can see through illusions, invisibility, and magical concealment within 30ft. The parasite perceives reality differently than mortal eyes — it sees the seams.

### Weakness: Sanity Erosion
Each time you enter Full Moon, roll 1d6. On a 1, you develop a temporary derangement (roll on Delirium Table) that persists for 1 hour after combat ends. The parasite's influence lingers even when the moon has passed.

---

## 12. Martyr

**Assessment**: Specs are strong. Compulsive Aid removes player agency too aggressively.

**Resource**: Devotion (0-40, thresholds at 10/20/30/40)

### Specs
- **Redemption** — builds from allies taking damage within 30ft (+1 per 5 HP ally loses). At threshold 3: all allies in 30ft regain 3d6 HP
- **Zealot** — builds from self-inflicted damage (+1 per 3 HP). At threshold 3: next attack deals +(Devotion x 2) ember
- **Ascetic** — builds from enemy attacks against you (+1 per 5 HP you lose). At threshold 3: become Guarded against all damage for 2 rounds (-25% damage taken). Decays 4x slower

### Quirk: Pain Assessment
Touch a creature to know exactly how many HP it's missing, last damage type taken, and whether it's stable or dying.

### Weakness: Sympathetic Wounds
When an ally within 30ft takes a critical hit, you take 1d6 wyrd damage (you feel their pain through your devotional bond). This triggers frequently in combat and reinforces your identity — you literally share the party's suffering.

---

## 13. Minstrel

**Assessment**: Instrument Dependency was total shutdown — too punishing. Dissonance was matchup-dependent.

**Resource**: Musical Notes (build 4-note cadences)

### Specs
- **Battlechoir** — notes from allies dealing damage (+1 per ally hit in 30ft). Finisher: all allies in 30ft gain +1d6 damage for 2 rounds
- **Soulsinger** — notes from healing (+1 per 5 HP healed). Finisher: target ally regains 1 spent resource
- **Dissonance** — baseline +1 note per round. BONUS +1 per enemy failed save in 30ft. Finisher: all enemies in 20ft take 2d6 wyrd + Deafened 1 round

### Quirk: Perfect Pitch
Advantage on Performance. Mimic any voice or sound heard in the last hour.

### Weakness: Disrupted Cadence
When you take damage from a critical hit, you lose 1 random note from your current cadence progress. A well-placed blow can shatter your building symphony. (Punishes positioning mistakes without shutting you down entirely. You can still cast — you just lose momentum.)

---

## 14. Plaguebringer

**Assessment**: Solid overall. Decay Harbinger slightly too passive. No major fixes needed.

**Resource**: Virulence (0-100) + Stage System

### Specs
- **Virulent Spreader** — builds from active plague count (+1 per round per active plague). Spend 30 to detonate all plagues at once (1d6 per Stage per target)
- **Torment Weaver** — builds from link activations (+3 per linked target damaged). Spend 25 to force all linked targets WIS save or Stunned
- **Decay Harbinger** — builds from advancing affliction stages (+5 per stage advanced) and passively (+1 per round). Spend 40 to make next plague Permanent

### Quirk: Toxic Immunity
Immune to disease and poison. Resistance to blight. Your blood works as antivenom for allies.

### Weakness: Ember Purge
If an enemy afflicted by your plague takes ember damage, the affliction is cleansed immediately and you lose 5 Virulence per cleansed stage. Ember is the enemy of rot — allied Pyrofiends and ember-wielding enemies alike can destroy your entire garden in one spell.

---

## 15. Pyrofiend

**Assessment**: Cleanest, most intuitive design in the roster. No changes needed.

**Resource**: Inferno Level (0-9)

### Specs
- **Inferno** — +1 Level per ember spell cast. At Level 7+, crits on 18-20. At Level 9, keep casting 1 round even at 0 HP
- **Wildfire** — +1 Level per 2 spells. Cap 7. At Level 5+, fire leaves burning ground
- **Apostate's Path** — choose to ascend OR descend by 2 per turn. Can spend 2 Levels to heal 2d6

### Quirk: Fireproof
Immune to non-magical ember. Resistant to ember damage. Skin always warm to the touch.

### Weakness: Cold Blood
Rime damage deals +50% to you (Exposed). In rime-saturated environments (blizzards, ice caves, magical cold), you have disadvantage on Constitution saves. The furnace inside you cannot be allowed to cool — when it does, you are mortal.

---

## 16. Revenant

**Assessment**: Strong. Running water weakness is niche but the divine vulnerability is solid.

**Resource**: Death Toll (0-20) + Death Shroud + Phylactery

### Specs
- **Sanguine Harvest** — builds from melee hits (+2) and kills (+5). Spend 8 to summon specter instantly
- **Frost Sovereign** — builds from freezes (+3) and shatters (+5). Spend 6 to extend Shroud aura to 30ft
- **Phylactery Anchor** — builds from damage taken (+1 per 5 HP lost). Spend 10 to store 25 HP in Phylactery

### Quirk: Death Sense
Sense any creature below 25% HP within 60ft. Know when someone died within 60ft in last 24 hours.

### Weakness: Unholy
Divine damage deals +50% to you (Exposed). Divine-consecrated weapons and relics deal +1d6 divine on contact. Consecrated ground gives you disadvantage on all saves. (Divine sources are common — Sun Cleric equivalents, blessed items, temples, divine spellcasters.)

---

## 17. Shaper

**Assessment**: Iron Dancer was matchup-dependent (needs melee attackers). Form Instability was too niche.

**Resource**: Kinetic Flux (0-20) + Body Toll (0-10)

### Specs
- **Flow Master** — builds from form shifts (+3 per shift). Spend 5 to fuse 2 forms for 1 round (both passives)
- **Iron Dancer** — baseline +1 Flux per round. BONUS +3 per successful riposte/counter. Spend 4 to harvest slain enemy trait (+2 stat for combat)
- **Primal Shadow** — builds from stealth attacks (+4 per ambush). Spend 3 to enter Void Predator from any form

### Quirk: Form Flexibility
Advantage on Acrobatics/Athletics to escape grapples and restraints. Squeeze through any gap your head fits.

### Weakness: Metabolic Strain
Each time you shift forms, you take 1 blight damage (your cells tear and reform). This damage is small but cumulative — a Shaper who shifts 10 times in a combat takes 10 blight damage. You cannot spam shifts without paying the biological cost.

---

## 18. Spellguard

**Assessment**: CRITICAL FIX. All 3 specs generated from enemy magic use = useless vs non-casters. Added baseline generation.

**Resource**: Arcane Radiation / Resonance

### Specs
- **Void-Scarred Bastion** — baseline +1 Resonance per round. BONUS +2 per spell intercepted. Spend 5 to create 15ft shield zone (allies take half magic damage, 1 round)
- **Entropic Eraser** — baseline +1 Resonance per round. BONUS +2 per spell reflected. Spend 3 to reflect at 150% instead of 125%
- **Leyline Devourer** — baseline +1 Resonance per round. BONUS +1 per 2 mana drained from enemies. Spend 4 to recover 1d4 mana to self or ally

### Quirk: Arcane Sight
See active magic auras within 60ft. Advantage on Arcana to identify spells/items/effects.

### Weakness: Brittle Plating
Void-glass plating is fragile against brute force. You are Exposed to physical bludgeoning damage (+50% damage taken). A warhammer is more dangerous to you than a fireball.

---

## 19. Toxicologist

**Assessment**: Already the strongest spec design (per-spec resources). Saboteur slightly matchup-dependent. Added baseline.

**Resource**: Toxin Vials / Contraption Parts

### Specs
- **Venomancer** — builds from poison ticks (+2 per tick, max 8). Spend 5 Vials for super-toxin (+4d10 blight, DC 18 CON)
- **Gadgeteer** — builds from combat events (hit=1, kill=3, crit=5, max 6). Spend 4 Parts for scrap-mech suit (2 rounds: reduces incoming damage by 2 per hit, 2d8 storm melee)
- **Saboteur** — baseline +1 Kit per round. BONUS +1 per enemy failed save, +3 per trap triggered (max 5). Spend 5 Kits for 6d6 in 20ft + debuff by target type

### Quirk: Poison Resistance
Immune to own poisons. Resistance to blight. Blood works as antivenom.

### Weakness: Volatile Concoctions
When you take ember damage, roll 1d6. On a 1, a random vial/part detonates (2d6 blight to you, 5ft radius).

---

## 20. Warden

**Assessment**: Specs are clean. Iron Weight (swimming) is too niche. Replaced.

**Resource**: Tension (0-5)

### Specs
- **Flayed Stalker** — builds from stealth attacks (+2) and bleed ticks (+1). Spend 4 to Vanish (invisible 1 round)
- **Iron Gaoler** — builds from cages (+2 per cage) and caged enemies at turn start (+1). Spend 4 to cage additional target
- **Relentless Tormentor** — builds from consecutive same-target hits (+1 per consecutive hit). Spend 3 for +3d6 on next attack vs focused target
- **Monolith** — builds from damage taken (+1 per 10 HP lost). Spend 3 Tension to detonate your calcified plates (5d6 in 20ft, Stun 1 round, you lose your damage reduction bonus for 2 rounds)

### Quirk: Spiritual Anchor
Always know direction back to any location spent 1+ hour at. Advantage on Survival to navigate.

### Weakness: Chain-Bound
Your chains are spiritually tethered to you. When an enemy pulls, grapples, or forcibly moves you, they deal +1d6 physical damage (the chains tear at your grafts as they resist the movement). You cannot be easily repositioned — and attempts to do so hurt.

---

## Fix Tracker — To Address When Implementing Class Changes

| Class | What Was Broken | Fix Applied | Status |
|---|---|---|---|
| Arcanoneer | Passive quirk (just spell ID) | Mana Resonance: passive 1 mana/round regen + detectable at double range by magical sensing | Pending |
| Animist | Spirit Binder runaway loop (specters generate resonance → more specters → infinite) | Capped specter generation at +6/round max. Replaced Defiled Ground (too punishing for dungeons) with Spirit Erosion Fatigue (1d6 wyrd/turn at 15+ Resonance) | Pending |
| Apex | Prey Mentality weakness (3+ enemies = disadvantage) conflicted directly with Bladestorm spec which wants to be surrounded | Replaced with Tunnel Vision: attacking same target 3+ times = Exposed to other enemies (+50% damage). Synergizes with chain mechanic | Pending |
| Augur | Harbinger/Hierophant CANNOT generate off-resource at all (too rigid, useless in single-target boss fights) | Changed to generates off-resource at 1/3 rate. Replaced Gore-Sight (too narrow, only bleed) with Sanguine Dependency (every spell costs 1 HP) | Pending |
| Berserker | Warlord built from allies taking damage = passive, roots for friends to suffer. Blind Fury = may attack allies = table friction | Warlord now builds from BOTH dealing and taking damage (+1 each way). Blind Fury replaced with Fury's Rejection: at 80+ Blood-Heat, body rejects all external healing (no PvP) | Pending |
| Chronarch | Nothing — cleanest design in roster | No changes needed | Clean |
| False Prophet | Cultist ritual generation too slow to start. Lie Detector trivialized social encounters | Cultist now generates from any spell cast while ritual active (+1 per round AND +1 per spell). Lie Detector replaced with Empathetic Static (sense emotional state, not lies) | Pending |
| Gambit | Karmic Magnet punished players for allies' bad rolls (felt unfair, no agency) | Replaced with Cosmic Interest: spending FP gains Karmic Debt at 1 per 3 FP. Debt gives -1 to all saves per 5 Debt. Player controls their own debt | Pending |
| Harbinger | Prophet's Curse was opt-in (player avoids by not predicting aloud). Fate Rift rewarded passivity (not detonating prophecies) | Prophet's Curse replaced with Backlash Channel: enemy saves against your spells deal you 1 wyrd per Mayhem held (triggers frequently, unavoidable). Fate Rift now generates from BOTH casting AND patience | Pending |
| Inquisitor | Iron Verdict generated ONLY from countered spells = useless vs non-casters | Added baseline +1 Authority per round for Iron Verdict. Bonus +3 per spell countered stays | Pending |
| Lunarch | Sanguine Warden forced shift at 50% HP removed player agency. Light Sensitivity was generic darkvision tradeoff | Sanguine Warden changed to voluntary OR auto-shift at 25% HP (safety valve, not forced). Light Sensitivity replaced with Sanity Erosion: each Full Moon entry has 1-in-6 chance of temporary derangement lasting 1 hour post-combat | Pending |
| Martyr | Compulsive Aid forced movement toward wounded allies (removed player agency) | Replaced with Sympathetic Wounds: when ally within 30ft takes a crit, you take 1d6 wyrd. Frequent, thematic, no forced action | Pending |
| Minstrel | Instrument Dependency = total shutdown if disarmed (no other class can be permanently neutralized this hard). Dissonance generated only from enemy failed saves (matchup-dependent) | Instrument Dependency softened to Disrupted Cadence: taking a crit loses 1 random note (reduced effectiveness, not shutdown). Dissonance given baseline +1 note/round + bonus from enemy failed saves | Pending |
| Plaguebringer | No major issues. Damage type terminology cleanup | Ember Purge weakness tightened: ember damage cleanses afflictions immediately, -5 Virulence per cleansed stage | Clean |
| Pyrofiend | Nothing — cleanest and most intuitive design in roster | No changes needed | Clean |
| Revenant | Holy references needed correction to divine terminology | Weakness reframed: divine damage +50% (Exposed), divine-consecrated weapons +1d6 divine, consecrated ground = disadvantage on saves | Clean |
| Shaper | Iron Dancer generated only from ripostes = useless vs ranged/caster enemies. Form Instability too niche (polymorph/petrification rare) | Iron Dancer given baseline +1 Flux/round + bonus from ripostes. Form Instability replaced with Metabolic Strain: each form shift deals 1 blight damage (cumulative, frequent) | Pending |
| Spellguard | CRITICAL: all 3 specs generated from enemy magic use = completely useless vs non-casters | Added baseline +1 Resonance/round for ALL specs. Bonus sources (intercept/reflect/drain) stay spec-specific | Pending |
| Toxicologist | Saboteur generated only from enemy failed saves = slightly matchup-dependent | Added baseline +1 Kit/round. Bonus from failed saves and trap triggers stays | Pending |
| Warden | Iron Weight (swimming) was too niche to matter in most campaigns | Replaced with Chain-Bound: forced movement (pull/grapple/reposition) deals +1d6 physical to you. Frequent in combat | Pending |
