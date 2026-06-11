/**
 * Martyr Class Data
 *
 * Complete class information for the Martyr - a selfless protector
 * who gains power through sacrifice and devotion to their allies.
 */

export const MARTYR_DATA = {
  id : "martyr",
  name: "Martyr",
  icon: "fas fa-cross",
  role: "Tank/Support",
  damageTypes: ["ember"],

  // Overview section
  overview: {
    originStory: `The Solvarn mother Sera refused to let her sacrificed child's name be erased by the noble houses' history-purge. She carved the name directly into her forearm with volcanic obsidian, swearing to bear the pain of the entire badlands to keep the memory alive.

Her devotion opened a channel of sympathetic pain. The Martyr carries the physical scars of all nearby wounds, her tissue burning with sympathetic heat whenever an ally is struck. She finds power only in her own suffering, converting blood to light, her skin cracking to reveal the solar embers of her vow.

Suffer for them. You are the shield of meat and bone, and your wounds are the only light left in the ash. Bleed until they are safe.`,
    title: "The Martyr",
    subtitle: "Bleeding Faith Healer — Where the Divine Meets the Scalpel",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Martyr does not use shields or armor to stop blades. They use the soft meat of their own body to catch weapons meant for their companions. Every wound they choose to bear becomes a prayer — and every prayer demands more flesh. You do not get stronger by surviving. You get stronger by volunteering to not survive.

**Core Mechanic**: ACTIVELY sacrifice HP (Intervene, self-damage spells, voluntary offering) → Cross damage thresholds → Unlock Devotion Levels → Spend Devotion to amplify healing/buffs

**Resource**: Devotion Gauge (6 levels, thresholds at 10/20/40/60/80/100 damage taken)

**CRITICAL DIFFERENCE FROM IRONCLAD**: The Ironclad specialization is an immovable furnace-fortress that absorbs damage and converts it into heat and shields. The standard Martyr is a BLEEDING FAITH HEALER who actively wounds themselves to heal others. The Ironclad's power comes from what hits them. The other Martyrs' power comes from what they CHOOSE to suffer. The Ironclad endures. The others volunteer.

**The Minor Hit Loop**: Intervene creates a tactical fork. Intercepting a major hit (10+ damage) yields maximum Devotion progression — your body drinks the violence and converts it into divine authority. But intercepting a minor hit (less than 10 damage) bypasses Devotion entirely and instead immediately restores 1d4 Mana. You must choose between building power and sustaining your casting endurance.

**The Fatal Flaw — Devotion Collapse**: If you go 1 round without taking damage or sacrificing HP, you lose 1 Devotion Level. The faith that is not tested rots immediately. Lose 3 levels through decay in a single combat and you become Faithless for 2 rounds: all healing you deal is halved, and you cannot use Intervene. The divine does not reward fair-weather believers. Recover by sacrificing at least 15 HP in a single round.

**Playstyle**: Frontline bleeding altar who converts deliberate self-harm into emergency salvation for everyone else

**Best For**: Players who enjoy protective gameplay with genuine risk, the martyrdom fantasy, and the visceral satisfaction of turning personal catastrophe into party survival`,
    },

    description: `The Martyr is not a protector. A protector uses a shield. The Martyr uses the soft meat of their own body to catch weapons swung at their companions. Through the Devotion Gauge — a resource that fills as they deliberately bleed themselves for allies — the Martyr transforms willing suffering into grotesque acts of emergency healing. Their power is not generosity. It is a transaction with something old and hungry that dwells in the space between flesh and faith. The more they bleed, the more that thing stirs. Unlike the Ironclad specialization which passively absorbs whatever hits them through furnace-plate armor, the standard Martyr must CHOOSE to suffer: casting self-damaging spells, using Intervene to intercept attacks, and offering their own HP to cross Devotion thresholds faster. Each wound they volunteer for becomes a wound closed on someone else. Theirutility is singular and terrifying: the ability to completely negate fatal blows tracking toward allies by pulling the entire damage vector into their own anatomy and releasing localized bursts of vitality that scale with accumulated agony. No other class can do this. But their connection to the divine is fragile. If they stop bleeding, the connection asphyxiates. Devotion Collapse is the Martyr's constant companion — a spiral into the Faithless state where their healing rots to half strength and their reactions lock down. They are a crisis tool with an expiration date, and that date is measured in rounds since their last wound.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The martyr's devotion was born in the volcanic badlands of <LoreLink termId="sundale">Sundale</LoreLink>. A Solvarn mother named <LoreLink termId="sera">Sera</LoreLink> refused to let her sacrificed child's memory be erased by the houses' subsequent history-purge. The price of this memory was a glowing, sympathetic solar scar. Sera carved her child's name directly into her forearm with volcanic obsidian, establishing the path that absorbs the suffering of others.

**CITIES & CIVIL RECEPTION**
Martyrs are highly respected as holy guardians in the frontier keeps and the geothermal arenas of the <LoreLink termId="harath_vault">Harath-Vault</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the Solvarn humans and the <LoreLink termId="emberth">Korr Emberth</LoreLink>.

**NOTABLE FIGURES**
* **Sera the Devoted**: The founding mother of the Martyr's Vow who carved the history of the sacrificed children.
* **Orak the Scarred**: A Korr monk who bore the sympathetic heat of thirty miners during a geothermal rupture.`
    },

    signatureQuote: {
      text: '"My child\'s name was carved from history. I carved it back into my arm. Every beat of my heart pushes their name through my veins. They are not forgotten. They are my pulse."',
      speaker: 'Sera the Devoted',
      context: 'The founding oath of the Martyr\'s Vow, Year 12 of the Dimming'
    },

    philosophy: {
      coreTenet: 'Suffering is not meaningless. Pain is a currency, and the Martyr spends it freely. Every wound they take is a debt the universe owes to someone else. They bleed so others can stand. They burn so others can feel warmth. The balance must be maintained, and the Martyr is the scale.',
      relationship: 'A Martyr\'s power comes from the sympathetic bond between their pain and their allies\' survival. When they Intervene, they do not just take damage — they absorb the spiritual weight of the injury. The wound that was meant for their ally exists in their body instead. The Devotion Gauge is not a resource they generate — it is a measure of how much suffering they have volunteered to carry. Every point of Devotion is a wound that belongs to someone else.',
      paradox: 'The Martyr heals others by refusing to heal themselves. Their power is maximized when they are at their most vulnerable. A Martyr with full health is useless. A Martyr at death\'s door can raise the entire party from the brink. This creates an agonizing incentive structure: the better a Martyr is at their job, the closer they are to dying. They must walk the exact line between enough sacrifice and too much — and the line moves every time.'
    },

    currentCrisis: `The Martyr\'s Vow is being weaponized. Sera\'s original covenant was a personal oath — a mother\'s refusal to let her child be forgotten. But the noble houses have discovered that organized groups of Martyrs can be used as a strategic resource. A battalion supported by a Martyr cadre can fight for three times as long as a normal one.

Several houses have begun "recruiting" Martyrs — some by indoctrination, some by coercion, some by simply taking children and training them from birth to associate pain with duty. These conscripted Martyrs do not carry the Vow willingly. Their Devotion Gauge fills more slowly, and their wounds heal less cleanly. The original Martyrs — those who took the Vow freely — have publicly condemned this practice, but they are outnumbered. The debate has split the Martyr tradition: free Martyrs versus conscripted Martyrs, and the conscripts are winning through sheer numbers.`,

    meaningfulTradeoffs: `To be a Martyr is to be in pain, always. The sympathetic bond means they feel every wound that their allies take, whether they Intervene or not. An ally who stubs their toe causes a Martyr a moment of sharp discomfort. An ally who dies causes the Martyr to experience that death in full, visceral detail. The Martyr cannot turn this off. They are permanently, intimately connected to the suffering of everyone they have sworn to protect. Most develop elaborate pain-management rituals — breathing exercises, meditation, or simply gritting their teeth until the wave passes. They never stop gritting.`,

    classSpecificLocations: [
      {
        name: 'The Martyr\'s Vigil',
        locationId: 'sundale',
        description: 'A shallow cave in the volcanic badlands of Sundale where Sera the Devoted carved her son\'s name into her arm. The cave walls are now covered in names — thousands of them, carved by every Martyr who has taken the Vow. Each name represents someone the Martyr has sworn to protect. The floor is worn smooth by generations of kneeling.',
        purpose: 'Pilgrimage site and initiation ground',
        status: 'Active — the free Martyrs gather here twice a year to renew their Vows'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `The Martyr is a hybrid support/tank whose utility is singular and terrifying: **the exclusive ability to negate fatal blows** tracking toward allies by pulling incoming damage vectors directly into their own body and releasing bursts of emergency vitality scaled to accumulated agony. No other class can do this.

**Strengths**:
- **Fatal Blow Negation**: The "Why Bring Me?" answer. Only the Martyr can completely intercept a killing strike and redirect it into themselves
- Sustained healing that scales with personal suffering — the more damaged they are, the more dangerous their support becomes
- Protective buffs purchased with self-harm
- Can turn near-death situations into party-saving turning points through high Devotion abilities
- Minor Hit Mana Loop creates tactical sustain — intercepting small hits fuels casting instead of Devotion

**Weaknesses**:
- **Devotion Collapse (Fatal Flaw)**: If you go 1 round without taking damage or sacrificing HP, you lose 1 Devotion Level. The faith that is not tested decays immediately. If you lose 3 Devotion Levels through decay in a single combat, you become Faithless for 2 rounds: all healing you deal is halved, and you cannot use Intervene. The divine does not reward fair-weather believers. Recover by sacrificing at least 15 HP in a single round
- Highly vulnerable to targeted crowd control that isolates them from the party — if they cannot reach allies to intercept, their Devotion starves
- Can become overwhelmed if they sacrifice too aggressively
- Requires ACTIVE self-sacrifice to reach full potential — passive damage absorption alone is insufficient
- Fundamentally different from Ironclad spec: Ironclad absorbs whatever hits them (passive furnace fortress). Other Martyrs must CHOOSE to bleed (active sacrifice)
- **The Zealot's Wrath Tithe**: Zealot-spec Martyrs deal devastating bonus damage scaled to Devotion, but suffer half that bonus as self-harm — they are simultaneously the party's most aggressive support and their own worst enemy

The Martyr shines in prolonged encounters where they can build Devotion Levels and unleash devastating amplified abilities at critical moments. They wither in fights where they cannot reach allies or where enemies ignore them.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Martyr is about strategic sacrifice, resource management, and the constant threat of Devotion Collapse. Key considerations:

**Building Devotion** (Active Sacrifice, NOT Passive Tanking):
- **Intervene (Major Hit)**: Intercept an attack dealing 10+ damage meant for an ally → Take the damage → Gain bonus Devotion equal to damage ÷ 10 (minimum 1). This is your primary Devotion engine for heavy combat
- **Intervene (Minor Hit Loop)**: Intercept an attack dealing less than 10 damage → Bypass Devotion gain entirely → Immediately restore 1d4 Mana. Use this when your Devotion is stable but your casting endurance is flagging
- **Self-Damage Spells**: Cast Penance of Pain, Burning Sacrifice, or other self-harming spells → Build Devotion while healing/buffing allies
- **Voluntary Offering**: At the start of your turn, sacrifice up to 1d8 HP as a free action to gain +1 Devotion progress toward the next threshold
- **Passive Damage**: Being hit naturally contributes, but this is SLOW. A Martyr who just stands there and gets hit is a dead Martyr
- **Devotion Collapse**: If you lose 3 Devotion Levels through decay in a single combat (not through spending), you become Faithless for 2 rounds (healing halved, cannot Intervene). Recover by sacrificing 15+ HP in a single round

**Devotion Level Strategy**:
- **Level 1-2 (Building Phase)**: Basic defensive benefits, focus on accumulating damage through interception
- **Level 3-4 (Power Phase)**: Strong passive effects, moderate amplification power — your wounds begin weeping light that hardens into ally armor
- **Level 5-6 (The Hollow Transfiguration)**: Your flesh turns translucent, bones blaze with volatile golden energy. You become a weaponized, weeping anatomical horror. Powerful auras and devastating amplified abilities. This is not beautiful. This is not clean. This is survival weaponized.

**Spending Devotion**:
- Amplified spells cost 1-5 Devotion Levels for enhanced effects
- Save high Devotion for critical moments (boss fights, emergencies)
- Consider whether passive benefits outweigh active spending
- Some situations require immediate amplified healing over passive bonuses

**Specialization Synergies**:
- **Redemption**: Maximum healing and protection, defensive playstyle — the purest form of bleeding faith
- **Zealot**: Aggressive damage-dealing through suffering, offensive support — Wrath Tithe makes your radiant spells devastating but you pay half the bonus damage in self-harm
- **Ascetic**: Balanced endurance, maintains high Devotion efficiently — the martyr who calculates the cost of every wound

**Team Dynamics**:
- Position near vulnerable allies to use Intervene effectively
- Communicate Devotion Levels so team knows when big abilities are ready
- Synergizes with classes that benefit from resistance and temp HP buffs
- Your fatal flaw is isolation — crowd control that separates you from allies starves your Devotion`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Sacred Sacrifice",
      content: `**The Setup**: You're a Martyr (Redemption specialization) and your party is fighting a demon lord and two lesser demons. Your mage is at 25 HP and a lesser demon is bearing down on her. Your tank holds the center. Starting HP: 100/100. Devotion Level: 0 (no damage taken yet). Starting Mana: 50/60. Spirit modifier: 4. Strength: 3.

**Starting State**: HP: 100/100 | Devotion: 0 (0 thresholds crossed, 0 spent) | Mana: 50/60 | Mage: 25/70 | Tank: 50/90

**DEVOTION LEVEL 0**

**Turn 1 â€” First Sacrifice**

*A lesser demon charges your mage. She's at 25 HPâ€”one solid hit will drop her.*

**Your Reaction â€” Intervene** (4 mana, redirect attack to self):
**Demon's Attack**: Redirected to you â†’ 2d8+5 â†’ [7, 8]+5 = **20 damage**
**No passives active** (Devotion 0)
**Your HP**: 100 âˆ’ 20 = **80/100**
**Total Damage Taken**: 20

**Devotion Check**: 20 â‰¥ 10 and 20 â‰¥ 20 â†’ crossed 2 thresholds â†’ **Devotion Level 2**
**Passive Gained (Level 1)**: Resistance to the first damage instance you receive each round (half damage, rounded down)
**Passive Gained (Level 2)**: Regain 1d6 HP at the start of your turn
**Redemptive Grace**: Intervene heals the protected ally for 2d6 â†’ [4, 5] = 9 â†’ Mage: 25 + 9 = **34/70**
**Suffering's Gift**: Requires Devotion 3+, not yet active

*Golden light flares from your wounds. Your first sacrifice awakens something divine.*

**Lesser Demon #1 attacks you**:
**Attack**: 1d10+3 â†’ [7]+3 = 10 damage
**Level 1 Passive (first instance this round)**: Resistance â†’ 10 Ã· 2 = **5 damage**
**Your HP**: 80 âˆ’ 5 = **75/100**
**Total Damage Taken**: 20 + 5 = 25
**Devotion Check**: 25 â‰¥ 20 but < 40 â†’ still 2 thresholds â†’ Devotion **2**

**Your Party's Mage**: "You took that hit for me..."
**You**: "That's what I'm here for. My pain is your protection."

**Current State**: HP: 75/100 | Devotion: 2 (2 crossed, 0 spent) | Total Damage: 25 | Mana: 46/60

**Turn 2 â€” The Demon Lord Strikes**

*The demon lord turns its burning gaze to you, flames licking along its massive blade.*

**Start of Turn â€” Level 2 Passive**: Regain 1d6 HP â†’ [4] = 4 â†’ HP: 75 + 4 = **79**

**Demon Lord attacks you**:
**Attack**: 3d10+6 fire â†’ [8, 9, 7]+6 = **30 fire damage**
**Level 1 Passive (first instance this round)**: Resistance â†’ 30 Ã· 2 = **15 damage**
**Your HP**: 79 âˆ’ 15 = **64/100**
**Total Damage Taken**: 25 + 15 = 40

**Devotion Check**: 40 â‰¥ 40 â†’ crossed 3 thresholds â†’ **Devotion Level 3!**
**Passive Gained (Level 3) â€” Suffering's Gift**: When you take damage, all allies within 10 ft gain temporary HP equal to your Devotion Level (3). Triggers once per damage instance. Self-inflicted damage does not trigger this effect.
**Suffering's Gift fires**: Allies gain 3 temp HP â†’ Mage: **3 temp HP**, Tank: **3 temp HP**

*More wounds. More light. Your scars glow brighter.*

**Your Action â€” Divine Shield** (10 mana, AoE within 10 ft):
**Effect**: All allies within 10 ft gain 1d6 temporary HP â†’ [5] = **5 temp HP**
**Temp HP comparison**: 5 (Divine Shield) > 3 (Suffering's Gift) â†’ higher value applies
**Result**: Mage: **5 temp HP**, Tank: **5 temp HP**

**Lesser Demon #2 attacks Tank**:
**Attack**: 1d10+3 â†’ [6]+3 = 9 damage
**No ally resistance passive** (Level 4 not yet reached)
**Tank's 5 temp HP** absorbs 5 â†’ Tank takes 4 â†’ Tank: 50 âˆ’ 4 = **46/90** (0 temp HP remaining)

**Current State**: HP: 64/100 | Devotion: 3 (3 crossed, 0 spent) | Total Damage: 40 | Mana: 36/60
Mage: 34/70 + 5 temp HP | Tank: 46/90 + 0 temp HP

**Turn 3 â€” Push to Peak, Amplified Sacrifice**

*The demons surround you. You're bleeding from a dozen wounds, but golden light pulses from every scar.*

**Start of Turn â€” Level 2 Passive**: Regain 1d6 HP â†’ [3] = 3 â†’ HP: 64 + 3 = **67**

**Demon Lord attacks you**:
**Attack**: 2d10+6 fire â†’ [7, 8]+6 = **21 fire damage**
**Level 1 Passive (first instance this round)**: Resistance â†’ 21 Ã· 2 = **10 damage** (rounded down)
**Your HP**: 67 âˆ’ 10 = **57/100**
**Total Damage Taken**: 40 + 10 = 50
**Devotion Check**: 50 â‰¥ 40 but < 60 â†’ still 3 thresholds â†’ Devotion **3**
**Suffering's Gift**: Allies gain 3 temp HP â†’ Mage has 5 (3 < 5, no change) | Tank has 0 â†’ Tank: **3 temp HP**

**Lesser Demon #1 attacks you**:
**Attack**: 1d10+3 â†’ [9]+3 = 12 damage
**Second instance this round â€” no resistance**
**Your HP**: 57 âˆ’ 12 = **45/100**
**Total Damage Taken**: 50 + 12 = 62

**Devotion Check**: 62 â‰¥ 60 â†’ crossed 4 thresholds â†’ **Devotion Level 4!**
**Passive Gained (Level 4)**: All allies within 10 ft resist the first damage type they receive each round (half damage, rounded down)
**Suffering's Gift**: Allies gain 4 temp HP â†’ Mage has 5 (4 < 5, no change) | Tank has 3 (4 > 3) â†’ Tank: **4 temp HP**

**Lesser Demon #2 attacks Mage**:
**Attack**: 1d10+3 â†’ [5]+3 = 8 slashing damage
**Level 4 Passive**: Allies resist first damage type â†’ 8 Ã· 2 = **4 damage** to Mage
**Mage's 5 temp HP** absorbs 4 â†’ Mage takes 0 â†’ Mage: **34/70** (1 temp HP remaining)

*Your wounds are radiant. Power surges through you. The mage is safe. Nowâ€”amplify.*

**Your Action â€” Restorative Prayer AMPLIFIED** on Mage (5 mana + spend 2 Devotion Levels):
**Devotion Spent**: 2 â†’ Effective Devotion: 4 crossed âˆ’ 2 spent = **Level 2**
**Rise Check**: Total damage (62) crosses a NEW threshold (80)? No â†’ stays at Level 2
**Base Healing**: 1d4 + Spirit(4) â†’ [3]+4 = 7 HP
**Amplification Bonus**: +2d8 per Devotion Level spent (2) = +4d8 â†’ [6, 7, 4, 8] = +25 HP
**Total Healing**: 7 + 25 = **32 HP** â†’ Mage: 34 + 32 = **66/70**

**Self-Damage (Amplified Spell Cost)**: 1d6 per Devotion Level spent (2) = 2d6 â†’ [3, 2] = **5 damage**
**Self-inflicted â†’ does NOT add to Total Damage Taken**
**Self-inflicted â†’ does NOT trigger Suffering's Gift**
**Your HP**: 45 âˆ’ 5 = **40/100**
**Total Damage Taken**: still **62**

**Mana**: 36 âˆ’ 5 = **31/60**

**Your Party's Tank**: "You're glowing like a furnace! Are you holding up?"
**You**: "I've been better. But the mage just got healed for 32 HP. That's what matters."

**Current State**: HP: 40/100 | Devotion: 2 (4 crossed, 2 spent) | Total Damage: 62 | Mana: 31/60
Mage: 66/70 + 1 temp HP | Tank: 46/90 + 4 temp HP

**Turn 4 â€” Rebuild and Finish**

*You're at 40 HP. The demons are relentless. But your Devotion is rebuildingâ€”each wound brings you closer to the next threshold.*

**Start of Turn â€” Level 2 Passive**: Regain 1d6 HP â†’ [5] = 5 â†’ HP: 40 + 5 = **45**

**Demon Lord attacks you**:
**Attack**: 2d10+6 fire â†’ [9, 7]+6 = **22 fire damage**
**Level 1 Passive (first instance this round)**: Resistance â†’ 22 Ã· 2 = **11 damage**
**Your HP**: 45 âˆ’ 11 = **34/100**
**Total Damage Taken**: 62 + 11 = 73
**Devotion Check**: 73 < 80 â†’ still 4 thresholds â†’ Devotion **2**

**Lesser Demon #1 attacks you**:
**Attack**: 1d10+3 â†’ [8]+3 = 11 damage
**Second instance this round â€” no resistance**
**Your HP**: 34 âˆ’ 11 = **23/100**
**Total Damage Taken**: 73 + 11 = 84

**Devotion Check**: 84 â‰¥ 80 â†’ NEW threshold crossed! 5 thresholds total â†’ Effective Devotion: 5 âˆ’ 2 = **Level 3!**
**Suffering's Gift**: Allies gain 3 temp HP â†’ Mage has 1 (3 > 1) â†’ Mage: **3 temp HP** | Tank has 4 (3 < 4, no change)

*New Devotion surges through you. Not full power, but enough.*

**Your Action â€” Devoted Strike** at Lesser Demon #2 (6 mana, melee):
**Attack Roll**: d20+5 â†’ [18] = Hit!
**Damage**: 1d8 + Strength(3) â†’ [7]+3 = **10 radiant damage**
**Self-Heal**: Strength(3) Ã· 2 = 1 HP â†’ HP: 23 + 1 = **24/100**
**Result**: Lesser Demon #2 is wounded

*Your allies finish the fightâ€”the tank crushes the wounded demon, and the mage's fire spell scorches the last one.*

**Combat Over**

*You stand among the demon corpses, bleeding but victorious. Your wounds glow with fading golden light.*

**Final State**: HP: 24/100 | Devotion: 3 (5 crossed, 2 spent) | Total Damage: 84 | Mana: 25/60
Mage: 66/70 + 3 temp HP | Tank: 46/90 + 4 temp HP

**The Lesson**: This fight demonstrates the core Martyr loop:

1. **Building Devotion Through Sacrifice**: You intercepted a killing blow on Turn 1 with Intervene (4 mana), immediately crossing two thresholds and reaching Devotion 2. Every hit you absorbed after that pushed you higher.

2. **Model A Devotion Spending**: On Turn 3, you spent 2 Devotion Levels to amplify Restorative Prayer. Your effective Devotion dropped from 4 to 2. Your total damage taken (62) did NOT decreaseâ€”only your available Devotion did. You could not rise back until your total damage crossed a NEW threshold (80).

3. **Self-Damage Exclusion**: The 2d6 self-damage from amplification (5 HP) did NOT contribute to your Devotion thresholds and did NOT trigger Suffering's Gift. Only damage from external sources counts.

4. **Recovering Devotion**: On Turn 4, when your total damage hit 84, you crossed the 80 threshold for the first timeâ€”earning a 5th Devotion level. With 2 spent, your effective Devotion rose from 2 back to 3. To fully recover to Level 5, you would need to spend no more Devotion.

5. **Layered Passive Protection**: Your passives provided constant valueâ€”Level 1 resistance halved the demon lord's 30-damage hit to 15, Level 2 regen restored 17 HP across four turns, Suffering's Gift buffered your allies with temp HP, and Level 4 resistance protected the Mage from an 8-damage hit entirely.

6. **Amplified Healing at the Right Moment**: Spending 2 Devotion on Turn 3 turned a modest 7 HP heal into 32 HPâ€”saving the Mage when she needed it most. The cost was real: 5 self-damage and dropping from Devotion 4 to 2. But the Mage lived.

7. **Devotion Persistence**: Your Devotion (Level 3, with 84 total damage) persists until you complete a Short Rest or are healed above 80% of your maximum HP (80 HP). Even after combat ends, you carry that power into the next fight.

You're not a traditional healer. You're a LIVING SACRIFICE. You intercept attacks meant for allies. You endure suffering so they don't have to. And when your Devotion peaks, you convert that pain into amplified healing that can save a dying ally. The key is timingâ€”spend Devotion when it matters most, and trust that more wounds will rebuild what you spent. Your wounds are your power. Your pain is their salvation.`,
    },
  },

  resourceSystem: {
    title: "Devotion Gauge",
    subtitle: "Power Through Sacrifice — The Currency of Agony",

    description: `The Devotion Gauge is not a resource. It is an open wound that measures how much of the Martyr's body has been offered to something old and hungry that lives between flesh and faith. By absorbing damage meant for allies, the Martyr builds this gauge — unlocking passive auras and radiant strikes that grow more powerful — and more grotesque — with each threshold crossed. At lower tiers, the Martyr is merely a bruised信徒 with good intentions. At higher tiers, their flesh turns translucent, their bones ignite with volatile golden light, and they become something that should not exist: a weaponized, weeping anatomical horror whose suffering poisons the air with mercy. Each wound is not a prayer — it is a payment. Each scar is not a blessing — it is a receipt. And if the payments stop, the connection dies. Devotion Collapse is not a risk. It is a certainty. The only question is when.`,

    cards: [
      {
        title: "Flickering Faith (Level 1â€“2)",
        stats: "Resist 1st Hit | 1d6 HP Regen",
        details:
          "The foundation of endurance. Your faith is a guttering candle in a cathedral of bones. At these levels, your devotion provides nothing more than the personal survival needed to keep absorbing punishment. You are not holy. You are meat that refuses to stop bleeding.",
      },
      {
        title: "Radiant Sacrifice (Level 3â€“4)",
        stats: "+1 DR Aura | Resists for Allies",
        details:
          "Your pain becomes their armor. Allies within 10ft gain protection only because your wounds weep light. Every point of resistance you grant was bought with an incision in your own flesh. The divine does not give — it extracts.",
      },
      {
        title: "The Hollow Transfiguration (Level 5â€“6)",
        stats: "+10 Radiant DMG | Massive Resist",
        details:
          "There is nothing beautiful about what you become. Your flesh turns translucent, stretched thin over a skeleton that blazes with volatile golden energy from within. Your bones become lanterns of radioactive devotion. Tears of liquid radiance stream from hollowed eye sockets. You do not gain phantom wings — you manifest as a weaponized, weeping anatomical horror, a crucified saint whose opened body cavity floods the battlefield with agonizing salvation. Allies within 15ft resist ALL damage types because your transfigured suffering poisons the air itself with mercy.",
      },
    ],

        generationTable: {
          headers: ["Action/Event", "Devotion Gain", "Thresholds"],
          rows: [
            ["Take Damage", "1:1 Progress", "10/20/40/60/80/100 Total"],
            [
              "Martyr's Intervene (Major Hit: 10+ dmg)",
              "Redirect + Bonus",
              "Gain Devotion = damage Ã· 10 (min 1)",
            ],
            [
              "Martyr's Intervene (Minor Hit: <10 dmg)",
              "No Devotion",
              "Bypass Devotion → Restore 1d4 Mana instead",
            ],
            [
              "Self-Sacrifice Spells",
              "Self-DMG",
              "Direct conversion of HP to Devotion",
            ],
            [
              "Amplify Spell",
              "Spend Levels",
              "Costs 1-5 Levels. Your effective Level decreases by the amount spent. Total damage taken does NOT decrease. Your Level can rise again if total damage crosses the threshold for your current Level + 1.",
            ],
            [
              "Zealot Wrath Tithe",
              "Self-Harm Tax",
              "Bonus damage = Devotion x 3. You suffer half as radiant self-injury.",
            ],
            [
              "Short Rest",
              "Persistence",
              "Devotion persists until you complete a Short Rest or are healed above 80% of your max HP",
            ],
          ],
        },

    usage: {
      momentum:
        'Use Intervene aggressively in the first three rounds. Your goal is to spike into Level 3 as fast as possible to unlock the ally armor aura. Target the biggest incoming hits — the ones that would kill your allies — because the Devotion payoff is proportional to the violence you absorb.',
      flourish:
        "The Spending Trap: Amplified spells are seductive, but they strip your passive auras. If you spend Level 6 to save one person, you lose the resistance that was keeping the rest of the party alive. The Minor Hit Loop is your sustain valve — when Devotion is stable, intercept small hits to recover Mana instead of overstacking thresholds you cannot maintain.",
    },

    overheatRules: {
      title: "Sacrificial Tiers",
      content: `Your **Devotion Level** determines the strength of your passive auras and the magnitude of your divine presence — and the horror of your transfiguration.

**The Hollow Transfiguration (Level 5â€“6)**:
- **Effect**: God-Tier Protection. Your flesh becomes translucent. Your bones glow with volatile golden energy. You are a weeping anatomical horror — a weaponized saint whose opened body cavity floods the battlefield with agonizing salvation.
- **Strategy**: This is your peak state, and it is monstrous. You provide resistance to all damage types for the entire team because your transfigured suffering poisons reality itself with mercy. Do not spend these levels on amplified spells unless it is for a game-ending strike or a life-saving burst heal. The transfiguration demands its toll whether you use it or not.

**Ascendant (Level 3â€“4)**:
- **Effect**: Support Anchor. Your wounds weep light that hardens into armor around your allies.
- **Strategy**: The optimal state for most of the battle. You provide balanced armor buffs and have moderate amplification power ready for emergency interventions. Your suffering is productive, controlled, and sustainable.

**Mortal (Level 0â€“2)**:
- **Effect**: Vulnerability. You are just meat and misplaced faith.
- **Strategy**: You are just a person with scars and bad theology. Your priority is to Intercept attacks immediately and use self-sacrificial spells to reach higher tiers before the party takes significant damage. A Martyr at Devotion 0 is a liability. Bleed. Rise.`,
    },

    strategicConsiderations: {
      title: "The Living Crash Pad",
      content: `**The Intervene Priority**: Your best resource isn't your mana — it's your HP. If an ally is targeted by a multi-hit attack, use Intervene on the largest single hit to maximize your Devotion gain (Damage/10). For small, attrition-style hits, use the Minor Hit Loop to sustain your Mana instead.

**Passive vs Active**: A Level 6 Martyr is practically a win-condition due to the group-wide resistance aura. Spending those levels should be your last resort, used only when the amplified healing is the only way to prevent a death.

**The Minor Hit Mana Loop**: Not every intercepted blow needs to build Devotion. When you intercept a hit dealing less than 10 damage, you gain no Devotion — but you immediately restore 1d4 Mana. This creates a tactical decision: do you need divine power (major hit → Devotion) or casting endurance (minor hit → Mana)? Late-game, when Devotion is stable, the minor hit loop becomes your primary sustain mechanic.

**The Self-Damage Loop**: Some spells, like Penance of Pain, hurt you to heal others. This is a double-win: you provide necessary support while manually pushing your Devotion Gauge into the next tier. However, self-damage from amplified spells does NOT contribute to your total damage taken for Devotion threshold purposes. This prevents infinite loops where amplified spell self-damage immediately recovers spent Devotion Levels.

**Wrath Tithe (Zealot)**: Zealot-spec Martyrs must treat their own offensive casts as additional self-harm events. At Devotion 6, every radiant spell costs you HP equal to half the bonus damage. Factor this into your survival calculations — a Zealot at low HP who casts offensively may kill themselves before the enemy does.

**Devotion Collapse Awareness**: If you are being ignored by enemies, your Devotion will decay. If you are being crowd-controlled, your Devotion will decay. If you are kited away from allies, your Devotion will decay. Three decay levels in one combat = Faithless. Always have a self-sacrifice spell ready to arrest the spiral.

**Worked Example (The Threshold Jump)**:
- **Scenario**: You are at Level 2 (20 damage taken). A boss targets your Wizard with a 20-damage fireball.
- **The Play**: Intervene. You take 20 damage.
- **The Result**: Your total damage hits 40 (Level 3), AND Intervene grants a bonus level. You jump from Level 2 to Level 4 in a single reaction.
- **Outcome**: The Wizard is safe, and your entire team now has a Resistance Aura they didn't have 10 seconds ago. Your bones are starting to glow.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Tracking the Blood Stacks",
      content: `Tracking six levels of devotion and cumulative damage can be messy. Use "Blood Stacks" for clarity.

**Required Materials**:
- **Devotion Track** â€” A strip of cardstock with 1-6 marked on it.
- **Red Glass Beads** â€” Use these for your current HP.
- **Gold Tokens** â€” Use these to mark unlocked Devotion Levels.

**The Physical Hack**:
- **The Altar**: Place your Devotion Track in the center of the table. As you take damage, move a marker up the track. When you "Amplify," physically hand the tokens to the GM. It makes the sacrifice feel heavy and significant.
- **Glow-Up**: Use a gold d6 to track your current level. When you hit Level 5, swap it for a d20 to show your "Ascendance."

**Quick Reference**:
\`\`\`
THRESHOLDS: 10, 20, 40, 60, 80, 100 (Total Damage)
INTERVENE: Redirect attack + 1 Bonus Level
AMPLIFY: Spend 1-5 Levels for Massive Spells
\`\`\`

**Tactile Tip**: Every time you take damage for an ally, tap your shield or the table. It reminds everyone that your power is bought with your own life force.`,
    },
  },

  // Specializations
  specializations: {
    title: "Martyr Specializations",
    subtitle: "Four Paths Through the Same Flesh",

    description: `Every Martyr chooses one of four specializations that define how they approach the fundamental transaction: their body for their allies' survival. Each specialization is a different theology of suffering — not a different job, but a different interpretation of the same horrible math.`,

    specs: [
      { id : "redemption",
        name: "Redemption",
        icon: "Radiant/Radiant Bolt",
        color: "#FFD700",
        theme: "Healing Through Sacrifice — The Open Vein",

        description: `Redemption Martyrs are the purest expression of bleeding faith. They do not fight — they hemorrhage on behalf of others, converting their own tissue damage into restorative magic. They are the party's emergency transfusion, willingly bearing wounds so others may live. Their healing is not gentle. It is the desperate, agonizing survival of meat and bone repurposed as medicine.`,

        playstyle:
          "Defensive support, maximum healing output, protective buffs purchased with flesh",

        strengths: [
          "Highest healing output of all Martyr specs",
          "Enhanced protective abilities",
          "Excellent at keeping allies alive in prolonged fights",
          "Amplified healing spells are extremely potent",
        ],

        weaknesses: [
          "Lowest damage output",
          "Requires allies to protect to be effective",
          "Less useful when fighting alone",
          "Heavily reliant on positioning near allies",
        ],

        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: "Path Passive",
            description:
              "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack â€” the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: "All Martyrs",
          },
          {
            name: "Redemptive Grace",
            tier: "Specialization Passive",
            description:
              "Whenever you use Martyr's Intervene, you heal the protected ally for 2d6 HP. Additionally, all healing spells you cast have their range increased by 10 feet.",
            uniqueTo: "Redemption",
          },
        ],

        recommendedFor:
          "Players who enjoy pure support roles, keeping allies alive, and selfless protection",
      },

      { id : "zealot",
        name: "Zealot",
        icon: "Radiant/Divine Downward Sword",
        color: "#DC143C",
        theme: "Righteous Fury — The Blade That Cuts Both Ways",

        description: `Zealot Martyrs channel their suffering into devastating radiant attacks fueled by the Wrath Tithe — a covenant where every point of bonus damage extracted from their Devotion demands an equal toll of flesh. They believe that pain purifies and empowers, but the price is literal: half of their offensive bonus tears through their own body on its way to the enemy. The more they suffer, the more destructive their righteous fury becomes — and the faster they kill themselves doing it.`,

        playstyle:
          "Aggressive support, radiant damage through self-harm, offensive buffs with a visceral tax",

        strengths: [
          "Highest damage output of all Martyr specs via Wrath Tithe scaling",
          "Wrath Tithe: +(Devotion Level x 3) bonus radiant damage — devastating at high Devotion",
          "Strong radiant damage scaling with Devotion — suffering is ammunition",
          "Excellent at eliminating priority targets when health is low",
        ],

        weaknesses: [
          "Wrath Tithe self-harm: you suffer half of your bonus damage as radiant self-injury every offensive cast",
          "Lower healing output than Redemption — you are a weapon, not a bandage",
          "More vulnerable due to accumulated self-harm from Wrath Tithe stacking with enemy damage",
          "Requires balancing offense with survival — every kill draws your own blood",
        ],

        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: "Path Passive",
            description:
              "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack â€” the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: "All Martyrs",
          },
          {
            name: "Zealous Wrath",
            tier: "Specialization Passive",
            description:
              "Wrath Tithe: Your radiant damage spells deal additional damage equal to your current Devotion Level x 3. However, you suffer half of this bonus damage as radiant self-harm. The conviction that burns through your enemies must first cauterize your own flesh. At Devotion 6, a single radiant spell deals +18 bonus damage — and you take 9 damage to yourself. There is no borrowed power here. Only borrowed pain.",
            uniqueTo: "Zealot",
          },
        ],

        recommendedFor:
          "Players who want aggressive support, dealing damage while healing, and offensive playstyles",
      },

      { id : "ascetic",
        name: "Ascetic",
        icon: "Healing/Prayer",
        color: "#4169E1",
        theme: "Enduring Faith — The Calculated Wound",

        description: `Ascetic Martyrs are the accountants of suffering. They treat every wound as an investment, every point of HP as capital, every Devotion threshold as a carefully managed portfolio. They embrace pain not as passion but as discipline — a cold, methodical approach to self-destruction that maximizes efficiency and minimizes waste. They do not bleed recklessly. They bleed precisely.`,

        playstyle: "Balanced support, sustained Devotion management, defensive resilience through calculated sacrifice",

        strengths: [
          "Best at maintaining high Devotion Levels",
          "Excellent survivability and damage resistance",
          "Reduced Devotion costs for amplified abilities",
          "Strong sustained performance in long fights",
        ],

        weaknesses: [
          "Moderate healing and damage (jack of all trades)",
          "Requires careful resource management",
          "Less impactful burst abilities",
          "Slower to reach peak power",
        ],

        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: "Path Passive",
            description:
              "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack â€” the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: "All Martyrs",
          },
          {
            name: "Ascetic Endurance",
            tier: "Specialization Passive",
            description:
              "All amplified spell costs are reduced by 1 Devotion Level (minimum 1). While at Devotion Level 4 or higher, you gain resistance to physical damage.",
            uniqueTo: "Ascetic",
          },
        ],

        recommendedFor:
          "Players who enjoy resource management, balanced gameplay, and sustained power",
      },

      { id : "ironclad",
        name: "Ironclad",
        icon: "Fire/Flame Shield",
        color: "#d35400",
        theme: "Furnace-Bound Devotion — The Welded Martyr",

        description: `Ironclad Martyrs have sealed themselves inside hundreds of pounds of crude, superheated iron plating — voluntarily. They combine the Martyr's theology of willing suffering with the Cragjaw Peaks' tradition of furnace-armor, welding alchemical steam-pistons to their own limbs and stoking their Devotion through literal combustion. Their armor is not worn; it is inhabited. Every wound they absorb for an ally heats the boiler, every Devotion threshold crossed vents scalding steam, and every step forward grinds pistons that scream with sacred friction. They do not dodge. They do not retreat. They are the iron wall that bleeds.

Born from the Dreadnaught tradition of the Groven troll-kin, Ironclad Martyrs represent a heretical synthesis: instead of the Dreadnaught's passive absorption of punishment, the Ironclad chooses to suffer — channeling the Martyr's active self-sacrifice through furnace mechanics. Where a Dreadnaught is struck and endures, an Ironclad Martyr throws themselves into the blow and thanks the divine for the coal.`,

        playstyle:
          "Immovable frontline tank, area denial through furnace heat, Devotion-powered steam vents",

        strengths: [
          "Ironclad Vow grants stacking DR as Devotion rises — the most physically resilient Martyr spec",
          "Furnace Heat aura punishes adjacent enemies at high Devotion",
          "Immunity to physical crowd control at Devotion Level 5+ (pistons crush roots and chains)",
          "Devotion-generated steam vents provide powerful area denial",
        ],

        weaknesses: [
          "Movement speed reduced by 10 feet — the slowest Martyr spec",
          "Vulnerability to Lightning damage (conductive armor) and Cold effects (lock pistons)",
          "Cannot stealth, swim, or squeeze through narrow spaces",
          "Lower healing output than Redemption — you are a wall, not a transfusion",
        ],

        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: "Path Passive",
            description:
              "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack — the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: "All Martyrs",
          },
          {
            name: "Ironclad Vow",
            tier: "Specialization Passive",
            description:
              "Your furnace-plate armor scales with Devotion: at Devotion Level 3+, gain +2 DR. At Devotion Level 5+, enemies within 5 feet take 1d6 fire damage at the start of your turn from radiant furnace heat, and you are immune to physical crowd control (roots, grapples, slows) as your pistons crush all restraints. However, your movement speed is reduced by 10 feet, you have vulnerability to Lightning damage, and Cold effects that would slow instead root you for 1 round as your pistons freeze.",
            uniqueTo: "Ironclad",
          },
        ],

        recommendedFor:
          "Players who want an immovable tank Martyr, area denial through furnace mechanics, and the Dreadnaught's iron-clad resilience expressed through willing sacrifice",
      },
    ],
  },

  // Spell Pools - spells available at each level for level-up selection
  spellPools: {
    1: [
      // Level 1 spells: Basic healing and protection (5 options, pick 3)
      "martyr_restorative_prayer",
      "martyr_intervene",
      "martyr_penance_of_pain",
      "martyr_radiant_burst",
      "martyr_devoted_strike",
    ],
    2: [
      {
        "id": "martyr_empathic_transference",
        "name": "Empathic Transference",
        "description": "Reach out and touch a fatigued, aching ally. Siphon their physical exhaustion, aches, and metabolic strain directly into your own muscles. They are fully refreshed, while you take on their heavy weariness.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Holy/Divine Healing",
        "typeConfig": {
          "school": "holy",
          "icon": "Holy/Divine Healing",
          "tags": [
            "utility",
            "roleplay",
            "martyr"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "targetRestrictions": [
            "ally"
          ]
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 5
          },
          "components": [
            "somatic"
          ],
          "somaticText": "Press your palm firmly against the ally's forehead, grimacing as their fatigue triggers a hot rush of strain in your arm"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "restoration",
          "selectedEffects": [
            {
              "id": "empathic_transference_effect",
              "name": "Endured Fatigue",
              "description": "Clears the target ally's exhaustion conditions. The Martyr suffers disadvantage on Agility checks for 1 hour from the transferred muscle fatigue."
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
          "martyr",
      "martyr_empathic_transference"
        ]
      }
    ],
    4: [
      // Level 4 spells: Powerful amplified abilities (3 options, pick 1)
      "martyr_shield_of_faith",
      "martyr_life_transfer",
      "martyr_martyrs_mark",
    ],
    6: [
      // Level 6 spells: Advanced devotion abilities (2 options, pick 1)
      "martyr_sanctified_ground",
      "martyr_willing_vessel",
    ],
  },

  // Example Spells - showcasing the spell wizard system
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // ========================================
    { id: "martyr_restorative_prayer",
      name: "Restorative Prayer",
      description:
        "Channel divine energy through prayer to heal an ally. Scales with Spirit and can be amplified with Devotion.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",

      typeConfig: {
        school: "ember",
        icon: "Healing/Golden Heart",
        tags: ["healing", "basic", "devotion amplifiable", "level 1"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Sanatio Divina",
        somaticText:
          "Hands clasped in prayer, golden light emanating from your fingers as divine energy flows through you",
      },

      resolution: "DICE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "1d4 + spirit",
        healingType: "direct",
        hasHotEffect: false,
        description:
          "The restorative prayer mends wounds with gentle divine energy. Cuts close, bruises fade, and the target feels their pain ease as vitality is restored. The healing is accompanied by a sense of peace and comfort, as if the divine itself is watching over them.",
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["healing", "basic", "devotion amplifiable", "level 1"],
    },

    { id: "martyr_intervene",
      name: "Intervene",
      description:
        "Step in front of an ally to intercept an attack, taking the damage yourself. If the intercepted damage is 10 or greater, you gain bonus Devotion equal to damage taken divided by 10 (minimum 1). If the intercepted damage is less than 10 (a minor hit), you bypass Devotion gain and instead immediately restore 1d4 Mana. Choose wisely: bleed for power, or sustain your casting.",
      level: 1,
      spellType: "REACTION",
      icon: "Utility/Shield",

      typeConfig: {
        school: "storm",
        icon: "Utility/Shield",
        tags: ["protection", "reaction", "devotion amplifiable", "level 1"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Protector!",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          { id : "intercept_attack",
            name: "Intercept Attack",
            description: "Take damage meant for ally this turn",
          },
          { id : "minor_hit_mana_loop",
            name: "Minor Hit Mana Loop",
            description:
              "If intercepted damage is less than 10, bypass Devotion gain and immediately restore 1d4 Mana instead",
          },
        ],
        duration: 1,
        durationUnit: "turns",
        concentration: false,
        power: "minor",
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["protection", "reaction", "devotion amplifiable", "level 1"],
    },

    { id: "martyr_penance_of_pain",
      name: "Penance of Pain",
      description:
        "Press your hand to your own wounds, converting pain into healing for an ally. The more wounded you are, the stronger the healing. Builds Devotion.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Beam",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Beam",
        tags: ["healing", "sacrificial", "devotion amplifiable", "level 1"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Dolor pro Beneficio!",
        somaticText:
          "Press hand to your own wound, channeling your pain into healing energy that flows from your fingertips",
      },

      resolution: "DICE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "(maxHealth - currentHealth) / 4",
        healingType: "direct",
        hasHotEffect: false,
        description:
          "Your pain becomes your ally's salvation. The healing energy flows from your wounds, carrying with it the power to mend their injuries. The more wounded you are, the more powerful the healing becomesâ€”your suffering is the price of their recovery.",
      },

      devotionRequired: 1,
      devotionGain: 1,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["healing", "sacrificial", "devotion amplifiable", "level 1"],
    },

    { id: "martyr_radiant_burst",
      name: "Radiant Burst",
      description:
        "Release a burst of radiant energy that damages undead and heals the living.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Bolt",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Bolt",
        tags: [
          "damage",
          "healing",
          "ember",
          "devotion amplifiable",
          "level 1",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 20,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
      },

      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 20,
          aoeShape: "circle",
          aoeParameters: { radius: 10 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 20,
          aoeShape: "circle",
          aoeParameters: { radius: 10 },
          targetRestrictions: ["ally"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Lux Divina!",
        somaticText: "Release radiant energy",
      },

      resolution: "DICE",
      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "1d6 + spirit/2",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      healingConfig: {
        formula: "1d6 + spirit/2",
        healingType: "direct",
        hasHotEffect: false,
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: ["damage", "healing", "ember", "devotion amplifiable", "level 1"],
    },

    { id: "martyr_devoted_strike",
      name: "Devoted Strike",
      description:
        "Strike an enemy with radiant power, dealing damage and healing yourself through devotion.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Reaching Hand",

      typeConfig: {
        school: "ember",
        icon: "Healing/Reaching Hand",
        tags: [
          "damage",
          "melee",
          "ember",
          "healing",
          "devotion amplifiable",
          "level 1",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "melee",
          rangeDistance: 5,
          targetRestrictions: ["enemy"],
        },
        healing: { targetingType: "self" },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike with radiant energy",
      },

      resolution: "DICE",
      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "1d8 + strength",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      healingConfig: {
        formula: "strength",
        healingType: "direct",
        hasHotEffect: false,
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "damage",
        "melee",
        "ember",
        "healing",
        "devotion amplifiable",
        "level 1",
      ],
    },

    { id: "martyr_divine_shield",
      name: "Divine Shield",
      description:
        "Grant protective divine energy to all allies within range, shielding them with temporary HP.",
      spellType: "ACTION",
      icon: "Force/Force Shield",
      level: 2,

      typeConfig: {
        school: "storm",
        icon: "Force/Force Shield",
        tags: [
          "buff",
          "temporary hp",
          "aoe",
          "devotion amplifiable",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: {
          radius: 10,
        },
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Aegis Sanctus",
        somaticText: "Raise hands skyward",
      },

      resolution: "DICE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "temporary_hp",
            name: "Temporary HP",
            description:
              "Gain 1d6 temporary HP that absorbs incoming damage before your actual health.",
            statModifier: {
              stat: "temporary_hp",
              magnitude: "1d6",
              magnitudeType: "dice",
            },
          },
        ],
        durationValue: 0,
        durationType: "instant",
        durationUnit: "instant",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: "Grants 2d6 temporary HP instead",
        },
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["buff", "temporary hp", "aoe", "devotion amplifiable", "level 2"],
    },
    { id: "martyr_purifying_pain",
      name: "Purifying Pain",
      description:
        "Inflict radiant damage upon yourself to heal an ally. The self-damage builds Devotion.",
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      level: 2,

      typeConfig: {
        school: "ember",
        icon: "Healing/Golden Heart",
        tags: [
          "healing",
          "self damage",
          "sacrifice",
          "devotion amplifiable",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Purificatio Doloris",
        somaticText: "Touch your heart then extend hand to ally",
      },

      resolution: "DICE",
      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "2d6",
        damageTypes: ["ember"],
        targetType: "self",
        resolution: "DICE",
      },

      healingConfig: {
        formula: "4d4 + spirit",
        healingType: "single_target",
        targetRestrictions: ["ally"],
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: "Heal for 6d4 + Spirit modifier HP instead",
        },
        selfDamage: {
          buildsDevotion: true,
        },
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "healing",
        "self damage",
        "sacrifice",
        "devotion amplifiable",
        "level 2",
      ],
    },

    // Buff and Protection Spells
    { id: "martyr_sanctuary_aura",
      name: "Sanctuary Aura",
      description:
        "Surround an ally with a protective aura that grants resistance to all damage types for 1 minute.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      level: 2,

      typeConfig: {
        school: "storm",
        icon: "Radiant/Radiant Golden Shield",
        tags: [
          "buff",
          "resistance",
          "protection",
          "devotion amplifiable",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "minutes",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Sanctuarium",
        somaticText: "Draw protective circle in the air",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "sanctuary",
            name: "Sanctuary",
            description: "Gain 25% damage resistance for 1 minute",
            statModifier: {
              stat: "damage_reduction",
              magnitude: 25,
              magnitudeType: "percentage",
            },
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect:
            "Grants resistance to all allies within 10 feet for 1 minute",
        },
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: [
        "buff",
        "resistance",
        "protection",
        "devotion amplifiable",
        "level 2",
      ],
    },

    { id: "martyr_blessed_resilience",
      name: "Blessed Resilience",
      description:
        "Bless allies with divine resilience, granting bonuses to saving throws and reducing damage taken.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",

      typeConfig: {
        school: "storm",
        icon: "Radiant/Divine Blessing",
        tags: [
          "buff",
          "saving throws",
          "damage reduction",
          "aoe",
          "devotion amplifiable",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Benedictio Fortis",
        somaticText: "Make blessing gesture",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "blessed_resilience_saves",
            name: "Blessed Resilience (Saves)",
            description: "+2 bonus to all saving throws",
            mechanicsText: "+2 to all Saving Throws",
            statModifier: {
              stat: "savingThrows",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
          { id : "blessed_resilience_damage",
            name: "Blessed Resilience (Damage Reduction)",
            description: "Reduces all incoming damage by 2",
            mechanicsText: "-2 Damage Taken (flat reduction)",
            statModifier: {
              stat: "damage_reduction",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "turns",
        durationUnit: "turns",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "buff",
        "saving throws",
        "damage reduction",
        "aoe",
        "devotion amplifiable",
        "level 2",
      ],
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    { id: "martyr_sacrificial_bond",
      name: "Sacrificial Bond",
      description:
        "Create a sacred bond with an ally. While active, you take half of the damage they would receive.",
      level: 3,
      spellType: "ACTION",
      icon: "Force/Force Shield",

      typeConfig: {
        school: "storm",
        icon: "Force/Force Shield",
        tags: ["buff", "protection", "sacrifice", "level 3"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Vinculum Sacrificii",
        somaticText: "Touch heart then extend hand",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "protection",
        effects: [
          { id : "sacrificial_bond",
            name: "Sacrificial Bond",
            description: "You take 50% of damage dealt to bonded ally",
            mechanicsText: "Take 50% of damage dealt to bonded ally",
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      devotionRequired: 1,
      devotionCost: 3,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "protection", "sacrifice", "level 3"],
    },

    { id: "martyr_burning_sacrifice",
      name: "Burning Sacrifice",
      description:
        "Sacrifice your own life force to deal radiant damage to enemies around you.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Sun Symbol",

      typeConfig: {
        school: "ember",
        icon: "Fire/Sun Symbol",
        tags: ["damage", "self damage", "ember", "aoe", "level 3"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 10, hp: 15 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Ignis Sacrificii!",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "4d6 + spirit",
        damageTypes: ["ember"],
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      devotionRequired: 1,
      devotionCost: 3,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["damage", "self damage", "ember", "aoe", "level 3"],
    },

    { id: "martyr_cleansing_touch",
      name: "Cleansing Touch",
      description:
        "Remove negative conditions from an ally by taking the affliction upon yourself briefly.",
      level: 3,
      spellType: "ACTION",
      icon: "Healing/Cure Within",

      typeConfig: {
        school: "ember",
        icon: "Healing/Cure Within",
        tags: ["purification", "sacrifice", "utility", "level 3"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Lay hands on ally",
      },

      resolution: "NONE",
      effectTypes: ["purification"],

      purificationConfig: {
        purificationType: "cleanse",
        targetType: "single",
        power: "moderate",
        duration: "instant",
        selfEffect: "You suffer the removed condition for 1 round",
      },

      devotionRequired: 1,
      devotionCost: 3,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["purification", "sacrifice", "utility", "level 3"],
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    { id: "martyr_shield_of_faith",
      name: "Shield of Faith",
      description:
        "Create a divine shield around an ally that absorbs 3d8 + spiritÃ—2 damage. Lasts up to 10 rounds or until the shield is depleted.",
      level: 4,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",

      typeConfig: {
        school: "storm",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["buff", "shield", "protection", "level 4"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Scutum Fidei",
        somaticText: "Create shield gesture",
      },

      resolution: "DICE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "shield",
        effects: [
          { id : "faith_shield",
            name: "Shield of Faith",
            description:
              "Absorbs 3d8 + spiritÃ—2 damage until depleted. Lasts up to 10 rounds.",
            shieldValue: {
              formula: "3d8 + spirit * 2",
              shieldType: "absorption",
            },
          },
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      devotionRequired: 2,
      devotionCost: 4,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "shield", "protection", "level 4"],
    },

    { id: "martyr_life_transfer",
      name: "Life Transfer",
      description:
        "Transfer your own health to heal an ally for twice the amount sacrificed.",
      level: 4,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",

      typeConfig: {
        school: "blight",
        icon: "Healing/Golden Heart",
        tags: ["healing", "sacrifice", "self damage", "level 4"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 8, hp: 20 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Channel life force",
      },

      resolution: "DICE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "40 + spirit",
        healingType: "direct",
        hasHotEffect: false,
      },

      devotionRequired: 1,
      devotionCost: 4,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["healing", "sacrifice", "self damage", "level 4"],
    },

    { id: "martyr_martyrs_mark",
      name: "Martyr's Mark",
      description:
        "Mark an enemy. Allies attacking the marked target heal for a portion of damage dealt.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Blood Scroll",

      typeConfig: {
        school: "ember",
        icon: "Necrotic/Blood Scroll",
        tags: ["debuff", "utility", "healing", "mark", "level 4"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Signum Martyris!",
      },

      resolution: "NONE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "mark",
        effects: [
          { id : "martyrs_mark",
            name: "Martyr's Mark",
            description: "Allies heal for 25% of damage dealt to marked target",
            mechanicsText:
              "Allies heal for 25% of damage dealt to marked target",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      devotionRequired: 1,
      devotionCost: 3,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["debuff", "utility", "healing", "mark", "level 4"],
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    { id: "martyr_righteous_suffering",
      name: "Righteous Suffering",
      description:
        "Embrace suffering to become immune to crowd control while slowly healing allies around you.",
      level: 5,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Illumination",
        tags: ["buff", "healing", "immunity", "aoe", "level 5"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 20, hp: 10 },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "Passio Justa!",
      },

      resolution: "DICE",
      effectTypes: ["buff", "healing"],

      buffConfig: {
        buffType: "immunity",
        effects: [
          { id : "righteous_immunity",
            name: "Righteous Immunity",
            description: "You become immune to stun, fear, and charm",
            mechanicsText: "Immune to stun, fear, and charm",
            damageImmunity: ["stun", "fear", "charm"],
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      healingConfig: {
        formula: "2d6",
        healingType: "hot",
        hasHotEffect: true,
        hotFormula: "2d6",
        hotDuration: 3,
        hotTickType: "round",
      },

      devotionRequired: 3,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["buff", "healing", "immunity", "aoe", "level 5"],
    },

    { id: "martyr_blood_pact",
      name: "Covenant of Sacrifice",
      description:
        "Forge a sacred covenant with allies. All party members share damage equally through divine bonds.",
      level: 5,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["buff", "protection", "sacrifice", "party", "level 5"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 22, hp: 15 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Pactum Sanguinis",
        somaticText: "Cut palm and raise hand",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "link",
        effects: [
          { id : "covenant_of_sacrifice",
            name: "Covenant of Sacrifice",
            description: "All damage is distributed evenly among linked allies",
            mechanicsText: "All damage distributed evenly among linked allies",
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      devotionRequired: 3,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["buff", "protection", "sacrifice", "party", "level 5"],
    },

    { id: "martyr_divine_retribution",
      name: "Divine Retribution",
      description:
        "When you take damage, store it as holy energy. Release it all as a burst of radiant damage.",
      level: 5,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["damage", "ember", "aoe", "stored damage", "level 5"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Vindicta Divina!",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d8 + stored_damage",
        damageTypes: ["ember"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      specialMechanics: {
        storedDamage: {
          description:
            "The spell channels all the pain and suffering you've endured since your last rest, converting it into divine retribution. The more you've suffered, the more devastating the strike becomes, though there is a limit to how much pain can be channeled.",
          cap: 50,
        },
      },

      devotionRequired: 4,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "ember", "aoe", "stored damage", "level 5"],
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    { id: "martyr_sanctified_ground",
      name: "Sanctified Ground",
      description:
        "Create a zone of holy ground that heals allies and burns undead and demons standing upon it. Persists for 5 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Bright Explosion",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Bright Explosion",
        tags: ["healing", "damage", "zone", "aoe", "level 6"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
      },

      effectTargeting: {
        healing: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          targetRestrictions: ["ally"],
          description: "All allies in the zone are healed each round",
        },
        damage: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          targetRestrictions: ["undead", "demon"],
          description:
            "Undead and demons in the zone take radiant damage each round",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 26 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Terra Sancta!",
        somaticText: "Touch ground with staff",
      },

      resolution: "DICE",
      effectTypes: ["healing", "damage", "utility"],

      healingConfig: {
        formula: "2d8 + spirit",
        healingType: "hot",
        hasHotEffect: true,
        hotFormula: "2d8",
        hotDuration: 5,
        hotTickType: "round",
        targetRestrictions: ["ally"],
        description: "Heals all allies in the zone each round",
        resolution: "DICE",
      },

      damageConfig: {
        formula: "3d8",
        damageTypes: ["ember"],
        targetRestrictions: ["undead", "demon"],
        description: "Damages undead and demons in the zone each round",
        resolution: "DICE",
      },

      zoneConfig: {
        duration: 5,
        durationUnit: "rounds",
        effects: ["healing", "damage"],
        movable: false,
      },

      devotionRequired: 3,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["healing", "damage", "zone", "aoe", "level 6"],
    },

    { id: "martyr_willing_vessel",
      name: "Willing Vessel",
      description:
        "Become a vessel for divine energy. Redirect all ally damage to yourself and gain massive damage reduction.",
      level: 6,
      spellType: "ACTION",
      icon: "Force/Force Field",

      typeConfig: {
        school: "storm",
        icon: "Force/Force Field",
        tags: ["buff", "protection", "sacrifice", "tank", "level 6"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 26 },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "Ego Sum Vas!",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "protection",
        effects: [
          { id : "willing_vessel",
            name: "Willing Vessel",
            description:
              "All ally damage redirects to you. You take 50% reduced damage.",
            mechanicsText:
              "All ally damage redirects to you. You take 50% reduced damage.",
            damageReduction: { value: 50, magnitudeType: "percentage" },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },

      devotionRequired: 5,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["buff", "protection", "sacrifice", "tank", "level 6"],
    },

    { id: "martyr_redemption_strike",
      name: "Redemption Strike",
      description:
        "Strike an enemy with holy might. The lower your health, the more damage this deals.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Divine Downward Sword",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Downward Sword",
        tags: ["damage", "ember", "single target", "level 6"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Melee weapon strike",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "5d10 + spirit + missing_hp_percentage",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      specialMechanics: {
        scalingDamage: {
          description: "Damage scales with missing health percentage",
          maxBonus: "5d8",
          formula: "+1d8 per 20% missing health",
        },
      },

      devotionRequired: 3,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["damage", "ember", "single target", "level 6"],
    },

    // ========================================
    // LEVEL 7 SPELLS (Minor Ultimates - 5-6 Turn Cooldown)
    // ========================================
    { id: "martyr_mass_resurrection",
      name: "Mass Restoration",
      description:
        "Channel divine energy to restore all fallen allies to consciousness with partial health.",
      level: 7,
      spellType: "ACTION",
      icon: "Healing/Ressusitate",

      typeConfig: {
        school: "ember",
        icon: "Healing/Ressusitate",
        tags: ["healing", "resurrection", "aoe", "ultimate", "level 7"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally", "unconscious"],
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 30, hp: 20 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Resurge Omnes!",
        somaticText: "Raise both arms to sky",
      },

      resolution: "DICE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "4d10 + spirit",
        healingType: "resurrection",
        hasHotEffect: false,
      },

      devotionRequired: 5,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["healing", "resurrection", "aoe", "ultimate", "level 7"],
    },

    { id: "martyr_guardian_spirit",
      name: "Guardian Spirit",
      description:
        "Place a guardian spirit on an ally. If they would die, the spirit sacrifices itself to restore them.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Winged Angel",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Winged Angel",
        tags: ["buff", "protection", "cheat death", "level 7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Spiritus Custos",
        somaticText: "Draw angel sigil",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "cheat_death",
        effects: [
          { id : "guardian_spirit",
            name: "Guardian Spirit",
            description:
              "If target would die, restore them to 50% health instead",
            mechanicsText: "If target would die, restore to 50% HP instead",
          },
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      devotionRequired: 4,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["buff", "protection", "cheat death", "level 7"],
    },

    { id: "martyr_holy_wrath",
      name: "Holy Wrath",
      description:
        "Unleash all accumulated Devotion as radiant damage to all enemies within range. The more Devotion spent, the more devastating the burst.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Radiant Sunburst",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Sunburst",
        tags: ["damage", "ember", "aoe", "devotion spend", "level 7"],
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
        resourceTypes: ["mana", "devotion"],
        resourceValues: { mana: 30, devotion: "all" },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "IRA SANCTA!",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "8d8 + devotion_spent * 2",
        damageTypes: ["ember"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2.5,
          extraDice: "4d8",
          critEffects: ["radiant_burn"],
        },
        resolution: "DICE",
      },

      specialMechanics: {
        devotionSpend: {
          description:
            "Consumes all accumulated Devotion, channeling every moment of suffering into devastating holy power. The more Devotion you've built through sacrifice, the more devastating the strike becomes, though a minimum threshold must be reached.",
          minimum: 5,
        },
      },

      devotionRequired: 5,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["damage", "ember", "aoe", "devotion spend", "level 7"],
    },

    // ========================================
    // LEVEL 8 SPELLS (Minor Ultimates - 6 Turn Cooldown)
    // ========================================
    { id: "martyr_divine_intervention",
      name: "Divine Intervention",
      description:
        "Call upon divine power to completely negate one incoming attack or spell against any ally.",
      level: 8,
      spellType: "REACTION",
      icon: "Radiant/Divine Radiance",

      typeConfig: {
        school: "storm",
        icon: "Radiant/Divine Radiance",
        tags: ["protection", "reaction", "negate", "level 8"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "PROHIBERE!",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          { id : "negate_attack",
            name: "Negate Attack",
            description: "Completely negate one incoming attack or spell",
          },
        ],
        duration: 1,
        durationUnit: "turns",
        concentration: false,
        power: "major",
      },

      specialMechanics: {
        negate: {
          description:
            "Completely negates one attack or spell targeting the ally",
          trigger: "on_ally_targeted",
        },
      },

      devotionRequired: 4,
      devotionCost: 5,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["protection", "reaction", "negate", "level 8"],
    },

    { id: "martyr_shared_agony",
      name: "Mirror of Martyrdom",
      description:
        "Link an enemy to yourself through divine retribution. When you take damage, they take the same amount as radiant damage.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Radiant Beam",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Beam",
        tags: ["debuff", "damage", "link", "ember", "level 8"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Dolor Communis",
        somaticText: "Create psychic link",
      },

      resolution: "NONE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "link",
        effects: [
          { id : "mirror_of_martyrdom",
            name: "Mirror of Martyrdom",
            description: "Enemy takes radiant damage equal to damage you take",
            mechanicsText:
              "Enemy takes radiant damage equal to damage you take",
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "negates",
        },
      },

      devotionRequired: 4,
      devotionCost: 6,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["debuff", "damage", "link", "wyrd", "level 8"],
    },

    // ========================================
    // LEVEL 9 SPELLS (Major Ultimates - Long Rest)
    // ========================================
    { id: "martyr_avatar_of_sacrifice",
      name: "Avatar of Sacrifice",
      description:
        "Transform into an Avatar of Sacrifice, gaining immense power and the ability to absorb all party damage.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Illumination",
        tags: ["transformation", "buff", "protection", "ultimate", "level 9"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "Ego Sum Sacrificium!",
      },

      resolution: "NONE",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformType: "divine",
        formName: "Avatar of Sacrifice",
        formDescription: "A glowing divine form radiating protective light.",
        duration: 5,
        durationUnit: "rounds",
        statModifiers: [
          { stat: "armor", magnitude: 5, magnitudeType: "flat" },
          { stat: "maxHp", magnitude: 50, magnitudeType: "temporary" },
          {
            stat: "damageReduction",
            magnitude: 50,
            magnitudeType: "percentage",
          },
        ],
        specialAbilities: [
          {
            name: "Absolute Protection",
            description:
              "All ally damage is redirected to you. You cannot be reduced below 1 HP while transformed.",
          },
        ],
        concentrationRequired: false,
        canBeDispelled: false,
      },

      devotionRequired: 6,
      devotionCost: 6,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["transformation", "buff", "protection", "ultimate", "level 9"],
    },

    { id: "martyr_judgment_day",
      name: "Judgment Day",
      description:
        "Call down divine judgment. Heal all allies to full and deal massive damage to all enemies.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Warrior",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Warrior",
        tags: ["damage", "healing", "aoe", "ultimate", "level 9"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy", "ally"],
      },

      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["ally"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 40, hp: 40 },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "DIES IUDICII!",
      },

      resolution: "DICE",
      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "12d10 + spirit * 2",
        damageTypes: ["ember"],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 20,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 3.0,
          extraDice: "6d10",
          critEffects: ["divine_judgment", "stun"],
        },
        resolution: "DICE",
      },

      healingConfig: {
        formula: "max_hp",
        healingType: "full_heal",
        hasHotEffect: false,
      },

      devotionRequired: 6,
      devotionCost: 6,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "healing", "aoe", "ultimate", "level 9"],
    },

    { id: "martyr_eternal_bond",
      name: "Eternal Bond",
      description:
        "Create unbreakable bonds with all allies. When a linked ally would be reduced to 0 HP, the killing blow is redirected to the Martyr instead.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Force Shield",

      typeConfig: {
        school: "ember",
        icon: "Force/Force Shield",
        tags: ["buff", "protection", "party", "sacrifice", "level 9"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Vinculum Aeternum",
        somaticText: "Connect all allies with light",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "cheat_death",
        effects: [
          { id : "eternal_bond",
            name: "Eternal Bond",
            description:
              "When a linked ally would be reduced to 0 HP, redirect the killing blow to the Martyr, who takes the damage instead.",
            mechanicsText:
              "When a linked ally would be reduced to 0 HP, redirect the killing blow to the Martyr instead",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "combat",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      devotionRequired: 6,
      devotionCost: 6,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["buff", "protection", "party", "immortality", "level 9"],
    },

    // ========================================
    // LEVEL 10 SPELLS (True Ultimates - Long Rest + Max Devotion)
    // ========================================
    { id: "martyr_ultimate_sacrifice",
      name: "Ultimate Sacrifice",
      description:
        "The ultimate act of martyrdom. Full Sacrifice: reduce yourself to 0 HP to fully resurrect and empower all fallen allies. Partial Sacrifice: sacrifice 50 HP to fully heal all living allies within range.",
      level: 10,
      spellType: "ACTION",
      icon: "Healing/Ressusitate",

      typeConfig: {
        school: "ember",
        icon: "Healing/Ressusitate",
        tags: ["resurrection", "sacrifice", "ultimate", "level 10"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["ally", "dead"],
      },

      resourceCost: {
        resourceTypes: ["hp"],
        resourceValues: { hp: "all" },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "SACRIFICIUM ULTIMUM!",
      },

      resolution: "NONE",
      effectTypes: ["restoration", "buff"],

      healingConfig: {
        formula: "max_hp",
        healingType: "resurrection",
        hasHotEffect: false,
      },

      buffConfig: {
        buffType: "empowerment",
        effects: [
          { id : "martyrs_blessing",
            name: "Martyr's Blessing",
            description:
              "Resurrected allies gain +5 to all stats for 10 rounds",
            statModifier: {
              stat: "all_stats",
              magnitude: 5,
              magnitudeType: "flat",
            },
            mechanicsText:
              "Resurrected allies gain +5 to all stats for 10 rounds",
          },
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      specialMechanics: {
        selfSacrifice: {
          description:
            "Full Sacrifice: You are reduced to 0 HP. All dead allies are resurrected at full health with +5 to all stats for 10 rounds.",
          resurrection: true,
        },
        partialSacrifice: {
          description:
            "Partial Sacrifice: Instead of sacrificing all HP, you may sacrifice 50 HP to fully heal all living allies within range. Does not resurrect fallen allies.",
          hpCost: 50,
          fullHeal: true,
        },
      },

      devotionRequired: 6,
      devotionCost: 6,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["resurrection", "sacrifice", "ultimate", "level 10"],
    },

    { id: "martyr_final_blessing",
      name: "Final Blessing",
      description:
        "Bestow your final blessing upon allies. They become immune to death for the rest of the encounter. The Martyr takes double damage while this blessing is active.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Golden Ring",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Golden Ring",
        tags: [
          "buff",
          "protection",
          "ultimate",
          "party",
          "sacrifice",
          "level 10",
        ],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana", "hp"],
        resourceValues: { mana: 45, hp: 50 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Benedictio Finalis",
        somaticText: "Grand blessing gesture",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "immortality",
        effects: [
          { id : "final_blessing",
            name: "Final Blessing",
            description:
              "Allies cannot be reduced below 1 HP for the rest of the encounter. The Martyr takes double damage from all sources while this blessing is active.",
            mechanicsText:
              "Allies cannot be reduced below 1 HP for the rest of the encounter. Martyr takes double damage while active",
            damageImmunity: ["lethal"],
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "combat",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      devotionRequired: 6,
      devotionCost: 6,
      devotionGain: 0,

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["buff", "protection", "ultimate", "party", "level 10"],
    },    {
      id : "martyr_burden_of_faith",
      name: "Burden of Faith",
      description:
        "Your healing power flows through sacrifice, not generosity. You can never heal yourself with any Martyr ability. All your healing spells target allies only. The only HP you gain is through suffering for others. Self-preservation is antithetical to the martyr's path.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Radiant/Sacred Symbol",
      effectTypes: ["passive"],
      typeConfig: {
        school: "ember",
        icon: "Radiant/Sacred Symbol",
        tags: ["passive", "restriction", "no self-heal", "sacrifice", "martyr"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "restriction", "no self-heal", "sacrifice", "martyr"],
    },
  ],
};
