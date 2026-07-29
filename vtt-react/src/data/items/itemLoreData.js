/**
 * Item Lore Data
 *
 * Maps every item ID to its lore connections — origin, flavor text,
 * and related lore term IDs. Items without entries inherit generic lore.
 *
 * This file is the single source of truth for item-world integration.
 * Add new entries here when creating new items.
 */

const ITEM_LORE = {

  // =======================================================================
  // ONE-HANDED SWORDS
  // =======================================================================
  ironweep: {
    origin: 'frostwood-reach',
    loreText: 'The Thalren militias arm their rank-and-file with these rust-blooded blades, forged from ironwood-bog ore that House Thalreth has mined since the Memory Wars.',
    relatedLore: ['frostwood-reach', 'house_thalreth', 'the-memory-wars']
  },
  'wanderers-edge': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan caravan-guards carry these unassuming blades across the starless steppe. Each scar is a toll paid on the Silt-Tide road, where a sword serves as tool, weapon, and barter.',
    relatedLore: ['sundrift-vale', 'house_ordavan', 'silt_tide']
  },
  soulthirst: {
    origin: 'bryngloom-forest',
    loreText: 'Neth shadow-crafters forge these essence-drinking daggers in the root-veil darkness beneath Atropolis. Each blade is quenched in ancestor-mound ichor, giving it an unnatural hunger.',
    relatedLore: ['bryngloom-forest', 'neth', 'root_veil']
  },

  // =======================================================================
  // TWO-HANDED WEAPONS
  // =======================================================================
  shattermourn: {
    origin: 'sundale',
    loreText: 'Solvan greatswords were once the pride of Sundale\'s cavalry. This broken relic was salvaged from the ash-fields after a skirmish between the Dawn Vigil and The Sunderer.',
    relatedLore: ['sundale', 'house_solvan', 'the_sunderers', 'dawn_vigil']
  },
  'grave-axe': {
    origin: 'nordhalla',
    loreText: 'Skalvyr burial rites demand that every warrior carry an axe into the afterlife. These rough-hewn blades are laid in ice-graves across Nordhalla\'s frozen fjords.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'frost_tithe']
  },
  cleaver: {
    origin: 'bryngloom-forest',
    loreText: 'Vreken cleavers are repurposed peat-cutting tools, their blades still stained with bog-iron. The Cult of Forgotten Shadow favours their crude, silent efficiency.',
    relatedLore: ['bryngloom-forest', 'vreken', 'cult_of_forgotten_shadow']
  },
  'battle-axe': {
    origin: 'cragjaw-peaks',
    loreText: 'The Groven forge battle-axes in geothermal vents beneath Frostmaw Holdfast, etching each blade with Ancestor-Spans — the calcified history of every Groven who wielded it.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild', 'the-first-thermal-war']
  },

  // =======================================================================
  // MACE & BLUNT
  // =======================================================================
  'iron-judgment': {
    origin: 'sundale',
    loreText: 'The Dawn Vigil uses these weighted maces during zealotry purges in the ashlands. Each swing carries the judgement of Sol — heavy, final, and without mercy.',
    relatedLore: ['sundale', 'dawn_vigil', 'sol']
  },
  'bone-hunger': {
    origin: 'nordhalla',
    loreText: 'Skald bone-carvers fashion clubs from the femurs of great beasts hunted across Nordhalla\'s ice-fields. The Corvani believe the animal\'s spirit lingers in the bone.',
    relatedLore: ['nordhalla', 'corvani', 'skald']
  },

  // =======================================================================
  // RANGED WEAPONS
  // =======================================================================
  'weeping-branch': {
    origin: 'bryngloom-forest',
    loreText: 'Bryngloom ironwood is notoriously difficult to shape, but Mimir rangers have mastered bows carved from its weeping branches. A single misfire means the bow snaps.',
    relatedLore: ['bryngloom-forest', 'mimir']
  },
  'hunters-whisper': {
    origin: 'frostwood-reach',
    loreText: 'The Mimir hunt-masters of Frostwood Reach craft shortbows from laminated ironwood sinew, their strings braided from gref stalker gut. Each bow is blessed before its first hunt.',
    relatedLore: ['frostwood-reach', 'mimir', 'gref']
  },

  // =======================================================================
  // STAFFS & MAGIC
  // =======================================================================
  'gnarled-sorrow': {
    origin: 'cragjaw-peaks',
    loreText: 'The Chronarch Conclave grows these focus-staves from living mountain-root, each knot capturing a splinter of frozen time. Fex-Vestara claims the finest staves span three generations.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara', 'silent_seventh']
  },
  'fractured-dream': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch Regent Bri-Vessela shattered her first focus-wand during the Silence-Heat Heresy. Fragments are still pulled from the fog-banks of Frostwood Reach, humming with unstable magic.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'the-silence-heat-heresy']
  },

  // =======================================================================
  // OFF-HAND WEAPONS
  // =======================================================================
  'parrying-blade': {
    origin: 'bryngloom-forest',
    loreText: 'Neth duelists train with parrying daggers from the age of ten, their blades blackened with root-veil tar to avoid glinting in the eternal twilight of Bryngloom.',
    relatedLore: ['bryngloom-forest', 'neth', 'root_veil']
  },
  'warding-dagger': {
    origin: 'frostwood-reach',
    loreText: 'Scribe-Sentinels carry warding daggers to defend their ledgers during the Great Revision. The blade is quicker than the quill, but both serve the Sovereign Ledger.',
    relatedLore: ['frostwood-reach', 'scribe_sentinels', 'the-great-revision', 'sovereign-ledger']
  },
  'small-buckler': {
    origin: 'iceheart-sea',
    loreText: 'Merryn deckhands fashion small bucklers from ship-timber and seashell resin. The Brine-Bond Syndicate taxes each shield as a seaworthy asset under their Luck-Ledger.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'iron-buckler': {
    origin: 'nordhalla',
    loreText: 'Skalvyr iron-shields bear the dents of a thousand border disputes with the Brine-Bond Syndicate\'s privateers. Each bash-groove is a treaty negotiation that failed.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'brine-bond-syndicate']
  },
  'tattered-tome': {
    origin: 'frostwood-reach',
    loreText: 'The Scribe-Cartel\'s monopoly on Soot-Resin Ink and Peat-Parchment makes even a tattered tome valuable in Frostwood Reach. Many contain fragments of the Sovereign Ledger.',
    relatedLore: ['frostwood-reach', 'scribe-cartel', 'sovereign-ledger']
  },
  'ancient-tome': {
    origin: 'iceheart-sea',
    loreText: 'Mer-Lyrisa\'s Tide-Choir preserves ancient musical scores in salt-cured leather tomes that resist the Iceheart Sea\'s corrosive spray. Knowledge is the only cargo that never sinks.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  'dim-orb': {
    origin: 'sundrift-vale',
    loreText: 'Astril stargazers once read celestial patterns in orbs like this, before Keth-Amar devoured the stars. Now they are dim relics of a sky that no longer speaks.',
    relatedLore: ['sundrift-vale', 'astril', 'keth_amar']
  },
  'glowing-orb': {
    origin: 'sundale',
    loreText: 'Pyrofiend acolytes cradle these heat-bleeding orbs, drawing fragments of Sol\'s dying ember. The glow is a debt — the more you draw, the closer the Deepening comes.',
    relatedLore: ['sundale', 'sols_breath', 'the_deepening']
  },
  'weathered-totem': {
    origin: 'sundrift-vale',
    loreText: 'Animist totems are carved from steppe-wood blessed by Sera Three-Scars herself. Each weathered piece holds a fragment of the Triune Founders\' convergence with wind spirits.',
    relatedLore: ['sundrift-vale', 'sera-three-scars', 'triune-founders']
  },
  'carved-totem': {
    origin: 'bryngloom-forest',
    loreText: 'Vreken spore-elders carve spirit-totems from ghost-mycelium stalks, each symbol a pact with the ancestor-mounds. These totems whisper in the silence between root-veils.',
    relatedLore: ['bryngloom-forest', 'vreken', 'nyssa', 'root_veil']
  },
  'crude-idol': {
    origin: 'sundale',
    loreText: 'The Risen carve crude effigies of Scathrach from Emberspire pumice. The faithful believe these idols hold a fragment of the Ashen Sovereign\'s vigil over Sol\'s prison.',
    relatedLore: ['sundale', 'scathrach', 'sol']
  },
  'sacred-idol': {
    origin: 'nordhalla',
    loreText: 'Harbinger Choir-Prime Malakor blessed these idols during the Doom Arithmetic revelations. Each is carved from ice that never melts, containing a number that predicts your end.',
    relatedLore: ['nordhalla', 'malakor', 'malakor-the-archivist']
  },

  // =======================================================================
  // INSTRUMENTS
  // =======================================================================
  'weathered-harp': {
    origin: 'iceheart-sea',
    loreText: 'Merryn harps are strung with ice-silk spun from Iceheart Sea kelp. The Brine-Bond Syndicate auctions mastercrafted harps as collateral on storm-risk ventures.',
    relatedLore: ['iceheart-sea', 'merryn', 'brine-bond-syndicate']
  },
  'travelers-lute': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan traveling musicians carry these lutes across the starless steppe, their songs keeping the old stories alive. When the stars died, music became the map.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'broken-flute': {
    origin: 'bryngloom-forest',
    loreText: 'Neth bone-carvers hollow gref femurs into flutes that produce a haunting, reedy tone. The Cult of Forgotten Shadow uses them to call spirits from the ancestor-mounds.',
    relatedLore: ['bryngloom-forest', 'neth', 'gref', 'cult_of_forgotten_shadow']
  },
  'war-drum': {
    origin: 'nordhalla',
    loreText: 'Skald war-drums are covered in stretched stel hide, beaten by Corvani drummers who set the rhythm for Nordhalla\'s shield-walls. The thunder of battle begins here.',
    relatedLore: ['nordhalla', 'skald', 'stel']
  },
  'hunters-horn': {
    origin: 'frostwood-reach',
    loreText: 'Silent-Master Sylas of the Apex First Hunters blows a gref-horn to rally the hunt across the mist-shrouded ironwood groves of Frostwood Reach.',
    relatedLore: ['frostwood-reach', 'sylas']
  },
  'weathered-violin': {
    origin: 'iceheart-sea',
    loreText: 'Mer-Lyrisa\'s Tide-Choir minstrels play salt-warped violins aboard Merrowport galleons, their melancholic melodies carrying across the Iceheart Sea\'s perpetual storms.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  'travelers-guitar': {
    origin: 'bryngloom-forest',
    loreText: 'Vreken travellers carve guitars from ironwood and braid strings from beast-sinew. In the twilight groves, music is the only light that never fades.',
    relatedLore: ['bryngloom-forest', 'vreken']
  },

  // =======================================================================
  // RAPIERS
  // =======================================================================
  'rusty-rapier': {
    origin: 'sundale',
    loreText: 'Dawn Vigil dueling masters train with blunted rapiers, but battlefield salvage yields many rusted originals — each telling the story of a cadet who failed the trials.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'duelists-thorn': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond privateers settle disputes with rapier duels on Merrowport docks, the winner claiming the loser\'s Luck-Ledger share. Every thrust is a fiscal policy.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },

  // =======================================================================
  // KATANAS
  // =======================================================================
  'chipped-katana': {
    origin: 'cragjaw-peaks',
    loreText: 'Warden Chain-Lords carry single-edged blades folded from veinrock ore. A chipped single-edged blade is a badge of honor — proof the wielder has survived the Knotted Decree.',
    relatedLore: ['cragjaw-peaks', 'alaric', 'house_tesshan']
  },
  'wandering-blade': {
    origin: 'sundrift-vale',
    loreText: 'False Prophet weavers carry these curved blades, their edge symbolizing the knife-edge between faith and delusion. Mor-Vereth carries one forged from a star fragment.',
    relatedLore: ['sundrift-vale', 'mor-vereth']
  },

  // =======================================================================
  // SABERS
  // =======================================================================
  'tarnished-saber': {
    origin: 'iceheart-sea',
    loreText: 'Grand Admiral Varis Mereval\'s Sea-Charter authorizes privateers to carry sabers in Iceheart Sea waters. A tarnished blade means a long voyage with no prize to polish it.',
    relatedLore: ['iceheart-sea', 'house_mereval']
  },
  'cavalry-saber': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan steppe-riders wield sabers from horseback, designed for slashing at full gallop. The Iron-Yurt Law requires every rider to carry one.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },

  // =======================================================================
  // SICKLES
  // =======================================================================
  'rusty-sickle': {
    origin: 'bryngloom-forest',
    loreText: 'Bryngloom peat-harvesters use sickles to cut ghost-moss from ancestor-mounds. Many were repurposed as weapons during the War of Thousand Screams.',
    relatedLore: ['bryngloom-forest', 'the-war-of-thousand-screams']
  },
  'harvesters-curse': {
    origin: 'sundale',
    loreText: 'The Risen harvest Solbrand ore with consecrated sickles, believing the metal remembers the star it was torn from. The curse is the brand of Sol\'s grief.',
    relatedLore: ['sundale', 'solbrand']
  },

  // =======================================================================
  // FLAILS
  // =======================================================================
  'broken-chain': {
    origin: 'cragjaw-peaks',
    loreText: 'The Warden\'s Chain-Lords wield weighted flails as symbols of the Knotted Decree. A broken chain is loaded with meaning — a law that failed, a prisoner escaped.',
    relatedLore: ['cragjaw-peaks', 'alaric', 'house_tesshan']
  },
  'iron-thresher': {
    origin: 'nordhalla',
    loreText: 'Augur Keeper Skadi Glass-Eye\'s ice-watch uses iron-threshers to break frozen barricades in the Frozen Archive. The same flail that smashes ice can shatter bone.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },

  // =======================================================================
  // FIST WEAPONS
  // =======================================================================
  'crude-claws': {
    origin: 'bryngloom-forest',
    loreText: 'Apex First Hunter Sylas teaches that crude claws are the first weapon a hunter learns. They extend the body\'s natural weapons with iron intent.',
    relatedLore: ['bryngloom-forest', 'sylas']
  },
  'iron-talons': {
    origin: 'frostwood-reach',
    loreText: 'Shaper Form-Matriarch Veyra designed these iron talons for close-quarters combat in the fog-banks, where blade length matters less than strike speed.',
    relatedLore: ['frostwood-reach', 'veyra']
  },

  // =======================================================================
  // CROSSBOWS
  // =======================================================================
  'cracked-crossbow': {
    origin: 'cragjaw-peaks',
    loreText: 'The Vat-Breakers\' Guild arms tunnel-patrols with crossbows that punch through chitin at fifty paces. A cracked stock means a misfire that probably saved your life.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'hunters-crossbow': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond Syndicate huntsmen use reinforced crossbows against sea-creatures breaching the Iceheart\'s surface. The payload often includes a Luck-Ledger tally slip.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },

  // =======================================================================
  // THROWN WEAPONS
  // =======================================================================
  'throwing-axe': {
    origin: 'nordhalla',
    loreText: 'Every Rime-Born child learns to throw an axe before reading wind patterns. Skalvyr axes are balanced so perfectly they always return — morally, if not physically.',
    relatedLore: ['nordhalla', 'rime_born', 'house_skalvyr']
  },
  'weathered-boomerang': {
    origin: 'sundrift-vale',
    loreText: 'Astril wanderers carve boomerangs from steppe-windwood, a tree that bends so far it nearly touches itself. The return arc is a meditation on the cyclical nature of exile.',
    relatedLore: ['sundrift-vale', 'astril', 'house_ordavan']
  },
  'chipped-chakram': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists\' Fexric guards throw chipped chakrams as warning shots. The ring of a chakram against tunnel stone is the sound of a border you should not cross.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  shuriken: {
    origin: 'frostwood-reach',
    loreText: 'Mimir shadow-runners carry star-shaped shuriken coated in memory-fog residue. A nick from one causes brief amnesia — the target forgets they were ever hit.',
    relatedLore: ['frostwood-reach', 'mimir', 'memory_fog_mechanics']
  },
  dart: {
    origin: 'bryngloom-forest',
    loreText: 'Toxicologist Venom-Master Varis perfected the delivery system for these blow-darts. A scratch from a Bryngloom reed-dart can fell a gref in seconds.',
    relatedLore: ['bryngloom-forest', 'varis']
  },

  // =======================================================================
  // BLOWGUNS
  // =======================================================================
  'crude-blowgun': {
    origin: 'bryngloom-forest',
    loreText: 'Vreken youths fashion blowguns from hollow reeds for hunting small game in the twilight canopy. A crude blowgun marks a hunter still learning patience.',
    relatedLore: ['bryngloom-forest', 'vreken']
  },
  'hunters-blowgun': {
    origin: 'bryngloom-forest',
    loreText: 'Plaguebringer Blight-Mother Vespera\'s acolytes use precision blowguns to deliver prion-laced darts. Silent weapon, patient payload, certain result.',
    relatedLore: ['bryngloom-forest', 'vespera']
  },

  // =======================================================================
  // SLINGS
  // =======================================================================
  'frayed-sling': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan herders use slings to direct livestock across the starless steppe. A frayed sling is a badge of long service under Khatun Bayarmaa\'s Iron-Yurt Law.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'shepherds-sling': {
    origin: 'cragjaw-peaks',
    loreText: 'Groven shepherds on Cragjaw\'s upper slopes use slings against cliff-stalkers. Their stones carry prayers etched in Thrumm dialect — a shepherd\'s blessing.',
    relatedLore: ['cragjaw-peaks', 'thrumm']
  },

  // =======================================================================
  // POLEARMS
  // =======================================================================
  'weathered-halberd': {
    origin: 'nordhalla',
    loreText: 'House Skalvyr\'s shield-wall rearguard favours halberds for their reach against ice-climber raids. A weathered halberd has held the line through a hundred Frost-Tithe collections.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'frost_tithe']
  },
  'polearm-of-burden': {
    origin: 'sundale',
    loreText: 'The Scoured carry these makeshift polearms on Monolith Shard hunts across all seven regions. The burden is knowing what the shards will reveal.',
    relatedLore: ['sundale', 'the_scoured']
  },
  'rusty-scythe': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant Threshold-Keeper Kor-Vasseth wields a scythe forged from an ancestor-mound gate. The rust is not corrosion — it is the stain of countless souls passing.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'reapers-tool': {
    origin: 'nordhalla',
    loreText: 'The Watcher in the Mist is depicted with a reaper\'s scythe in Morvane carvings from the Frozen Archive. These tools bridge the boundary between life and death.',
    relatedLore: ['nordhalla', 'the_watcher']
  },
  'splintered-lance': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan cavalry charges across the steppe with lances of windwood. A splintered lance means a successful impact — the rider simply needs another.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'knights-lance': {
    origin: 'sundale',
    loreText: 'Dawn Vigil sun-knights charge on ash-stallions with lances lacquered in solar gold. Vael Ardent-Sun\'s lance is rumoured to be a Sundered Monolith shard on a pole.',
    relatedLore: ['sundale', 'dawn_vigil', 'sundered_monoliths']
  },
  'broken-staff-blade': {
    origin: 'cragjaw-peaks',
    loreText: 'Chronarch time-stitchers mount blade-heads on focus-staves, merging melee and magic. A broken staff-blade is a timeline severed before it could unfold.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara']
  },
  'twin-blade': {
    origin: 'iceheart-sea',
    loreText: 'Gambit Harbor-Master Merr-Cael carries matched twin-blades from a single Merrowport anchor. Perfect balance — like probability itself, given edge and weight.',
    relatedLore: ['iceheart-sea', 'merr-cael']
  },
  'crude-maul': {
    origin: 'cragjaw-peaks',
    loreText: 'Thrumm forge-cults shape crude mauls from basalt, heated in magma-vents and quenched in Groven-ichor. Simple, heavy, and nearly indestructible.',
    relatedLore: ['cragjaw-peaks', 'thrumm']
  },
  'war-spear': {
    origin: 'nordhalla',
    loreText: 'Rime-Born war-spears are tipped with stel-bone, serrated to cause wounds that freeze from the inside. Halvar Skalvyr\'s personal spear is named Jarn-Tand.',
    relatedLore: ['nordhalla', 'rime_born', 'stel', 'halvar-skalvyr']
  },
  pike: {
    origin: 'sundale',
    loreText: 'The Scoured use long pikes to probe for Wyrd-corrupted ground before advancing. The length is for survival — touch the Wyrd with your foot and you are already lost.',
    relatedLore: ['sundale', 'the_scoured', 'wyrd']
  },
  glaive: {
    origin: 'sundrift-vale',
    loreText: 'False Prophet weavers wield glaives whose curved blades seem to move of their own accord. Mor-Vereth claims the glaive is a sceptre for truths too sharp to speak.',
    relatedLore: ['sundrift-vale', 'mor-vereth']
  },
  'executioners-axe': {
    origin: 'bryngloom-forest',
    loreText: 'Inquisitor Commander Vrael the 47th presides over sentences in Atropolis\'s sunken amphitheatre, his axe inscribed with every verdict he has delivered.',
    relatedLore: ['bryngloom-forest', 'vrael-forty-seventh']
  },
  'berserker-axe': {
    origin: 'nordhalla',
    loreText: 'Hark Ash-Hammer blesses these axes in Blood-Heat ceremonies. A berserker who carries one feels no pain, no fear — only the red arithmetic of slaughter.',
    relatedLore: ['nordhalla', 'hark-ash-hammer', 'blood_heat']
  },
  'battle-halberd': {
    origin: 'sundale',
    loreText: 'Spellguard Bulwark-Captain Thrak-Damos trains the Aegis in halberd formations that funnel Wyrd-corrupted creatures into kill-boxes at Emberspire\'s base.',
    relatedLore: ['sundale', 'thrak-damos']
  },
  'reapers-scythe': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant acolytes harvest soul-essence with these ritual scythes in the ancestor-mounds. Each swing cuts a thread connecting the living to the memory of the dead.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },

  // =======================================================================
  // ENCHANTED WEAPONS
  // =======================================================================
  flamebrand: {
    origin: 'sundale',
    loreText: 'Pyrofiend Last-Ember Sol-Vareths forged the first flamebrand from a shard of the Solbrand. It burns with the last heat of a dying star; every cut feeds the Deepening.',
    relatedLore: ['sundale', 'sol-vareths', 'solbrand', 'the_deepening']
  },
  frostbite: {
    origin: 'nordhalla',
    loreText: 'The Frozen Archive yielded this blade from a Silence-Heat Heresy martyr\'s tomb. Its edge is absolute zero — a temperature even the Wyrd cannot corrupt.',
    relatedLore: ['nordhalla', 'the-silence-heat-heresy', 'watcher_in_the_mist']
  },
  thunderstrike: {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists harnessed thermal vent discharge to forge this hammer. Each strike releases a charge that the Thrumm claim is the voice of the mountain itself.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists', 'thrumm']
  },
  venomstrike: {
    origin: 'bryngloom-forest',
    loreText: 'Varis the Trembling blended eighteen ghost-mycelium strains to coat this blade. A scratch triggers a cascade of biological betrayal.',
    relatedLore: ['bryngloom-forest', 'varis']
  },
  soulreaper: {
    origin: 'bryngloom-forest',
    loreText: 'Kor-Vasseth forged soulreaper in ancestor-mound fires, binding a thousand restless spirits to its edge. It does not cut flesh — it cuts the soul free.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  stormcaller: {
    origin: 'iceheart-sea',
    loreText: 'Mer-Lyrisa\'s Tide-Choir awakened this trident in the eye of an Iceheart cyclone. It channels the deep\'s fury into arcs that can split a longship in two.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  shadowblade: {
    origin: 'bryngloom-forest',
    loreText: 'The Cult of Forgotten Shadow quenched the first shadowblade in silence-essence from a living Neth oracle. The blade casts no shadow — it is made of shadow.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  bonecrusher: {
    origin: 'cragjaw-peaks',
    loreText: 'The Vat-Breakers\' Guild forged bonecrusher from the calcified remains of the first hundred Groven who shattered their vats. It carries the weight of liberation.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  windwhisper: {
    origin: 'sundrift-vale',
    loreText: 'Astril totem-singer Kael wove wind spirits into this spear\'s haft. It whispers the steppe\'s secrets — where prey runs, where the Wyrd pools.',
    relatedLore: ['sundrift-vale', 'kael']
  },
  'inferno-blade': {
    origin: 'sundale',
    loreText: 'The First Cabal of Pyrofiends forged this blade in Emberspire\'s heart, drawing on Sol\'s death-throes. Its heat cannot be extinguished by any natural means.',
    relatedLore: ['sundale', 'first-cabal', 'scathrach']
  },
  voidreaver: {
    origin: 'iceheart-sea',
    loreText: 'The Silent Seventh\'s deepest vaults beneath the Iceheart Sea yielded this weapon. Its edge is a tear in reality; wielders hear the whispers of Keth-Amar.',
    relatedLore: ['iceheart-sea', 'silent_seventh', 'keth_amar']
  },
  stormbreaker: {
    origin: 'cragjaw-peaks',
    loreText: 'Warden Chain-Lord Alaric broke this weapon across a prisoner\'s back, then reforged it with the chains that held them. It now breaks laws as easily as bone.',
    relatedLore: ['cragjaw-peaks', 'alaric']
  },
  icebreaker: {
    origin: 'nordhalla',
    loreText: 'Skadi Glass-Eye uses icebreaker to shatter vault-seals in the Frozen Archive. Each swing opens a doorway to a memory the Silence-Heat Heresy tried to erase.',
    relatedLore: ['nordhalla', 'skadi-glass-eye', 'the-silence-heat-heresy']
  },
  disarmor: {
    origin: 'sundale',
    loreText: 'Martyr Vigil-Mother Sol-Kaessen blessed this weapon during the False Dawn Riots. It dismantles armor, leaving the enemy bare before Sol\'s judgement.',
    relatedLore: ['sundale', 'sol-kaessen', 'the-false-dawn-riots']
  },
  venomfang: {
    origin: 'bryngloom-forest',
    loreText: 'Vespera cultivated this living weapon from a Neth predator\'s fang, grafted to a hilt of ghost-mycelium. It hungers, learns, and grows.',
    relatedLore: ['bryngloom-forest', 'vespera']
  },
  'dueling-rapier': {
    origin: 'sundale',
    loreText: 'Dawn Vigil dueling masters teach the art of the single thrust — one touch, one verdict. This rapier has passed through three graduates, each earning the right.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'honor-blade': {
    origin: 'frostwood-reach',
    loreText: 'Jarl-Archivist Kaelen Thalreth awards these to Scribe-Sentinels completing a century of service. The inscription: "Written in blood, sealed in honor."',
    relatedLore: ['frostwood-reach', 'kaelen-thalreth', 'scribe_sentinels']
  },
  'harvest-sickle': {
    origin: 'sundale',
    loreText: 'The Risen use harvest-sickles to collect Solbrand from Emberspire slopes. Each flake of fallen star is a prayer; each cut a sacrament in the twilight of the sun.',
    relatedLore: ['sundale', 'solbrand', 'the_risen']
  },
  'chain-flail': {
    origin: 'cragjaw-peaks',
    loreText: 'Warden jailers train with chain-flails that wrap, bind, and break in a single motion. The Knotted Decree is written in the language of chains.',
    relatedLore: ['cragjaw-peaks', 'alaric', 'house_tesshan']
  },
  'iron-fist': {
    origin: 'cragjaw-peaks',
    loreText: 'Shaper Form-Matriarch Veyra designed the iron-fist as a bridge between flesh and metal. Each knuckle houses a different Shaper discipline.',
    relatedLore: ['cragjaw-peaks', 'veyra']
  },
  'arcane-staff': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch Regent Bri-Vessela channels the Silent Seventh through staves of polished memory-glass. The staff does not store magic — it remembers it.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'silent_seventh']
  },
  'wand-of-flame': {
    origin: 'sundale',
    loreText: 'Pyrofiend initiates craft these wands from Emberspire obsidian. The flame is a fragment of Sol\'s dying will, leashed to mortal frame for a single purpose.',
    relatedLore: ['sundale', 'sol-vareths', 'sol']
  },
  'wand-of-frost': {
    origin: 'nordhalla',
    loreText: 'Augur ice-wands are carved from the Frozen Archive\'s eternal ice, attuned to deaths that have not yet happened. Frost is prophecy given physical form.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },
  'throwing-dagger': {
    origin: 'bryngloom-forest',
    loreText: 'Neth shadow-crafters balance these daggers to perfection. A Velun assassin can place one between your ribs from forty paces in complete darkness.',
    relatedLore: ['bryngloom-forest', 'neth', 'velun']
  },
  'poison-blowgun': {
    origin: 'bryngloom-forest',
    loreText: 'Varis the Trembling\'s Toxilogical Academy certifies these after a hundred live tests. The certification is a skull etched into the mouthpiece.',
    relatedLore: ['bryngloom-forest', 'varis']
  },
  'sling-stone': {
    origin: 'sundrift-vale',
    loreText: 'Astril sling-stones are river pebbles that have tumbled for centuries. A stone that has traveled so far knows exactly where to land.',
    relatedLore: ['sundrift-vale', 'astril']
  },

  // =======================================================================
  // ARMOR
  // =======================================================================
  'threadbare-sorrow': {
    origin: 'sundale',
    loreText: 'Worn by ash-walkers who tend the Solbrand, these robes are singed by a star\'s dying breath. The sorrow is not in the cloth — it is in what the cloth has witnessed.',
    relatedLore: ['sundale', 'solbrand']
  },
  'weathered-hide': {
    origin: 'frostwood-reach',
    loreText: 'Mimir trappers cure gref-hides with ironwood bark tannin, producing leather that hardens like plate when struck. Each hide tells a hunt in the memory-fog.',
    relatedLore: ['frostwood-reach', 'mimir', 'gref']
  },
  'rusted-sorrow': {
    origin: 'sundale',
    loreText: 'Dawn Vigil patrol armor corrodes quickly in Sundale\'s volcanic ash. A rusted chestplate is evidence of service in the deepest ash-fields.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'tattered-memories': {
    origin: 'frostwood-reach',
    loreText: 'The Memory Wars stripped many Thalren soldiers of their past. These leg-guards are all that remains of a uniform worn by a soldier who cannot recall his name.',
    relatedLore: ['frostwood-reach', 'the-memory-wars', 'house_thalreth']
  },
  'stiff-resolve': {
    origin: 'nordhalla',
    loreText: 'Rime-Born leather is stiffened with glacial ichor that hardens in cold and flexes in battle-warmth. Resolve is the cold, made wearable.',
    relatedLore: ['nordhalla', 'rime_born']
  },
  'chain-of-burden': {
    origin: 'cragjaw-peaks',
    loreText: 'Groven chain-legs are forged from recycled Ancestor-Span chains. Every link is a generation before, bound in tensile remembrance.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'sun-faded-cap': {
    origin: 'sundale',
    loreText: 'The Risen faithful wear caps bleached by Sol\'s dying light. The fading is a metaphor — once bright, now a memory of warmth.',
    relatedLore: ['sundale', 'the_risen', 'sol']
  },
  'muffled-thoughts': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch initiates wear padded headgear against the Silent Seventh\'s whispers. The muffling is survival against the fog\'s erosion of self.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'silent_seventh', 'memory_fog_mechanics']
  },
  'blinded-helm': {
    origin: 'cragjaw-peaks',
    loreText: 'Warden Chain-Lords wear full helms folded to withstand the heaviest blows. A blinded helm sees nothing but the law.',
    relatedLore: ['cragjaw-peaks', 'alaric', 'house_tesshan']
  },
  'open-palms': {
    origin: 'bryngloom-forest',
    loreText: 'Animist hand-wraps are left open for spirit-channeling. Nyssa\'s spore-elders weave ghost-mycelium into the fabric, bridging flesh and ancestor-mound.',
    relatedLore: ['bryngloom-forest', 'nyssa']
  },
  'stiffened-grip': {
    origin: 'cragjaw-peaks',
    loreText: 'Fexric leatherworkers treat gloves with thermal-vent resin, creating a grip that never slips. The stiffness is the price of certainty.',
    relatedLore: ['cragjaw-peaks', 'fexrick']
  },
  'iron-fetters': {
    origin: 'nordhalla',
    loreText: 'Skalvyr gauntlets have locking mechanisms for chaining prisoners. Each gauntlet has served as both armor and restraint.',
    relatedLore: ['nordhalla', 'house_skalvyr']
  },
  'worn-path': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan boots worn thin by endless steppe. A worn sole is a map of where you have been — Khatun Bayarmaa reads lives from boot-leather.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'travelers-tread': {
    origin: 'iceheart-sea',
    loreText: 'Merryn sea-boots are studded with barnacle-grip against Iceheart decks. The tread pattern is unique to each ship — a signature in salt and leather.',
    relatedLore: ['iceheart-sea', 'merryn']
  },
  'anchor-greaves': {
    origin: 'iceheart-sea',
    loreText: 'Mereval\'s marines wear greaves weighted with ship-ballast. The anchor keeps a sailor grounded when the Iceheart tries to claim them.',
    relatedLore: ['iceheart-sea', 'house_mereval']
  },
  'bare-wrists': {
    origin: 'sundrift-vale',
    loreText: 'False Prophet weavers bare their wrists as a sign of vulnerability — veins offered to truths they channel. Mor-Vereth bears scars from a thousand revelations.',
    relatedLore: ['sundrift-vale', 'mor-vereth']
  },
  'leather-bindings': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant bindings are wrapped in ancestor-mound silk, each layer a year of threshold service. Kor-Vasseth\'s bindings are three inches thick.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'chain-wraps': {
    origin: 'cragjaw-peaks',
    loreText: 'Vat-Breakers\' wrist-wraps incorporate chainmail from alchemical vat linings. The metal glows faintly in Frostmaw\'s dark tunnels.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'iron-vambraces': {
    origin: 'nordhalla',
    loreText: 'Each vambrace is etched with the owner\'s lineage — ancestors added as runes. A full set tells a family history going back twelve generations.',
    relatedLore: ['nordhalla', 'skald']
  },
  'tattered-pads': {
    origin: 'bryngloom-forest',
    loreText: 'Inquisitor patrols wear deliberately frayed shoulder pads, the loose threads snagging evidence. Vrael the 47th examines every thread personally.',
    relatedLore: ['bryngloom-forest', 'vrael-forty-seventh']
  },
  'weathered-pauldrons': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond captains wear pauldrons from drift-whale bone, each notch recording a successful voyage. The pauldron is a captain\'s log worn on the shoulders.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate', 'house_mereval']
  },
  'chain-spaulders': {
    origin: 'nordhalla',
    loreText: 'Skald voice-casters wear these spaulders, each ring a word shouted across the frozen waste and heard. They relay orders across Nordhalla\'s ice-fields.',
    relatedLore: ['nordhalla', 'skald']
  },
  'iron-pauldrons': {
    origin: 'sundale',
    loreText: 'Dawn Vigil sun-knights wear iron pauldrons shaped like solar flares. Vael Ardent-Sun\'s are said to still be warm from the touch of Sol.',
    relatedLore: ['sundale', 'dawn_vigil', 'sol']
  },
  'frayed-cord': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan nomads tie belongings with cord ritually cut each spring. The fraying represents the temporary nature of possessions under Iron-Yurt Law.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'travelers-belt': {
    origin: 'iceheart-sea',
    loreText: 'Merrowport belts have pouches for Luck-Ledger tallies and rations. A traveller\'s belt is the difference between a successful voyage and becoming Iceheart chum.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'chain-girdle': {
    origin: 'cragjaw-peaks',
    loreText: 'Groven forge-masters wear chain girdles supporting their backs at the anvil. Each link is a prayer to the mountain that provides their ore.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'iron-girdle': {
    origin: 'sundale',
    loreText: 'Solbrand miners wear heavy girdles anchoring them against Emberspire\'s tremors. The weight is Sol\'s death throes beneath their feet.',
    relatedLore: ['sundale', 'solbrand', 'scathrach']
  },
  'threadbare-undershirt': {
    origin: 'bryngloom-forest',
    loreText: 'Neth commoners wear threadbare shirts beneath outer garments — a symbol that all are equal under the root-veil. The Silent Seventh sees no rank through the weave.',
    relatedLore: ['bryngloom-forest', 'neth', 'silent_seventh']
  },
  'simple-tunic': {
    origin: 'frostwood-reach',
    loreText: 'Mimir clothiers weave tunics from ironwood-fiber that breathes in the fog and tightens in the cold. Form follows function in Frostwood fashion.',
    relatedLore: ['frostwood-reach', 'mimir']
  },
  'comfortable-undershirt': {
    origin: 'nordhalla',
    loreText: 'Corvani under-layers are lined with seal-fur, the only comfort against Nordhalla\'s killing cold. Warmth is a luxury between life and frost-death.',
    relatedLore: ['nordhalla', 'corvani']
  },
  'plain-tabard': {
    origin: 'sundale',
    loreText: 'The Risen issue blank tabards to initiates. The first mark is added after their first pilgrimage to the Solbrand.',
    relatedLore: ['sundale', 'the_risen']
  },
  'guild-tabard': {
    origin: 'cragjaw-peaks',
    loreText: 'Each Groven guild bears a distinct tabard. The Vat-Breakers\' is charcoal grey with a shattered vial in white — the moment they won their freedom.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'faction-tabard': {
    origin: 'sundale',
    loreText: 'Dawn Vigil tabards are solar gold with an eclipse motif. Only High Command knows whether it represents Keth-Amar or Sol\'s final mercy.',
    relatedLore: ['sundale', 'dawn_vigil', 'keth_amar']
  },
  'shattered-ward': {
    origin: 'sundale',
    loreText: 'The Scoured carry shattered shields as badges of their mission. Each crack is a monolith fragment neutralized — or lost.',
    relatedLore: ['sundale', 'the_scoured', 'sundered_monoliths']
  },
  'oaken-bulwark': {
    origin: 'bryngloom-forest',
    loreText: 'Neth shield-wardens carry bulwarks grown from living ironwood, roots still connected to Bryngloom soil. The shield heals itself when returned to the grove.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'iron-bastion': {
    origin: 'nordhalla',
    loreText: 'Skalvyr shield-bearers interlock iron bastions into a wall never breached. Each bears the name of a soldier who held the line and did not retreat.',
    relatedLore: ['nordhalla', 'house_skalvyr']
  },
  flameguard: {
    origin: 'sundale',
    loreText: 'Pyrofiend flameguard robes are woven from Emberspire asbestos-fiber. The cost of wielding Sol\'s fire is carrying its heat forever.',
    relatedLore: ['sundale', 'sol-vareths', 'scathrach']
  },
  shadowweave: {
    origin: 'bryngloom-forest',
    loreText: 'Cult shadowweavers spin fabric from ghost-mycelium filaments harvested in absolute darkness. It is colder than air and moves like liquid night.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  thunderplate: {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists forged thunderplate from lightning-struck ore during the First Thermal War. The metal remembers the strike and discharges on impact.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists', 'the-first-thermal-war']
  },
  soulward: {
    origin: 'bryngloom-forest',
    loreText: 'Revenant threshold-keepers weave soulward from the unspent years of the dead. Each thread is a life unlived, given purpose as protection.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  stormweaver: {
    origin: 'iceheart-sea',
    loreText: 'Mer-Lyrisa\'s Tide-Choir stitch lightning-harvested thread into cloaks that crackle with static. A stormweaver\'s garment is a weather system given form.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  'dragon-scale': {
    origin: 'cragjaw-peaks',
    loreText: 'Thrumm forge-cults claim their ancestors rode creatures whose scales deflected falling stars. Wyrm-Scale armor is a reconstruction of that lost art.',
    relatedLore: ['cragjaw-peaks', 'thrumm']
  },
  voidweave: {
    origin: 'iceheart-sea',
    loreText: 'The Silent Seventh\'s voidweave is stitched from fabric existing in two places simultaneously. The wearer is never entirely where they appear.',
    relatedLore: ['iceheart-sea', 'silent_seventh']
  },
  'warded-plate': {
    origin: 'sundale',
    loreText: 'Thrak-Damos commissioned warded plate etched with a thousand counter-spell runes. Each has blocked a curse that would have killed its wearer.',
    relatedLore: ['sundale', 'thrak-damos']
  },
  'mindguard-robe': {
    origin: 'frostwood-reach',
    loreText: 'Bri-Vessela\'s mindguard robe is lined with memory-fog resistant ironwood bark. It does not protect the body — it protects the mind from erosion of self.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'memory_fog_mechanics']
  },

  // =======================================================================
  // ACCESSORIES
  // =======================================================================
  'the-burden': {
    origin: 'sundale',
    loreText: 'A ring forged from chains that bound the First Martyr Sera Solvan to Emberspire stakes. Her sacrifice is carried by all who wear it — faith made manifest.',
    relatedLore: ['sundale', 'sera']
  },
  'endurance-iron': {
    origin: 'cragjaw-peaks',
    loreText: 'Groven endurance rings are forged from the first chain that held the vats. They grant strength through suffering — freedom earned, not given.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'madness-whisper': {
    origin: 'bryngloom-forest',
    loreText: 'Cult rings infused with silence-essence that whispers the thoughts of the dead. The madness is realizing the dead are listening back.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'hollow-promise': {
    origin: 'sundrift-vale',
    loreText: 'False Prophet weavers give these rings to converts as a faith test. There is no enchantment — the power comes entirely from the wearer\'s belief.',
    relatedLore: ['sundrift-vale', 'mor-vereth']
  },
  'blood-pact': {
    origin: 'nordhalla',
    loreText: 'Hark Ash-Hammer approves blood-pact rings for berserkers past the Blood-Heat trial. The ring shares pain between two bonded warriors.',
    relatedLore: ['nordhalla', 'hark-ash-hammer', 'blood_heat']
  },
  'pain-remembrance': {
    origin: 'nordhalla',
    loreText: 'Augur death-vision foci. Each facet contains a death the wearer foresaw and failed to prevent.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },
  'whisper-chain': {
    origin: 'bryngloom-forest',
    loreText: 'Vreken spirit-speaker necklaces that vibrate near ancestor-mound activity. One end in the living world, the other in the silence.',
    relatedLore: ['bryngloom-forest', 'vreken', 'nyssa']
  },
  'silent-focus': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch medallions polished to a mirror sheen, reflecting fog from the wearer\'s thoughts. The Silent Seventh cannot touch a focused mind.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'silent_seventh']
  },
  'weight-of-sorrow': {
    origin: 'sundale',
    loreText: 'The Scoured carry these as penance for monoliths they failed to destroy. Each gram is a fragment of the world\'s doom that remains unsealed.',
    relatedLore: ['sundale', 'the_scoured', 'sundered_monoliths']
  },
  'corrupted-totem': {
    origin: 'bryngloom-forest',
    loreText: 'Cult totems corrupted by Wyrd-touch, each one a spiritual contagion spreading the ancestor-mounds\' silence.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow', 'wyrd']
  },
  'bone-memory': {
    origin: 'nordhalla',
    loreText: 'Skald charms carved from ancestor finger-bones, each knot a recollection preserved from the Silence-Heat Heresy purges.',
    relatedLore: ['nordhalla', 'skald', 'the-silence-heat-heresy']
  },
  'fading-remembrance': {
    origin: 'frostwood-reach',
    loreText: 'Scribe-Cartel mnemonic charms that help Sentinels remember through the fog. But the charm fades — and so does the memory it protects.',
    relatedLore: ['frostwood-reach', 'scribe-cartel', 'scribe_sentinels', 'memory_fog_mechanics']
  },
  'anchor-stone': {
    origin: 'iceheart-sea',
    loreText: 'Merryn sailors carry anchor-stones as ballast against siren currents. The stone is a promise to return — even when the deep calls your name.',
    relatedLore: ['iceheart-sea', 'merryn', 'brine-bond-syndicate']
  },
  'shattered-reflection': {
    origin: 'cragjaw-peaks',
    loreText: 'Chronarch mirror-fragments showing alternate timelines. Fex-Vestara reads them for futures with the least Wyrd-corruption.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara']
  },
  'brute-fetish': {
    origin: 'nordhalla',
    loreText: 'Rime-Born hunters string beast-teeth into fetishes granting the strength of animals they were taken from. Each tooth is a pact with a predator\'s ghost.',
    relatedLore: ['nordhalla', 'rime_born']
  },
  'flameheart-ring': {
    origin: 'sundale',
    loreText: 'Sol-Vareths forged the first from a drop of his Blood-Heat. It burns eternally — a pilot light for the inferno within.',
    relatedLore: ['sundale', 'sol-vareths', 'blood_heat']
  },
  'frostbite-amulet': {
    origin: 'nordhalla',
    loreText: 'Augur ice-amulets contain the Frozen Archive\'s eternal cold. Skadi uses them to preserve visions that would melt into forgetfulness.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },
  'thunderclap-trinket': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists bottled the First Thermal War\'s largest explosion. Shaken, it releases a thunderclap echoing freedom\'s fury.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists', 'the-first-thermal-war']
  },
  'soulbound-ring': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant rings tying a living wearer to an ancestor-mound. The dead share knowledge; the living share their remaining years.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'stormcaller-pendant': {
    origin: 'iceheart-sea',
    loreText: 'Tide-Choir pendants attuned to Iceheart weather. The wearer feels storms in their bones before clouds appear.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  'silence-totem': {
    origin: 'bryngloom-forest',
    loreText: 'Inquisitor totems that suppress the Wyrd in a small radius. Vrael the 47th carries one for interrogations free of supernatural interference.',
    relatedLore: ['bryngloom-forest', 'vrael-forty-seventh', 'wyrd']
  },
  'phoenix-heart-ring': {
    origin: 'sundale',
    loreText: 'The Risen believe these contain a spark of Sol\'s original fire — before Keth-Amar began feeding. Hope, set in gold and worn on a finger.',
    relatedLore: ['sundale', 'the_risen', 'sol', 'keth_amar']
  },
  'stormlord-amulet': {
    origin: 'iceheart-sea',
    loreText: 'Mereval awards these to captains who survived the Iceheart\'s worst tempest. Each contains a piece of the storm that tried to kill them.',
    relatedLore: ['iceheart-sea', 'house_mereval']
  },
  'soul-harvester': {
    origin: 'bryngloom-forest',
    loreText: 'Vespera cultivates these from parasitic ghost-mycelium that feeds on life essence. The trinket is alive, and it is always hungry.',
    relatedLore: ['bryngloom-forest', 'vespera']
  },
  'tattered-cloak': {
    origin: 'sundrift-vale',
    loreText: 'Astril wind-walker cloaks that catch the steppe winds, frayed edges forming patterns predicting coming storms.',
    relatedLore: ['sundrift-vale', 'astril']
  },
  'travelers-cloak': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond cloaks waxed with sea-creature oil, shedding rain and brine. The only home a sailor has between ports.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'shadow-cloak': {
    origin: 'bryngloom-forest',
    loreText: 'Cult agent cloaks woven from Vreken ghost-mycelium silk. In Bryngloom\'s twilight, the wearer becomes indistinguishable from the dark between trees.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow', 'vreken']
  },
  'ward-of-protection': {
    origin: 'frostwood-reach',
    loreText: 'Scribe-Sentinel talismans inscribed with Sovereign Ledger passages. The words themselves form a barrier against memory-erasing fog.',
    relatedLore: ['frostwood-reach', 'scribe_sentinels', 'sovereign-ledger']
  },
  'iron-will-amulet': {
    origin: 'nordhalla',
    loreText: 'Skalvyr berserkers wear these to anchor themselves during Blood-Heat frenzies. Without it, they might never return from the red rage.',
    relatedLore: ['nordhalla', 'hark-ash-hammer', 'blood_heat', 'house_skalvyr']
  },
  'poison-ward-trinket': {
    origin: 'bryngloom-forest',
    loreText: 'Varis issues these to his assistants. They glow in the presence of toxins — a living safety manual.',
    relatedLore: ['bryngloom-forest', 'varis']
  },
  'freedom-ring': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan steppe-runners earn these after crossing the starless steppe alone. The ring is the key to no lock but binds you to your people.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'silence-ward': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch memory-glass pendants that absorb fog-whispers. When full, they are emptied into the Silent Seventh\'s vaults beneath Greymark Keep.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'silent_seventh']
  },

  // =======================================================================
  // CONSUMABLES
  // =======================================================================
  'crimson-tears': {
    origin: 'sundale',
    loreText: 'Brewed from moss growing where Sol\'s blood fell during the Breach. Each sip staves off death — a tear shed by a dying star.',
    relatedLore: ['sundale', 'the_breach', 'the_risen', 'sol']
  },
  'blood-remembrance': {
    origin: 'nordhalla',
    loreText: 'Distilled from Frozen Archive ichor. Drinking it grants a vision of the deceased\'s final moments.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },
  'desperate-draught': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists brew this from thermal-vent minerals and Groven adrenal compounds. It keeps you alive — but the debt comes due with interest.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'azure-sorrow': {
    origin: 'frostwood-reach',
    loreText: 'Distilled from memory-fog condensate. Restores magical energy by overwriting recent memories — you lose the hour but regain your power.',
    relatedLore: ['frostwood-reach', 'silent_seventh', 'memory_fog_mechanics']
  },
  'spirit-whisper': {
    origin: 'bryngloom-forest',
    loreText: 'Distilled from ancestor-mound dew, each bottle a whisper from the dead. Spirits speak truths the living fear to voice.',
    relatedLore: ['bryngloom-forest', 'vreken', 'nyssa']
  },
  'madness-brew': {
    origin: 'bryngloom-forest',
    loreText: 'Cult-fermented ghost-mycelium and silence-essence. It unlocks hidden doors in the mind and leaves them open for things that should not enter.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'strength-of-sorrow': {
    origin: 'nordhalla',
    loreText: 'Rime-Born shamans brew this from crushed stel-bone and glacial melt. It grants a beast\'s strength — but its death-cold settles in your marrow.',
    relatedLore: ['nordhalla', 'rime_born', 'stel']
  },
  'mind-fog': {
    origin: 'frostwood-reach',
    loreText: 'Iron paradox: the Scribe-Cartel sells the very fog they protect against. Used for scribes who must forget what they transcribed.',
    relatedLore: ['frostwood-reach', 'scribe-cartel', 'memory_fog_mechanics']
  },
  'hardtack-sorrow': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond ship-biscuits so hard they must be soaked in brine. Sailors say they taste like regret — but the Iceheart does not feed the living.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'travelers-fare': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan trail rations — dried windwood-fruit and salt-cured steppe-game. A single pouch sustains a rider for a week across the starless expanse.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'stew-of-memories': {
    origin: 'frostwood-reach',
    loreText: 'Mimir hearth-stew from ironwood-bark and gref-meat, seasoned with herbs that awaken buried memories. Each bowl tastes different — because each eater remembers differently.',
    relatedLore: ['frostwood-reach', 'mimir', 'gref']
  },
  'black-bread': {
    origin: 'bryngloom-forest',
    loreText: 'Neth bakers grind ironwood acorns into flour for this dense loaf. It keeps for months — longer than most things survive in the twilight.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'scroll-of-haste': {
    origin: 'cragjaw-peaks',
    loreText: 'Chronarch time-stitchers inscribe haste-scrolls that bend time around the reader. The lost seconds must come from somewhere.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara']
  },
  'scroll-of-fortitude': {
    origin: 'sundale',
    loreText: 'Dawn Vigil scrolls inscribed with Sol\'s last prayer. Reading reinforces the soul against the Wyrd — a shield of faith on parchment.',
    relatedLore: ['sundale', 'dawn_vigil', 'sol', 'wyrd']
  },
  'scroll-of-madness': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant scrolls written in ancestor-mound ash. Reading reveals death\'s true nature — a revelation that breaks the unprepared mind.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'embers-of-life': {
    origin: 'sundale',
    loreText: 'Pyrofiends seal dying Solbrand embers in glass. Breaking one releases star-fire that can rekindle a faltering life — or end one decisively.',
    relatedLore: ['sundale', 'sol-vareths', 'solbrand']
  },
  'hollow-essence': {
    origin: 'bryngloom-forest',
    loreText: 'Extracted from the silence between ancestor-mound pulses — absence of life made liquid. Drinking it makes you invisible to spirits and perhaps to yourself.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'cursed-ration': {
    origin: 'nordhalla',
    loreText: 'During Frost-Tithe shortages, families ate rations cursed by the Silence-Heat Heresy. The hunger was worse than the poison.',
    relatedLore: ['nordhalla', 'frost_tithe', 'the-silence-heat-heresy']
  },
  'weak-poison': {
    origin: 'bryngloom-forest',
    loreText: 'Toxicologist initiates brew from Bryngloom\'s least lethal fungi. A failed batch induces vomiting; a successful one starts a career.',
    relatedLore: ['bryngloom-forest', 'varis']
  },
  'venom-vial': {
    origin: 'bryngloom-forest',
    loreText: 'Varis\'s signature venom — eighteen ghost-mycelium strains, each adding a different symptom. A symphony of suffering.',
    relatedLore: ['bryngloom-forest', 'varis']
  },
  'deadly-toxin': {
    origin: 'bryngloom-forest',
    loreText: 'Only Venom-Masters brew this prion compound. It destroys the victim\'s sense of self before it destroys their body.',
    relatedLore: ['bryngloom-forest', 'varis']
  },

  // =======================================================================
  // CONTAINERS
  // =======================================================================
  satchel: {
    origin: 'sundrift-vale',
    loreText: 'Ordavan hide-satchels stitched from steppe-beast leather and sealed with windwood resin. A nomad\'s satchel holds everything they own.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'reinforced-crate': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond crates banded with salt-iron and stamped with the Luck-Ledger seal. The contents are insured — but your soul is collateral.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'alchemy-case': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists\' portable cases compartmentalized with thermal-vent cork, keeping reagents stable through Frostmaw\'s temperature extremes.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'tool-kit': {
    origin: 'cragjaw-peaks',
    loreText: 'Vat-Breakers\' kit contains implements forged from the first shattered vat. Five generations of Groven have mended equipment with these tools.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'leather-pouch': {
    origin: 'nordhalla',
    loreText: 'Corvani pouches sewn from seal-hide, worn close to the body. They hold Frost-Tithe tallies proving a family has paid their debt to House Skalvyr.',
    relatedLore: ['nordhalla', 'corvani', 'frost_tithe', 'house_skalvyr']
  },
  'travelers-bag': {
    origin: 'sundrift-vale',
    loreText: 'Astril bags woven from windwood fiber that never mildews. Expands in dry air and contracts in wet — a weather predictor disguised as luggage.',
    relatedLore: ['sundrift-vale', 'astril']
  },
  'adventurers-pack': {
    origin: 'frostwood-reach',
    loreText: 'Scribe-Sentinel expedition packs contain mapping supplies and a blank ledger. If it is not written, it did not happen.',
    relatedLore: ['frostwood-reach', 'scribe_sentinels', 'sovereign-ledger']
  },
  'coin-purse': {
    origin: 'iceheart-sea',
    loreText: 'Every Merrowport trader carries a Brine-Bond marked purse. It is weighed before every transaction — trust measured in copper, signed in salt.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'reinforced-satchel': {
    origin: 'sundale',
    loreText: 'Dawn Vigil courier satchels lined with asbestos-cloth, protecting documents from Sundale\'s volcanic heat. A courier\'s satchel is more sacred than their life.',
    relatedLore: ['sundale', 'dawn_vigil']
  },

  // =======================================================================
  // MINING MATERIALS
  // =======================================================================
  'red-copper': {
    origin: 'sundale',
    loreText: 'The first metal pulled from Sundale\'s ash-fields, stained rust-red by volcanic gases. The Dawn Vigil uses it for ceremonial fittings that must match Sol\'s dying light.',
    relatedLore: ['sundale']
  },
  'grey-tin': {
    origin: 'cragjaw-peaks',
    loreText: 'Grey-tin veins run through the upper slopes of Cragjaw Peaks, easy to smelt but brittle. Groven children learn to forge on it before graduating to iron.',
    relatedLore: ['cragjaw-peaks', 'groven']
  },
  'black-iron': {
    origin: 'frostwood-reach',
    loreText: 'The deep bogs of Frostwood Reach yield black-iron, a metal stained by centuries of decomposed memory. Weapons forged from it remember their targets.',
    relatedLore: ['frostwood-reach', 'house_thalreth']
  },
  deepsteel: {
    origin: 'cragjaw-peaks',
    loreText: 'Forged in the geothermal depths where the pressure is immense and the heat unnatural. Deepsteel is lighter than it looks and never loses its edge.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  veinrock: {
    origin: 'cragjaw-peaks',
    loreText: 'A composite of compressed minerals that runs through Cragjaw\'s deepest tunnels. The Thrumm use it for structural forging where flexibility matters more than hardness.',
    relatedLore: ['cragjaw-peaks', 'thrumm']
  },
  'rough-stone': {
    origin: 'sundrift-vale',
    loreText: 'Unworked steppe-stone gathered from the surface of Sundrift Vale. The Ordavan use it for temporary shelters and grave markers that the wind will eventually erase.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'cut-granite': {
    origin: 'cragjaw-peaks',
    loreText: 'Quarried from Frostmaw Crag by Groven stone-cutters who can cleave a block along its fault lines with a single strike. Their precision is legendary.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'slate-shards': {
    origin: 'frostwood-reach',
    loreText: 'Frostwood Reach\'s slate beds split naturally into thin, sharp sheets. The Scribe-Cartel uses slate as a backup medium when peat-parchment runs short.',
    relatedLore: ['frostwood-reach', 'scribe-cartel']
  },
  'basalt-chunks': {
    origin: 'sundale',
    loreText: 'Volcanic basalt from Emberspire\'s cooled flows, still warm to the touch months after eruption. Pyrofiends shape it into heat-conductive weapon heads.',
    relatedLore: ['sundale', 'scathrach']
  },
  'marble-block': {
    origin: 'bryngloom-forest',
    loreText: 'White marble quarried from Bryngloom\'s subterranean rivers, veined with ghost-mycelium that glows faintly in darkness. The Neth use it for ancestor-mound markers.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'obsidian-glass': {
    origin: 'sundale',
    loreText: 'Emberspire obsidian is sharper than any metal on its first fracture. The Scoured tip their pikes with it, knowing it will shatter after a single use — just like the Monoliths.',
    relatedLore: ['sundale', 'the_scoured']
  },
  'crystallized-salt': {
    origin: 'iceheart-sea',
    loreText: 'Harvested from Iceheart Sea evaporation pools, this salt is so pure it can preserve meat for decades. The Brine-Bond Syndicate controls the only viable deposits.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  voidglass: {
    origin: 'iceheart-sea',
    loreText: 'Recovered from the Silent Seventh\'s deep-sea vaults, voidglass is a material that absorbs light completely. It weighs nothing and reveals everything in its darkness.',
    relatedLore: ['iceheart-sea', 'silent_seventh']
  },
  'sky-iron': {
    origin: 'sundrift-vale',
    loreText: 'Meteoric iron that fell from the sky Keth-Amar devoured. It is not from this world — and some say it remembers the stars it came from.',
    relatedLore: ['sundrift-vale', 'keth_amar']
  },

  // =======================================================================
  // GATHERING / HERBS
  // =======================================================================
  bitterroot: {
    origin: 'nordhalla',
    loreText: 'A root that survives Nordhalla\'s permafrost by producing a natural antifreeze. The Rime-Born chew it to stave off frostbite during long watches.',
    relatedLore: ['nordhalla', 'rime_born']
  },
  rainreed: {
    origin: 'iceheart-sea',
    loreText: 'A reed that grows in the brackish estuaries of the Iceheart Sea. Its hollow stems are used for blowgun darts and as drinking straws for shipboard water rations.',
    relatedLore: ['iceheart-sea']
  },
  'stone-moss': {
    origin: 'cragjaw-peaks',
    loreText: 'A phosphorescent moss that grows on Cragjaw\'s cave walls, providing light without heat. The Groven cultivate it in their tunnels as a living lantern.',
    relatedLore: ['cragjaw-peaks', 'groven']
  },
  ashflower: {
    origin: 'sundale',
    loreText: 'A flower that blooms in the wake of volcanic ash-fall, its petals black with flecks of orange. The Risen consider it sacred — life emerging from death.',
    relatedLore: ['sundale', 'the_risen']
  },
  frostcap: {
    origin: 'nordhalla',
    loreText: 'A mushroom that grows only in the Frost-Tithe caves where the temperature never rises above freezing. The Augurs grind it into a powder that induces prophetic dreams.',
    relatedLore: ['nordhalla', 'augur']
  },
  glowbulb: {
    origin: 'bryngloom-forest',
    loreText: 'A bioluminescent fungus that pulses in rhythm with the ancestor-mound heartbeats. Vreken children string them into necklaces that serve as night-lights in the twilight.',
    relatedLore: ['bryngloom-forest', 'vreken']
  },
  'blood-vine': {
    origin: 'bryngloom-forest',
    loreText: 'A crimson vine that secretes a sap identical to human blood. Plaguebringer Vespera uses it to culture prions that can rewrite the host\'s genetic code.',
    relatedLore: ['bryngloom-forest', 'vespera']
  },

  // =======================================================================
  // TEXTILES
  // =======================================================================
  'linen-fiber': {
    origin: 'sundrift-vale',
    loreText: 'Flax grown in the thin soil of Sundrift Vale produces a fiber prized for its breathability. Ordavan weavers spin it into garments that protect against both sun and frost.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'wool-thread': {
    origin: 'nordhalla',
    loreText: 'Shorn from the thick-coated stel-beasts that roam Nordhalla\'s ice-fields. Corvani wool is coarse but unbelievably warm — the difference between life and frost-death.',
    relatedLore: ['nordhalla', 'corvani', 'stel']
  },
  'hemp-cord': {
    origin: 'cragjaw-peaks',
    loreText: 'Groven hemp is grown in geothermal greenhouses, its fibers strengthened by the mineral-rich steam. Every Vat-Breaker\'s toolkit contains at least fifty feet of it.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'silk-strand': {
    origin: 'bryngloom-forest',
    loreText: 'Ghost-mycelium silk harvested from Bryngloom\'s deepest ancestor-mounds. It is stronger than steel by weight and carries the faint memory of the dead woven into its threads.',
    relatedLore: ['bryngloom-forest', 'neth', 'root_veil']
  },
  'fine-weave-cloth': {
    origin: 'iceheart-sea',
    loreText: 'Mer-Lyrisa\'s Tide-Choir weaves sea-silk into fabric so fine it can pass through a wedding ring. Each bolt takes a year to produce and costs a small fortune in Luck-Ledger credits.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  'hardened-cloth': {
    origin: 'frostwood-reach',
    loreText: 'Linen treated with ironwood resin and memory-fog condensate, producing a fabric as stiff as boiled leather. Scribe-Sentinels wear it for archive protection duty.',
    relatedLore: ['frostwood-reach', 'scribe_sentinels']
  },
  'insulated-weave': {
    origin: 'cragjaw-peaks',
    loreText: 'A triple-layer weave with air pockets trapped between geothermal-cured fabrics. Essential for anyone venturing between Cragjaw\'s frozen surface and its molten depths.',
    relatedLore: ['cragjaw-peaks']
  },
  'spell-treated-fabric': {
    origin: 'sundale',
    loreText: 'Fabric soaked in Solbrand-infused oil, giving it minor heat resistance. Dawn Vigil quartermasters issue it to troops stationed near Emberspire\'s vents.',
    relatedLore: ['sundale', 'dawn_vigil', 'solbrand']
  },
  shadowfiber: {
    origin: 'bryngloom-forest',
    loreText: 'A fabric woven in absolute darkness by the Cult of Forgotten Shadow, using techniques that predate the Neth-Vreken Reincarnation Bargain. It absorbs all light.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  dreamweave: {
    origin: 'frostwood-reach',
    loreText: 'A rare fabric that changes color based on the wearer\'s emotional state. The Scribe-Cartel uses dreamweave in interrogation rooms — the cloth cannot lie.',
    relatedLore: ['frostwood-reach', 'scribe-cartel']
  },
  ethercloth: {
    origin: 'iceheart-sea',
    loreText: 'Reclaimed from the Silent Seventh\'s surface caches, ethercloth is semi-corporeal. It provides no physical protection but resists magical damage with uncanny efficiency.',
    relatedLore: ['iceheart-sea', 'silent_seventh']
  },
  'fate-thread': {
    origin: 'cragjaw-peaks',
    loreText: 'Chronarch time-stitchers spin thread from temporal-displaced silk-moth cocoons. Sewing with fate-thread binds the fabric to a specific moment in time.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara']
  },

  // =======================================================================
  // SKINS & LEATHER
  // =======================================================================
  'light-hide': {
    origin: 'sundrift-vale',
    loreText: 'Thin hide from the swift steppe-deer of Sundrift Vale. Ordavan leatherworkers cure it with windwood smoke, producing a supple leather perfect for gloves and light armor.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'thick-hide': {
    origin: 'nordhalla',
    loreText: 'The hide of a full-grown stel-bear, thick enough to stop a knife at close range. Rime-Born hunters prize it for winter cloak linings.',
    relatedLore: ['nordhalla', 'rime_born', 'stel']
  },
  'hardened-leather': {
    origin: 'frostwood-reach',
    loreText: 'Boiled in ironwood tannin and smoked over gref-fat fires, this leather achieves plate-like rigidity while retaining flexibility. The Mimir invented the process during the Memory Wars.',
    relatedLore: ['frostwood-reach', 'mimir', 'the-memory-wars']
  },
  'scale-plate': {
    origin: 'iceheart-sea',
    loreText: 'Scales from the deep-dwelling Iceheart leviathans, overlapping naturally in a pattern that deflects blade thrusts. Merryn divers harvest them at great personal risk.',
    relatedLore: ['iceheart-sea', 'merryn']
  },
  'horn-fragment': {
    origin: 'bryngloom-forest',
    loreText: 'Shed antlers from the great ironwood stags that roam Bryngloom\'s canopy. Neth carvers shape them into bow-tips and dagger handles, each grain telling a century of growth.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'claw-talon': {
    origin: 'cragjaw-peaks',
    loreText: 'Shed from the cliff-stalkers that hunt Cragjaw\'s vertical faces. The Groven tip their climbing harpoons with these talons, which can bite into solid ice.',
    relatedLore: ['cragjaw-peaks', 'groven']
  },
  'beast-sinew': {
    origin: 'nordhalla',
    loreText: 'Dried sinew from Nordhalla\'s great beasts, used for bowstrings and composite recurves. A good sinew strand can last a decade if kept dry and oiled.',
    relatedLore: ['nordhalla']
  },
  'bone-plates': {
    origin: 'cragjaw-peaks',
    loreText: 'Calcified bone from the Ancestor-Spans of the Groven dead, laminated into armor plates. Wearing them is honoring the ancestors who made the Vat-Breakers\' freedom possible.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },

  // =======================================================================
  // CRAFTING COMPONENTS
  // =======================================================================
  'copper-ingot': {
    origin: 'sundrift-vale',
    loreText: 'Smelted from red-copper ore in Ordavan portable furnaces. Soft, malleable, and easy to work — the metal of choice for steppe-repairs and trade goods.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'iron-ingot': {
    origin: 'frostwood-reach',
    loreText: 'Smelted from bog-iron in the peat-fired furnaces of Frostwood Reach. Each ingot carries the faint smell of the bog it came from — earth, memory, and decay.',
    relatedLore: ['frostwood-reach', 'house_thalreth']
  },
  'metal-rivets': {
    origin: 'cragjaw-peaks',
    loreText: 'Mass-produced by Groven smiths who can turn out a hundred rivets in an hour. Every Vat-Breakers\' structural joint is held together by these humble fasteners.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'leather-straps': {
    origin: 'sundrift-vale',
    loreText: 'Cut from steer-hide and stretched over windwood frames, these straps are the universal connector of Ordavan material culture. If it moves, it is strapped.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'wooden-haft': {
    origin: 'bryngloom-forest',
    loreText: 'Turned from Bryngloom ironwood saplings on Neth wood-lathes that have run continuously for centuries. The grain is so tight it resists splitting even after years of combat.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'weapon-blank': {
    origin: 'cragjaw-peaks',
    loreText: 'A pre-shaped billet of metal ready for final forging. Deep Alchemists produce weapon-blanks with internal channels already formed for alchemical infusions.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'armor-frame': {
    origin: 'sundale',
    loreText: 'The wire skeleton around which plate armor is built. Dawn Vigil armories produce standardized frames that can be fitted to any soldier in under an hour.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'binding-wire': {
    origin: 'cragjaw-peaks',
    loreText: 'Pulled from molten ore in continuous strands up to a mile long. The Warden Chain-Lords use binding-wire for restraints that can hold a Wyrd-corrupted creature.',
    relatedLore: ['cragjaw-peaks', 'alaric']
  },
  'waxed-thread': {
    origin: 'iceheart-sea',
    loreText: 'Linen thread coated in Brine-Bond beeswax, rot-proof and water-resistant. Every sail on a Merrowport vessel is sewn with it.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'resin-glue': {
    origin: 'bryngloom-forest',
    loreText: 'Distilled from ironwood sap and ghost-mycelium enzymes, this glue bonds almost any material to itself. The bond is stronger than the original surfaces.',
    relatedLore: ['bryngloom-forest', 'neth']
  },

  // =======================================================================
  // ALCHEMY SUPPLIES
  // =======================================================================
  'distilled-water': {
    origin: 'cragjaw-peaks',
    loreText: 'Collected from geothermal steam vents and condensed through ice-cold pipes. Deep Alchemists insist on absolute purity for their most volatile experiments.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'alcohol-base': {
    origin: 'nordhalla',
    loreText: 'Distilled from fermented frostcap mushrooms, this clear spirit burns at a proof that would kill an unprepared drinker. It is an industrial solvent that happens to be intoxicating.',
    relatedLore: ['nordhalla']
  },
  'mineral-salts': {
    origin: 'iceheart-sea',
    loreText: 'Evaporated from Iceheart Sea brine in solar stills. Each batch\'s color indicates its mineral composition — blue for copper, green for iron, white for pure sodium.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'sulfur-powder': {
    origin: 'sundale',
    loreText: 'Mined from Emberspire\'s fumaroles where the air is unbreathable. Pyrofiend alchemists use it in incendiary compounds that can ignite even wet timber.',
    relatedLore: ['sundale', 'sol-vareths']
  },
  'ground-bone': {
    origin: 'bryngloom-forest',
    loreText: 'Pulverized ancestor-mound bone, used as a reagent in Revenant rituals. The powder retains a faint spiritual resonance that can be detected by those sensitive to the threshold.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'fire-essence': {
    origin: 'sundale',
    loreText: 'Extracted from Solbrand cinders by Pyrofiend essence-stillers. A single vial contains enough thermal energy to boil a cauldron or immolate a target.',
    relatedLore: ['sundale', 'solbrand', 'sol-vareths']
  },
  'frost-essence': {
    origin: 'nordhalla',
    loreText: 'Drawn from the Frozen Archive\'s oldest ice by Augur Keepers. This essence is absolute cold given liquid form — it does not freeze because it is already colder than freezing.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },
  'vital-essence': {
    origin: 'sundrift-vale',
    loreText: 'A life-force extract brewed from first-spring steppe-grasses by Animist convergers. It accelerates healing and fermentation in equal measure.',
    relatedLore: ['sundrift-vale', 'sera-three-scars']
  },
  'shadow-residue': {
    origin: 'bryngloom-forest',
    loreText: 'The physical byproduct of silence-essence extraction, a tar-like substance that deadens sound and light. The Cult of Forgotten Shadow uses it in binding rituals.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'arcane-ash': {
    origin: 'frostwood-reach',
    loreText: 'The remains of spells that have been excised from the Sovereign Ledger by Scribe-Cartel memory-mages. The ash still sparks with residual magical energy.',
    relatedLore: ['frostwood-reach', 'scribe-cartel', 'sovereign-ledger']
  },
  'glass-vial': {
    origin: 'sundale',
    loreText: 'Blown from Emberspire silica sand, heat-tempered to withstand extreme thermal shock. The Risen use them to carry Solbrand embers as portable altars.',
    relatedLore: ['sundale', 'the_risen']
  },
  'reinforced-flask': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemist pressure flasks are rated to contain reactions that would shatter ordinary glass. The threaded stopper alone requires a master glass-blower to produce.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'sealed-ampoule': {
    origin: 'nordhalla',
    loreText: 'Crack-sealed glass ampoules that preserve volatile extracts indefinitely. Augurs store their divination compounds in these, each one labeled with the death it predicted.',
    relatedLore: ['nordhalla', 'skadi-glass-eye']
  },

  // =======================================================================
  // ENCHANTING MATERIALS
  // =======================================================================
  'arcane-dust': {
    origin: 'frostwood-reach',
    loreText: 'Ground from spent focus-crystals, arcane-dust is the universal reagent for minor enchantments. The Scribe-Cartel taxes its trade heavily.',
    relatedLore: ['frostwood-reach', 'scribe-cartel']
  },
  'soul-fragment': {
    origin: 'bryngloom-forest',
    loreText: 'A shard of spiritual essence harvested from ancestor-mounds. Revenants use them to create sentient enchantments that can act independently of their wielder.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'imprint-shard': {
    origin: 'frostwood-reach',
    loreText: 'A crystal that has been exposed to a specific memory in the Sovereign Ledger, absorbing its essence. Imprint-shards can transfer skills and knowledge through enchantment.',
    relatedLore: ['frostwood-reach', 'sovereign-ledger']
  },
  'focus-crystal': {
    origin: 'cragjaw-peaks',
    loreText: 'Grown in the Chronarch\'s time-dilated crystal gardens, where a day outside equals a century within. These crystals resonate with pure temporal energy.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara']
  },
  'rune-ink': {
    origin: 'frostwood-reach',
    loreText: 'The Scribe-Cartel\'s monopoly on Soot-Resin Ink makes this the most valuable writing medium in the known world. A single pot can inscribe a hundred binding runes.',
    relatedLore: ['frostwood-reach', 'scribe-cartel']
  },
  'sigil-chalk': {
    origin: 'sundale',
    loreText: 'Pressed from Solbrand ash and Emberspire pumice, this chalk writes in lines that glow faintly when charged with magic. Dawn Vigil inquisitors use it for ward circles.',
    relatedLore: ['sundale', 'dawn_vigil', 'solbrand']
  },
  'binding-scroll': {
    origin: 'nordhalla',
    loreText: 'Prepared from the skin of a stel-beast, cured in Augur ichor and inscribed with containment runes. Used to trap spirits, spells, or memories for later use.',
    relatedLore: ['nordhalla', 'skald', 'stel']
  },

  // =======================================================================
  // COOKING SUPPLIES
  // =======================================================================
  'fresh-meat': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan herders slaughter only when necessary, and every part of the animal is used. Fresh meat is a luxury on the steppe — most meals are preserved.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'dried-rations': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond provisions are salt-cured and compressed into nutrient bricks that last indefinitely. They taste of nothing but salt, but salt is all a sailor needs.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },
  'fat-trimmings': {
    origin: 'nordhalla',
    loreText: 'Rendered from stel-bear fat, this tallow is used for cooking, lamp fuel, leather treatment, and — in desperation — as a frostbite preventative. Nothing is wasted.',
    relatedLore: ['nordhalla', 'stel']
  },
  'root-vegetables': {
    origin: 'frostwood-reach',
    loreText: 'Hardy tubers that grow in the ironwood groves where little else survives. Mimir crofters store them in peat cellars where they keep for an entire winter.',
    relatedLore: ['frostwood-reach', 'mimir']
  },
  'cave-mushrooms': {
    origin: 'cragjaw-peaks',
    loreText: 'Cultivated in Groven tunnel-farms warmed by geothermal vents. These mushrooms are the staple of the underground diet, rich in protein and minerals.',
    relatedLore: ['cragjaw-peaks', 'groven']
  },
  'river-fish': {
    origin: 'bryngloom-forest',
    loreText: 'Caught from Bryngloom\'s subterranean rivers, these fish are pale and blind but delicious. The Neth smoke them over ghost-mycelium fires for a distinctive flavour.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'spice-blend': {
    origin: 'sundrift-vale',
    loreText: 'Ordavan traders carry spice blends that are worth more than gold in the frozen markets of Nordhalla. The recipe is a closely guarded family secret.',
    relatedLore: ['sundrift-vale', 'house_ordavan']
  },
  'preserving-salt': {
    origin: 'iceheart-sea',
    loreText: 'The Brine-Bond Syndicate\'s most essential export. Without it, the long winters of the north would be starvation seasons. Salt is the currency of survival.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate']
  },

  // =======================================================================
  // LOOT ITEMS DATA
  // =======================================================================
  'archmages-spellbook': {
    origin: 'frostwood-reach',
    loreText: 'A spellbook rescued from the Silent Seventh\'s purge of the Frostwood Academy. Bri-Vessela recognizes the hand — it belongs to a Lunarch who vanished into the fog fifty years ago.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'silent_seventh']
  },
  'basalt-war-hammer': {
    origin: 'cragjaw-peaks',
    loreText: 'Forged from Cragjaw basalt by Groven smiths who shaped stone before they learned to shape metal. A link to a time before the vats, before the rebellion.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'deep-ale': {
    origin: 'cragjaw-peaks',
    loreText: 'Fermented in thermal caves, heated by geothermal warmth and served at temperatures that scald surface-dwellers. Groven love it.',
    relatedLore: ['cragjaw-peaks', 'groven']
  },
  'ancient-heartwood': {
    origin: 'bryngloom-forest',
    loreText: 'A section of ironwood from a tree ancient when the Neth first settled Bryngloom. Its growth rings tell a history predating recorded memory.',
    relatedLore: ['bryngloom-forest', 'neth']
  },
  'thornroot-seed': {
    origin: 'bryngloom-forest',
    loreText: 'The Thorn-Speaker of the Trueborn Florae blessed this seed before the Great Revision. Planted, it would grow into a tree that remembers what the fog erased.',
    relatedLore: ['bryngloom-forest', 'thorn-speaker', 'the-great-revision']
  },
  'ash-cleave': {
    origin: 'sundale',
    loreText: 'Forged from a Sundered Monolith fragment. The Scoured carry these as reminders that even the unbreakable can be broken.',
    relatedLore: ['sundale', 'the_scoured', 'sundered_monoliths']
  },
  'warlord-trophy-necklace': {
    origin: 'nordhalla',
    loreText: 'Halvar Skalvyr awarded this to a chieftain who brought him a Silence-Heat heretic\'s head. The teeth are real, and so is the history.',
    relatedLore: ['nordhalla', 'halvar-skalvyr', 'the-silence-heat-heresy']
  },
  'arcane-focus-crystal': {
    origin: 'cragjaw-peaks',
    loreText: 'The Chronarch Conclave grows these in time-dilated pockets where a day lasts a century. Unparalleled clarity and unimaginable age.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara']
  },
  'giant-frost-axe': {
    origin: 'nordhalla',
    loreText: 'Recovered from the Frozen Archive. Belonged to a warrior-king who defied the Frost-Tithe. The blade is etched with his final declaration of independence.',
    relatedLore: ['nordhalla', 'frost_tithe']
  },
  'frost-giant-heart': {
    origin: 'nordhalla',
    loreText: 'The still-beating heart of an ice-titan felled during the Silence-Heat Heresy. Kept in stasis — proof that the old gods can die.',
    relatedLore: ['nordhalla', 'rime_born', 'the-silence-heat-heresy']
  },

  // =======================================================================
  // FACTION WEAPONS
  // =======================================================================
  'ardent-sun-blade': {
    origin: 'sundale',
    loreText: 'Grandmaster Vael Ardent-Sun carved his sun-sword from Emberspire caldera glass, embedding a fragment of the Solbrand in its pommel. The blade is warm to the touch and brighter at sunset.',
    relatedLore: ['sundale', 'solbrand', 'dawn_vigil']
  },
  'emberspire-greatsword': {
    origin: 'sundale',
    loreText: 'The First Cabal of Pyrofiends consecrated this blade in Sol\'s dying fire during the Deepening. Its edge is not forged — it is a wound in reality that Sol refuses to heal.',
    relatedLore: ['sundale', 'first-cabal', 'sol', 'the_deepening']
  },
  'vigil-purges-mace': {
    origin: 'sundale',
    loreText: 'Dawn Vigil purgation-maces contain compressed Solbrand ash in their hollow heads. Hierophant Aethelgard commissioned ten thousand of them for the False Dawn Riots suppression.',
    relatedLore: ['sundale', 'dawn_vigil', 'the-false-dawn-riots']
  },
  'monolith-shard-dagger': {
    origin: 'sundale',
    loreText: 'The Scoured hew these daggers from Sundered Monolith fragments with nothing but their hands and conviction. The shard hums at a frequency that dissolves wards and enchantments on contact.',
    relatedLore: ['sundale', 'the_scoured', 'sundered_monoliths']
  },
  'risen-harvest-scythe': {
    origin: 'sundale',
    loreText: 'The Risen consecrate harvest-scythes in starlight prayers at the Solbrand. Each crescent blade is polished by a thousand offerings, and the grip is wrapped in the prayer shrouds of the faithful departed.',
    relatedLore: ['sundale', 'the_risen', 'solbrand']
  },
  'sovereign-quill-dagger': {
    origin: 'frostwood-reach',
    loreText: 'Scribe-Sentinels carry these blades disguised as writing implements. The edge is coated with truth-compelling Soot-Resin Ink — a confession extracted at dagger-point is still a confession, and still recorded.',
    relatedLore: ['frostwood-reach', 'scribe_sentinels', 'scribe-cartel']
  },
  'ledgers-justification': {
    origin: 'frostwood-reach',
    loreText: 'Judge-Master Caedren Thalreth wielded this gavel-mace during the Great Revision tribunals. Its inscription reads: "The Ledger is absolute; the judgment is final."',
    relatedLore: ['frostwood-reach', 'kaelen-thalreth', 'caedren-thalreth', 'the-great-revision']
  },
  'mimir-fog-stalker-bow': {
    origin: 'frostwood-reach',
    loreText: 'Mimir hunt-masters string these bows with memory-fog thread harvested from the deepest banks. The string absorbs all sound — arrows fly in perfect silence, and prey die without hearing death approach.',
    relatedLore: ['frostwood-reach', 'mimir', 'sylas', 'memory_fog_mechanics']
  },
  'silence-weavers-staff': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch Regent Bri-Vessela\'s personal focus-staff, carved from polished memory-glass. Through it, she can see the fog\'s every intention and redirect the Silent Seventh\'s whispers.',
    relatedLore: ['frostwood-reach', 'bri-vessela', 'silent_seventh', 'memory_fog_mechanics']
  },
  'jarn-tand-war-spear': {
    origin: 'nordhalla',
    loreText: 'High King-Jarl Halvar Skalvyr\'s legendary war-spear Jarn-Tand, tipped with stel-bone from the last ice-titan he slew personally. Only a Skalvyr may carry it — all others find their blood freezing in their veins.',
    relatedLore: ['nordhalla', 'halvar-skalvyr', 'stel', 'house_skalvyr']
  },
  'blood-heat-greataxe': {
    origin: 'nordhalla',
    loreText: 'Hark Ash-Hammer blessed this axe in the boiling blood of a stel-beast\'s heart. The blade grows hotter with each swing, eventually reaching a temperature that cauterizes wounds as it makes them.',
    relatedLore: ['nordhalla', 'hark-ash-hammer', 'blood_heat', 'stel']
  },
  'luck-ledger-cutlass': {
    origin: 'iceheart-sea',
    loreText: 'Every Brine-Bond privateer carries a standard-issue cutlass etched with their Luck-Ledger account. The blade itself is collateral — losing it is a financial catastrophe measured in suffering.',
    relatedLore: ['iceheart-sea', 'brine-bond-syndicate', 'house_mereval']
  },
  'tide-choir-harp': {
    origin: 'iceheart-sea',
    loreText: 'Mer-Lyrisa\'s masterwork harp, strung with kelp-wire tuned to the Iceheart Sea\'s twelve tidal patterns. Each string evokes a different sea-state, from gentle swell to catastrophic maelstrom.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa']
  },
  'wyrd-distillation-lance': {
    origin: 'cragjaw-peaks',
    loreText: 'The Prime Alchemist\'s experimental weapon — a lance with a hollow shaft containing a Wyrd-neutralizing compound. If it works, it could cure the world. If it fails, it could accelerate the corruption.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists', 'wyrd']
  },
  'liberation-flail': {
    origin: 'cragjaw-peaks',
    loreText: 'The head of this flail was cast from the first alchemical vat to shatter, during the Groven uprising. Vat-Breakers carry it in ceremonies celebrating the day their chains broke.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild']
  },
  'knotted-decree-glaive': {
    origin: 'cragjaw-peaks',
    loreText: 'Warden Chain-Lord Alaric the Law-Keeper forged this glaive\'s handle from the chains of the Knotted Decree itself. He broke the law to enforce the law — and the law thanked him.',
    relatedLore: ['cragjaw-peaks', 'alaric', 'house_tesshan']
  },
  'time-frozen-wand': {
    origin: 'cragjaw-peaks',
    loreText: 'Fex-Vestara\'s personal focus-wand, grown from a crystal cultivated in a time-dilated pocket. Spells cast through it arrive before they are cast — the cause and effect are permanently disordered.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara', 'silent_seventh']
  },
  'shadow-veil-blade': {
    origin: 'bryngloom-forest',
    loreText: 'Forged in absolute root-veil darkness by the Cult of Forgotten Shadow. This blade absorbs light so completely that its edge exists as a localized pocket of perfect black — the absence of everything.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow', 'root_veil']
  },
  'threshold-keepers-scythe': {
    origin: 'bryngloom-forest',
    loreText: 'Kor-Vasseth\'s ritual scythe was forged from the iron gate of the ancestor-mound at the threshold between life and death. Each swing adds a soul to its collection — and the collection whispers back.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth']
  },
  'blight-mothers-prong': {
    origin: 'bryngloom-forest',
    loreText: 'Vespera\'s living weapon — a prong grafted from a Neth predator\'s fang to ghost-mycelium. It secretes adaptive venom that learns, mutates, and always finds a way past its target\'s defenses.',
    relatedLore: ['bryngloom-forest', 'vespera']
  },
  'faiths-edge-glaive': {
    origin: 'sundrift-vale',
    loreText: 'Mor-Vereth\'s curved glaive — the edge of faith. It is said that those who doubt their beliefs cannot lift it, while those with absolute conviction find it lighter than air.',
    relatedLore: ['sundrift-vale', 'mor-vereth']
  },
  'probability-weaver-twin-blades': {
    origin: 'iceheart-sea',
    loreText: 'Merr-Cael\'s twin blades from a single Merrowport anchor. Each strike shifts probability — making the impossible likely and the certain uncertain. Carrying both is the only way to stay balanced.',
    relatedLore: ['iceheart-sea', 'merr-cael']
  },

  // =======================================================================
  // ENRICHED WEAPONS — UNCOMMON
  // =======================================================================
  'cinder-fang': {
    origin: 'sundale',
    loreText: 'Solbrand smiths hammer ember-sap into the tang of these daggers. The venom runs hot and never cools, even in the dead of a Frostwood winter.',
    relatedLore: ['sundale', 'solbrand', 'house_solvan']
  },
  'rime-thorn': {
    origin: 'nordhalla',
    loreText: 'Skalvyr huntsmen carve these spear-tips from stel-bone and carry them on frost-tithe expeditions. The cold that radiates from the tip comes from within the bone itself.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'frost_tithe']
  },
  'gale-lash': {
    origin: 'iceheart-sea',
    loreText: 'Woven from Merrowport kelp-thread and electrified by Iceheart squalls. The Tide-Choir use these to punish those who disrespect the tides.',
    relatedLore: ['iceheart-sea', 'tide_choir', 'mer-lyrisa']
  },
  'void-pricker': {
    origin: 'bryngloom-forest',
    loreText: 'The Cult of Forgotten Shadow forges these katars in the root-veil, where no light has ever reached. The puncture wounds they leave don\'t bleed — they remember.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow', 'root_veil']
  },
  'gravel-spitter': {
    origin: 'cragjaw-peaks',
    loreText: 'Warden Chain-Lords load these crossbows with Cragjaw gravel blessed by House Tesshan\'s ward-courts. Each bolt carries the weight of law and stone.',
    relatedLore: ['cragjaw-peaks', 'house_tesshan', 'warden_chain_lords']
  },
  'bone-singers-flute': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant bone-singers hollow out ancestor-bones and carve them into flutes. The melodies they produce heal flesh but chill the spirit — the dead demand a song before they give.',
    relatedLore: ['bryngloom-forest', 'revenant', 'kor-vasseth']
  },
  'rust-eater': {
    origin: 'sundrift-vale',
    loreText: 'Mor-Vereth\'s converts carry these poison-tipped blades to test the faith of non-believers. The venom corrodes more than flesh — it rusts certainty itself.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },
  'thorn-lash-kama': {
    origin: 'frostwood-reach',
    loreText: 'Scribe-Sentinel enforcers use these to disarm fugitives fleeing justice. The curved blade catches weapons and wrenches them free — a sentence carried out on the body.',
    relatedLore: ['frostwood-reach', 'scribe_cartel']
  },
  'sun-scorn': {
    origin: 'sundale',
    loreText: 'Dawn Vigil inquisitors carry these maces into heretic trials. The sacred damage they inflict is said to burn away lies, leaving only truth — and a body that cannot speak it.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'wraith-bite': {
    origin: 'bryngloom-forest',
    loreText: 'A rapier whose shadow lingers a moment after the blade moves. The Cult of Forgotten Shadow trains assassins to strike twice — once with steel, once with the shadow that follows.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'storm-pike': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond privateers mount these on ship-rails during boardings. The pike channels the Iceheart Sea\'s electric storms into the target — a jolt that feels like drowning on dry land.',
    relatedLore: ['iceheart-sea', 'brine_bond']
  },
  'wyrd-whistle': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists carve these from Wyrd-crystal resonators. The sound it makes is inaudible to most — but those attuned to Wyrd-frequency hear a dissonant tone that unravels concentration.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'ember-needler': {
    origin: 'sundale',
    loreText: 'Solbrand crossbow bolts tipped with compressed ash. The Sun-Blessed Militia uses these to light up hiding positions — the ember seeds burn through armor and reveal the cowardice beneath.',
    relatedLore: ['sundale', 'solbrand']
  },
  'frost-guard-longsword': {
    origin: 'nordhalla',
    loreText: 'House Skalvyr forges these from stel-iron quenched in Nordhalla\'s glacial lakes. The cold damage doesn\'t come from magic — it comes from the memory of the ice that made the blade.',
    relatedLore: ['nordhalla', 'house_skalvyr']
  },
  'plague-biter': {
    origin: 'bryngloom-forest',
    loreText: 'Plaguebringer harvesters use these sickles to collect infected tissue from blighted creatures. The blight on the edge spreads on contact — a gift from Vespera\'s garden.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },

  // =======================================================================
  // ENRICHED WEAPONS — RARE
  // =======================================================================
  'infernal-dire': {
    origin: 'sundale',
    loreText: 'A Solbrand champion\'s greatsword, consecrated in the dying fires of a solar eclipse. The ember DoT it inflicts is described by survivors as being burned from the inside out.',
    relatedLore: ['sundale', 'solbrand', 'vael_ardent_sun']
  },
  'hoarfrost-glaive': {
    origin: 'nordhalla',
    loreText: 'Halvar Skalvyr\'s elite guard carries these frost-glaives. The freeze effect comes from stel-bone marrow sealed inside the blade — when it shatters on impact, the cold is absolute.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'halvar_skalvyr']
  },
  'tempest-trident': {
    origin: 'iceheart-sea',
    loreText: 'Mer-lyrisa herself tuned the prongs of this trident to the Iceheart Sea\'s three deepest currents. Each prong carries a different storm — and together, they create a tempest.',
    relatedLore: ['iceheart-sea', 'tide_choir', 'mer-lyrisa']
  },
  'nightfall-rapier': {
    origin: 'bryngloom-forest',
    loreText: 'A blade that exists half in shadow and half in the living world. The Cult of Forgotten Shadow\'s top assassins can use it to strike from a shadow you didn\'t know was there.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'arcane-siphon': {
    origin: 'frostwood-reach',
    loreText: 'Mimir research-daggers that drain arcane energy from targets and convert it to healing. The Mimir believe knowledge flows both ways — and pain is just another form of data.',
    relatedLore: ['frostwood-reach', 'mimir']
  },
  'wyrd-hammer': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists embed Wyrd-crystal shards in the hammer-head. Each impact releases a burst of Wyrd-frequency that corrodes reality itself — the wound doesn\'t heal normally.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'scourge-lash': {
    origin: 'cragjaw-peaks',
    loreText: 'Vat-Breaker flails wielded during the Groven uprising. The chains are forged from broken vat-locks — each link a symbol of a chain that was broken and a freedom that was earned.',
    relatedLore: ['cragjaw-peaks', 'vat_breakers_guild', 'the_groven_uprising']
  },
  'holy-inquisitors-mace': {
    origin: 'sundale',
    loreText: 'Dawn Vigil inquisitors carry these during heretic purges. The sacred damage they deal is excruciating — not because it burns, but because it reveals every sin the target has committed.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'venom-drake-fang': {
    origin: 'bryngloom-forest',
    loreText: 'Vespera cultivated this venom from the Neth predator\'s gland. The poison mutates inside the wound, learning and adapting — by the time you notice the pain, it\'s already too late.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'psychic-horror-wand': {
    origin: 'sundrift-vale',
    loreText: 'Mor-Vereth channels psychic energy through this wand to inflict terror. The fear it causes isn\'t rational — it\'s the target\'s deepest, most personal dread made manifest.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },
  'thunder-anvil': {
    origin: 'iceheart-sea',
    loreText: 'A greataxe forged from Merrowport\'s last working thunder-forge. Each swing carries the cumulative charge of a hundred Iceheart storms compressed into a single devastating arc.',
    relatedLore: ['iceheart-sea', 'brine_bond', 'the_great_fracture']
  },
  'blight-caller': {
    origin: 'bryngloom-forest',
    loreText: 'Plaguebringer channeling staves carved from ghost-mycelium. They use these to spread Vespera\'s gift — the blight DoT seeps into the land itself, turning soil to ash and water to bile.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'soul-razor': {
    origin: 'bryngloom-forest',
    loreText: 'Revenant katars that carve fragments from the soul on each hit. The healing they provide comes at a cost — the soul-fragments feed the ancestor-mounds and keep the dead awake.',
    relatedLore: ['bryngloom-forest', 'revenant']
  },
  'force-nexus-bow': {
    origin: 'cragjaw-peaks',
    loreText: 'Chronarch Conclave bows that fire bolts of concentrated temporal force. The knockback they cause isn\'t physical — it\'s the target\'s position in time being briefly displaced.',
    relatedLore: ['cragjaw-peaks', 'chronarch_conclave', 'fex-vestara']
  },
  'mind-killer': {
    origin: 'sundrift-vale',
    loreText: 'A sword whose edge cuts thought itself. False Prophet zealots carry it to silence dissent — the stun effect is a moment of pure mental blankness, as if the mind has been erased.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },
  'ash-bringers-scourge': {
    origin: 'sundale',
    loreText: 'The Scoured wield these chain-flails to spread Sol\'s dying ash across Sundale. The ember DoT isn\'t fire — it\'s the slow corruption of everything Solbrand once touched.',
    relatedLore: ['sundale', 'the_scoured']
  },
  'tide-crusher': {
    origin: 'iceheart-sea',
    loreText: 'A trident blessed by Mer-lyrisa in the deepest trench of the Iceheart Sea. The cold damage and knockback come from the memory of the sea-floor — the pressure of a thousand fathoms.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa', 'tide_choir']
  },
  'star-fall-harp': {
    origin: 'frostwood-reach',
    loreText: 'A Lunarch harp strung with memory-glass strings that vibrate at stellar frequencies. Regent Bri-Vessela believes it can channel the light of stars that died millions of years ago.',
    relatedLore: ['frostwood-reach', 'lunarch', 'bri-vessela']
  },
  'blood-oath-greataxe': {
    origin: 'nordhalla',
    loreText: 'Hark Ash-Hammer blessed this axe in the boiling blood of a stel-beast. The healing it grants comes from the target\'s pain — an oath written in blood, paid in flesh.',
    relatedLore: ['nordhalla', 'hark_ash_hammer', 'house_skalvyr']
  },
  'phantom-dance': {
    origin: 'bryngloom-forest',
    loreText: 'A Revenant saber that moves through shadows as if dancing. The shadow DoT it leaves behind is the blade\'s echo — a wound that bleeds darkness long after the cut has healed.',
    relatedLore: ['bryngloom-forest', 'revenant', 'root_veil']
  },

  // =======================================================================
  // ENRICHED WEAPONS — EPIC
  // =======================================================================
  'sol-brands-final-word': {
    origin: 'sundale',
    loreText: 'Vael Ardent-Sun\'s legendary greatsword, the last weapon forged before Sol went dark. Its sacred flames burn with the memory of the sun — and the world remembers what it lost.',
    relatedLore: ['sundale', 'vael_ardent_sun', 'solbrand']
  },
  'everfrost-crown-pike': {
    origin: 'nordhalla',
    loreText: 'High King-Jarl Halvar Skalvyr\'s ancestral weapon. Its freeze is the absolute zero of Nordhalla\'s deepest glacier — a cold so profound it freezes the concept of warmth itself.',
    relatedLore: ['nordhalla', 'halvar_skalvyr', 'house_skalvyr']
  },
  'storm-gods-wrath': {
    origin: 'iceheart-sea',
    loreText: 'A maul forged during the Great Fracture from the heart of the Iceheart Sea\'s greatest storm. Each strike releases the raw fury of the fracture itself — the world breaking open.',
    relatedLore: ['iceheart-sea', 'the_great_fracture']
  },
  'void-emperors-blade': {
    origin: 'bryngloom-forest',
    loreText: 'Kor-Vasseth\'s legendary blade, forged from a fragment of the void between worlds. Those who face it feel fear that doesn\'t come from their own mind — it comes from the void looking back at them.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth', 'revenant']
  },
  'psychic-abyss': {
    origin: 'sundrift-vale',
    loreText: 'Mor-Vereth\'s final creation — a staff that opens a window into the deepest psychic abyss. The fear it causes is existential: the target glimpses the void where their mind should be.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },
  'plague-sovereign': {
    origin: 'bryngloom-forest',
    loreText: 'Vespera\'s masterwork — a scythe grafted from a living plague-colony. The blight it spreads doesn\'t kill quickly — it transforms, until the target becomes part of Vespera\'s garden.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'wyrd-collapse': {
    origin: 'cragjaw-peaks',
    loreText: 'Fex-Vestara\'s wand, grown from a crystal that has experienced the collapse of a timeline. The Wyrd damage it deals is the shock of reality unravelling at the seams.',
    relatedLore: ['cragjaw-peaks', 'fex-vestara', 'chronarch_conclave']
  },
  'force-of-nature': {
    origin: 'cragjaw-peaks',
    loreText: 'A greatsword forged from the compressed force of the Great Fracture itself. The knockback it delivers isn\'t physical force — it\'s the world pushing back against the wound the Fracture left.',
    relatedLore: ['cragjaw-peaks', 'the_great_fracture', 'deep_alchemists']
  },
  'holy-reckoning': {
    origin: 'sundale',
    loreText: 'The Dawn Vigil\'s ultimate weapon, carried only by its highest inquisitor. Its sacred damage is absolute judgment — the target is found guilty, sentenced, and executed in a single strike.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'night-terrors-embrace': {
    origin: 'bryngloom-forest',
    loreText: 'A dagger that exists as a gateway to the deepest nightmares. The Cult of Forgotten Shadow forged it from the dreamstuff of the root-veil — the shadow DoT is the target\'s own fear eating them alive.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'inferno-sovereign': {
    origin: 'sundale',
    loreText: 'The Solbrand Order\'s greataxe of office, wielded by its mightiest champion. Its ember DoT is the fire of Sol itself — ancient, patient, and utterly inescapable.',
    relatedLore: ['sundale', 'solbrand', 'vael_ardent_sun']
  },
  'tempest-choirmaster': {
    origin: 'iceheart-sea',
    loreText: 'Mer-lyrisa\'s personal harp, tuned to the song of the Iceheart Sea\'s oldest storm. The arcane chord it strikes can level mountains and silence the arrogant.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa', 'tide_choir']
  },
  'soul-harvesters-call': {
    origin: 'bryngloom-forest',
    loreText: 'A Revenant scythe that sings when it nears a soul ready for harvest. The healing it provides is life stolen from the target — an exchange that the ancestor-mounds honor.',
    relatedLore: ['bryngloom-forest', 'revenant', 'kor-vasseth']
  },
  'mind-thief': {
    origin: 'sundrift-vale',
    loreText: 'Mor-Vereth\'s signature rapier — the edge that steals thoughts. The stun it causes isn\'t paralysis but amnesia — for a moment, the target forgets who they are.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },
  'the-consensus': {
    origin: 'frostwood-reach',
    loreText: 'The Scribe-Cartel\'s staff of ultimate authority, inscribed with every law ever written during the Great Revision. Its arcane power comes from the weight of consensus itself — the agreement of thousands.',
    relatedLore: ['frostwood-reach', 'scribe_cartel', 'the_great_revision']
  },

  // =======================================================================
  // ENRICHED ARMOR — UNCOMMON
  // =======================================================================
  'ash-weave-mantle': {
    origin: 'sundale',
    loreText: 'Solbrand ash woven into cloth by Sundale\'s fire-priests. The mantle radiates gentle warmth and offers resistance to flame — a comfort in a world where Sol has gone dark.',
    relatedLore: ['sundale', 'solbrand']
  },
  'rime-scale-vest': {
    origin: 'nordhalla',
    loreText: 'Nordhalla hunters craft these from stel-beast scales overlaid on cured leather. The vest is always cold to the touch, but warms against the skin — as if the cold remembers its purpose.',
    relatedLore: ['nordhalla', 'house_skalvyr']
  },
  'storm-woven-chain': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond smiths forge chain links from sea-storm tempered steel. Each ring carries a static charge that crackles when danger approaches.',
    relatedLore: ['iceheart-sea', 'brine_bond']
  },
  'shadow-step-cloak': {
    origin: 'bryngloom-forest',
    loreText: 'A cloak woven from root-veil silk that absorbs ambient light. The Cult of Forgotten Shadow\'s scouts wear these to move unseen — the darkness isn\'t around them, it IS them.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow', 'root_veil']
  },
  'blight-resistant-greaves': {
    origin: 'bryngloom-forest',
    loreText: 'Vat-Breaker leather-workers discovered that ghost-mycelium tanning resists blight. These greaves have saved countless lives in Bryngloom\'s infected zones.',
    relatedLore: ['bryngloom-forest', 'plaguebringer']
  },
  'wyrd-touched-circlet': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists embed Wyrd-crystal dust in the circlet\'s band. Wearing it grants clarity of thought but leaves a faint ringing in the ears — the frequency of the space between moments.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'sacred-bulwark': {
    origin: 'sundale',
    loreText: 'Dawn Vigil chainmail blessed in Solbrand ash. The sacred damage it reflects on impact serves as divine punishment — the gods remember every strike against their faithful.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'tide-callers-belt': {
    origin: 'iceheart-sea',
    loreText: 'A belt woven from Merrowport kelp-leather, inscribed with tidal runes. It grants resistance to cold and storm — the protection of the sea itself, worn close to the body.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa', 'tide_choir']
  },

  // =======================================================================
  // ENRICHED ARMOR — RARE
  // =======================================================================
  'inferno-plate': {
    origin: 'sundale',
    loreText: 'Full plate forged in Solbrand\'s deepest forges, quenched in liquid ember. The wearer is virtually immune to fire but moves slowly — the weight of Sol\'s protection is not light.',
    relatedLore: ['sundale', 'solbrand']
  },
  'frost-warden-helm': {
    origin: 'nordhalla',
    loreText: 'The helm of Nordhalla\'s frost-guard elite. The frozen immunity comes from a stel-bone lining — the same material that keeps the fjords frozen year-round.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'halvar_skalvyr']
  },
  'tempest-guard': {
    origin: 'iceheart-sea',
    loreText: 'Brine-Bond marine armor reinforced with sea-storm tempered plates. The shock it reflects on impact feels like being struck by lightning — because it literally is.',
    relatedLore: ['iceheart-sea', 'brine_bond']
  },
  'void-shroud': {
    origin: 'bryngloom-forest',
    loreText: 'A shroud of root-veil shadow-silk that the Revenant weave for their spirit-speakers. It grants immunity to fear — because those who wear it have already seen what lies beyond.',
    relatedLore: ['bryngloom-forest', 'revenant', 'root_veil']
  },
  'arcane-aegis': {
    origin: 'frostwood-reach',
    loreText: 'Lunarch plate armor inscribed with memory-glass runes. It absorbs and nullifies arcane attacks — each rune remembers a spell and prevents its repetition.',
    relatedLore: ['frostwood-reach', 'lunarch', 'bri-vessela']
  },
  'plague-doctors-mask': {
    origin: 'bryngloom-forest',
    loreText: 'Vespera\'s plague-doctors wear these masks when harvesting blight samples. The filters grant total immunity to poison and disease — a necessity when working with the Plaguebringer\'s creations.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'wyrd-lock-gauntlets': {
    origin: 'cragjaw-peaks',
    loreText: 'Chronarch gauntlets with Wyrd-crystal joints that nullify magical silencing. Fex-Vestara designed them so that no timeline-split can separate a Chronarch from their magic.',
    relatedLore: ['cragjaw-peaks', 'chronarch_conclave', 'fex-vestara']
  },
  'sacred-judicators-plate': {
    origin: 'sundale',
    loreText: 'The Dawn Vigil\'s ceremonial battle-plate, worn during heretic tribunals. Its sacred damage reflects the judgment of Sol — and its shadow resistance protects against the heretic\'s inevitable curse.',
    relatedLore: ['sundale', 'dawn_vigil']
  },
  'force-ward-vambraces': {
    origin: 'cragjaw-peaks',
    loreText: 'Warden Chain-Lord vambraces forged from the metal of collapsed vats. The force damage they reflect is the kinetic memory of the Groven uprising — chains breaking free.',
    relatedLore: ['cragjaw-peaks', 'warden_chain_lords', 'the_groven_uprising']
  },
  'psychic-dampener': {
    origin: 'sundrift-vale',
    loreText: 'A helm lined with Wyrd-crystal dust that shields against psychic intrusion. False Prophet initiates wear these during indoctrination — to ensure only the RIGHT thoughts get in.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },

  // =======================================================================
  // ENRICHED ARMOR — EPIC
  // =======================================================================
  'suns-coremantle': {
    origin: 'sundale',
    loreText: 'The legendary plate of Vael Ardent-Sun himself. Forged from the core of Sol\'s last ember, it burns with eternal flame and grants near-total immunity to fire. The weight is said to feel like being embraced.',
    relatedLore: ['sundale', 'vael_ardent_sun', 'solbrand']
  },
  'absolute-zero': {
    origin: 'nordhalla',
    loreText: 'Halvar Skalvyr\'s ancestral plate, carved from a single piece of ever-ice. The cold it radiates is so absolute that it freezes the air around the wearer — a walking glacier in human form.',
    relatedLore: ['nordhalla', 'halvar_skalvyr', 'house_skalvyr']
  },
  'thunder-sovereigns-guard': {
    origin: 'iceheart-sea',
    loreText: 'The armor of the Iceheart Sea\'s legendary protector, forged in the heart of the Great Fracture\'s greatest storm. It crackles with permanent lightning and makes the wearer untouchable by stun or shock.',
    relatedLore: ['iceheart-sea', 'the_great_fracture']
  },
  'shadow-of-the-void': {
    origin: 'bryngloom-forest',
    loreText: 'Kor-Vasseth\'s shadow-cloak, woven from the darkness between worlds. It grants immunity to fear and charm — because the void inside it is deeper than any emotion.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth', 'revenant']
  },
  'arcane-perfection': {
    origin: 'frostwood-reach',
    loreText: 'The Lunarch\'s masterpiece of magical armor — a cloth robe inscribed with every spell of the Great Revision. It nullifies silence and confusion with the authority of written law.',
    relatedLore: ['frostwood-reach', 'lunarch', 'the_great_revision']
  },
  'blight-sovereigns-plate': {
    origin: 'bryngloom-forest',
    loreText: 'Vespera\'s personal armor, grown from a living blight-colony. It grants total immunity to poison and disease — not through resistance, but through transformation. The wearer IS the plague.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'holy-terranova': {
    origin: 'sundale',
    loreText: 'The Dawn Vigil\'s ultimate armor — a suit of plate blessed by every living priest of Sol. It reflects sacred damage and grants immunity to charm and fear through the power of absolute faith.',
    relatedLore: ['sundale', 'dawn_vigil', 'vael_ardent_sun']
  },

  // =======================================================================
  // ENRICHED ACCESSORIES — UNCOMMON
  // =======================================================================
  'ember-signet': {
    origin: 'sundale',
    loreText: 'A Solbrand signet ring that glows with inner heat. House Solvan awards these to officers who have proven their devotion through fire.',
    relatedLore: ['sundale', 'solbrand', 'house_solvan']
  },
  'frost-charm': {
    origin: 'nordhalla',
    loreText: 'A charm carved from Nordhalla ice-stone, worn by Skalvyr scouts. It grants advantage against the frozen death that haunts the fjords.',
    relatedLore: ['nordhalla', 'house_skalvyr']
  },
  'storm-bead': {
    origin: 'iceheart-sea',
    loreText: 'A glass bead containing a captured Iceheart lightning strike. Tide-Choir minstrels wear these as proof of their bond with the sea.',
    relatedLore: ['iceheart-sea', 'tide_choir']
  },
  'shadow-loom': {
    origin: 'bryngloom-forest',
    loreText: 'A cloak of shadow-silk that makes the wearer harder to frighten. The Cult of Forgotten Shadow gives these to initiates who have survived their first night in the root-veil.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'wyrd-stone': {
    origin: 'cragjaw-peaks',
    loreText: 'A smooth stone pulsing with Wyrd-frequency. Deep Alchemists carry these to maintain focus during reality-warping experiments.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'plague-vial-pendant': {
    origin: 'bryngloom-forest',
    loreText: 'A pendant containing a vial of neutralized blight — Plaguebringer insurance against their own creations. The irony of building immunity from the thing you worship is not lost on Vespera.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'haste-sash': {
    origin: 'iceheart-sea',
    loreText: 'A Brine-Bond sash enchanted with tide-speed magic. Privateers wear these during ship-boardings — speed is everything when the deck is already tilted.',
    relatedLore: ['iceheart-sea', 'brine_bond']
  },

  // =======================================================================
  // ENRICHED ACCESSORIES — RARE
  // =======================================================================
  'inferno-loop': {
    origin: 'sundale',
    loreText: 'A ring of Solbrand gold set with an ember that never dies. Its burn immunity and fire damage make it the most sought-after treasure in Sundale\'s undercity.',
    relatedLore: ['sundale', 'solbrand']
  },
  'glacial-focus': {
    origin: 'nordhalla',
    loreText: 'An amulet containing a drop of ever-ice from Nordhalla\'s deepest glacier. Its freeze effect and cold immunity make it invaluable for traversing the frost-tithe territories.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'frost_tithe']
  },
  'thunder-cage': {
    origin: 'iceheart-sea',
    loreText: 'A cage of sea-storm crystal containing a living spark. Mer-lyrisa designed these for Tide-Choir combat-bards who need their storm damage portable.',
    relatedLore: ['iceheart-sea', 'mer-lyrisa', 'tide_choir']
  },
  'void-gazers-eye': {
    origin: 'bryngloom-forest',
    loreText: 'A trinket shaped like an eye that sees into the void. Revenant shamans use it to channel shadow and Wyrd energy — but staring into it too long makes the void stare back.',
    relatedLore: ['bryngloom-forest', 'revenant']
  },
  'arcane-resonator': {
    origin: 'frostwood-reach',
    loreText: 'A Lunarch ring that resonates with arcane frequencies. Bri-Vessela gave these to her most trusted researchers — their silenced immunity is vital in the memory-fog.',
    relatedLore: ['frostwood-reach', 'lunarch', 'bri-vessela']
  },
  'blight-wrapped-relic': {
    origin: 'bryngloom-forest',
    loreText: 'A necklace wrapping an ancient relic in ghost-mycelium. The blight that protects it also grants the wearer total immunity to poison and disease — Vespera\'s paradox of protection.',
    relatedLore: ['bryngloom-forest', 'plaguebringer', 'vespera']
  },
  'wyrd-anchor': {
    origin: 'cragjaw-peaks',
    loreText: 'A trinket of Wyrd-crystal and chronarch metal. Fex-Vestara created these as anchors against Wyrd-corruption — they keep the wearer grounded when reality shifts.',
    relatedLore: ['cragjaw-peaks', 'chronarch_conclave', 'fex-vestara']
  },
  'psychic-lens': {
    origin: 'sundrift-vale',
    loreText: 'A ring of Wyrd-crystal that focuses psychic energy. Mor-Vereth\'s inner circle wear these to project fear — and to see the fears of others.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },

  // =======================================================================
  // ENRICHED ACCESSORIES — EPIC
  // =======================================================================
  'phoenix-ash-ring': {
    origin: 'sundale',
    loreText: 'A ring forged from the ash of a phoenix that died during the Sundering. Its burn immunity and sacred flame are the last remnants of a bird that carried hope between worlds.',
    relatedLore: ['sundale', 'the_sunderers', 'the_memory_wars']
  },
  'absolute-zero-pendant': {
    origin: 'nordhalla',
    loreText: 'A pendant containing the concept of absolute cold. Halvar Skalvyr\'s shamans say it was carved from the frost-tithe itself — the price the land pays for the Skalvyr\'s survival.',
    relatedLore: ['nordhalla', 'house_skalvyr', 'frost_tithe']
  },
  'storm-majestys-crown': {
    origin: 'iceheart-sea',
    loreText: 'The legendary amulet of the Iceheart Sea\'s storm-majesty. It contains the essence of the Great Fracture\'s thunder — the sound of a world being torn apart and rebuilt.',
    relatedLore: ['iceheart-sea', 'the_great_fracture']
  },
  'shadow-throne-signet': {
    origin: 'bryngloom-forest',
    loreText: 'Kor-Vasseth\'s signet ring, symbol of his authority over the ancestor-mounds. Its shadow and Wyrd power are absolute — the dead obey its bearer without question.',
    relatedLore: ['bryngloom-forest', 'kor-vasseth', 'revenant']
  },
  'mind-palace-key': {
    origin: 'sundrift-vale',
    loreText: 'Mor-Vereth\'s masterwork — a key that opens doors in the mind. Its psychic immunity protects the wearer from all mental intrusion — because Mor-Vereth is already inside your head.',
    relatedLore: ['sundrift-vale', 'mor-vereth', 'false_prophet']
  },

  // =======================================================================
  // ENRICHED CONSUMABLES — UNCOMMON
  // =======================================================================
  'ember-shield-draught': {
    origin: 'sundale',
    loreText: 'Solbrand fire-priests brew this from ash-sap and sacred oil. The ember resistance it grants coats the skin in a thin layer of protective ash — but the sluggishness it causes is real.',
    relatedLore: ['sundale', 'solbrand']
  },
  'frost-walker-brew': {
    origin: 'nordhalla',
    loreText: 'A Nordic elixir that slows the heart to near-freezing. Nordhalla scouts drink this before crossing ice-choked fjords — the cold resistance comes at the cost of weaker strikes.',
    relatedLore: ['nordhalla', 'house_skalvyr']
  },
  'storm-glass-vial': {
    origin: 'iceheart-sea',
    loreText: 'A vial of captured lightning from the Iceheart Sea\'s storms. The storm spell damage is potent, but the electricity makes your hands shake uncontrollably for hours.',
    relatedLore: ['iceheart-sea', 'tide_choir']
  },
  'shadow-blend': {
    origin: 'bryngloom-forest',
    loreText: 'A paste made from Bryngloom\'s bioluminescent mushrooms. Cult of Forgotten Shadow operatives use it before infiltration missions — the hallucinations are a price they pay gladly.',
    relatedLore: ['bryngloom-forest', 'cult_of_forgotten_shadow']
  },
  'scroll-of-warding': {
    origin: 'frostwood-reach',
    loreText: 'A Scribe-Cartel warding scroll inscribed with protective runes from the Great Revision. It grants broad resistance but drains vitality — the law protects, but the law also demands sacrifice.',
    relatedLore: ['frostwood-reach', 'scribe_cartel', 'the_great_revision']
  },
  'antidote-of-last-resort': {
    origin: 'cragjaw-peaks',
    loreText: 'Deep Alchemists brew this from Wyrd-crystal dissolved in acid. It purges all toxins but the process is violent — nausea, weakness, and the taste of reality dissolving.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },

  // =======================================================================
  // ENRICHED CONSUMABLES — RARE
  // =======================================================================
  'solbrands-blessing': {
    origin: 'sundale',
    loreText: 'A golden potion blessed by Vael Ardent-Sun himself. It grants immense sacred and ember spellpower and restores health — but the divine light burns the impure, draining charisma.',
    relatedLore: ['sundale', 'vael_ardent_sun', 'solbrand']
  },
  'wyrd-antidote': {
    origin: 'cragjaw-peaks',
    loreText: 'A Deep Alchemist formula that neutralizes Wyrd contamination. It heals and grants Wyrd resistance, but the memory loss it causes is unpredictable — you might forget the poison, or you might forget your name.',
    relatedLore: ['cragjaw-peaks', 'deep_alchemists']
  },
  'scroll-of-ice-storm': {
    origin: 'nordhalla',
    loreText: 'A scroll written in frost-runes during the coldest Nordhalla winter on record. It unleashes the fury of an Iceheart Sea blizzard — cold and storm damage amplified by frozen fury.',
    relatedLore: ['nordhalla', 'halvar_skalvyr', 'house_skalvyr']
  },
  'plague-immunity-serum': {
    origin: 'bryngloom-forest',
    loreText: 'A Vat-Breaker concoction that grants temporary total immunity to disease and poison. The taste is unbearable — but freedom from Vespera\'s plagues is worth any suffering.',
    relatedLore: ['bryngloom-forest', 'vat_breakers_guild', 'plaguebringer']
  },
  'berserker-mead': {
    origin: 'nordhalla',
    loreText: 'Hark Ash-Hammer\'s legendary mead, brewed from stel-beast blood and Nordhalla honey. It grants immense strength but clouds judgment — the warrior becomes the battle, and the battle becomes everything.',
    relatedLore: ['nordhalla', 'hark_ash_hammer', 'house_skalvyr']
  },
  'scroll-of-shadows': {
    origin: 'bryngloom-forest',
    loreText: 'A scroll written in ink that absorbs light. The Revenant use it to grant shadow and Wyrd power — but the cost is a weakened connection to the sacred, as if the light rejects the reader.',
    relatedLore: ['bryngloom-forest', 'revenant']
  },

  // =======================================================================
  // ENRICHED CONSUMABLES — EPIC
  // =======================================================================
  'elixir-of-the-tempest': {
    origin: 'iceheart-sea',
    loreText: 'A legendary elixir brewed during the Great Fracture itself. It grants immense storm and arcane power but slowly destroys the body — the same energy that built the world can unbuild it.',
    relatedLore: ['iceheart-sea', 'the_great_fracture']
  },
  'phoenix-tear': {
    origin: 'sundale',
    loreText: 'A single tear from a phoenix that fell during the Sundering. It restores massive health and grants near-total fire immunity — but the pain of rebirth is said to be the most exquisite agony in existence.',
    relatedLore: ['sundale', 'the_sunderers']
  },
  'scroll-of-the-void': {
    origin: 'bryngloom-forest',
    loreText: 'A scroll that opens a window to the void between worlds. The shadow and Wyrd power it grants is immense — but the risk of losing your mind to the darkness is real and permanent.',
    relatedLore: ['bryngloom-forest', 'the_memory_wars', 'cult_of_forgotten_shadow']
  }
};

export default ITEM_LORE;
