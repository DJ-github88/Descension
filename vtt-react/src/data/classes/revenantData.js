export const REVENANT_DATA = {
  id: "revenant",
  name: "Revenant",
  icon: "fas fa-skull-crossbones",
  color: "#2D1B69",
  role: "Deathcaster / Undying Predator",
  damageTypes: ["blight", "rime", "wyrd"],

  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Blood Rites Kit",
        icon: "Necrotic/Drain Soul",
        items: [
          "Ritual Dagger (1d6 slashing, necrotic resonance — HP sacrificed with this weapon generates +1 Death Toll per strike)",
          "Bloodstained Leather Armor (No agility penalty)",
          "Copper Chalice (ritual focus — reduces HP cost of first spell each combat by 1)",
        ],
        description:
          "The close-quarters path. Your dagger is both weapon and conduit — every cut feeds the Death Toll. Best for Sanguine Harvest builds that plan to drain at melee range.",
      },
      {
        name: "Frost Phylactery Rig",
        icon: "Frost/Frozen in Ice",
        items: [
          "Obsidian Staff (1d8 bludgeoning, +5 ft reach on necrotic and frost spells)",
          "Tattered Robes (+1 frost damage to all spells)",
          "Basalt Phylactery Shard (beginning soul anchor — stores up to 15 Phylactery HP, upgrades as you level)",
        ],
        description:
          "The ranged caster and phylactery-focused path. The staff extends your reach and the shard starts your resurrection insurance early. Best for Frost Sovereign and Phylactery Anchor builds.",
      },
    ],
    standardGear: [
      "Traveler's backpack with sulfur-blackened wraps",
      "Rations (7 days, salt-cured)",
      "Ritual components pouch (iron filings, bone ash, preserved peat-moss)",
      "Lantern with black iron cage",
      "1d10 × 5 tarnished silver pieces",
    ],
    notes: "Revenants cannot wield holy symbols or consecrated weapons — the necrotic resonance in their blood causes such items to crack and dull. Bows and crossbows are forbidden; the Revenant's work requires the press of blood or frost against flesh.",
  },

  overview: {
    title: "The Revenant",
    subtitle: "Death Is Fuel. The Grave Is a Door. You Walk Both Ways.",
    originStory: `Two traditions of death magic, born in the same peat-bogs of the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink>, bound by the same terrible truth: life force is the only currency that matters.

The Vreken Veil-Speaker <LoreLink termId="kora">Kora</LoreLink> was the first to pay it. Desperate to keep the ancestral lights of thirty generations burning, she walked into the marsh-depths and bargained with the Root-Veil, offering her own blood as necrotic thread. The covenant was absolute — every spell she wove drained her own life, generating volatile Blood Tokens that orbited her body like carrion flies. The dead answered. The living recoiled. Kora's voice was reduced to a dry whisper by the overlapping screams of ancestors she could never silence.

The human scribe <LoreLink termId="vesper">Vesper</LoreLink> sought the same bogs decades later, dying of the sumps' lung-rot. He performed the forbidden Rite of the Cold Hearth — binding his soul to a basalt phylactery and inviting the bog's freezing decay to halt his mortal heart. Vesper achieved immortality, but his body became a cold, rotting tomb. His heart beats once an hour. His flesh is cold as bog-iron. He must constantly harvest life force to prevent his skeleton from dissolving.

When the bog-graves began waking on their own — the dead marching toward the Sundered Monoliths without permission — Kora's descendants and Vesper's acolytes recognized that their separate wars were the same war. The necrotic covenant was failing. The peat was turning black. The dead were no longer waiting.

The Revenant was forged in that recognition. Blood magic meets frost stasis. Volatile sacrifice meets methodical harvest. Kora's tokens and Vesper's phylactery are one economy now. The dead answer to a single voice. That voice is yours. It comes out as a whisper, and your hands are always cold.

You died once. That was the easy part. Coming back is where the price starts.`,

    illustration: "/assets/images/classes/revenant_illustration.png",
    illustrationCaption: "A Vreken Revenant standing at the edge of the Bryngloom peat-bogs, blood-frost crackling between their fingers.",

    quickOverview: {
      title: "The Undying Economy",
      content: `**What You Need to Know**: The Revenant is a death mage who has returned from the grave with two intertwined economies: **Death Toll** (0-20, volatile necrotic energy built through HP sacrifice and kills) and a **Phylactery** (resurrection pool charged by killing enemies). You can toggle **Death Shroud** mode to burn HP instead of Mana for enhanced frost+necrotic spells.

**Core Loop**: Sacrifice HP / Kill enemies → Build Death Toll + Charge Phylactery → Toggle Death Shroud for devastating HP-burning spells → Die strategically → Resurrect via Phylactery → Death Trigger freeze → Repeat

**Resources**: Mana (Normal casting), HP (Death Shroud casting + spell sacrifice), Death Toll (0-20, volatile, decays without kills), Phylactery HP (kill-charged resurrection pool, max 50), Death Marks (5 permanent bargains)

**Fatal Flaws**: Death Toll 6+ = self-damage. 11+ = cannot be healed. 16+ = nuclear detonation on death. Death Shroud drains HP every turn. Phylactery depleted = no safety net.

**Best For**: Players who want to ride the razor's edge between annihilation and godhood, who treat death as a tactical resource, and who understand that the real enemy is the timer in their own veins`,
    },

    description: `The Revenant is a death caster who walks between two necrotic traditions — the blood-fueled sacrifice of Kora's covenant and the frost-stasis harvest of Vesper's phylactery. Every spell costs life. Every kill feeds the grave. The Death Toll they carry is not safe storage — it is boiling necrotic energy orbiting their body, volatile and searing. Their Phylactery is their insurance against the inevitable: when the cold consumes them, the harvested souls drag them back from the threshold. Death Shroud mode transforms them into a walking blizzard of HP-burning devastation. They are the only class that converts their own death into a tactical weapon — the Death Trigger freeze that erupts from their resurrection is one of the strongest control effects in the game. They are not alive. They are not dead. They are the Revenant, and they have work to do.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The Revenant tradition was born from the convergence of two death-magic schools in the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink>. The blood covenant of <LoreLink termId="kora">Kora</LoreLink> the Veil-Speaker (necrotic sacrifice, volatile Blood Tokens, ancestral communication) and the frost stasis of <LoreLink termId="vesper">Vesper</LoreLink> the Scribe (soul-bound phylactery, Eternal Frost Aura, kill-harvested resurrection).

**CITIES & CIVIL RECEPTION**
Revenants are feared and respected in the catacombs of the <LoreLink termId="sunken_spire">Sunken Spire</LoreLink> but viewed as dark omens in surface cities. Their presence causes temperatures to drop. Their blood glows faintly in the dark.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="vreken">Clean Vreken</LoreLink> (blood covenant tradition) and the <LoreLink termId="neth">Drun Neth</LoreLink> (frost stasis tradition). Desperate human Morren also take the path.

**NOTABLE FIGURES**
* **Kora the Veil-Speaker**: The first caller whose voice turned to whispers to keep the crypt-lights burning.
* **Vesper the Scribe**: The dying scholar who bound his soul to basalt and refused to end.
* **Neth-Veil Valerius**: A Neth pact-lord who established the necrotic covenant linking bog-graves to Atropolis.
* **Karr Bloodhammer**: The legendary Skald warlock who performed the first stasis ritual to combat the Milk-Grief.`,
    },

    signatureQuote: {
      text: '"I hear thirty generations of the dead screaming in my veins. Death came for me in the peat-bogs and I told it to wait. It has been waiting eight hundred years. We have an understanding now — I go first, and it follows close behind."',
      speaker: 'The Revenant (attributed to both Kora and Vesper traditions)',
      context: 'Carved into the threshold of the Hall of Returned Dead, Year 412 of the Dimming',
    },

    philosophy: {
      coreTenet: 'Death is not the end — it is a transitional economy. The dead owe their life force to the living, and the Revenant is the collector. Every ancestor has something to teach, every corpse has something to give. Life force is the currency, and the dead are generous lenders. The body decays because it has forgotten how to endure. The Revenant remembers — they simply refuse to stop.',
      relationship: 'Revenants do not raise the dead as servants — they petition them as ancestors and harvest them as fuel. The dead choose whether to answer the call. This relationship is built on mutual obligation: the Revenant feeds the ancestors with their own life force, and in return the dead lend their power. If the Revenant stops paying, the dead stop answering. The phylactery ensures that even when the payment fails, the Revenant returns to try again.',
      paradox: 'The Revenant keeps the ancestors alive by feeding them their own blood while preserving their own flesh in peat-stasis. Every spell costs vitality. The most powerful rituals require so much life force that the Revenant must be on the verge of death. They are simultaneously a living blood bank for the dead and an undying corpse that refuses to rot. The question every Revenant eventually faces: how much of yourself are you willing to spend before you become the thing you harvest?',
    },

    currentCrisis: `The bog-graves are waking up on their own. For centuries, the peat-bogs of the Bryngloom have held the dead in perfect preservation. Now the dead are calling themselves — twelve Revenants found dead in their ritual chambers, bodies drained of blood but showing no wounds, the bog-graves empty.

Simultaneously, the Cult of Forgotten Shadow has discovered a way to amplify the frost stasis ritual using Void energy. Unlike traditional peat-preservation, Void-stasis requires no life force harvesting — the Void sustains the body directly. Half of the remaining Revenants have accepted this "clean immortality." The other half suspect the Void is not sustaining them but slowly consuming them, replacing their souls with something else.

The peat-bogs are reacting. In areas where Void-stasis Revenants have congregated, the preserving peat has turned black and acidic. The Root-Veil is withdrawing its blessing. The dead are no longer waiting for permission. They are marching toward the Sundered Monoliths, and the Revenants have lost control of their ancestral covenant.`,

    meaningfulTradeoffs: `To hear the dead is to lose the living. Revenants exist in a state of constant sensory overload — the voices of ancestors overlay every conversation. They feel the cold always, cannot taste food, and their relationships fail because partners realize they are competing with a chorus of dead ancestors for attention. The frost stasis that halts their decay also strips them of warmth, emotion, and physical sensation. They experience the world through frosted glass. Many survive only through an intellectual commitment to goals set centuries ago, the emotional resonance long since faded into ash.`,

    classSpecificLocations: [
      {
        name: 'The Bog-Graves of Kora',
        locationId: 'peat-bog-sinks',
        description: 'The oldest consecrated burial ground in the Bryngloom, where Kora performed the first necrotic covenant. Graves marked by pale, bioluminescent fungi that pulse in sequence — a slow heartbeat of light that Revenants believe is the ancestors breathing.',
        purpose: 'Primary necrotic anchor and covenant site',
        status: 'Compromised — twelve graves are empty, fungi pulses erratically',
      },
      {
        name: 'The Peat-Bog Sinks',
        locationId: 'peat-bog-sinks',
        description: 'The deep, preserving bogs where Revenants perform the Rite of the Cold Hearth. Acidic peat preserves organic matter — those who enter and perform the ritual emerge with their decay halted.',
        purpose: 'Initiation site and final resting place',
        status: 'Active — sections turning black and acidic due to Void contamination',
      },
      {
        name: 'The Sunken Confessionals',
        locationId: 'over-shanty',
        description: 'Where the Cult of Forgotten Shadow offers Void-stasis to Revenants willing to abandon the old ways.',
        purpose: 'Void-stasis initiation',
        status: 'Active — increasingly popular',
      },
    ],

    combatRole: {
      title: "The Undying Economy",
      content: `**Primary Role**: The only class that converts its own HP and death itself into explosive damage and tactical resurrection.

**Why Bring a Revenant?**: No other class rides this razor's edge. They pay for power in flesh — every spell costs HP and/or Mana — and generate Death Toll that supercharges the next cast. At 16+ Toll, a single spell becomes a walking nuclear detonation. They drain life back from enemies. They toggle Death Shroud to burn HP for devastating frost+necrotic damage. They kill to charge their Phylactery, die strategically to trigger a battlefield-wide freeze, resurrect, and do it again. When the party needs something dead and the healer is down, the Revenant opens a vein, freezes the room, and solves the problem permanently.

**Damage Profile**:
- Sustained necrotic/frost damage through HP sacrifice
- Burst damage via Death Toll consumption
- Area denial through Death Shroud auras and spectral allies
- Tactical death via Phylactery resurrection + Death Trigger freeze

**Support Capabilities**:
- Spectral summons that tank damage
- Life Link to protect allies
- Death Trigger freeze as battlefield control
- Life drain for self-sustain

**Fatal Flaws**: Death Toll is VOLATILE. At 6+ Toll, searing self-damage. At 11+, cannot be healed. At 16+, nuclear detonation on death that kills allies. Death Shroud drains HP every turn. Phylactery depleted means death is permanent. The Revenant carries enough power to end any fight — and enough instability to end their own party.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `**Core Mechanic**: HP as fuel + Death as a tactical reset. Toggle Death Shroud to trade Mana for HP costs and gain frost enhancement. Build Death Toll through sacrifice and kills. Spend Toll for devastation. Die to trigger Phylactery resurrection and Death Trigger freeze.

**Decision Points**:
- When to activate Death Marks (permanent, irreversible consequences)
- When to toggle Death Shroud (HP drain vs enhanced damage)
- When to spend Death Toll before it becomes dangerous
- When dying is the right play (Death Trigger freeze)
- How aggressively to kill (Phylactery charging)

**Skill Expression**:
- Managing HP as dual-purpose resource (fuel + health)
- Timing Death Toll usage before volatility thresholds
- Toggling Death Shroud for maximum burst windows
- Strategic death for Death Trigger freeze
- Balancing aggression with Phylactery insurance

**Team Dynamics**:
- Requires healers to offset Death Shroud drain and HP sacrifice
- Benefits from tanks who protect while vulnerable
- Synergizes with crowd control to safely drain life
- Death Trigger freeze enables devastating team combos
- Can protect allies through Life Link and spectral summons`,
    },

    immersiveCombatExample: {
      title: "Combat Example: Death Is Fuel",
      content: `**The Setup**: Your party faces a powerful undead knight and three skeletal archers. You're a Level 4 Revenant (Sanguine Harvest) with 2 Death Marks active (Shrouded Veil, Crimson Pact). HP: 60/72, Mana: 40/50, Death Toll: 0, Phylactery: 10 HP, Death Shroud: OFF.

**Active Death Marks**:
- **Shrouded Veil**: +2d6 necrotic damage to all spells, advantage on Stealth, -10% max HP (max 72, not 80)
- **Crimson Pact**: Death Toll generates +1 extra per trigger, each Toll spent adds +1d8 damage (instead of +1d6)

**Starting State**: HP: 60/72 | Mana: 40/50 | Toll: 0 | Phylactery: 10 | Shroud: OFF

**Turn 1 — Blood Sacrifice + Summon (HP: 60 → 48, Toll: 0 → 9)**

**Action**: Cast "Necrotic Bolt" (4 mana, costs 1d6 HP)
**Health Cost Roll**: 1d6 → [4] = 4 HP sacrificed
**Death Toll**: +4+1 (Crimson Pact bonus) = +5 Toll (now at 5)
**HP**: 60 - 4 = 56 HP
**Spell Damage**: 3d8 + 2d6 (Shrouded Veil) → [7,6,5] + [5,4] = 27 necrotic damage

**Action (1 AP)**: Summon Spectral Allies (10 mana, costs 1d4 HP)
**Health Cost Roll**: 1d4 → [3] = 3 HP sacrificed
**Death Toll**: +3+1 = +4 (now at 9)
**HP**: 56 - 3 = 53 HP

**End of Turn Drain**: Specters drain 1d4 HP each
**Drain**: [2] + [3] = 5 HP
**HP**: 53 - 5 = 48 HP

**Current State**: HP: 48/72 | Mana: 26/50 | Toll: 9 | Phylactery: 10 | Shroud: OFF

**Turn 2 — Death Shroud Burst (HP: 48 → 30, Toll: 9 → 0)**

*The skeletal archers are dangerous. Time to switch to Death Shroud and detonate your Toll.*

**Action**: Toggle Death Shroud ON (Free action)
*Frost crackles from your skin. Your breath freezes in the air. Spells now cost HP.*

**Start of Turn Shroud Drain**: 1d6 HP → [4] = 4 HP lost
**HP**: 48 - 4 = 44 HP

**Action**: Cast "Death's Embrace" — costs HP in Shroud mode (10 mana value = 10 HP cost + 2d8 HP sacrifice)
**Total HP Cost**: 10 + 2d8 → 10 + [6,5] = 21 HP
**HP**: 44 - 21 = 23 HP
**Death Toll**: +21+1 = +22, but capped at 20 (now at 20)
**Mana**: 26 - 10 = 16

**Spend ALL 20 Death Toll** to enhance the spell (+1d8 per Toll with Crimson Pact!)
**Spell Damage**: 4d6 base + 2d6 (Veil) + 20d8 (Toll) → massive devastation

*The necrotic explosion obliterates the skeletal archers. The undead knight staggers.*

**Death Toll**: 20 - 20 = 0

**Current State**: HP: 23/72 | Mana: 16/50 | Toll: 0 | Phylactery: 10 | Shroud: ON

**Turn 3 — Kill to Charge + Strategic Death (HP: 23 → 0 → RESURRECTION!)**

*You're dangerously low. But the knight is nearly dead...*

**Shroud Drain**: 1d6 → [5] HP
**HP**: 23 - 5 = 18 HP

**Action**: Cast "Life Leech" at the knight (HP cost in Shroud)
**Kill the knight → Phylactery charges +1d6 HP → [4] = +4 HP
**Phylactery**: 10 + 4 = 14 HP

**Enemy attacks → you take 18 damage → HP: 0 → YOU DIE**

**PHYLACTERY RESURRECTION!**
*Your phylactery SHATTERS, releasing harvested souls. You reform from ice and shadow.*
**Resurrect at 14 HP. Phylactery: 0.**

**DEATH TRIGGER**: All enemies within 15ft FROZEN for 1 round (no save)

**Toggle Death Shroud OFF** (free action on resurrection)

**Current State**: HP: 14/72 | Mana: 16/50 | Toll: 0 | Phylactery: 0 | Shroud: OFF

**The Lesson**:
1. HP is fuel — you sacrificed 32+ HP for spells
2. Death Toll volatility — at 9 Toll you're in the "unstable" zone
3. Death Shroud converts Mana to HP costs for burst damage
4. Phylactery resurrection turns death into a tactical weapon
5. Death Trigger freeze is the strongest control effect in the game
6. After resurrection, play safe until Phylactery recharges

You're not a mage who casts spells. You're an UNDYING PREDATOR who burns your own life for devastating power, charges your phylactery with every kill, and uses death itself as your strongest move.`,
    },
  },

  resourceSystem: {
    title: "Death Toll & Phylactery",
    subtitle: "Volatile Necrotic Energy + Kill-Harvested Resurrection",

    description: `The Revenant's power is a dual economy built on death itself. **Death Toll** (0-20) is volatile necrotic energy generated through HP sacrifice and killing — spend it to devastating effect, or let it build and risk catastrophic self-damage. **Phylactery HP** is a kill-charged resurrection pool — every enemy felled by your spells adds life force to your soul anchor, and when you die, that stored life drags you back.

**Death Shroud Toggle**:
The Revenant can switch between two casting modes:
- **Shroud OFF (Rest Mode)**: Spells cost Mana normally. Death Toll does not decay.
- **Shroud ON (Death Mode)**: Spells cost HP instead of Mana. All spells deal +1d6 frost+necrotic damage. Enemies hit: DC 15 Con save or Chilled (-10 ft speed). Lose 1d6/1d8/1d10 HP at start of each turn (scales with level). Toggle is free, once per turn.

**Death Toll Volatility**:
- **1-5 Toll**: Stable. No side effects.
- **6-10 Toll**: Unstable. 1 necrotic damage/turn to self. Enemies within 5ft take 1 necrotic/Toll.
- **11-15 Toll**: Volatile. 1d4 necrotic/Toll/turn. Cannot be healed by others. All spell saves at -2.
- **16-20 Toll**: CRITICAL MASS. 1d6 necrotic/Toll/turn. Advantage on death saves but disadvantage on all other saves. If you die at 16+, ALL Toll detonates — 1d10 necrotic/Toll to EVERYTHING within 30ft (including allies).

**Toll Decay**: -1 per round if no enemy killed and no HP sacrificed this round. Timer pressure forces aggression.

**Differentiation**: Unlike the Inquisitor (who builds Authority through anti-magic friction and demon command), the Revenant builds Death Toll through raw HP sacrifice and body count. The Inquisitor is surgical; the Revenant is a chain reaction.`,

    cards: [
      {
        title: "Death Toll (0-20)",
        stats: "HP Sacrifice + Kills",
        details:
          "1 HP lost = 1 Toll (before bonuses). Kills add +1d6 Toll. Spend for +1d6 necrotic per Toll. VOLATILE: 6+ = self-damage, 11+ = can't be healed, 16+ = nuclear detonation on death. Decays -1/round without kills/sacrifice.",
      },
      {
        title: "Death Shroud (Toggle)",
        stats: "HP Casting | +1d6 Damage",
        details:
          "Switch between Rest Mode (Mana) and Death Mode (HP). Death Mode: spells cost HP, +1d6 frost+necrotic, Chill on hit, but drain HP each turn.",
      },
      {
        title: "Phylactery (0-50)",
        stats: "+1d6 HP per Kill",
        details:
          "Harvest souls from fallen enemies. On death, resurrect at stored HP value. Death Trigger: freeze all enemies within 15ft for 1 round (no save). Once per combat.",
      },
      {
        title: "Death Marks",
        stats: "5 Permanent Bargains",
        details:
          "Sequential permanent upgrades granting massive power at irreversible cost. Once activated, never reversed.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Change", "Notes"],
      rows: [
        ["Sacrifice HP (Spell Cost)", "+1 Toll per 1 HP", "Generated on every cast"],
        ["Kill Enemy", "+1d6 Toll", "Per kill, from any source"],
        ["Cast in Death Shroud", "+1 Toll per spell", "Shroud mode bonus"],
        ["Spend Toll", "-Variable", "+1d6 necrotic per Toll spent"],
        ["Toll Decay", "-1 per round", "No kills or HP sacrifice"],
        ["Toggle Shroud ON", "Free action", "Spells cost HP, +1d6 damage"],
        ["Kill Enemy (Phylactery)", "+1d6 Phylactery HP", "Max 50 HP stored"],
        ["Die (Phylactery)", "Resurrect at stored HP", "Death Trigger freeze 15ft"],
      ],
    },

    usage: {
      momentum:
        "Spend Toll to add +1d6 damage each to any spell. Toggle Death Shroud for burst windows. Kill to charge Phylactery.",
      flourish:
        "The Nuclear Option: At 16+ Toll, your spells deal apocalyptic damage — but death means taking your party with you. The strategic play is to detonate Toll on a spell before it reaches critical mass, or use Death Trigger freeze to control the battlefield while you resurrect.",
    },

    overheatRules: {
      title: "Death Marks (Permanent Ascension)",
      content: `The Revenant has no "Overheat" recovery. Instead, they face the **Sequential Descent**.

**Death Marks**: 5 permanent bargains that can be activated at the listed level. Each grants a powerful boon and an irreversible curse. Penalties stack.

**Strategy**: High-level Revenants often stop at Mark 3-4 to maintain survivability. Only the most desperate activate Mark 5.`,
    },

    deathMarksTable: {
      title: "Death Marks",
      headers: ["Mark", "Boon", "Curse", "Unlock Level"],
      rows: [
        [
          "Shrouded Veil",
          "+2d6 necrotic to all spells + advantage on Stealth",
          "-10% max HP (perpetual shadow drain)",
          "1",
        ],
        [
          "Crimson Pact",
          "Toll generates +1 extra per trigger, each Toll spent adds +1d8 (instead of +1d6)",
          "Unused Toll bursts for 1d12 self-damage each",
          "3",
        ],
        [
          "Frostwalker",
          "Death Shroud gains +1d4 frost/turn aura to enemies within 15ft",
          "+50% fire vulnerability",
          "5",
        ],
        [
          "Spectral Command",
          "Spectral allies gain +1d6 necrotic and +25% HP",
          "Summons drain 1d4 HP/turn from you each",
          "7",
        ],
        [
          "Deep Void",
          "1/long rest: Negate any spell targeting you",
          "2d6 psychic damage when used",
          "10",
        ],
      ],
    },

    deathTollTable: {
      title: "Death Toll Mechanics",
      headers: ["Threshold", "Effect", "Notes"],
      rows: [
        ["1-5 (Stable)", "No side effects", "Safe to accumulate"],
        ["6-10 (Unstable)", "1 necrotic/turn to self, 1/Toll to enemies 5ft", "Starting to hurt"],
        ["11-15 (Volatile)", "1d4/Toll/turn, can't be healed, -2 spell saves", "Danger zone"],
        ["16-20 (Critical)", "1d6/Toll/turn, nuclear detonation on death", "Walking bomb"],
        ["Decay", "-1/round without kills or sacrifice", "Forces aggression"],
      ],
    },

    strategicConsiderations: {
      title: "The Razor's Edge: Risk & Recovery",
      content: `**Phase 1 (0-5 Toll)**: Build your bank. Cast HP-costing spells to generate Toll. Don't fear the HP cost — every point is potential devastation.

**Phase 2 (6-10 Toll)**: You're in the unstable zone. Self-damage is ticking. Time to spend Toll on a devastating spell, or toggle Death Shroud for maximum burst and kill to charge Phylactery.

**Phase 3 (Toll Spent + Phylactery Charged)**: After detonating Toll and securing kills, switch to Normal Mode. Use Life Leech to drain HP back. Kill weak enemies to rebuild Phylactery insurance.

**Phase 4 (Strategic Death)**: If Phylactery is charged and enemies are clustered, dying is a valid tactic. Death Trigger freezes the battlefield. Your party gains a full round of free attacks.

**Advanced Tactic: The Intentional Detonation**: If you're at 16+ Toll with a full Phylactery, position near enemies, detonate all Toll on a massive AoE, die to the resulting self-damage, resurrect via Phylactery, and Death Trigger freeze the survivors. This is the Revenant's apotheosis.`,
    },

    playingInPerson: {
      title: "Playing Revenant In Person",
      content: `**Required Materials**:
- **20 Red/Blue Beads**: Death Toll tokens (red for blood aspect, blue for frost aspect)
- **A Physical Timer**: Countdown for Toll decay
- **Phylactery Tracker**: Separate HP tracker for stored resurrection HP
- **Mode Toggle Card**: Shows Rest Mode / Death Mode
- **Death Mark Reference Card**: 5 permanent marks with checkboxes

**The Physical Hack**:
- The moment you generate Toll, start your decay timer (each round without a kill = lose 1 bead)
- Mark Death Marks with permanent marker on a laminated card
- Use separate dice for HP sacrifice vs enemy damage
- When you die and resurrect, physically sweep your hand across the table for Death Trigger freeze`,
    },
  },

  specializations: {
    title: "Specializations",
    subtitle: "Three Paths of the Returned Dead",

    specs: [
      {
        id: "sanguine_harvest",
        name: "Sanguine Harvest",
        icon: "Necrotic/Drain Soul",
        color: "#8B0000",
        theme: "Aggressive Life Drain + Spectral Army",

        description: `Sanguine Harvests stopped running from the hunger and let it consume them from within. They wade into melee range with their life essence pouring freely, draining vitality from everything they touch. The Crimson Pact and Life Leech marks are their preferred scars — permanent concessions that turn every enemy into a transfusion. Their spectral allies rise from the corpses they create, forming an army of the dead that feeds on the Revenant's own life force. They do not heal. They take. And what they take is never enough.`,

        playstyle: "Melee-range life drain, aggressive HP sacrifice, spectral army from kills, high sustain through draining",

        strengths: [
          "Excellent sustain through life drain",
          "Spectral minions from every kill (guaranteed)",
          "High burst through Death Toll consumption",
          "Strong in prolonged fights with enemies to drain",
        ],
        weaknesses: [
          "Vulnerable to burst damage",
          "Requires melee range for optimal play",
          "Dependent on having enemies to drain",
          "Minions drain your HP each turn",
        ],

        specPassive: {
          name: "Sanguine Hunger",
          icon: "Necrotic/Drain Soul",
          description:
            "Your life drain effects are 25% more effective. Every enemy killed by your spells rises as a spectral minion for 1d4 rounds (max 4). Minions have 10 HP and deal 1d6 necrotic damage per turn. When below 25% HP, your next life drain is cast instantly and costs no mana.",
        },
        keyAbilities: [
          "Blood Leech — Drain health, restoring 25% per HP sacrificed (8 mana, 1d4 HP cost)",
          "Crimson Shield — Absorb 10× damage sacrificed as a ward (5 mana, 1d10 HP cost)",
          "Eternal Agony — Escalating psychic DOT based on HP sacrificed (15 mana, 1d10 HP cost)",
        ],
      },

      {
        id: "frost_sovereign",
        name: "Frost Sovereign",
        icon: "Frost/Frozen in Ice",
        color: "#4A90E2",
        theme: "Freeze-Shatter Loop + Frost Control",

        description: `Frost Sovereigns mastered the art of freezing enemies solid and shattering them for devastating burst damage. Their Death Shroud is the coldest — frost radiates from their body even in Rest Mode, and in Death Mode the temperature drops to lethal levels. The Frostwalker and Shrouded Veil marks are their preferred scars, granting extended freeze durations and bonus necrotic damage. They create an active loop: freeze, shatter, refreeze, shatter again. Each cycle is faster and more devastating than the last. Their battlefield is a sculpture gallery of frozen corpses, and every new enemy is just raw material.`,

        playstyle: "Ranged frost/necrotic caster, freeze-shatter loop, area control through ice",

        strengths: [
          "Exceptional crowd control through extended freezes",
          "Shatter mechanic for devastating burst",
          "Strong bonus damage to frozen targets",
          "Can lock down multiple dangerous enemies",
        ],
        weaknesses: [
          "Shatter ends freeze — must choose damage vs control",
          "Requires setup to freeze before shattering",
          "Less effective against freeze-immune enemies",
          "Relies on landing freeze saves",
        ],

        specPassive: {
          name: "Permafrost Dominion",
          icon: "Frost/Frozen in Ice",
          description:
            "Your freeze effects last 1d4 additional rounds. Frozen enemies take +1d6 damage from your frost and necrotic spells. When a frozen enemy takes damage, 50% chance they Shatter (additional 3d6 frost, freeze ends). In Death Shroud, your chill effect upgrades to a freeze (1 round) on failed save.",
        },
        keyAbilities: [
          "Wraith Spear — Frost projectile that freezes on hit (10 mana, 1d6 HP cost in Shroud)",
          "Frozen Orb — AoE frost+necrotic that freezes groups (16 mana, 2d6 HP cost in Shroud)",
          "Absolute Zero — Lock down all enemies in sight with escalating freeze (35 mana, 4d8 HP cost in Shroud)",
        ],
      },

      {
        id: "phylactery_anchor",
        name: "Phylactery Anchor",
        icon: "Frost/Frost Manipulation",
        color: "#2D1B69",
        theme: "Enhanced Resurrection + Psychic/Frost Control",

        description: `Phylactery Anchors are the most durable Revenants, their phylacteries expanded and reinforced through obsessive ritual. Their Death Trigger freeze radius is the largest of all specs, and their phylactery can store up to 75 HP — enough to resurrect multiple times in extended fights. The Spectral Command and Deep Void marks are their preferred scars, granting spectral army durability and spell negation. They play the long game: absorb damage, kill to charge, die strategically for the freeze, resurrect, and repeat. They are the tankiest Revenant, and the one most likely to outlast an enemy through sheer, stubborn refusal to stay dead.`,

        playstyle: "Tankiest Revenant with enhanced phylactery, psychic/frost hybrid control, strategic death management",

        strengths: [
          "Highest survivability — 75 HP Phylactery",
          "Death Trigger freeze in 25ft radius",
          "Can afford aggressive Death Shroud usage",
          "Psychic damage integration for resistances",
        ],
        weaknesses: [
          "Lower damage output than other specs",
          "No crowd control bonuses beyond freeze",
          "Still vulnerable to burst above Phylactery capacity",
          "Resurrection limited to once per combat",
        ],

        specPassive: {
          name: "Fortified Phylactery",
          icon: "Frost/Frost Manipulation",
          description:
            "Your Phylactery stores up to 75 HP (instead of 50). Death Trigger freeze radius increased to 25ft (instead of 15ft). In Death Shroud, store 1 HP in Phylactery per 10 damage taken from any source (max 5/round). Your psychic damage spells ignore resistance.",
        },
        keyAbilities: [
          "Siphon Soul — Frost+necrotic drain that heals and charges Phylactery on kill (8 mana)",
          "Glacial Shroud — Ice armor that freezes melee attackers (8 mana)",
          "Phylactery Nova — Detonate stored Phylactery HP as a massive frost explosion (30 mana, 3d6 HP cost)",
        ],
      },
    ],
  },

  exampleSpells: [
    { id: "rv_necrotic_bolt",
      name: "Necrotic Bolt",
      description: "You channel your life force into a lance of blackened energy that burrows into the target's vitality and gnaws.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "ranged", "blood magic", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A low, rattling hiss — like air escaping a collapsed lung.",
        somaticText: "Press your palm outward, dark veins flaring as necrotic energy condenses into a bolt.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      triggerConfig: {
        triggers: [
          { id: "rv_blood_sacrifice_bolt",
            name: "Blood Sacrifice",
            triggerType: "on_cast",
            action: "Sacrifice 1d6 HP. Generate Death Toll equal to HP lost.",
          },
        ],
      },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id: "rv_necrotic_weakness",
            name: "Necrotic Weakness",
            description: "Damage dealt reduced by 3 for 1 round.",
            mechanicsText: "Target deals -3 damage for 1 round",
          },
        ],
        statPenalties: [
          { stat: "damage", magnitude: -3, magnitudeType: "flat" },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      tags: ["damage", "debuff", "ranged", "blood magic", "revenant"],
    },

    { id: "rv_corpse_walk",
      name: "Corpse Walk",
      description: "You dissolve into a cloud of necrotic ash and reform where death has already walked.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Death Mark",
      effectTypes: ["utility"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Death Mark",
        tags: ["teleport", "mobility", "blight", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["location"],
        maxTargets: 1,
        requiresLineOfSight: false,
        restriction: "Target location must be a space where a creature has died during this combat.",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A whispered name — the last word spoken by the dead.",
        somaticText: "Drag your fingers through the air as if parting a curtain of ash.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id: "rv_corpse_teleport",
            name: "Corpse Walk",
            description: "Teleport to a location where a creature died this combat.",
            distance: 60,
            duration: 0,
            durationUnit: "instant",
          },
        ],
        power: "minor",
      },
      tags: ["teleport", "mobility", "blight", "revenant"],
    },

    { id: "rv_crimson_aegis",
      name: "Crimson Aegis",
      description: "Your blood hardens into a carapace of scab and shadow. The wound you inflict becomes armor.",
      level: 1,
      spellType: "REACTION",
      icon: "Necrotic/Protective Aura",
      effectTypes: ["buff"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Protective Aura",
        tags: ["protection", "ward", "reaction", "revenant"],
        castTime: 1,
        castTimeType: "REACTION",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 0,
        components: ["verbal", "somatic"],
        verbalText: "A sharp gasp of exertion, teeth clenched against the strain.",
        somaticText: "Clench your fist and pull — your life force crystallizes into a crimson shell.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d8" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      triggerConfig: {
        triggers: [
          { id: "rv_aegis_absorption",
            name: "Crimson Absorption",
            triggerType: "on_hit",
            action: "When struck, absorb damage up to 2× HP sacrificed. Ward crumbles when depleted.",
          },
        ],
      },
      buffConfig: {
        effects: [
          { id: "rv_crimson_ward",
            name: "Crimson Aegis",
            description: "Absorbs damage equal to 2× HP sacrificed (lasts 3 rounds).",
            mechanicsText: "Absorb 2× HP sacrificed as a damage ward (3 rounds)",
            statModifier: {
              stat: "damage_absorption",
              magnitude: "2x_health_sacrificed",
              magnitudeType: "formula",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      tags: ["protection", "ward", "reaction", "revenant"],
    },

    { id: "rv_blood_leech",
      name: "Blood Leech",
      description: "You extend a tendril of coagulated hate. Their life becomes yours — a crude, screaming transfusion.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Drain Soul",
        tags: ["damage", "healing", "life drain", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingMode: "effect",
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "ranged",
          rangeDistance: 30,
          targetRestrictions: ["enemy"],
          maxTargets: 1,
        },
        healing: {
          targetingType: "self",
        },
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A guttural growl — hunger given voice.",
        somaticText: "Extend your arm, fingers splayed, as a tendril of dark energy arcs toward the target.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d4" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      triggerConfig: {
        triggers: [
          { id: "rv_vampiric_leech",
            name: "Vampiric Drain",
            triggerType: "on_hit",
            action: "On hit, drain HP equal to damage dealt. Restore that amount to caster.",
          },
        ],
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["blight"],
        resolution: "DICE",
      },
      healingConfig: {
        formula: "2d6",
        healingType: "vampiric",
        resolution: "DICE",
      },
      tags: ["damage", "healing", "life drain", "revenant"],
    },

    { id: "rv_grave_whisper",
      name: "Grave Whisper",
      description: "You speak a name that should not be remembered. The target's flesh remembers how to rot.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Corruption",
        tags: ["debuff", "vulnerability", "ranged", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A single word — the syllable of decay.",
        somaticText: "Draw a slow circle in the air with one finger.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id: "rv_necrotic_vulnerability",
            name: "Grave Whisper",
            description: "+50% necrotic damage taken for 3 rounds.",
            mechanicsText: "+50% necrotic vulnerability for 3 rounds (Con save negates)",
            statusEffect: {
              vulnerabilityType: "blight",
              vulnerabilityPercent: 50,
            },
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      tags: ["debuff", "vulnerability", "ranged", "revenant"],
    },

    { id: "rv_soul_rend",
      name: "Soul Rend",
      description: "You reach across the void and close your grip around their life essence. Something screams. You pull.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Ebon Death",
      effectTypes: ["damage"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Ebon Death",
        tags: ["damage", "melee", "execute", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 12 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A ragged scream — effort torn from the throat.",
        somaticText: "Lunge forward and close your grip, tearing at the target's life force.",
        useFormulas: { health: true },
        resourceFormulas: { health: "2d8" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "4d6 + 2d6",
        damageTypes: ["blight", "wyrd"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              health_below_25: "8d6 + 4d6",
              default: "4d6 + 2d6",
            },
          },
        },
        effectTriggers: {
          damage: {
            logicType: "AND",
            compoundTriggers: [
              { id: "rv_health_threshold",
                category: "health",
                name: "Target Below 25% HP",
                parameters: { percentage: 25, comparison: "below", perspective: "target" },
              },
            ],
          },
        },
      },
      tags: ["damage", "melee", "execute", "revenant"],
    },

    { id: "rv_blood_cataclysm",
      name: "Blood Cataclysm",
      description: "Every drop of hoarded agony detonates at once. The air becomes red glass. You are the bomb.",
      level: 6,
      spellType: "ACTION",
      icon: "Poison/Poison Plague",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Plague",
        tags: ["aoe", "damage", "death_toll", "ultimate", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "deathToll"],
        resourceValues: { mana: 22, deathToll: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A roar of release — every held-back scream let loose at once.",
        somaticText: "Throw both arms wide and detonate.",
        useFormulas: { health: true },
        resourceFormulas: { health: "4d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "8d6 + death_toll_spent x 1d6",
        damageTypes: ["blight"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half_damage",
        },
      },
      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id: "rv_cataclysm_stun",
            name: "Cataclysm Shockwave",
            description: "If 10+ Death Toll spent, all enemies Stunned for 1 round.",
            config: { thresholdToll: 10, stunDuration: 1 },
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        duration: 1,
        durationUnit: "rounds",
      },
      tags: ["aoe", "damage", "death_toll", "ultimate", "revenant"],
    },

    { id: "rv_judgment_day",
      name: "Judgment Day",
      description: "The sky cracks open like a scab. A rain of black fire descends. Their life force boils upward into your mouth.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Ebon Death",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Ebon Death",
        tags: ["aoe", "damage", "vampiric", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["enemy"],
        },
        healing: { targetingType: "self" },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "deathToll"],
        resourceValues: { mana: 28, deathToll: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A verdict spoken in a voice not your own.",
        somaticText: "Throw your head back, black fire raining from above.",
        useFormulas: { health: true },
        resourceFormulas: { health: "6d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "12d6",
        damageTypes: ["blight"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
      },
      healingConfig: {
        formula: "12d6",
        healingType: "vampiric",
        resolution: "DICE",
      },
      tags: ["aoe", "damage", "vampiric", "revenant"],
    },

    { id: "rv_necrotic_armageddon",
      name: "Necrotic Armageddon",
      description: "You cut the world's connection to magic. The wound is permanent. Reality screams. You scream louder.",
      level: 10,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "blight",
        icon: "Void/Black Hole",
        tags: ["aoe", "damage", "anti_magic", "permanent_cost", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 100 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "deathToll"],
        resourceValues: { mana: 36, deathToll: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "The last word ever spoken — final, absolute, severing.",
        somaticText: "Bring your palms together and crack them apart.",
        useFormulas: { health: true, permanentHealth: true },
        resourceFormulas: { health: "10d6", permanentHealth: "2d10" },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "18d6",
        damageTypes: ["blight"],
        resolution: "DICE",
        savingThrow: {
          ability: "charisma",
          difficultyClass: 20,
          saveOutcome: "negates",
        },
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id: "rv_magic_severance",
            name: "Magic Severance",
            description: "All magic suppressed in the area for 1 hour.",
            duration: 1,
            durationUnit: "hours",
          },
        ],
        power: "major",
      },
      tags: ["aoe", "damage", "anti_magic", "permanent_cost", "revenant"],
    },

    { id: "rv_ethereal_gossip",
      name: "Ethereal Gossip",
      description: "Summon a tiny wisp of glowing green soulfire that whispers local rumors and the names of those buried nearby.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Spirit",
      typeConfig: {
        school: "shadow",
        icon: "Necrotic/Spirit",
        tags: ["utility", "roleplay", "revenant"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        components: ["verbal", "somatic"],
        verbalText: "Audite, umbrae locales...",
        somaticText: "Rub bone dust between your palms, igniting a pale green spark",
      },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "perception",
        selectedEffects: [
          { id: "rv_ethereal_gossip_effect",
            name: "Wisp Whispers",
            description: "A floating soulfire wisp reveals local historical facts, names, or rumors.",
          },
        ],
        duration: 10,
        durationUnit: "minutes",
        concentration: false,
        power: "minor",
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility", "roleplay", "revenant"],
    },
  ],

  spellPools: {
    1: [
      "rv_necrotic_bolt",
      "rv_corpse_walk",
      "rv_crimson_aegis",
    ],
    2: [
      "rv_blood_leech",
      "rv_grave_whisper",
      "rv_ethereal_gossip",
    ],
    3: [
      "rv_soul_rend",
    ],
    4: [],
    5: [],
    6: [
      "rv_blood_cataclysm",
    ],
    7: [],
    8: [
      "rv_judgment_day",
    ],
    9: [],
    10: [
      "rv_necrotic_armageddon",
    ],
  },
};

export default REVENANT_DATA;
