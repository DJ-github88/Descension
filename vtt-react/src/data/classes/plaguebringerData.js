/**
 * PLAGUEBRINGER CLASS DATA
 *
 * A dark cultivator who sows seeds of rot and pestilence in the flesh of the living.
 * Resource System: Virulence - generated through casting affliction category spells and seeding targets.
 * Specializations: Virulent Spreader, Torment Weaver, Decay Harbinger
 *
 * DESIGNER NOTES (v2.0 Surgical Overhaul):
 * - Tone: Heavy, tragic fantasy. Magic demands a heavy price, power demands a toll of vitality and blood.
 * - Normalized spell properties to comply with UnifiedSpellCard and Spellcrafting Wizard.
 * - Removed 5e terminology (Bonus Actions -> AP/Reaction, AC -> DR/Dodge, spell slots -> mana/virulence).
 * - Fixed all damageTypes targets ('direct', 'area' -> 'necrotic', 'poison', 'psychic', 'acid').
 * - Fixed durationConfig.durationValue and durationUnit properties.
 * - Moved school into typeConfig.
 * - Nested all savingThrow definitions inside their respective damageConfig, debuffConfig, or controlConfig.
 * - Integrated "Operational Friction" / "Cultivation Tolls" into every spell to emphasize the class theme.
 * - Renamed exampleSpells -> spells and added level-based spellPools to match standard class structures.
 */

export const PLAGUEBRINGER_DATA = {
 restrictions: {
  "allowedSubraces": [
   "drun_neth",
   "morren_human",
   "clean_vreken",
   "marked_vreken"
  ],
  "hardBlocks": [
   "astril",
   "skald_human",
   "emberth",
   "groven",
   "fexrick",
   "myrathil",
   "florae",
   "mimir",
   "thalren_human",
   "tessen_human",
   "solvarn_human",
   "merryn_human",
   "ordan_human"
  ],
  "narrativeUnlock": false,
  "justification": "Requires the Bryngloom's unique fungal-bog substrate. Other regions lack the specific biological agents. Drun Neth's partial-death allows hosting. Morren's desperation drives acceptance."
 },

 /**
 * Subrace Variants, the Plaguebringer cultivates living disease inside their own body,
 * and what that body *is* determines what it can host. The Drun Neth are half-dead
 * already. The Morren are desperate enough to accept anything. The Vreken castes
 * carry the disease on the forest's own infrastructure.
 */
 subraceVariants: {
 drun_neth: {
  subraceName: 'Drun Neth',
  title: 'The Silence-Host',
   reframe: `The <LoreLink termId="neth">Drun Neth</LoreLink>, the leaden-grey outcasts who severed all contracts and legally do not exist, are the Plaguebringer's ideal substrate. The Drun severed their names from the First Contract through the fire-ritual of the Severing. Morvane's pact no longer preserves them  -  the slow decay that the contract once held at bay now creeps through their flesh. This partial-death is not a separate biological state; it is the absence of Morvane's preservation. But what the contract no longer protects, it also no longer regulates. The Drun's decaying flesh has become a legal vacuum  -  and nature, as always, fills vacuums. Their body accepts foreign biology not because it is designed to, but because there is nothing left to reject it. A Drun Plaguebringer is not a sick person wielding sickness, they are a halfway-corpse whose decay hosts a substrate.`,
  signatureAbility: {
  name: 'Silence-Cultivation',
  description: `Cultivated diseases take root faster and more virulently in the Drun's partially-dead flesh, generating more Virulence per affliction cast. The cost: the Drun's decay *accelerates* with each cultivation, they are spending their remaining life as substrate.`
  },
  currentCrisisAngle: `The foundational strain's collapse hits the Drun as *accelerated dissolution*, as the cultivated bacteria die, they take the host's half-life with them. The Drun Plaguebringers are dying faster than the tradition can replace them, and the others are beginning to suspect the Drun knew this would happen: that they chose this path knowing it was, in the end, a faster form of the death they were already living.`,
  signatureQuote: {
  text: '"I was legally dead before I swallowed the first culture. Everything since has been interest on a debt I never owed. Let the strain die. I have been dying for years."',
  speaker: 'Drun Vel-Kaassen',
  context: 'A Drun Plaguebringer, declining treatment for the collapsing strain'
  }
 },

 morren_human: {
  subraceName: 'Morren',
  title: 'The Desperation-Cultivator',
  reframe: `The <LoreLink termId="house_morrath">Morren</LoreLink> took to the Plaguebringer path out of pure desperation, the bog's pharmacological resources were their only wield against the Neth contract-economy, and cultivating the hush itself as a weapon was the one act the Neth could not tax. A Morren Plaguebringer does not love disease; they *need* it, the way a debtor needs the one skill their creditor cannot repossess.`,
  signatureAbility: {
  name: 'Debt-Immunity',
  description: `Cultivated diseases are engineered to be *untaxable*, they cannot be traced, cannot be contracted under Neth law, cannot be seized as assets. A Morren Plaguebringer's Virulence is, by design, the one property Morvane has no jurisdiction over.`
  },
  currentCrisisAngle: `As the foundational strain collapses and cultivated diseases turn virulent against the host, the Morren Plaguebringers face a bitter symmetry: the weapon they built to escape debt is now *costing them their lives*, and the Neth have offered to "renegotiate" their contracts in exchange for the cultivation techniques. The Morren are dying of the one freedom they ever had, and their creditors are circling.`,
  signatureQuote: {
  text: '"I grew the hush in my veins because it was the only thing you could not ledger. Now it is killing me, and you offer to save me if I sign it over. I will die first. That, at least, you cannot tax."',
  speaker: 'Mor-Vespera',
  context: 'A Morren Plaguebringer, to a Neth renegotiator, the week her strain turned'
  }
 },

 clean_vreken: {
  subraceName: 'Clean Vreken',
  title: 'The Glow-Culture',
  reframe: `The <LoreLink termId="vreken">Clean Vreken</LoreLink>, deep-glow scholars, interact with cultivated disease through their bioluminescence: the pathogens glow in their skin, visibly trackable, the Plaguebringer's internal substrate rendered as a living map of light. A Clean Vreken Plaguebringer can *see* their diseases the way a cartographer sees coastlines.`,
  signatureAbility: {
  name: 'Luminescent-Tracking',
  description: `Cultivated diseases express as visible bioluminescent patterns, allowing the Plaguebringer to track infection-progress in real time and tune virulence with surgical precision, but also broadcasting the disease-map to every Vreken nearby, a glowing confession of biological warfare.`
  },
  currentCrisisAngle: `As the strains mutate virulently, the Clean Vreken's glow-maps are going *dark* in patches, the mutated pathogens no longer fluoresce, becoming invisible even to their own cultivator. A Clean Vreken Plaguebringer who cannot see their disease is a blind surgeon, and the first deaths from untracked mutations have already begun in the deep groves.`,
  signatureQuote: {
  text: '"I used to read my diseases like scripture. Now entire passages have gone dark. I am preaching a gospel I can no longer proofread, and the congregation is dying."',
  speaker: 'Scholar Ysen Bright-Blight',
  context: 'A Clean Vreken Plaguebringer, cataloguing the first dark-patch mutation'
  }
 },

 marked_vreken: {
  subraceName: 'Marked Vreken',
  title: 'The Mycelium-Vector',
  reframe: `The <LoreLink termId="vreken">Marked Vreken</LoreLink>, ghost-mycelium walkers, deliver cultivated disease through the <LoreLink termId="root_veil">Root-Veil</LoreLink> itself. The mycelial network threading their skin is the forest's nervous system, and a Marked Plaguebringer rides it like a delivery infrastructure, seeding affliction across miles of interconnected root and spore.`,
  signatureAbility: {
  name: 'Network-Seeding',
  description: `Cultivated diseases can be transmitted *through the mycelial network* to any connected organism, bypassing physical proximity entirely. The Marked are the tradition's only area-effect cultivators, a single Marked Plaguebringer can blight a grove through the roots beneath it.`
  },
  currentCrisisAngle: `The virulent strain-mutations have begun spreading *through the network itself*, the Root-Veil, the Vreken's sacred ancestor, is now carrying weaponized disease to organisms that never encountered the Plaguebringer. The Marked are being accused of poisoning the forest's spirit, and the Root-Veil, for the first time in three centuries, has begun *rejecting* the Marked, expelling mycelium from their skin the way a body expels a splinter.`,
  signatureQuote: {
  text: '"The forest was my delivery-system and my ancestor. Now it coughs up my touch like an infection. I have poisoned the spirit that raised me, and it knows."',
  speaker: 'Vesh the Blight-Walked',
  context: 'A Marked Plaguebringer, the morning the mycelium began rejecting her'
  }
 }
 },


 id : "plaguebringer",
 name: "Plaguebringer",
 icon: "fas fa-biohazard",
 role: "Damage/Control",
 damageTypes: ["blight", "wyrd"],

 classIdentity: {
 title: "Class Identity",
  content: `The Plaguebringer does not study magic in clean academies, nor do they pray to benevolent spirits. Their craft is a dark, tragic pact with the decay of all living matter. To cast a spell is to sacrifice their own vitality and mental clarity, coaxing black rot from living matter. Power in this class demands a heavy, punishing toll. 

**Why Bring Me? (The Exponential Contagion)**:
The Plaguebringer excels at unstoppable, compounding, exponential battlefield contamination. Left alone for three rounds, a single infection is cultivated into a room-clearing pandemic. They turn the living into festering spore-bombs and reanimate fallen foes as vessels of pestilence, tearing through clustered enemy ranks with a dark, creeping inevitability.

**The Fatal Flaw (Incubation & Purity)**:
The Plaguebringer possesses zero immediate burst damage. Their diseases require time to mature ("Incubation Lag"), making them highly vulnerable to aggressive rush tactics. and, their contagions are volatile ("Vector Isolation"),allies who stand too close to infected targets risk contracting the rot themselves. Finally, their rot cannot survive clean heat: any source of ember damage immediately purges active rot from both targets and the environment, leaving the gardener exposed and helpless.`
 },

 livingOrder: {
 orderName: 'The Cultivar',
 founder: {
  name: '<LoreLink termId="vespera">Vespera</LoreLink>',
  status: `Alive, and the crisis. The <LoreLink termId="vreken">Vreken</LoreLink> alchemist who bonded with bog-rot to cure the spore-hush three centuries ago still hosts the foundational bacterial strain, and the strain is dying inside her. She is the substrate; when it fails, so does she.`,
  note: `<LoreLink termId="vespera">Vespera</LoreLink> injected decaying moss from the <LoreLink termId="sunken_spire">Sunken Spire</LoreLink> directly into her veins to save her family. She succeeded, and has been a permanent host to active decay ever since, waxy, pale, cold, cultivating new diseases for three hundred years.`
 },
 currentLeader: {
  name: '<LoreLink termId="vespera">Blight-Mother Vespera</LoreLink>',
  title: 'The First Host',
  characterization: `<LoreLink termId="vespera">Vespera</LoreLink> leads the Cultivar from the deep peat-sinks, but "leads" is generous, she is bedridden, her foundational strain failing, and most of her authority is delegated to her senior cultivators. She is calm about her own death in a way her students find unbearable. She has been dying for three centuries. This is just the final stretch.`
 },
 headquarters: { name: 'The Peat-Sink Laboratories, deep Bryngloom', locationId: 'bryngloom-forest' },
 crisisConnection: `<LoreLink termId="vespera">Vespera</LoreLink>'s failing strain is mutating into virulent forms that attack the host, and every Plaguebringer who learned from her is now carrying a dying inheritance. She has tasked her cultivators with a single project before she goes: engineer a successor strain that does not require *her* blood as substrate. The project is failing. The Marked Vreken cultivators are being rejected by the Root-Veil as they work, and <LoreLink termId="vespera">Vespera</LoreLink> has begun to suspect the forest is *deliberately* killing the strain, that the <LoreLink termId="root_veil">Root-Veil</LoreLink> has decided the Plaguebringer art is a disease worth curing.`
 },

 worldFriction: [
 { region: 'bryngloom-forest', status: 'persecuted', consequence: 'The Root-Veil is rejecting the Marked cultivators and the network is carrying weaponized disease to organisms that never met a Plaguebringer. The Neth Regency has begun classifying Plaguebringer cultivation as "assault on the archive-substrate", a capital offense against Morvane.', workaround: 'None. A Plaguebringer in the deep Bryngloom is now hunted by the forest they depend on; the only refuge is the Over-Shanty, where the network does not reach.' },
 { region: 'everywhere-else', status: 'shunned', consequence: 'Plaguebringers are universally untouchable, their cultivated diseases are contagious enough (even if host-specific) that no settlement permits casual contact. A traveling Plaguebringer is housed outside the walls and trades through intermediaries. This is not persecution; it is quarantine.' }
 ],

 overview: {
  originStory: `A plaguebringer is a living laboratory. The body has been deliberately infected with carefully balanced strains of bacteria, fungi, and parasites that coexist without consuming the host. In combat, these afflictions are seeded into enemies, advanced through stages of decay, and harvested at peak virulence. The craft requires the Bryngloom's unique fungal-bog substrate, a biological chemistry found nowhere else on Mythrill.

The first was Blight-Mother Vespera, a Vreken alchemist who bonded with bog-rot to synthesize a cure for the spore-hush that ravaged her family's cave-keeps. She gathered decaying moss from the Sunken Spire and injected its alchemical bile directly into her veins. It cured the hush. It also made her body a permanent host for active decay. Her skin became waxy and pale. Her body temperature dropped below normal. She began cultivating new diseases within her own tissue, carefully balancing strains that would destroy an enemy but leave the host intact.

That was three centuries ago. Vespera's foundational bacterial strain, the original rot she pulled from the Sunken Spire, is dying. Cultivated diseases across all practitioners are mutating into forms that attack their hosts. The Root-Veil has begun actively rejecting them. The forest has decided the art is a disease worth curing.

Each subrace hosts the affliction differently. The Drun Neth are the ideal substrate. Their partial-death is a consequence of severing from the First Contract through the fire-ritual of the Severing, leaving flesh in a legal vacuum that nature fills with whatever it can. The Morren cultivate the hush because it is the one property Morvane cannot tax, a disease engineered to be untraceable under contract-law. The Clean Vreken host visible bioluminescent disease-maps, their cultivated afflictions glowing along their skin for surgical precision but broadcasting to every Vreken nearby. The Marked Vreken deliver disease through the Root-Veil across miles of interconnected root and spore, a single practitioner able to blight an entire grove without touching it.

Vespera is bedridden. She has tasked her cultivators with engineering a successor strain before she dies. The project is failing. The Root-Veil is deliberately killing the foundational strain, and the virulent mutations are spreading through the network to organisms that never encountered a plaguebringer at all.`,
 title: "The Plaguebringer",
 subtitle: "Dark Cultivator of Rot & Decay",

 quickOverview: {
  title: "Quick Overview",
  content: `**Who they are**: A dark cultivator who treats the battlefield as a garden of rot  -  sowing sickness in enemies and nurturing it through stages of infection until the harvest reaps.

**The hook**: Apply Seed afflictions to enemies, then cultivate them through five categories of corruption from Stage 1 to Stage 3. Build Virulence with every advancing infection  -  the higher it climbs, the more your damage, duration, and spread radius amplify. Unleash devastating Harvest executions at peak Virulence to reap everything you have sown.

**The cost**: Your body is a walking infection vector. Every spell drains your own vitality. Purging fire deals catastrophic damage to you. You carry active decay in your flesh  -  waxy skin, warty growths, cold to the touch. Society outlaws you on sight.

**Bring one for**: Unmatched attrition warfare  -  turn enemies into infectious vectors and watch the pandemic consume entire encounters. No other class fights by turning the enemy's own body against them with such creeping, inevitable finality.`,
 },

  description: `The Plaguebringer is a grim, tragic practitioner of corruption who treats the battlefield as a garden of rot. By sowing seeds of sickness in their enemies and nurturing them through stages of infection, they cultivate a creeping pandemic. However, this dark garden demands constant sacrifice; casting their spells drains the Plaguebringer's own vitality and leaves them vulnerable to purging fire.`,

 roleplayIdentity: {
  title: "Roleplay Identity",
  content: `**HISTORY: THE GENESIS**
The plaguebringer's rot-vessel was born in the peat-bog sinks of the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink>. An alchemist named **Vespera** sought to synthesize a cure for the mycelial spore-hush and accidentally bonded with the bog's decay. The price of this alchemical synthesis was waxy, cold skin and warty growths. Vespera lived in perpetual symbiosis with the rot, her skin turning waxy, pale, and cold to the touch.

**CITIES & CIVIL RECEPTION**
Plaguebringers are feared and outlawed in every civilized city, forced to reside in the Over-Shanties or the forest sumps.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="neth">Drun Neth</LoreLink> and the Morren outcasts.

**NOTABLE FIGURES**
* **Vespera the Rot-Vessel**: The alchemist who saved her family from the spore-hush at the price of hosting active decay.
* **Malakor the Bile-Lord**: A Drun Neth outcast who weaponized the mycelial rot against canopy patrols.`
 },

 signatureQuote: {
  text: '"They call me a monster. They are right. But I did not make myself this way, I was born into a world that was already rotting, and I learned to breathe the decay."',
  speaker: 'Vespera the Rot-Keeper',
  context: 'Her journals, found in a peat-bog after she was presumed dead; she was not dead'
 },

 philosophy: {
  coreTenet: 'Decay is not the end of life, it is the continuation of life by other means. The Plaguebringer does not create disease; they cultivate it, tend it, and guide it toward specific outcomes. A disease is not a weapon. It is a garden, and the Plaguebringer is the gardener.',
  relationship: 'The Plaguebringer\'s body is a living substrate. They have deliberately infected themselves with carefully balanced strains of bacteria, fungi, and parasites that coexist without consuming their host. New strains must be introduced carefully, a Plaguebringer can die if they add a disease that upsets the internal balance. Their power comes from this precarious equilibrium, and every harvest, every time they release a cultivated disease into the world, destabilizes them.',
  paradox: 'The Plaguebringer preserves life by cultivating death. Their body would collapse without the carefully balanced diseases they carry. The rot is not a weapon they wield, it is a symbiotic substrate that they host. If they ever cured themselves of every disease, their immune system would collapse from the shock. They need the rot to live. They must keep themselves sick to stay healthy.'
 },

 currentCrisis: `The internal substrate is collapsing. Vespera's original strain, the carefully balanced blend of diseases that makes Plaguebringer cultivation possible, is failing. After three centuries of adaptation, the foundational bacteria are dying. Plaguebringers across the Bryngloom are reporting the same symptoms: their cultivated diseases are becoming unstable, mutating into virulent forms that attack the host.

The cause is unclear. Some blame the Silence contamination spreading through the peat-bogs. Others believe the bacterial strains have simply reached the end of their evolutionary lifespan. Whatever the cause, the Plaguebringers are facing extinction. Without stable foundational strains, they cannot cultivate new diseases. Without new diseases, they cannot harvest Virulence. Without Virulence, they cannot fight. And some of them are beginning to realize that if the foundational strains die, the diseases they are carrying may turn on them.`,

 meaningfulTradeoffs: `To be a Plaguebringer is to be untouchable. The diseases they carry are contagious, not lethally (they have cultivated them to be host-specific), but enough to make casual physical contact dangerous. Plaguebringers cannot hug their children. Cannot share a bed. Cannot hold a dying friend's hand. They live in a state of permanent physical isolation, surrounded by people who flinch when they approach. Many Plaguebringers develop elaborate surrogate-contact rituals, they leave gifts at doorsteps, communicate through windows, touch via intermediaries. They are never touched.`,

 classSpecificLocations: [
  {
  name: 'The Rot-Gardens',
  locationId: 'peat-bog-sinks',
  description: 'Submerged cultivation chambers in the deepest peat-bogs, where Plaguebringers grow and maintain their foundational bacterial strains. The gardens are marked by distinctive bioluminescent fungi that change color based on the health of the culture. Several gardens have recently turned black, the color of culture death.',
  purpose: 'Bacterial cultivation and strain preservation',
  status: 'Critical, foundational strains are failing across all active gardens'
  }
 ],

 combatRole: {
  title: "Combat Role",
  content: `The Plaguebringer is a specialized damage/control caster who thrives in prolonged, crowded skirmishes. They do not deal instant damage, but their capacity for multi-target, cascading decay is unmatched.

**Damage Output**: Low initial burst. Extreme, exponential sustained damage over time. High burst potential exclusively during Peak Harvest executions.

**Survivability**: Moderate-Low. Rely on siphoning life from their garden, but vulnerable to physical focus. ember damage immediately purges their garden, stripping their defensive life-drains.

**Utility**: Superior battlefield control. Spits out blinding spores, debilitating fog, neural-scrambling fevers, and reanimates corpses as walking pestilence hazards.

**Complexity**: High. Requires precise tracking of affliction stages, Virulence thresholds, and managing cultivation tolls.

**Weaknesses**:
- Ember-Purged: fire damage immediately purges your garden, stripping your life-draining siphons  -  a torch or a single ember spell can gut your entire kit in one hit.
- Slow Burn: your damage is exponential but back-loaded; fast, bursty enemies kill you before the garden ever blooms.
- Virulence Volatility: your power scales with Virulence, but the gauge decays without kills and a fight with no siphon target leaves it empty and your DoTs weak.
- Purge-Sensitive: at low Virulence your seeds are dispellable  -  a single cleansing effect can erase turns of setup.
- Physically Fragile: moderate-low survivability and vulnerable to focused physical damage; a martial that reaches you folds you fast.
- Untouchable (social): you are contagious and outlawed  -  permanent physical isolation, flinched from, barred from cities. You cannot touch your allies, hold a dying hand, or tend the sick without risk of passing the rot.`
,
 },

 playstyle: {
  title: "Playstyle & Strategy",
  content: `**Core Gameplay Loop**:
1. **Sow the Seeds**: Apply base afflictions to key enemy targets.
2. **Cultivate the Garden**: Cast Category spells (Weaken, Torment, Fester, Decay, Amplify) to advance affliction stages.
3. **Manage the Toll**: Balance the heavy self-inflicted HP and attribute costs required to fuel your darkest spells.
4. **Trigger the Harvest**: Unleash devastating ultimate spells when your Virulence reaches Peak Harvest.

**Virulence Management**:
- **0-24 (Dormant)**: Low DoT effectiveness. Focus on applying seeds and low-cost cultivations.
- **25-49 (Sprouting)**: DoTs gain +1 damage die. Siphon effects become active.
- **50-74 (Blooming)**: Afflictions gain +1 round duration and spread +5ft further.
- **75-100 (Peak Harvest)**: Afflictions become resistant to dispel attempts. Damage gains +2 dice. Ultimate execute spells are unlocked.`,
 },

 immersiveCombatExample: {
  title: "Combat Example: Sowing the Rot",
  content: `**The Setup**: You face a cluster of three armored knights in a damp dungeon corridor. Your party stands behind you. You start at 0 Virulence and 60/60 Mana.

**Turn 1 - Sowing the Seeds (Virulence: 0 ? 15)**
*Your veins burn with black bile as you trace a rot-sigil in the air. The knights advance, unaware of the garden taking root in their marrow.*
- **Action**: Cast "Wasting Curse" on the lead Knight (3 mana, 1 AP).
- **Flesh Toll**: You take 2 blight damage as the sigil sears your palm.
- **Effect**: Seed applied. Deals 1d6 blight damage/round.
- **Virulence Generated**: +15 (Seed applied).
- **State**: Lead Knight is infected (Stage 0). Caster HP: 58/60. Virulence: 15.

**Turn 2 - Cultivating the Rot (Virulence: 15 ? 30)**
*The knight coughs, a dark ichor dripping from his visor. You advance the plague.*
- **Action**: Cast "Enfeebling Fog" (4 mana, 1 AP) centering on the infected Knight.
- **Flesh Toll**: Your pores leak damp fog, slowing your movement speed by 5ft.
- **Effect**: Cultivates Wasting Curse to **Stage 1 (Weaken)**. The Knight's DR is reduced by 4. The fog clings to all three knights.
- **Virulence Generated**: +15 (Affliction cultivated).
- **State**: Lead Knight at Stage 1 (Weaken). All knights in fog have DR reduced. Virulence: 30 (Sprouting threshold met).

**Turn 3 - The Bloom and Spread (Virulence: 30 ? 55)**
*The lead knight staggers under his rotting armor. The rot wants to spread.*
- **Action**: Cast "Infectious Sores" (6 mana, 1 AP) on the lead Knight.
- **Flesh Toll**: You take 5 blight damage as your skin blisters in sympathy.
- **Effect**: Cultivates Wasting Curse to **Stage 2 (Fester)**. The sores rupture, spreading Wasting Curse as Stage 0 Seeds to the two adjacent knights.
- **Virulence Generated**: +25 (Affliction advanced + contagion spread).
- **State**: Lead Knight at Stage 2 (Fester). Adjacent knights infected (Stage 0). Virulence: 55 (Blooming threshold met).

**Turn 4 - Peak Harvest (Virulence: 55 ? 80)**
*The garden is fully realized. Three infected hosts stand before you, shivering with rot. It is time for the harvest.*
- **Action**: Cast "Necrotic Eruption" (34 mana, 3 AP).
- **Flesh Toll**: Black blood erupts from your nose; you take 20 blight damage.
- **Effect**: Consumes all active afflictions on the three knights. Each host explodes, dealing 12d8 blight damage in a 30ft radius.
- **Result**: The knights are utterly dissolved. The corridor is silent, save for the quiet drip of corrupted runoff.
- **State**: Enemies obliterated. Virulence decays. Caster HP: 33/60.`,
 },
 },

 // Resource System
 resourceSystem: {
 title: "Virulence & The Five Garden Categories",
 subtitle: "Cultivating the Inevitable Decay",
 description: `The Plaguebringer's power is governed by Virulence, a scale representing the saturation of rot in the local area. Instead of immediate spells, they apply base Seeds and nurture them through five distinct thematic categories of decay. As Virulence climbs, the entire garden intensifies.

?? **PURGING FLAMES**: Purity is your absolute doom. Any source of ember damage instantly clears all active Seeds and affliction stages from targets within its area, setting your Virulence back to 0. 

?? **VIRULENCE ECONOMY**: Your power is measured in Virulence (0-100), generated by seeding and cultivating diseases and spent on devastating Harvests. Some advanced spells carry side-effects  -  a movement slow or temporary stat debuff from the rot you host  -  but the gauge, not your blood, is the price.`,

 cards: [
  {
  title: "Virulence Scale (0-100)",
  stats: "Thresholds: 25 / 50 / 75",
  details: "Generated by sowing seeds and cultivating stages. Decays by 2 per round out of combat. Unlocks major spell enhancements and executes as it climbs."
  },
  {
  title: "Affliction Stages (0-3)",
  stats: "Seed ? Cultivated ? Final",
  details: "Spells apply a Stage 0 Seed. Category spells advance the Seed by 1 stage. At Stage 3, the affliction assumes a devastating, permanent final archetype."
  },
  {
  title: "Flesh Tolls",
   stats: "Self-Injury",
   details: "Active spells generate and spend Virulence. Some advanced cultivations carry side-effects (slows, stat debuffs) from the rot you host  -  but your HP is not the currency."
  }
 ],

 usage: {
   momentum: "Sow seeds early and broad. Maintain multiple Stage 1 DoTs to rapidly climb past the Sprouting (25) and Blooming (50) thresholds. Siphon and Drain spells help offset your self-inflicted HP tolls.",
  flourish: "Do not rush your Harvest. Keep targets at Stage 2 or 3 under Peak Harvest (75+) where they cannot dispel your rot, allowing the massive DoTs to tick before cashing them in with a devastating execute."
 },

 overheatRules: {
   title: "The Price of the Harvest (Operational Friction)",
  content: `The manipulation of biological rot is a parasitic process. The Plaguebringer's body acts as the primary incubator, meaning they suffer severe feedback when push comes to shove.

**HP and Attribute Tolls**:
Many Plaguebringer cultivations carry side-effects  -  temporary Agility or Strength reductions from the rot you host, or a movement slow. These represent the strain of channeling decay, not a health cost; Virulence is the currency, not your HP.

**The Fire Purge**:
The greatest weakness of the garden is heat. If any target carrying your afflictions takes ember damage, or if a Fire-based zone (like a fireball or wall of fire) covers them, the heat immediately burns away all rot. The affliction is cleansed, and your Virulence drops by 15 per cleansed target. Plan your party composition carefully,allies with ember magic will ruin your harvest.

**Vector Contamination**:
Your diseases do not possess intelligence. Under "Vector Isolation," any ally who starts or ends their turn within 5 feet of an enemy carrying a Stage 2+ affliction must make a Constitution saving throw (DC 14) or contract a Stage 0 Seed of that affliction. Keep your martial allies informed of where the rot is thickest.`
 },

 generationTable: {
  title: "Virulence Generation",
  headers: ["Action", "Virulence Gained", "Notes"],
  rows: [
  ["Apply Base Seed", "+10", "Apply a Stage 0 Seed to a healthy target"],
  ["Sow Contagion", "+5", "When a plague spreads naturally or via spell to a new target"],
  ["Cultivate Stage", "+15", "Cast a category spell to advance an affliction's stage"],
  ["Corpse Burst", "+20", "When a fully cultivated host dies and infects nearby targets"],
  ["Round Decay", "-2", "Losing grip on the garden. Decays every round spent without casting a plague spell"]
  ]
 },

 fiveCategoriesTable: {
  title: "The Five Cultivation Categories",
  headers: ["Category", "Identity", "Stage Effect", "Best For"],
  rows: [
  ["Weaken", "The Sap", "Reduces target DR, Dodge, and physical attributes", "Softening heavily armored targets"],
  ["Torment", "The Whisper", "Inflicts wyrd damage and crowd control (Confusion/Fear)", "Disrupting casters and breaking enemy lines"],
  ["Fester", "The Creep", "Spreads active diseases to adjacent healthy targets", "Clearing tightly packed groups of enemies"],
  ["Decay", "The Rot", "Deals blight damage and drains maximum HP and healing", "Sapping bosses and locking down healers"],
  ["Amplify", "The Surge", "Multiplies existing DoT damage and triggers immediate ticks", "Setting up massive burst damage windows"]
  ]
 },

 finalFormsTable: {
  title: "Final Cultivated Archetypes (Stage 3)",
  headers: ["Ending Category", "Archetype Name", "Core Effect", "Harvested?"],
  rows: [
  ["Amplify", "The Harvest", "Massive single-target burst execute", "Yes, affliction consumed"],
  ["Fester", "The Pandemic", "Affliction spreads to all enemies within 20ft", "No, persists on all targets"],
  ["Weaken", "The Collapse", "Permanent -6 to all attributes and halved movement speed", "No, persists until cured"],
  ["Torment", "The Shatter", "Mental break; target goes wild and attacks nearest creature", "No, persists as madness"],
  ["Decay", "The Blight", "Target cannot receive healing and maximum HP drops by 20%", "No, persists as decay"]
  ]
 },

 strategicConsiderations: {
  title: "Combat Phases & Strategic Decisions",
  content: `**Planting Phase (Rounds 1-2)**: Focus on seeding multiple targets. Your primary goal is to bypass the Dormant stage and hit Sprouting (25) as fast as possible to make your DoTs threatening. Accept the early HP tolls as an investment.

**Cultivation Phase (Rounds 3-4)**: The sweet spot of your gameplay. Maintain your distance from infected targets to avoid vector contamination to allies. Cultivate the lead target toward Fester if you want a broad plague, or Decay if you face a single powerful foe.

**The Harvest Phase (Rounds 5+)**: Unstoppable decay. Your afflictions are nearly immune to dispels. Finish with Amplify to trigger a massive burst execute, or let the Stage 3 Blight drain the target's life completely while you siphon their health.`
 },

 playingInPerson: {
  title: "Playing in Person",
  subtitle: "Physical Tracking for Tabletop Play",
  content: `The physical tracking of a Plaguebringer's garden is a visually satisfying tabletop experience. Use distinct markers to track the stages of your rot.

**Required Materials**:
- **Colored Glass Beads**, (Grey: Weaken, Purple: Torment, Green: Fester, Black: Decay, Red: Amplify). Place these on enemy miniatures to represent active category tokens.
- **A 100-point Dial or d100**, To track your Virulence gauge on your playmat.
- **Skull Tokens**, To mark Stage 3 final archetypes.

**The Tabletop Hack**:
- **Contagion Slide**: When a plague spreads, physically slide the duplicate glass beads from the primary host to the adjacent miniatures. It visually demonstrates the infection creeping across the battle map.
 - **The Sweeper**: When you cast a Harvest spell, physically sweep all glass beads off the target's card into a cup. The rattle of the beads represents the rot taking hold.`
 }
 },

 // Specializations
 specializations: {
 title: "Plaguebringer Specializations",
 subtitle: "Three Paths of biological Decay",
 description: `Plaguebringers specialize in three fundamentally different methods of tending their dark garden, each changing how they interact with their victims.`,
 
 sharedPassive: {
  name: "Plague Mastery",
  icon: "Poison/Poison Plague",
  description: "Your afflictions last 2 additional rounds and resist dispel attempts (roll 1d6, on 5-6 resist). Whenever an afflicted target dies, you gain 1d4 mana."
 },

 specs: [
  { id : "virulent-spreader",
  name: "Virulent Spreader",
  icon: "Poison/Poison Contagion",
  color: "#556B2F",
  description: "The Swarm Gardener. You treat the entire battlefield as a single plot of soil. You excel at sowing seeds across multiple targets simultaneously and watching infection cascade through their ranks.",
  playstyle: "You play WIDE. You do not care about cultivating one perfect flower; you blanket the entire field in rot and let natural contagion do the work. Perfect for fighting clustered armies.",
  strengths: [
   "Exceptional multi-target damage through cascading contagion",
   "High mana efficiency,one cast applies seeds to multiple foes",
   "Powerful area denial with necrotic plague zones",
   "Scales exponentially when enemies are grouped tightly"
  ],
  weaknesses: [
   "Lower single-target burst than other specializations",
   "Highly dependent on enemy grouping",
   "High risk of vector contamination to martial allies",
   "Vulnerable to fire clearing the entire field at once"
  ],
  specPassive: {
   name: "Epidemic Mastery",
   description: "Base affliction spells apply to 2 adjacent targets simultaneously for the same mana cost. When an affliction reaches Stage 2+, it auto-spreads to 1 adjacent enemy as a Stage 0 Seed. +1 spread target per 25 Virulence."
  },
  keyAbilities: [
   "Field Seeding: Base afflictions apply to multiple targets.",
   "Auto-Contagion: Stage 2 afflictions automatically creep to nearby foes.",
   "Plague Burst: Detonate all active plagues in a 15ft radius."
  ]
  },
  { id : "torment-weaver",
  name: "Torment Weaver",
  icon: "Psychic/Mind Roar",
  color: "#4B0082",
  description: "The Psychic Spider. Your garden is a web of linked minds. You cultivate an affliction in one mind, and all connected targets suffer the same neural rot.",
  playstyle: "You play CONNECTED. You plant the same seed in multiple minds, forming a psychic web. When you cultivate one target, the neural shock waves travel through the web to advance all linked targets.",
  strengths: [
   "Highly efficient cultivation,advance multiple targets with one spell",
   "Vicious crowd control through psychic hallucinations and confusion",
   "Excellent against groups of high-value targets",
   "Stage 3 Shatter final archetypes chain through all links"
  ],
  weaknesses: [
   "Links break immediately if base affliction types differ",
   "Lower raw physical/blight damage output",
   "Psychic resistance can sever web connections",
   "Requires deliberate setup to establish the links"
  ],
  specPassive: {
   name: "Psychic Resonance",
   description: "Applying the same base affliction to multiple targets creates a Psychic Link (max 3 targets, +1 per 25 Virulence). Advancing an affliction on one target advances all linked targets. Linked targets take +1d4 wyrd damage whenever a link is activated."
  },
  keyAbilities: [
   "Psychic Link: Cultivating one linked host cultivates all.",
   "Resonance Damage: Linked targets take wyrd damage on link activation.",
   "Mind Fracture: Force saving throws against stunning mental shocks."
  ]
  },
  { id : "decay-harbinger",
  name: "Decay Harbinger",
  icon: "Necrotic/Necrotic Death",
  color: "#2F4F2F",
  description: "The Devastating Attritionist. You do not harvest your garden. You let it grow forever, stacking permanent, biological decay that eats away at the victim's attributes and maximum life.",
  playstyle: "You play DEEP. You ignore quick executes. Instead, you let your rot fester indefinitely. Each category spell cast after Stage 3 stacks permanent deterioration on the victim.",
  strengths: [
   "Permanent rot stacks that persist between combat encounters",
   "Devastating anti-healing and attribute reduction",
   "Unmatched power in prolonged boss encounters",
   "Stacks up to 15 permanent debuffs per target"
  ],
  weaknesses: [
   "No burst execute,cannot harvest afflictions for immediate big numbers",
   "Extremely slow ramp-up in short, simple skirmishes",
   "Highly dependent on maintaining concentration for deep stacks",
   "Cured by high-level restoration magic"
  ],
  specPassive: {
   name: "Accelerated Decay",
   description: "Afflictions have no final form. Instead, each category spell after Stage 3 adds a permanent stack: choose -1 to a stat, -1d4 max HP, or -10% healing. Stacks persist until Greater Restoration (max 15 stacks). Stacks above 10 require concentration."
  },
  keyAbilities: [
   "Infinite Growth: Nurture afflictions beyond Stage 3 into permanent decay.",
   "Withering Aura: High stacks emit a 20ft aura that blocks all enemy healing.",
   "Necrotic Dominion: Halve enemy healing and gain massive lifesteal against rotted targets."
  ]
  }
 ]
 },

 // =============================================
 // UNIFIED SPELL LIST (30 spells, 2 passives)
 // =============================================
 spells: [
 // ===== LEVEL 1 SPELLS =====
 { id: "pb_curse_of_agony",
  effectTypes: ["damage"],
  name: "Wasting Curse",
  description: "Plant a seed of decay in your target's veins, dealing 1d6 + intelligence blight damage immediately, and 1d6 blight damage at the start of their turn for 4 rounds. Advances the target's affliction stage by 1. Cultivates as a Decay category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Skull",
  level: 1,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Necrotic Skull",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "curse", "dot", "decay", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 40,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 3 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "1d6 + intelligence",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "1d6",
   duration: 4,
   tickFrequency: "round",
   isProgressiveDot: false
  },
  savingThrow: {
   ability: "spirit",
   difficultyClass: 14,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Flesh: The caster's reserves strain, generating Virulence."
  },
  cultivation: {
   category: "Decay",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  tags: ["damage", "blight", "dot", "decay", "plaguebringer"],
  flavorText: "A seed of decay planted in the warm meat of the living. It grows, and they weep."
 },
 { id: "pb_venomous_touch",
  effectTypes: ["damage"],
  name: "Venomous Touch",
  description: "Strike a target with rotting fluid, dealing 1d8 + intelligence blight damage and applying a Stage 0 Seed. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Poison/Venomous Snakes",
  level: 1,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Venomous Snakes",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "melee", "seed", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "melee",
  rangeDistance: 5,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 4 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 10 }
  },
  damageConfig: {
  formula: "1d8 + intelligence",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 14,
   saveOutcome: "negates"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: Seizes the caster's hands with toxic palsy, reducing Dodge by 2 for 1 round."
  },
  cultivation: {
   category: "Fester",
   appliesSeed: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  tags: ["damage", "blight", "seed", "fester", "plaguebringer"],
  flavorText: "A touch that rots the skin like overripe fruit, leaving weeping sores."
 },
 { id: "pb_whisper_of_decay",
  effectTypes: ["damage"],
  name: "Whisper of Decay",
  description: "Whisper a tragic dirge into the victim's mind, dealing 1d6 + intelligence wyrd damage. If the target has an active Seed, advance it to Stage 1. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Psychic/Mind Roar",
  level: 1,
  specialization: "torment-weaver",
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Mind Roar",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "mind", "cultivation", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 50,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 4 },
  components: ["verbal"],
   verbalText: "Plaguebringer!",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "1d6 + intelligence",
  elementType: "wyrd",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 14,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Mind: The caster whispers a part of their own sanity away, suffering a -2 penalty to Spirit checks for 1 round."
  },
  cultivation: {
   category: "Torment",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  tags: ["damage", "wyrd", "mind", "torment", "plaguebringer"],
  flavorText: "The dry hum of locusts inside the skull. It never stops, repeating the names of the dead."
 },

 // ===== LEVEL 2 SPELLS =====
 { id: "pb_fever_dream",
  effectTypes: ["damage", "debuff"],
  name: "Fever Dream",
  description: "Plunge an infected target into a sweating delirium, dealing 2d6 wyrd damage and reducing Agility by 3 for 3 rounds. Requires an active affliction. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Psychic/Mental Chaos",
  level: 2,
  specialization: "torment-weaver",
  typeConfig: {
  school: "wyrd",
  secondaryElement: "blight",
  icon: "Psychic/Mental Chaos",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "debuff", "cultivation", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 40,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 6 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "2d6",
  elementType: "wyrd",
  damageTypes: ["wyrd", "blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 15,
   saveOutcome: "half_damage"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "delirium",
   name: "Delirium",
   description: "Agility reduced by 3 due to severe sweating and hallucination."
   }
  ],
  statPenalties: [
   { stat: "agility", magnitude: -3, magnitudeType: "flat" }
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 15,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The caster's reserves strain, generating Virulence."
  },
  cultivation: {
   category: "Torment",
   requiresAffliction: true,
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  tags: ["damage", "wyrd", "debuff", "torment", "plaguebringer"],
  flavorText: "Their eyes roll back, witnessing the dark garden blooming behind their eyelids."
 },
 { id: "pb_mark_of_the_pestilent",
  effectTypes: ["damage", "debuff"],
  name: "Mark of the Pestilent",
  description: "Brand a target with a searing sigil of rot, dealing 2d8 blight damage and reducing DR by 5 for 3 rounds. Cultivates as a Weaken category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Death Mark",
  level: 2,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Death Mark",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "debuff", "weaken", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 30,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 6 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "2d8",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 15,
   saveOutcome: "negates"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "marked_pestilent",
   name: "Pestilent Brand",
   description: "Flesh softens under the mark, reducing DR by 5."
   }
  ],
   savingThrow: {
   ability: "constitution",
   difficultyClass: 15,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Virulence Toll: The brand feeds on the caster's reserves, costing 5 Virulence."
  },
  cultivation: {
   category: "Weaken",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  tags: ["damage", "debuff", "weaken", "plaguebringer"],
  flavorText: "The brand of the gardener. You are marked for the sickle, and your shell begins to crack."
 },
 { id: "pb_enfeebling_fog",
  effectTypes: ["debuff"],
  name: "Enfeebling Fog",
  description: "Exhale a thick, greenish cloud of rot in a 20ft radius. Enemies inside are enfeebled, suffering -4 Strength and -4 Agility. Cultivates active afflictions as Weaken.",
  spellType: "ACTION",
  icon: "Poison/Poison Blight",
  level: 2,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Blight",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "zone", "debuff", "weaken", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 45,
  aoeType: "sphere",
  aoeSize: 20,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 4 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 10 }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "enfeebled",
   name: "Enfeebled",
   description: "Muscles liquefy and joints stiffen, reducing Strength and Agility by 4."
   }
  ],
  statPenalties: [
   { stat: "strength", magnitude: -4, magnitudeType: "flat" },
   { stat: "agility", magnitude: -4, magnitudeType: "flat" }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 15,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The fog leaks from the caster's own lungs, slowing their movement speed by 5ft for 2 rounds."
  },
  cultivation: {
   category: "Weaken",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["debuff", "zone", "weaken", "plaguebringer"],
  flavorText: "The air turns sour, thick with the heavy stench of stagnant bogs. Their limbs grow leaden."
 },

 // ===== LEVEL 3 SPELLS =====
 { id: "pb_drain_vitality",
  effectTypes: ["damage", "healing"],
  name: "Drain Vitality",
  description: "Siphon the life force of a diseased enemy, dealing 3d6 blight damage and healing the caster for 50% of the damage dealt. Requires active affliction. Cultivates as a Decay category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Drain Soul",
  level: 3,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Drain Soul",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "lifesteal", "decay", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 35,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 8 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "3d6",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 15,
   saveOutcome: "half_damage"
  }
  },
  healingConfig: {
  formula: "damage / 2",
  healingType: "self",
  resolution: "AUTOMATIC",
  canOverheal: false
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Flesh: To open the siphon, the caster must inject some of their own blood into the link, taking 4 blight damage that cannot be reduced."
  },
  cultivation: {
   category: "Decay",
   requiresAffliction: true,
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  tags: ["damage", "healing", "lifesteal", "decay", "plaguebringer"],
  flavorText: "Your lungs expand as their chest collapses. A sweet, warm thieving of breath."
 },
 { id: "pb_hallucinogenic_spores",
  effectTypes: ["control"],
  name: "Hallucinogenic Spores",
  description: "Throw a handful of fungal dust in a 15ft radius. Enemies failing a Spirit save are confused for 2 rounds. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Blight",
  level: 3,
  specialization: "torment-weaver",
  typeConfig: {
  school: "wyrd",
  icon: "Poison/Poison Blight",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "control", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 30,
  aoeType: "sphere",
  aoeSize: 15,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 6 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  controlConfig: {
  controlType: "mind_control",
  effects: [
   { id : "confused_spores",
   name: "Spore Confused",
   description: "Spore inhalation causes target to wander aimlessly or attack nearest ally (50% chance)."
   }
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 15,
   saveOutcome: "negates"
  },
  durationValue: 2,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: Spore blowback irritates the caster's mind, imposing disadvantage on Spirit saves for 1 round."
  },
  cultivation: {
   category: "Torment",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["control", "wyrd", "torment", "plaguebringer"],
  flavorText: "A burst of blue, glowing spores. The dust enters their nostrils, and they begin to weep, clawing at invisible bugs."
 },
 { id: "pb_agonizing_wail",
  effectTypes: ["damage", "control"],
  name: "Wail of Decay",
  description: "Let loose a tragic scream of pure despair, dealing 3d8 wyrd damage to all enemies in a 15ft cone. Targets with 2+ active afflictions lose their reaction next round. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Psychic/Mind Roar",
  level: 3,
  specialization: "torment-weaver",
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Mind Roar",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "cone", "control", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 15,
  aoeType: "cone",
  aoeSize: 15,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 9 },
  components: ["verbal"],
   verbalText: "Plaguebringer!",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "3d8",
  elementType: "wyrd",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 15,
   saveOutcome: "half_damage"
  }
  },
  controlConfig: {
  controlType: "incapacitation",
  effects: [
   { id : "reaction_lost",
   name: "Reaction Lost",
   description: "The overwhelming mental scream deprives the target of their reaction next turn."
   }
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 15,
   saveOutcome: "negates"
  },
  durationValue: 1,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The sheer vocal strain sears the caster's throat; they cannot speak or cast verbal spells next turn."
  },
  cultivation: {
   category: "Torment",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["damage", "control", "wyrd", "torment", "plaguebringer"],
  flavorText: "It is not a battle cry. It is the howl of a parent losing a child, amplified through the throat of the dead."
 },

 // ===== LEVEL 4 SPELLS =====
 { id: "pb_infectious_sores",
  effectTypes: ["damage"],
  name: "Infectious Sores",
  description: "Cause existing infections to blister and burst, dealing 2d6 blight damage. If the target is Stage 1+, the sores rupture, applying Stage 0 Seeds to 2 enemies within 10ft. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Contagion",
  level: 4,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Contagion",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "contagion", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 35,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 6 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 20 }
  },
  damageConfig: {
  formula: "2d6",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 16,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
       description: "Toll of Flesh: The caster's reserves strain, generating Virulence."
  },
  cultivation: {
   category: "Fester",
   advancesStage: true,
   spreadsOnStage: 1,
   spreadRadius: 10,
   spreadTargets: 2
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["damage", "blight", "contagion", "fester", "plaguebringer"],
  flavorText: "Yellow blisters swell rapidly and pop with a wet hiss, spraying infectious rot on bystanders."
 },
 { id: "pb_plague_of_flies",
  effectTypes: ["damage", "debuff"],
  name: "Plague of Flies",
  description: "Summon a biting, black cloud of insects centered on a target, dealing 2d4 blight damage per round for 3 rounds. Enemies in the swarm have disadvantage on physical attacks. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Blight",
  level: 4,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Blight",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "dot", "debuff", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 40,
  aoeType: "sphere",
  aoeSize: 15,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 8 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "2d4",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "2d4",
   duration: 3,
   tickFrequency: "round",
   isProgressiveDot: false
  },
  savingThrow: {
   ability: "constitution",
   difficultyClass: 16,
   saveOutcome: "half_damage"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "blinded_flies",
   name: "Biting Swarm",
   description: "Disadvantage on all physical attacks due to blinding insects."
   }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 16,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The ravenous flies bite the caster upon emergence, dealing 3 piercing damage."
  },
  cultivation: {
   category: "Fester",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["damage", "debuff", "blight", "fester", "plaguebringer"],
  flavorText: "A deafening buzz. A million tiny, black bodies swarm the eyes and open sores of the living."
 },
 { id: "pb_necrotic_burst",
  effectTypes: ["damage"],
  name: "Necrotic Burst",
  description: "Detonate the blighted decay in a host, dealing 4d6 blight damage to all enemies in a 15ft radius. Requires a Stage 1+ affliction on the primary host. Cultivates as a Decay category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Skull Explosion",
  level: 4,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Skull Explosion",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "aoe", "decay", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 45,
  aoeType: "sphere",
  aoeSize: 15,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 9 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 20 }
  },
  damageConfig: {
  formula: "4d6",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 16,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The biological shock of the burst rattles the caster, reducing their DR by 2 for 1 round."
  },
  cultivation: {
   category: "Decay",
   requiresAffliction: true,
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["damage", "aoe", "blight", "decay", "plaguebringer"],
  flavorText: "Flesh swells, turns a deep, bruised purple, then bursts with wet, explosive decay."
 },

 // ===== LEVEL 5 SPELLS =====
 { id: "pb_wither_touch",
  effectTypes: ["damage", "debuff"],
  name: "Wither Touch",
  description: "Touch a target to wither their physical strength, dealing 4d8 blight damage and imposing disadvantage on Strength checks for 2 rounds. Cultivates as a Decay category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Wither",
  level: 5,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Necrotic Wither",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "debuff", "weaken", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "melee",
  rangeDistance: 5,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 10 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "4d8",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 17,
   saveOutcome: "half_damage"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "withered_muscles",
   name: "Withered Muscles",
   description: "Target's tendons rot, giving disadvantage on Strength checks."
   }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 17,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The caster's own hand rots temporarily, giving disadvantage on Strength checks for 2 rounds."
  },
  cultivation: {
   category: "Decay",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["damage", "debuff", "blight", "weaken", "plaguebringer"],
  flavorText: "Flesh falls away under your grasp, revealing gray, crumbling bone."
 },
 { id: "pb_dark_rejuvenation",
  effectTypes: ["healing", "debuff"],
  name: "Dark Rejuvenation",
  description: "Drain 2d10 HP from your active afflictions to heal yourself. Triggers a self-debuff reducing all stats by 2 for 2 rounds. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Healing/Red Heart",
  level: 5,
  specialization: "torment-weaver",
  typeConfig: {
  school: "blight",
  icon: "Healing/Red Heart",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["healing", "debuff", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 8 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 10 }
  },
  healingConfig: {
  formula: "2d10",
  healingType: "self",
  resolution: "DICE",
  canOverheal: false
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "rejuvenation_rot",
   name: "Rejuvenation Rot",
   description: "Caster's body is poisoned by the harvested rot, reducing all stats by 2."
   }
  ],
  statPenalties: [
   { stat: "all_stats", magnitude: -2, magnitudeType: "flat" }
  ],
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Sanity: Healing with stolen sickness induces a self-debuff, reducing all attributes by 2 for 2 rounds."
  },
  cultivation: {
   category: "Torment",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["healing", "debuff", "torment", "plaguebringer"],
  flavorText: "You swallow their sickness to mend your bones, but their fever now burns inside your own heart."
 },
 { id: "pb_sufferings_echo",
  effectTypes: ["damage"],
  name: "Suffering's Echo",
  description: "Cause a target's active affliction to echo in an adjacent healthy enemy. Deals 4d6 wyrd damage to the second target and copies the first target's active Seed. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Psychic/Mental Chaos",
  level: 5,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Mental Chaos",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "contagion", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 45,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 9 },
  components: ["verbal"],
   verbalText: "Plaguebringer!",
  classResource: { type: "virulence", gain: 20 }
  },
  damageConfig: {
  formula: "4d6",
  elementType: "wyrd",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 17,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The psychic feedback echoes in the caster's mind, dealing 6 wyrd damage."
  },
  cultivation: {
   category: "Fester",
   advancesStage: true,
   copiesAffliction: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["damage", "wyrd", "contagion", "fester", "plaguebringer"],
  flavorText: "The torment of one mind reflects in another. The scream sounds twice."
 },

 // ===== LEVEL 6 SPELLS =====
 { id: "pb_pain_magnification",
  effectTypes: ["damage"],
  name: "Pain Magnification",
  description: "Magnify the pain of all active afflictions, forcing every infected enemy to immediately take 1 tick of all their active DoT damages. Cultivates as an Amplify category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Plague",
  level: 6,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Plague",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["damage", "dot", "burst", "amplify", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeType: "sphere",
  aoeSize: 50,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 12 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 20 }
  },
  damageConfig: {
  formula: "Immediate tick of all active DoTs",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "AUTOMATIC"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Virulence Surge: The cascade generates 5 Virulence."
  },
  cultivation: {
   category: "Amplify",
   advancesStage: true,
   triggersDoTTick: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["damage", "dot", "burst", "amplify", "plaguebringer"],
  flavorText: "Every seed blooms in one terrifying, searing instant."
 },
 { id: "pb_essence_corruption",
  effectTypes: ["damage", "debuff"],
  name: "Essence Corruption",
  description: "Corrupt the mana pool of an enemy spellcaster, dealing 5d8 wyrd damage and locking their mana regeneration for 1 round. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Psychic/Mind Control",
  level: 6,
  specialization: "torment-weaver",
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Mind Control",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "debuff", "anti-caster", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 50,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 14 },
  components: ["verbal"],
   verbalText: "Plaguebringer!",
  classResource: { type: "virulence", gain: 15 }
  },
  damageConfig: {
  formula: "5d8",
  elementType: "wyrd",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "mana_locked",
   name: "Mana Lock",
   description: "Mana pool is corrupted and cannot regenerate mana or spend spell resources."
   }
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 18,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The caster's own spiritual pathways choke; their mana regeneration is locked to 0 next turn."
  },
  cultivation: {
   category: "Torment",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["damage", "debuff", "wyrd", "torment", "plaguebringer"],
  flavorText: "Your thoughts rot their wellspring. They reach for power, and find only ashes."
 },
 { id: "pb_affliction_mark",
  effectTypes: ["debuff"],
  name: "Affliction Mark",
  description: "Mark an enemy with a highly volatile contagion. Reduces their Dodge by 6 and Agility by 4. If they die, their corpse bursts, applying Stage 0 Seeds to all enemies in 15ft. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Death Mark",
  level: 6,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Death Mark",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "debuff", "weaken", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 45,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 1,
  resourceTypes: ["mana"],
  resourceValues: { mana: 10 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 20 }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "volatile_mark",
   name: "Volatile Mark",
   description: "Dodge reduced by 6 and Agility by 4. Corpse will burst into seeds upon death."
   }
  ],
  statPenalties: [
   { stat: "dodge", magnitude: -6, magnitudeType: "flat" },
   { stat: "agility", magnitude: -4, magnitudeType: "flat" }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Flesh: Tracing the volatile mark burns the caster's skin, dealing 6 blight damage."
  },
  cultivation: {
   category: "Fester",
   advancesStage: true,
   corpseBurst: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["debuff", "weaken", "fester", "plaguebringer"],
  flavorText: "A wet, black seal painted on the forehead. The flies gather even before the target ceases breathing."
 },

 // ===== LEVEL 7 SPELLS =====
 { id: "pb_plague_burst",
  effectTypes: ["damage"],
  name: "Plague Burst",
  description: "Harvest all active afflictions in a 20ft radius (max 6). Each active affliction is immediately consumed to deal 5d6 blight damage to the host and all adjacent targets. Cultivates as a Weaken category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Plague",
  level: 7,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Plague",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "aoe", "burst", "weaken", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 40,
  aoeType: "sphere",
  aoeSize: 20,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 15 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 20 }
  },
  damageConfig: {
  formula: "5d6 per consumed affliction (max 6)",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The violent physical recoil of the burst generates Virulence."
  },
  cultivation: {
   category: "Weaken",
   advancesStage: true,
   harvestsAffliction: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["damage", "aoe", "blight", "weaken", "plaguebringer"],
  flavorText: "Their flesh splits under internal pressure. The harvest is messy."
 },
 { id: "pb_mass_affliction",
  effectTypes: ["debuff"],
  name: "Mass Affliction",
  description: "Unleash a wave of contagion that applies a Stage 0 Seed to all enemies within 30ft. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Contagion",
  level: 7,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Contagion",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "aoe", "seed", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeType: "sphere",
  aoeSize: 30,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 18 },
  components: ["somatic"],
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 25 }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "mass_seeded",
   name: "Rot Seeded",
   description: "Host carries a dormant plague seed."
   }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Virulence Toll: The mass projection strains the caster's reserves, costing 8 Virulence."
  },
  cultivation: {
   category: "Fester",
   appliesSeedToAll: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
  tags: ["debuff", "aoe", "blight", "fester", "plaguebringer"],
  flavorText: "The gardener sows the seeds broadly. The soil is rich."
 },
 { id: "pb_pandemic",
  effectTypes: ["damage"],
  name: "Pandemic",
  description: "Force all active afflictions to immediately spread to up to 3 adjacent enemies in 15ft. Deals 4d8 blight damage to all targets in the cascade. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Contagion",
  level: 7,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Contagion",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "contagion", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeType: "sphere",
  aoeSize: 45,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 20 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 25 }
  },
  damageConfig: {
  formula: "4d8",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Virulence Surge: The cascade generates 8 Virulence."
  },
  cultivation: {
   category: "Fester",
   advancesStage: true,
   massSpread: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
  tags: ["damage", "contagion", "fester", "plaguebringer"],
  flavorText: "One cough. Two stagger. Ten rot. The battlefield belongs to the garden."
 },
 { id: "pb_decay_field",
  effectTypes: ["damage", "debuff"],
  name: "Decay Field",
  description: "Saturate a 30ft radius circle in creeping rot, dealing 5d8 blight damage per round for 4 rounds. Enemies inside have Dodge reduced by 5. Cultivates active afflictions as Decay.",
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Wither",
  level: 7,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Necrotic Wither",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "zone", "dot", "decay", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 40,
  aoeType: "sphere",
  aoeSize: 30,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 22 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 20 }
  },
  damageConfig: {
  formula: "5d8",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "5d8",
   duration: 4,
   tickFrequency: "round",
   isProgressiveDot: false
  },
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "rotted_ground",
   name: "Rotted Ground",
   description: "Slippery decay reduces Dodge by 5."
   }
  ],
  statPenalties: [
   { stat: "dodge", magnitude: -5, magnitudeType: "flat" }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 18,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The decay of the soil saps the caster's own speed, reducing movement speed by 10ft while the field persists."
  },
  cultivation: {
   category: "Decay",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
  tags: ["damage", "zone", "blight", "decay", "plaguebringer"],
  flavorText: "The earth rots beneath their feet. Nothing grows here anymore."
 },
 { id: "pb_gardens_wrath",
  effectTypes: ["damage"],
  name: "Garden's Wrath",
  description: "Trigger every active affliction across all targets to deal its full DoT damage simultaneously in one devastating tick. Requires 3+ active afflictions. Cultivates as Amplify.",
  spellType: "ACTION",
  icon: "Poison/Poison Plague",
  level: 7,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  secondaryElement: "wyrd",
  icon: "Poison/Poison Plague",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["damage", "ultimate", "amplify", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  aoeType: "sphere",
  aoeSize: 60,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 26 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 10 }
  },
  damageConfig: {
  formula: "All affliction DoT sums � virulence multiplier",
  elementType: "blight",
 damageTypes: ["blight", "wyrd"],
  resolution: "AUTOMATIC"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: The sheer neural load of detonating all active rot stuns the caster for 1 round."
  },
  cultivation: {
   category: "Amplify",
   requiresAfflictions: {
   enabled: true,
   minimumAfflictions: 3
   }
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
  tags: ["damage", "ultimate", "amplify", "plaguebringer"],
  flavorText: "The garden blooms all at once. Every flower is a grave."
 },
 { id: "pb_mind_plague",
  effectTypes: ["damage", "control"],
  name: "Mind Plague",
  description: "Infect the minds of all enemies in a 25ft radius, dealing 8d8 wyrd damage. Enemies take +2d8 wyrd damage per active affliction stage on them. Targets failing a Spirit save are confused for 2 rounds. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Psychic/Mind Control",
  level: 7,
  specialization: "torment-weaver",
  typeConfig: {
  school: "wyrd",
  icon: "Psychic/Mind Control",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["wyrd", "aoe", "control", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 50,
  aoeType: "sphere",
  aoeSize: 25,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 27 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 5 }
  },
  damageConfig: {
  formula: "8d8 + (affliction stages � 2d8)",
  elementType: "wyrd",
  damageTypes: ["wyrd"],
  resolution: "DICE",
  savingThrow: {
   ability: "spirit",
   difficultyClass: 18,
   saveOutcome: "half_damage"
  }
  },
  controlConfig: {
  controlType: "mind_control",
  effects: [
   { id : "confused_mind",
   name: "Confused Mind",
   description: "Psychic rot induces severe disorientation, leading targets to attack allies or drop weapons."
   }
  ],
  savingThrow: {
   ability: "spirit",
   difficultyClass: 18,
   saveOutcome: "negates"
  },
  durationValue: 2,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: Projects extreme psychic instability, reducing the caster's Spirit by 4 for 2 rounds."
  },
  cultivation: {
   category: "Torment",
   advancesStage: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
  tags: ["damage", "wyrd", "control", "torment", "plaguebringer"],
  flavorText: "The mind rots first. The body follows in trembling convulsions."
 },

 // ===== LEVEL 8 SPELLS =====
 { id: "pb_plague_incarnate",
  effectTypes: ["transformation"],
  name: "Plague Incarnate",
  description: "Become a living vessel of disease and decay for 5 rounds. Your weapon attacks apply random Stage 0 Seeds. Enemies starting their turn within 15ft must make a Constitution save (DC 16) or contract a Seed. Cultivates as Torment.",
  spellType: "ACTION",
  icon: "Poison/Poison Plague",
  level: 8,
  specialization: "torment-weaver",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Plague",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["transformation", "buff", "ultimate", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 32 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 25 }
  },
  transformationConfig: {
  transformationType: "elemental",
  targetType: "self",
  duration: 5,
  durationUnit: "rounds",
  power: "major",
  newForm: "Plague Incarnate",
  description: "Your form dissolves into a heavy, green-black fog, and insects hover inside your hollow chest cavity.",
  grantedAbilities: [
   { id : "plague_stats",
   name: "Plague Form",
   description: "+5 Intelligence and +5 Constitution."
   },
   { id : "plague_touch",
   name: "Plague Touch",
   description: "Weapon attacks apply a random Stage 0 Seed."
   },
   { id : "contagion_aura",
   name: "Contagion Aura",
   description: "Enemies within 15ft save (DC 16 Con) or contract Seed."
   }
  ]
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Virulence Toll: The transformation drains the caster's reserves, costing 12 Virulence for the duration."
  },
  cultivation: {
   category: "Torment"
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
  tags: ["transformation", "buff", "ultimate", "torment", "plaguebringer"],
  flavorText: "You are no longer merely a gardener tending the garden. You ARE the rot."
 },
 { id: "pb_epidemic",
  effectTypes: ["damage"],
  name: "Epidemic",
  description: "Start an epidemic chain. Deals 8d6 blight damage to a primary target, then chains to up to 8 enemies within 20ft, dealing +2d6 damage per active affliction already on each chain target. Cultivates as a Fester category spell.",
  spellType: "ACTION",
  icon: "Poison/Poison Contagion",
  level: 8,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Contagion",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "contagion", "aoe", "fester", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 50,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 2,
  resourceTypes: ["mana"],
  resourceValues: { mana: 30 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 5 }
  },
  damageConfig: {
  formula: "8d6 + (active afflictions � 2d6)",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 17,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Operational Friction: Unleashing the biological chains drains the caster, dealing 10 blight damage."
  },
  cultivation: {
   category: "Fester",
   advancesStage: true,
   chainMechanic: {
   enabled: true,
   maxTargets: 8,
   chainRange: 20
   }
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
  tags: ["damage", "contagion", "aoe", "fester", "plaguebringer"],
  flavorText: "One cough. Eight graves. The garden propagates."
 },

 // ===== LEVEL 9 SPELLS =====
 { id: "pb_black_death",
  effectTypes: ["damage"],
  name: "Black Death",
  description: "The ultimate plague. Targets below 30% HP with an active Stage 2+ affliction die instantly. Other targets with active afflictions take 12d10 blight damage. Cultivates as a Torment category spell.",
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Death",
  level: 9,
  specialization: "torment-weaver",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Necrotic Death",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "execute", "ultimate", "torment", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  aoeType: "sphere",
  aoeSize: 50,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 3,
  resourceTypes: ["mana"],
  resourceValues: { mana: 36 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 10 }
  },
  damageConfig: {
  formula: "12d10 (or instant kill)",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 20,
   saveOutcome: "half_damage"
  }
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Flesh: The dark execute demands the caster's lifeblood, dealing 15 blight damage and imposing 1 level of exhaustion."
  },
  cultivation: {
   category: "Torment",
   executeThreshold: 30,
   requiredStage: 2
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
  tags: ["damage", "execute", "ultimate", "torment", "plaguebringer"],
  flavorText: "The Black Death does not negotiate. It does not hesitate. It simply is the end of the garden."
 },
 { id: "pb_necrotic_eruption",
  effectTypes: ["damage"],
  name: "Necrotic Eruption",
  description: "Consume all active afflictions across all targets (max 8). Each consumed affliction explodes in a 30ft radius, dealing 4d8 blight damage (Stage 3 afflictions deal 6d8 instead). Cultivates as Decay.",
  spellType: "ACTION",
  icon: "Necrotic/Necrotic Death",
  level: 9,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Necrotic/Necrotic Death",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "aoe", "harvest", "decay", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  aoeType: "sphere",
  aoeSize: 60,
  targetRestrictions: ["enemies"]
  },
  durationConfig: {
  durationType: "instant",
  durationValue: 0,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 3,
  resourceTypes: ["mana"],
  resourceValues: { mana: 34 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  },
  damageConfig: {
  formula: "Consumed Afflictions � 4d8 necrotic (max 8)",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "AUTOMATIC"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Toll of Flesh: The nuclear option causes severe cellular shock, generating Virulence."
  },
  cultivation: {
   category: "Decay",
   harvestsAll: true
  }
  },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
  tags: ["damage", "aoe", "harvest", "decay", "plaguebringer"],
  flavorText: "Every garden must eventually end. This one ends in fire and rotting blood."
 },

 // ===== LEVEL 10 SPELLS =====
 { id: "pb_plague_god",
  effectTypes: ["transformation"],
  name: "Plague God",
  description: "Ascend to become the Plague God for 4 rounds. Your attributes surge (+8 Intelligence, +8 Constitution, +6 Spirit), all active afflictions deal +50% damage, your weapon attacks apply random Stage 2 afflictions, and your Virulence locks at 100. Cultivates as Decay.",
  spellType: "ACTION",
  icon: "Poison/Poison Contagion",
  level: 10,
  specialization: "decay-harbinger",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Contagion",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["transformation", "buff", "ultimate", "god_form", "decay", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "self",
  rangeType: "self"
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 3,
  resourceTypes: ["mana"],
  resourceValues: { mana: 40 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 25 }
  },
  transformationConfig: {
  transformationType: "elemental",
  targetType: "self",
  duration: 4,
  durationUnit: "rounds",
  power: "major",
  newForm: "Plague Lord",
  description: "You grow to double your height, your body emanates a cloud of flies and decay-essence, and your eyes shine like dead stars.",
  grantedAbilities: [
   { id : "lord_stats",
   name: "Pestilence Enhancement",
   description: "+8 Intelligence, +8 Constitution, and +6 Spirit."
   },
   { id : "divine_plague",
    name: "Sol's Breath Plague",
   description: "All active afflictions deal +50% damage."
   },
   { id : "death_touch",
   name: "Death Touch",
   description: "Weapon attacks apply a random Stage 2 affliction."
   },
   { id : "virulence_lock",
   name: "Virulence Lock",
   description: "Virulence is locked at 100 for the duration."
   }
  ]
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Tragic Finale: When the transformation ends, the caster's body collapses, taking 3d10 blight damage and gaining 2 levels of exhaustion."
  },
  cultivation: {
   category: "Decay"
  }
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  tags: ["transformation", "ultimate", "god_form", "decay", "plaguebringer"],
  flavorText: "Mortal gardeners tend their plots. You tend the entire world, and the harvest is ripe."
 },
 { id: "pb_ultimate_affliction",
  effectTypes: ["damage", "debuff"],
  name: "Ultimate Affliction",
  description: "Apply the ultimate plague, dealing 15d10 blight damage immediately and 5d10 blight damage per round for 6 rounds. Reduces target's healing received by 50% and all attributes by 4. Requires 5+ active afflictions on the field to cast. Cultivates as Amplify.",
  spellType: "ACTION",
  icon: "Poison/Poison Plague",
  level: 10,
  specialization: "virulent-spreader",
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Plague",
  castTime: 1,
  castTimeType: "IMMEDIATE",
  tags: ["blight", "debuff", "ultimate", "amplify", "plaguebringer"]
  },
  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 60,
  targetRestrictions: ["enemies"],
  maxTargets: 1,
  requiresLineOfSight: true
  },
  durationConfig: {
  durationType: "rounds",
  durationValue: 6,
  durationUnit: "rounds"
  },
  resourceCost: {
  actionPoints: 3,
  resourceTypes: ["mana"],
  resourceValues: { mana: 36 },
  components: ["verbal", "somatic"],
   verbalText: "Plaguebringer!",
   somaticText: "Channel plaguebringer through gesture",
  classResource: { type: "virulence", gain: 25 }
  },
  damageConfig: {
  formula: "15d10",
  elementType: "blight",
  damageTypes: ["blight"],
  resolution: "DICE",
  hasDotEffect: true,
  dotConfig: {
   dotFormula: "5d10",
   duration: 6,
   tickFrequency: "round",
   isProgressiveDot: false
  },
  savingThrow: {
   ability: "constitution",
   difficultyClass: 22,
   saveOutcome: "half_damage"
  }
  },
  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "ultimate_decay",
   name: "Ultimate Decay",
   description: "Healing received reduced by 50% and all attributes reduced by 4."
   }
  ],
  statPenalties: [
   { stat: "all_stats", magnitude: -4, magnitudeType: "flat" }
  ],
  savingThrow: {
   ability: "constitution",
   difficultyClass: 22,
   saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 6,
  durationUnit: "rounds"
  },
  specialMechanics: {
  agonyToll: {
   enabled: true,
   description: "Virulence Toll: The ritual consumes 15 Virulence and leaves the caster weakened until a Greater Restoration."
  },
  cultivation: {
   category: "Amplify",
   requiresAfflictions: {
   enabled: true,
   minimumAfflictions: 5
   }
  }
  },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  tags: ["damage", "debuff", "ultimate", "amplify", "plaguebringer"],
  flavorText: "All five categories of biological ruin. One affliction. Total and absolute decay."
 },

 // ===== PASSIVE SPELLS =====
 { id: "plague_incubation_period",
  name: "Incubation Period",
  description: "All diseases have a 1-round delay before dealing damage or applying debuffs. Enemies can seek cures or kill you before the plague takes hold.",
  level: 1,
  spellType: "PASSIVE",
  icon: "Poison/Poison Blight",
  effectTypes: ["passive"],
  typeConfig: {
  school: "blight",
  icon: "Poison/Poison Blight",
  tags: ["passive", "restriction", "delayed_effect", "disease", "plaguebringer"],
  castTime: 0,
  castTimeType: "PASSIVE"
  },
  targetingConfig: {
  targetingType: "self"
  },
  resourceCost: {
  resourceTypes: [],
  resourceValues: {},
  actionPoints: 0
  },
  resolution: "AUTOMATIC",
  tags: ["passive", "restriction", "delayed_effect", "disease", "plaguebringer"]
 },
 { id: "plague_sterile_environment",
  name: "Sterile Environment",
  description: "In cleansed areas (primal magic, healing, alchemical purification), diseases are suppressed. Cannot apply new diseases; existing ones stop dealing damage. Purity is your weakness.",
  level: 3,
  spellType: "PASSIVE",
  icon: "Healing/Cure Within",
  effectTypes: ["passive"],
  typeConfig: {
  school: "blight",
  icon: "Healing/Cure Within",
  tags: ["passive", "weakness", "holy_vulnerability", "suppression", "plaguebringer"],
  castTime: 0,
  castTimeType: "PASSIVE"
  },
  targetingConfig: {
  targetingType: "self"
  },
  resourceCost: {
  resourceTypes: [],
  resourceValues: {},
  actionPoints: 0
  },
  resolution: "AUTOMATIC",
  tags: ["passive", "weakness", "holy_vulnerability", "suppression", "plaguebringer"]
 },

  {
  "id": "virulent-lavender_mask",
  "name": "Lavender Mask",
  "description": "Exhale a thick, heavy cloud of purple mist. While it appears toxic, it is completely harmless and fills the room with the sweet smell of lavender, completely blocking all tracking scents and scent-based tracking.",
  "level": 1,
  "spellType": "ACTION",
  "icon": "Necrotic/Miasma",
  "typeConfig": {
   "school": "blight",
   "icon": "Necrotic/Miasma",
   "tags": [
   "utility",
   "roleplay",
   "plaguebringer"
   ],
   "castTime": 1,
   "castTimeType": "IMMEDIATE"
  },
  "targetingConfig": {
   "targetingType": "area",
   "rangeType": "self_centered",
   "aoeShape": "circle",
   "aoeParameters": {
   "radius": 20
   }
  },
  "resourceCost": {
   "actionPoints": 1,
   "resourceTypes": [
   "mana"
   ],
   "resourceValues": {
   "mana": 3
   },
   "components": [
   "somatic"
   ],
   "somaticText": "Blow a long, slow breath through a copper pipe or closed fingers, a purple spark igniting"
  },
  "resolution": "NONE",
  "effectTypes": [
   "utility"
  ],
  "utilityConfig": {
   "utilityType": "environment",
   "selectedEffects": [
   {
    "id": "lavender_mask_scent_block",
    "name": "Scent Siphon",
    "description": "A 20-foot cloud blocks all scent-based tracking, scent perception, and covers the area in the scent of lavender for 10 minutes."
   }
   ],
   "duration": 10,
   "durationUnit": "minutes",
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
    "plaguebringer"
   ]
  },
  // ===== NON-COMBAT / ROT & MYCELIUM UTILITY (the gardener of decay, out of combat) =====
  { id : "pb_rot_touch",
    name: "Rot-Touch",
    description: "Lay a hand on dead organic matter  -  a rope, a leather hinge, a wooden door, a plank, a corpse  -  and accelerate its decay a thousandfold. Rope crumbles, leather splits, softwood fails, and a corpse rots to clean bone and sludge in minutes (disposing of evidence). Living tissue and treated/magical materials resist. Out of combat.",
    level: 1, spellType: "ACTION", icon: "Necrotic/Necrotic Wither",
    typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","infiltration","plaguebringer"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 4 }, components: ["somatic"], somaticText: "Press your palm to the matter and exhale the rot forward" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "demolition", selectedEffects: [ { id: "rot_touch_decay", name: "Accelerated Decay", description: "Rot one dead organic object to failure (rope crumbles, leather/softwood fails) or reduce a corpse to bone and sludge in minutes. Living tissue, cured/treated, and magical materials resist.", "mechanicsText": "Rot one dead organic object to failure; speed-decay a corpse." } ], power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","exploration","infiltration","plaguebringer"]
  },
  { id : "pb_mycelium_sense",
    name: "Mycelium-Web Sense",
    description: "Press bare skin to bare earth or root and listen through the Ghost-Mycelium. For the duration you feel every creature that treads on connected ground within range  -  footsteps, weight, direction, and the sharp sting of the Wyrd-touched. Stone, deep water, and dead/warded earth break the web. Out of combat.",
    level: 1, spellType: "ACTION", icon: "Nature/Nature Natural 11",
    typeConfig: { school: "blight", icon: "Nature/Nature Natural 11", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","detection","exploration","investigation","plaguebringer"] },
    targetingConfig: { targetingType: "self", rangeType: "self" },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 4 }, components: ["somatic"], somaticText: "Press palm and forehead to the earth and breathe with the rot" },
    resolution: "NONE", effectTypes: ["utility"],
    utilityConfig: { utilityType: "perception", selectedEffects: [ { id: "mycelium_sense_tremor", name: "Fungal Tremorsense", description: "For 10 minutes, sense creatures moving on connected earth/root within 120 ft  -  weight, direction, count, and whether Wyrd-touched. Stone, deep water, dead earth, and warded ground break the web.", "mechanicsText": "Fungal tremorsense on connected ground, 120 ft, 10 min." } ], duration: 10, durationUnit: "minutes", power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","detection","exploration","investigation","plaguebringer"]
  },
  { id : "pb_plague_reader",
    name: "Plague-Reader",
    description: "Taste a drop of blood, breath, or sweat, or run a fingertip over a substance, and read the disease, poison, or affliction written there  -  what it is, its cause, how far it has progressed, and whether it is contagious. Your body already hosts every illness you understand; you recognize them by sympathy. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Psychic/Focused Mind",
    typeConfig: { school: "blight", icon: "Psychic/Focused Mind", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","divination","investigation","plaguebringer"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 5 }, components: ["somatic"], somaticText: "Touch the sample to tongue or skin and let your substrate answer" },
    resolution: "NONE", effectTypes: ["utility"],
    utilityConfig: { utilityType: "divination", selectedEffects: [ { id: "plague_reader_diagnose", name: "Diagnosis", description: "Identify any disease/poison/affliction in a creature or substance: type, cause, progression, and contagiousness. Magical or engineered plagues may read faintly or partially.", "mechanicsText": "Diagnose any disease/poison + cause/progression/contagion." } ], power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","divination","investigation","plaguebringer"]
  },
  { id : "pb_counter_culture",
    name: "Counter-Culture",
    description: "From your own living substrate, culture a counter-strain to a disease or poison you have diagnosed: an antidote, a neutralizing spore, or a break-fever. You host the counter-disease briefly to brew it, then deliver it to cure the afflicted. The plaguebringer as healer  -  by suffering the cure. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Healing/Golden Heart",
    typeConfig: { school: "blight", icon: "Healing/Golden Heart", castTime: 10, castTimeType: "MINUTES", tags: ["utility","exploration","investigation","plaguebringer"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0, targetRestrictions: ["any"] },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 8 }, components: ["verbal","somatic"], somaticText: "Breed the counter-strain in your own blood, then draw it forth" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "protection", selectedEffects: [ { id: "counter_culture_cure", name: "Cultured Antidote", description: "Neutralize one diagnosed disease or poison in a creature by culturing and delivering a counter-strain. You suffer a brief, mild bout of the counter-disease (disadvantage on one check within the next hour) as payment.", "mechanicsText": "Cure one diagnosed disease/poison; you suffer a brief counter-symptom." } ], power: "major" },
    cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
    tags: ["utility","exploration","investigation","plaguebringer"]
  },
  { id : "pb_cadaver_puppet",
    name: "Cadaver-Puppet",
    description: "Seed a fresh corpse with pestilence and heave it upright as a shambling, mindless servant for an hour. It obeys simple commands  -  carry, pull a lever, walk ahead to spring traps, block a doorway, or provide a grisly distraction. It cannot fight meaningfully and collapses when its rot runs dry. Out of combat.",
    level: 3, spellType: "ACTION", icon: "Necrotic/Death Mark",
    typeConfig: { school: "blight", icon: "Necrotic/Death Mark", castTime: 10, castTimeType: "MINUTES", tags: ["utility","exploration","infiltration","plaguebringer"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 10 }, classResource: { type: "virulence", cost: 15 }, components: ["verbal","somatic"], somaticText: "Exhale spores into the corpse's mouth and will it upright" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "summon", selectedEffects: [ { id: "cadaver_puppet_servant", "name": "Macabre Servant", "description": "Animate one fresh corpse as a shambling servant for 1 hour: carry, pull levers, spring traps ahead of the party, block a door, or distract. It cannot fight effectively and drops when the rot runs dry.", "mechanicsText": "One corpse-servant for 1 hour; labor/trap-spring/distraction only." } ], duration: 1, durationUnit: "hours", power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","exploration","infiltration","plaguebringer"]
  }
 ],


 // Spell Pools by Level
 spellPools: {
 1: [
  "pb_curse_of_agony",
  "pb_venomous_touch",
  "pb_whisper_of_decay",
  "plague_incubation_period",
  "virulent-lavender_mask",
  "pb_rot_touch",
  "pb_mycelium_sense"
 ],
 2: [
  "pb_fever_dream",
  "pb_mark_of_the_pestilent",
  "pb_enfeebling_fog",
  "pb_plague_reader",
  "pb_counter_culture"
 ],
 3: [
  "pb_drain_vitality",
  "pb_hallucinogenic_spores",
  "pb_agonizing_wail",
  "plague_sterile_environment",
  "pb_cadaver_puppet"
 ],
 4: [
  "pb_infectious_sores",
  "pb_plague_of_flies",
  "pb_necrotic_burst"
 ],
 5: [
  "pb_wither_touch",
  "pb_dark_rejuvenation",
  "pb_sufferings_echo"
 ],
 6: [
  "pb_pain_magnification",
  "pb_essence_corruption",
  "pb_affliction_mark"
 ],
 7: [
  "pb_plague_burst",
  "pb_mass_affliction",
  "pb_pandemic",
  "pb_decay_field",
  "pb_gardens_wrath",
  "pb_mind_plague"
 ],
 8: [
  "pb_plague_incarnate",
  "pb_epidemic"
 ],
 9: [
  "pb_black_death",
  "pb_necrotic_eruption"
 ],
 10: [
  "pb_plague_god",
  "pb_ultimate_affliction"
 ]
 }
};

export default PLAGUEBRINGER_DATA;
