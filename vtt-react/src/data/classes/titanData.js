/**
 * Titan Class Data - The Ossified Juggernaut
 *
 * Visceral, tragic, and oppressive class design marrying 2004-era asymmetry
 * with grimdark folklore. A lumbering anomaly weaponizing bone density and mass.
 */

import { DEVOTIONS, SPECIALIZATIONS, TITAN_MANA } from "./titan/titanConstants";
import { TITAN_SPELLS } from "./titan/titanSpells";

export const TITAN_DATA = {
  id: "titan",
  name: "Titan",
  icon: "fas fa-skull",
  role: "Gravitational Tank",
  damageTypes: ["bludgeoning", "radiant", "force", "necrotic"],

  // Overview section
  overview: {
    title: "The Titan",
    subtitle: "The Ossified Juggernaut",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Titan is a lumbering anatomical anomaly who weaponizes their own bone density and gravitational mass. They calcify their own flesh to protect their party at the absolute cost of their own mobility, acting as a massive, space-bending meat-shield.

**Core Mechanic**: Manage Calcification Mass (0-100) → Attune to bone structures (Marrow-Burn, Pale Tomb, Crushing Core, Fossilized Tomb, Flayed Gale) → Hold choke points while managing the crushing penalties of Terminal Inertia.

**Resource**: Calcification Mass (Visceral skeletal matter that builds via bone-strikes and damage absorption, and spends on devastating gravity-collapses).

**Playstyle**: Extreme defensive body-blocking, crowd control, and damage redirection.

**Best For**: Players who enjoy high-risk, zero-mobility protective roles, manipulating localized gravity fields, and managing self-inflicted anatomical curses.`,
    },

    description: `The Titan is not a glorious celestial champion, but a horrifying anatomical anomaly. They channel raw gravitational force through the agonizing, hyper-accelerated calcification of their own skeleton and muscle. By forcing mineralized shell-growth over their skin and joints, they become a crushing, immovable meat-shield of petrified bone. Power demands an excruciating toll of blood and mobility, calcifying their very hearts to absorb the blows meant for their allies.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `To be a Titan is to endure a tragic, slow petrification. The bone-stitch ritual binds your soul to the crushing gravity of the earth. Every time you channel your mass, your bones fracture, splinter, and heal at hyper-accelerated speeds, filling your ears with the sickening crunch of grinding calcium. In the towns and villages, you are viewed as a lumbering freak—a calcified golem of flesh whose joints bleed dust. You do not fight for glory, but for the desperate, tragic survival of those you body-block with your fossilized ribs.

Their calcification attunements manifest visually as horrifying physical changes: blistering solar heat radiating from bleached marrow (Marrow-Burn), a cadaverous outer shell of dead bone-crust (Pale Tomb), a space-bending distortion field pulling dust into their heavy skeleton (Crushing Core), fossilized rock-muscle that splits skin to show stone-slate (Fossilized Tomb), or razor-sharp bone spurs tearing through flesh (Flayed Gale).`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Titan is the ultimate gravitational meat-shield. They hold corridors, lock down massive threats, and intercept damage with absolute, dense mass. They excel at:

**Corridor Body-Blocking**: Creating impassable gravity-walls that physically block enemy movement.
**Aggro & Crowd Control**: Pulling enemies closer, pinning them in stone, and forcing them to strike their stone shell.
**AoE Damage Interception**: Drawing AoE blasts and ranged impacts directly into their own petrified skeleton.

Their devastating fatal flaw is **Terminal Inertia**. As their mass grows, their speed decays, their Dodge drops to zero, and they become highly vulnerable to Agility-based saves. Worst of all, they suffer a catastrophic vulnerability to Acid damage, which violently melts their calcified shell, dealing double damage and shattering their resource pool.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Titan is a high-stakes balance between defense and absolute immobility. You build Calcification Mass by absorbing damage and striking with dense bone-weapons, then spend it to erect protective structures or trigger massive gravity collapses. 

**ATTUNEMENT MODES**:
- **Marrow-Burn (Solara)**: Searing calcium heat, dealing bonus radiant damage but glowing blindingly and accepting total vulnerability.
- **Pale Tomb (Lunara)**: Cadaverous defense shell, gaining Armor and self-healing at the cost of failing all Agility saves.
- **Crushing Core (Astraeus)**: Gravitational field, dragging enemies close and dealing force damage while taking double damage from non-magical strikes.
- **Fossilized Tomb (Terranox)**: Petrified muscle, giving massive HP and physical resistance at the cost of losing all movement speed.
- **Flayed Gale (Zephyra)**: Splintered marrow spikes, dealing lightning damage and quick strikes with a constant risk of bone fracture knockbacks.

**Terminal Inertia Management**: You must coordinate with your allies. Since you cannot move quickly, you must position yourself at chokepoints early. Let the party funnel enemies to you, then lock them in place with your gravity and stone skills.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: Marrow-Burn & Mass",
      content: `**The Lesson — Read This First**:
1. **Bone Attunement**: Marrow-Burn (Solara) provides +1d6 radiant calcium burn and generates +10 Calcification Mass on every melee strike.
2. **Terminal Inertia Penalty**: High Calcification reduces Dodge to 0 and movement speed to a crawl. You accept hits to build Mass, then detonate it.
3. **Mass Execution**: Spend Calcification on devastating ultimates like Bleached Flare (3d8 radiant, blind 1 turn) once you've gathered enemies.

---

**The Setup**: You are a Level 4 Titan cornered in a narrow dungeon hallway by four feral ghouls. You are attuned to **Marrow-Burn (Solara)**. Your path is blocked; your job is to physically body-block the hallway so the ghouls cannot reach your spellcaster allies.

**Starting State**: Calcification: 50/100 | HP: 85/85 | Mana: 40/60 | Bleached Flare: **Available**

---

**Turn 1 — Building Mass via Marrow-Burn Strike**

*You step forward, your boots grinding bone dust into the stone floor. Your collarbones crackle with friction-heat.*

**Action**: Melee attack Ghoul #1
**Attack Roll**: d20+6 → [14] = Hit!
**Base Damage**: 2d8+4 → [5, 6] + 4 = 15 bludgeoning damage
**Marrow-Burn Passive**: +1d6 radiant → [5] = **+5 radiant damage**
**Resource Change**: +10 Calcification Mass
**Total**: **20 damage dealt**

*Your massive stone cleaver crushes the ghouls shoulder. Searing calcium sparks hiss from your joints, burning the beasts decaying flesh.*

**Ghoul #1**: 20 damage → **Heavily Wounded**
**Current Mass**: 50 + 10 = **60/100 Calcification**

---

**Turn 2 — Agonizing Calcification & Terminal Inertia**

*The ghouls swarm you, clawing at your neck. You force a rapid, agonizing calcification of your ribcage to form a protective shield.*

**Action**: Cast **Agonizing Calcification** (16 mana, 0 AP)
**Resource Change**: +25 Calcification Mass (Now 85/100)
**Effect**: Gain +4 Armor for 5 rounds.
**Terminal Inertia Trigger**: Because your Calcification is above 80, your movement speed is reduced by 10 ft, and your Dodge is locked at 0.

*A sickening crunch echoes as a thick shell of calcified bone erupts through your chest. Your muscles petrify, locking your joints. You cannot evade.*

**Ghoul #2's Attack**: Attacks you. Hits automatically due to your locked Dodge.
**Armor Reduction**: Your new +4 Armor reduces the claw swipe to a mere tickle.
**Damage Taken**: 4 physical damage.
**HP**: 85 − 4 = 81/85

---

**Turn 3 — Bleached Flare (Spending Mass)**

*The ghouls are pressed against your chest, trying to push past. You have gathered enough mass. You detonate your calcified core.*

**Action**: Cast **Bleached Flare** (0 mana, 2 AP, spends 30 Calcification)
**Resource Change**: −30 Calcification Mass (Now 55/100)
**Damage**: 3d8 radiant → [6, 7, 8] = **21 radiant damage to all enemies within 10 ft**
**Debuff**: Blinds all hit targets for 1 turn.

*You unleash a blinding, radioactive white burst of heat from your chest. The ghouls squeal in agony, their eyes melting.*

**Ghoul #1**: 21 radiant → **Dead**
**Ghoul #2**: 21 radiant → **Dead**
**Ghoul #3**: 21 radiant → Blinds, **Heavily Wounded**
**Ghoul #4**: 21 radiant → Blinds, **Heavily Wounded**

**Final State**: Calcification: 55/100 | HP: 81/85 | Mana: 24/60 | Bleached Flare: **Spent**

**Key Takeaway**: You absorbed the hits, used your mana to trigger rapid calcification, accepted absolute immobility, and then shattered the enemy pack with a massive explosion of spent skeletal mass. You saved your party from being overrun.`,
    },
  },

  characterCreation: {
    title: "Character Creation",
    content: `**Step 1: Allocate Stats**
Prioritize **Strength** (increases your bludgeoning damage and heavy skeletal strikes) and **Vitality** (boosts your HP pool—you must endure relentless strikes). **Spirit** is secondary, raising the difficulty class (DC) of your spatial gravity saves. Ignore **Agility**—your weight locks your Dodge to 0 anyway.

**Step 2: Choose Your Bone Attunement**
Pick your initial daily calcification style based on your defensive tactical needs:
- **Marrow-Burn (Solara)**: Searing calcium fire. Excellent against undead, shadow-beasts, and when dealing offensive radiant damage.
- **Pale Tomb (Lunara)**: Silvery fossil-skin. Ideal for self-sustain and shielding vulnerable allies.
- **Crushing Core (Astraeus)**: Gravitational field. Best for dragging elusive archers and wizards into your melee range.
- **Fossilized Tomb (Terranox)**: Petrified rock-muscle. The ultimate choice for blocking chokepoints and absorbing heavy bosses.
- **Flayed Gale (Zephyra)**: Splintered bone-spurs. Perfect for quick strikes and high damage-per-round.

**Step 3: Select a Specialization**
- **Ossified Scion (Celestial Champion)**: Maximize bone density. Gain +50% attunement benefits, but take double damage from Acid.
- **Vessel of Bone-Marrow (Divine Conduit)**: Halve your Terminal Inertia drawbacks and attune to a secondary bone structure.
- **Gravitational Rupture (Astral Warrior)**: Instantly fracture and switch your bone attunements mid-combat for 1 AP.

**Step 4: Select Starting Spells**
You begin with your attunement's **passive ability** (active automatically) and **ultimate ability** (once per long rest), plus the level 4 universal spell **Ossified Cleave** (your primary active strike).

**Step 5: Equip Starting Gear**
- **Jagged Bone-Cleaver** (two-handed bludgeoning): 2d8 damage. A rusted, jagged iron slab designed to fracture armor.
- **Studded Acolyte's Shroud** (medium armor): +4 Armor. Made of thick leather and stitched bone plates.
- **Cracked Medallion** (trinket): A heavy copper disc displaying your attunement. +1 Spirit.
- **Fossilized Beast Skull** (offhand): A dense skull acting as a focal point for localized gravity. +1 Strength.
- **Phial of Marrow-Grease** (consumable, ×2): Restore 20 Mana by applying numbing grease to your fractured joints.

**Step 6: Plan Your First Turn**
Do not attempt to run. Stand your ground at a narrow chokepoint. Swing your Jagged Cleaver to trigger your attunement passive and generate Calcification. Once enemies swarm you, trigger your attunement's ultimate to sweep, crush, or blind them.`,
  },

  // Resource System
  resourceSystem: {
    title: "Skeletal Calcification System",
    subtitle: "Visceral Bone Density Management",

    description: `Each morning, you undergo the agonizing ritual of bone-stitching to attune to a skeletal form. This grants a constant passive anatomical change and a devastating once-per-long-rest ultimate—but binds you to a crippling physical restriction.

**Mana & Calcification Economy**: Titans have a base mana pool of 60 (+5 per level) and regenerate 5 mana at the start of each turn. Devotion passives and ultimates (Levels 1–3) cost **no mana**—they are fueled solely by building and spending Calcification Mass. Level 4+ active spells cost mana and interact directly with your skeletal mass, either generating Calcification on cast or spending it for spatial distortions.`,

    cards: [
      {
        title: "Bone Attunement",
        stats: "1/Long Rest choice",
        details: "Agonizingly stitch your bones to attune to one of five skeletal forms. This grants a heavy passive benefit, an ultimate, and a crippling restriction.",
      },
      {
        title: "Calcification Mass",
        stats: "0 to 100 Mass Pool",
        details: "Your physical weight. Built via bone-strikes and damage absorption. High mass increases defense but triggers Terminal Inertia, locking your Dodge to 0.",
      },
      {
        title: "Mana Pool",
        stats: `${TITAN_MANA.basePool} Base | +${TITAN_MANA.regenPerTurn}/Turn`,
        details: `Used to fuel advanced level 4+ spells. Regenerates 5 per turn. Devotion-specific abilities (L1-3) cost 0 mana, relying entirely on Calcification.`,
      },
      {
        title: "Shatter-Shift",
        stats: "Special Action (Spec-Dependent)",
        details: "Gravitational Ruptures can instantly fracture and switch bone attunements mid-combat for 1 AP (3 uses/rest). Divine Conduits switch during a short rest.",
      },
    ],

    celestialDevotionsTable: {
      title: "Skeletal Attunements",
      headers: [
        "Bone Attunement",
        "Passive Benefits (Generates Mass)",
        "Ultimate Ability (1/Long Rest)",
        "Terminal Inertia Restriction",
      ],
      rows: Object.values(DEVOTIONS).map((d) => [
        `${d.name} (${d.title})`,
        d.benefit,
        `${d.ultimateName}: ${d.ultimateShort}`,
        d.restriction,
      ]),
    },

    usage: {
      momentum:
        "Your attunement shapes your physical reality. Marrow-Burn players are offensive radiators; Pale Tomb players are self-sustaining walls. Accept the agony of your anatomical cage.",
      flourish:
        "Time your ultimates carefully. Erasing your bone-crust to cast a wall or collapse gravity drops your Mass and leaves you physically vulnerable until you strike again.",
    },

    overheatRules: {
      title: "The Fatal Flaw: Terminal Inertia",
      content: `Power demands a toll of physical mobility. The greater your skeletal mass, the harder it is to move your limbs.

**The Crushing Penalties**:
Every bone attunement carries a drawback that is always active. Because of your dense calcium shell, your joints grind and lock. 
- **Solara**: Dodge is 0. All attacks against you have advantage. Suffer extreme Acid vulnerability.
- **Lunara**: All external healing received is halved. Movement speed is reduced by 10 ft. Automatically fail all Agility saves.
- **Astraeus**: Dodge is 0. Disadvantage on Agility saves. Suffer extreme Acid vulnerability.
- **Terranox**: Dodge is 0. Movement speed is reduced by 15 ft. Suffer extreme Acid vulnerability.
- **Zephyra**: Disadvantage on Agility saves. Suffer Acid vulnerability. 25% chance to be knocked back when hit as bones splinter.

**Acid / Corrosive Vulnerability**:
All Titans share a catastrophic vulnerability to Corrosive/Acid attacks. Acid melts petrified calcium skins, dealing double damage and instantly draining all your Calcification Mass. Always target acid-spitting monsters first.`,
    },

    strategicConsiderations: {
      title: "Managing the Anatomical Cage",
      content: `**Before Combat — The Morning Attunement**:
Analyze your enemies. Fighting undead or shadows? Solaris Marrow-Burn melts them. Facing a colossal boss? Terranox's physical resistance protects your organs. Slow, narrow dungeon crawls? Pale Tomb's wall holds corridors with absolute authority.

**Marrow-Burn (Offensive)**:
High radiant damage output. Use it when fighting in shadows or darkness to offset your sickening white glow. Save Bleached Flare for when ghouls or soldiers pack tightly—blinding them protects your squishy wizard allies.

**Pale Tomb (Sustain)**:
Perfect for when your healer is down or busy. You regenerate HP constantly. Use Ossified Wall defensively when a boss channels a massive attack; absorbing 50 damage for your entire party can avert a catastrophic wipe.

**Crushing Core (Control)**:
Pull archers and spellcasters off their high ledges and drag them into your massive cleaving range. Starfall's single-target stun is your primary shutdown tool for boss spells. Avoid martial duelists who can exploit your locked Dodge.

**Fossilized Tomb (Immovable Tank)**:
The ultimate physical wall. Gain 20 Max HP and flat physical damage reduction. Position yourself in doorways. You cannot chase, so carry throwable rocks or wait for the party to funnel enemies directly into your stone limbs.

**Flayed Gale (High DPR)**:
Your highest damage potential. Razor-sharp spurs shred flesh. Splinter-Burst Dash provides highly-needed teleportation to bypass barriers. Watch your positioning—splintering bones can knock you backward into hazards.`,
    },

    playingInPerson: {
      title: "Playing Titan In Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `A set of bone attunement cards transforms each morning into a meaningful ritual. The physical act of choosing your skeletal patron grounds the roleplay and keeps your mechanics visible to the whole table.

**Required Materials**:
- **5 Attunement Cards** — Index cards or printed cards, one per bone structure (Marrow-Burn, Pale Tomb, Crushing Core, Fossilized Tomb, Flayed Gale). Each card shows: passive benefits, ultimate ability, and restriction.
- **Ultimate Token** — A heavy coin or token (heads = available, tails = spent).
- **Restriction Sticky Note** — A small note with your current restriction written on it, placed visibly on the table.

**The Morning Ritual**:
1. Announce your devotion choice to the table.
2. Place the chosen devotion card face-up in front of you.
3. Set the ultimate token to heads (available).
4. Write your restriction on the sticky note and place it where allies can see it.

**Quick Reference**:
\`\`\`
CELESTIAL DEVOTIONS:
  Solara   | +1d6 radiant melee | Solar Flare (AoE blind) | Adv. on you in bright light
  Lunara   | +2 Armor, 5 HP/turn | Lunar Shield (50 absorb) | Healing halved
  Astraeus | +10ft move, Agi adv | Starfall (stun target)  | +1d6 from non-magic
  Terranox | +20 HP, phys resist | Earthquake (20ft prone) | -10ft speed
  Zephyra  | +2 atk speed, +1d4 | Wind Dash (teleport AoE) | 10% knockback risk

ULTIMATE: 1/Long Rest (irreversible until next rest)
\`\`\`

**The Physical Hacks**:
- **The Devotion Deck**: Keep all 5 cards in a small deck box. Each morning, dramatically draw your choice. Other players will start anticipating which devotion you'll pick based on the encounter.
- **Restriction Token on Mini**: Place a small colored token on your miniature to remind everyone (including yourself) of your active restriction. Red for Solara, blue for Lunara, purple for Astraeus, brown for Terranox, white for Zephyra.
- **Ultimate Countdown**: When you use your ultimate, flip the token and place it on the devotion card. It serves as a visual reminder that your biggest swing is gone for the day.`,
    },
  },

  // Specializations
  specializations: {
    title: "Ossified Specializations",
    subtitle: "Three Paths of Skeletal Alteration",

    description: `Every Titan chooses one of three horrifying specializations that permanently alter their skeletal structure, changing how they manage mass and gravity.`,

    specs: [
      {
        id: "celestial-champion",
        name: "Ossified Scion",
        icon: "Radiant/Radiant Bolt",
        color: "#EBE6DD",
        theme: "Unrestrained Calcification",

        description: `You embrace skeletal ossification fully. Your bones are a walking graveyard, swollen with immense calcium deposits and dense mineral growths.`,

        playstyle: "Aggressive mass building, extreme passive defense, total immobility",

        strengths: [
          "Attunement passive benefits are increased by 50%.",
          "Can use your bone ultimate twice per long rest.",
          "Allies within 10 feet gain 25% of your bone density (Armor +1).",
          "Unrivaled frontline defensive absorption.",
        ],

        weaknesses: [
          "Attunement restrictions and mobility penalties are doubled.",
          "Cannot switch bone attunements mid-combat.",
          "Acid vulnerability increases to +100% damage taken.",
          "Locked Dodge makes you a permanent punching bag.",
        ],

        keyAbilities: [
          "Bone-Grafted Ascendancy: Attunement benefits increased by 50%.",
          "Shared Density: Allies within 10 ft gain Armor +1.",
          "Calcium Surge: Channel your ultimate twice per long rest.",
        ],

        specPassive: {
          name: "Bone-Grafted Ascendancy",
          description:
            "Attunement passive benefits increased by 50%. Ultimate abilities can be used twice per long rest. Allies within 10 feet gain +1 Armor. Attunement restrictions are doubled (Solara's glow expands to 60 ft, Terranox speed reduction is 25 ft). Acid vulnerability is doubled to +100% damage taken. Cannot switch devotions mid-combat.",
        },
      },
      {
        id: "divine-conduit",
        name: "Vessel of Bone-Marrow",
        icon: "Radiant/Divine Radiance",
        color: "#768A96",
        theme: "Regulated Calcification",

        description: `You have carved intricate drainage channels into your own skeleton. By constantly venting friction-heat and mineral weight, you minimize the drawbacks of petrification.`,

        playstyle: "Consistent mobility, flexible attunements, moderate defense",

        strengths: [
          "Attunement restrictions and speed penalties are halved.",
          "Can attune to a secondary bone structure at 50% effectiveness.",
          "Switch attunements during one short rest per day.",
          "More forgiving mobility and saving throws.",
        ],

        weaknesses: [
          "Attunement passive benefits are reduced by 25%.",
          "Ultimate damage and shield values are reduced by 25%.",
          "Lacks the extreme defensive peaks of the Scion.",
          "Less specialized at locking down single lanes.",
        ],

        keyAbilities: [
          "Marrow-Flux Harmony: Attunement restrictions halved, benefits reduced by 25%.",
          "Dual Marrow: Benefit from a secondary attunement at 50% strength.",
          "Flexible Drainage: Switch bone attunements during a short rest.",
        ],

        specPassive: {
          name: "Marrow-Flux Harmony",
          description:
            "Attunement restrictions reduced by 50%. Attunement benefits reduced by 25%. Can attune to a second bone structure at 50% effectiveness. Can switch attunements during one short rest per day.",
        },
      },
      {
        id: "astral-warrior",
        name: "Gravitational Rupture",
        icon: "Arcane/Missile",
        color: "#583D70",
        theme: "Combat Weight-Shift",

        description: `You weaponize the kinetic shock of skeletal fracture. By violently shattering and rebuilding your bones mid-combat, you swap attunements on the fly.`,

        playstyle: "Tactical shape-shifting, mobile gravity wells, combo strikes",

        strengths: [
          "Switch attunements mid-combat for 1 AP (3 uses per long rest).",
          "Switching triggers a bone-shattering shockwave matching your new attunement.",
          "Starting combat with all 3 shift uses available.",
          "Highly adaptive to changing enemy resistances.",
        ],

        weaknesses: [
          "Each shift deals 2d6 self-inflicted crushing damage.",
          "Ultimate availability does not reset upon shifting attunements.",
          "Requires deep knowledge of complex combat matchups.",
          "Lower static defensive bonuses when not shifting.",
        ],

        keyAbilities: [
          "Terminal Weightless-Burst: Switch attunements mid-combat for 1 AP.",
          "Shatter Pulse: Shifting triggers a unique burst based on the new attunement.",
          "Friction Shrapnel: Gaining +20 Calcification instantly upon shifting.",
        ],

        specPassive: {
          name: "Terminal Weightless-Burst",
          description:
            "Can switch attunements mid-combat for 1 AP (3 uses per long rest). Shifting deals 2d6 crushing damage to yourself but triggers a unique burst shockwave and instantly generates +20 Calcification Mass.",
        },
      },
    ],
  },

  exampleSpells: TITAN_SPELLS,
};
