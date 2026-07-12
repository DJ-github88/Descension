import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LORE_DICTIONARY } from '../../data/loreDictionary';
import { SUBREGIONS } from '../../data/subregions';
import useAuthStore from '../../store/authStore';
import './styles/MapMakingSection.css';

const STORAGE_KEY = 'mapMakingSectionState_v1';
const NOTES_KEY = 'mapMakingSectionNotes_v1';
const CHECKLIST_KEY = 'mapMakingSectionChecklist_v4';

const REGION_COLORS = {
  'frostwood-reach': { primary: '#4a3728', accent: '#8b7355', fog: '#c8c0b0', water: '#5a6a7a' },
  'nordhalla': { primary: '#1a3a5c', accent: '#7ec8e3', ice: '#e8f0f5', stone: '#2a2a2a' },
  'sundale': { primary: '#5a1a00', accent: '#cc4400', ash: '#3a3a3a', glow: '#ff6622' },
  'iceheart-sea': { primary: '#1a3a5a', accent: '#c4a040', sea: '#0a1a2a', gold: '#c4a040' },
  'cragjaw-peaks': { primary: '#2a3a4a', accent: '#7a8a5a', snow: '#e8e8e8', ice: '#a8c0d0' },
  'sundrift-vale': { primary: '#8b6914', accent: '#d4c5a0', grass: '#a8a070', sky: '#2a2a2a' },
  'bryngloom-forest': { primary: '#1a4a2a', accent: '#4a8a5a', bog: '#3a4a3a', glow: '#3affe0' }
};

const REGION_DISPLAY = [
  {
    id: 'frostwood-reach', name: 'Frostwood Reach', tagline: 'The Mist-Archivists\' Forest',
    placement: 'Northeast of the world. Divided NORTH (cold) and SOUTH (warm).',
    inkarnate: { base: 'ironwood forest + fog', palette: ['#4a3728', '#8b7355', '#c8c0b0'], climateNote: 'Cool-temperate south, sub-arctic north' }
  },
  {
    id: 'nordhalla', name: 'Nordhalla', tagline: 'The Glacier Cathedral',
    placement: 'Far north. Coasts run along the SOUTH and EAST.',
    inkarnate: { base: 'glaciers + black stone', palette: ['#1a3a5c', '#7ec8e3', '#2a2a2a'], climateNote: 'Polar interior, cold-temperate coasts' }
  },
  {
    id: 'sundale', name: 'Sundale', tagline: 'The Ashlands of the Buried Sun',
    placement: 'The center. The warmest. Forested half-island (the Glitterwood) extends from the south-east.',
    inkarnate: { base: 'volcanic ash + basalt', palette: ['#5a1a00', '#cc4400', '#3a3a3a'], climateNote: 'Hot, dry, ash-fall, cool at night' }
  },
  {
    id: 'iceheart-sea', name: 'Iceheart Sea', tagline: 'The Storm-Lashed Heart',
    placement: 'The largest continent by area: encompasses the central ocean and all its islands. West and center-west.',
    inkarnate: { base: 'open sea + volcanic islands', palette: ['#1a3a5a', '#c4a040', '#0a1a2a'], climateNote: 'Perpetual storms, never freezes' }
  },
  {
    id: 'cragjaw-peaks', name: 'Cragjaw Peaks', tagline: 'The Howling Vertical Labyrinth',
    placement: 'Far east. A vertical mountain range. Perpetual blizzard above the mid-line.',
    inkarnate: { base: 'granite peaks + whiteout', palette: ['#2a3a4a', '#7a8a5a', '#e8e8e8'], climateNote: 'Alpine, blizzard above mid-line' }
  },
  {
    id: 'sundrift-vale', name: 'Sundrift Vale', tagline: 'The Starless Steppe',
    placement: 'South. A wind-swept steppe beneath a permanently starless sky.',
    inkarnate: { base: 'endless grass + dark sky', palette: ['#8b6914', '#d4c5a0', '#2a2a2a'], climateNote: 'Cold-temperate steppe, perpetual wind' }
  },
  {
    id: 'bryngloom-forest', name: 'Bryngloom Forest', tagline: 'The Twilight Swamp of the First Contract',
    placement: 'Southwest. Twilight ironwood canopy with a vast central lake (The Great Mere) dotted with small islands.',
    inkarnate: { base: 'peat-bog + bioluminescence', palette: ['#1a4a2a', '#4a8a5a', '#3affe0'], climateNote: 'Damp, mild, twilight year-round' }
  }
];

const CATEGORIES = [
  { id: 'terrain',   label: 'Terrain & Landmass',   icon: 'fas fa-mountain',       color: '#8b6914', help: 'Mountains, forests, deserts, swamps, ice fields, ash plains: the main biome shapes.' },
  { id: 'water',     label: 'Water & Ice',          icon: 'fas fa-water',         color: '#1a3a5a', help: 'Rivers, lakes, seas, ice flows, glaciers, ocean currents, bays.' },
  { id: 'coast',     label: 'Coastlines & Shores',  icon: 'fas fa-umbrella-beach',color: '#7a8a5a', help: 'Cliffs, beaches, harbors, fjords, estuaries, capes, peninsulas.' },
  { id: 'cities',    label: 'Settlements & Cities', icon: 'fas fa-city',          color: '#c4a040', help: 'Cities, towns, villages, camps, ports, fortresses, monasteries.' },
  { id: 'landmarks', label: 'Landmarks & Ruins',    icon: 'fas fa-landmark',      color: '#7ec8e3', help: 'Special structures: tombs, monoliths, ruins, shrines, monuments.' },
  { id: 'routes',    label: 'Routes & Borders',     icon: 'fas fa-route',         color: '#cc4400', help: 'Walls, passes, bridges, checkpoints, trade routes, sea lanes.' },
  { id: 'effects',   label: 'Atmospheric Effects',  icon: 'fas fa-smog',          color: '#3affe0', help: 'Fog overlays, storm-vortexes, blizzards, ash clouds, glow patches.' },
  { id: 'labels',    label: 'Labels & Decoration',  icon: 'fas fa-font',          color: '#e8d8b8', help: 'Region names, subregion names, point-of-interest labels.' }
];

// Action types get visual icons and prefix
const ACTION_TYPES = {
  DRAW:   { icon: 'fas fa-pen',   color: '#c4a040', verb: 'DRAW'   },
  PLACE:  { icon: 'fas fa-map-marker-alt', color: '#c4a040', verb: 'PLACE'  },
  MARK:   { icon: 'fas fa-thumbtack', color: '#7ec8e3', verb: 'MARK'   },
  ADD:    { icon: 'fas fa-plus',  color: '#8b6914', verb: 'ADD'    },
  ICON:   { icon: 'fas fa-icons', color: '#5a8a4a', verb: 'ICON'   },
  COLOR:  { icon: 'fas fa-palette', color: '#cc4400', verb: 'COLOR' },
  FOG:    { icon: 'fas fa-cloud', color: '#c8c0b0', verb: 'FOG'    },
  LABEL:  { icon: 'fas fa-tag',   color: '#e8d8b8', verb: 'LABEL'  },
  SHOW:   { icon: 'fas fa-eye',   color: '#b8a888', verb: 'SHOW'   }
};

// Each checklist item is now: { action, text, why, inkarnate, subregion? }
const CHECKLIST_TEMPLATE = {
  'frostwood-reach': [
    // TERRAIN
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Southern half: warm peat-brown forest (#4a3728 base, #8b7355 accents)',
      why: 'The Southern half of the Reach is a warm, peat-brown forest zone governed by House Thalreth. Bordered by the Velling Pass to the west and the Eastern Fens, it is surrounded by dense groves of giant ironwood trees, winding silt-roads, and the Bramble Heath. It is placed here to show the primary habitable area of the forest where the insulating mist keeps temperatures warm enough for agriculture.',
      inkarnate: 'Inkarnate color wash'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Northern half: cold granite tundra, sparse twisted ironwood',
      why: 'The Northern half of the Reach is the barren, sub-arctic tundra known as the Frostfang Wastes. Bordered by the glacier walls of Nordhalla to the north and the southern forest, it is surrounded by desolate granite plains, frozen lakes, and sparse twisted ironwood trees. It represents the frontier shield of the region, guarding against the advancing freeze-front.',
      inkarnate: 'Inkarnate color wash'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Ironwood Heart: a glowing white tree in the deepest grove',
      why: 'The Ironwood Heart is a legendary, glowing white ironwood tree. Located at the geometric center of the deepest grove in the Reach, it is surrounded by petrified ironwood giants and perpetual twilight mist. It is placed there as the sacred origin point of the forest\'s runic magic, whose roots anchor the Tapestry-Wards and keep the insulating mist stable.',
      inkarnate: 'Forest biome + custom tree icon'
    },
    {
      category: 'terrain',
      action: 'MARK',
      text: 'Bramble Heath: crimson thorn-flowers on thorn-covered heathland',
      why: 'The Bramble Heath is a vast, desolate field of petrified brambles and crimson thorn-flowers. Located in the eastern quadrant of the Frostwood Reach, it is surrounded by dense ironwood groves and treacherous peat-bogs. It is placed there as a natural geographic barrier and a lawless refuge where Briaran outlaws construct their hidden thorn-locked camps.',
      inkarnate: 'Inkarnate bramble texture'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Eastern Fens: peat-bog, marsh, drowned ironwood groves',
      why: 'The Eastern Fens are a lawless, waterlogged marshland on the eastern fringe of the Reach. Dotted with peat-bogs, sinkholes, and drowned ironwood trees, they are surrounded by the Bramble Heath and the cold northern tundra. They serve as a natural border, populated by outlaw clans and ancient burial mounds like the Mistbarrow.',
      inkarnate: 'Marsh/swamp biome'
    },
    // WATER
    {
      category: 'water',
      action: 'DRAW',
      text: 'Mirror Mere: perfectly still lake, never ripples',
      why: 'Mirror Mere is a perfectly still, glass-like lake in the heart of the Frostwood Reach. Surrounded by dense ironwood groves, its waters never ripple. It was established here because the lake\'s magical glass-like water is crucial for Mimir divination and memory retrieval, allowing them to carve the wooden masks that protect people from the memory-erasing fog.',
      inkarnate: 'Small lake icon'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'Iron Lake: frozen 44 weeks/year, mirror-still in summer',
      why: 'Iron Lake is a massive, sub-arctic lake in the northern Frostfang Wastes. Frozen for 44 weeks of the year and mirror-still in summer, it is surrounded by cold granite cliffs and barren tundra. It is placed there as a key geographic landmark, serving as the primary freshwater source for the Grevtholm keep and a natural defense against Jutul warbands.',
      inkarnate: 'Frozen lake icon'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'The Shifting Fen: geography rearranges itself overnight',
      why: 'The Shifting Fen is a mysterious, fog-shrouded swamp wreathed in wild magic. Located on the eastern borders of the Reach, it is surrounded by bottomless peat-bogs and drowned ironwood groves. It is placed there as an atmospheric hazard where paths and terrain physically rearrange overnight, making the eastern approach impassable.',
      inkarnate: 'Fog-covered marsh'
    },
    // COAST
    {
      category: 'coast',
      action: 'DRAW',
      text: 'Velling Pass: narrow valley connecting to Sundale',
      why: 'Velling Pass is a narrow, cliff-walled valley connecting the Frostwood Reach to Sundale. Situated along the southwestern border, it is surrounded by steep peat-stone ridges and geothermal hot springs. It was placed there as the sole natural land corridor between the regions, serving as a critical checkpoint and trade corridor.',
      inkarnate: 'Pass/mountain-gap icon'
    },
    // CITIES
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Greymark Keep: capital, in the southern reach',
      why: 'Greymark Keep is the fortified peat-stone capital and royal seat of House Thalreth. Built on a massive rise in the warm, peat-brown southern reach, it is surrounded by dense ironwood groves, the Bramble Heath, and protected by the towering Sunder-Palisade wall. It was founded here to control the critical Velling Pass trade route to Sundale and to anchor the Tapestry-Wards, keeping the memory-erasing fog stable across the southern borders.',
      inkarnate: 'Capital city icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Scribes\' Tower: vertical parchment-cathedral in a hollowed tree',
      why: 'Scribes\' Tower is a vertical parchment-cathedral and the central scriptorium of the Scribe-Cartel. Built inside a hollowed, petrified giant ironwood tree, it is surrounded by dense, fog-choked canopy groves. It is placed there to tap into the resin-rich wood needed to manufacture the Cartel\'s monopoly ink, serving as the legal archive where all property deeds and regional history are recorded.',
      inkarnate: 'Tower icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Mirror Mere village: Mimir mask-carver settlement (200 pop)',
      why: 'Mirror Mere village is a small lakeside settlement home to the mask-carving Mimir. Located on the shores of Mirror Mere, it is surrounded by perfectly still waters that never ripple and dense ironwood groves. It was established here because the lake\'s magical glass-like water is crucial for Mimir divination and memory retrieval, allowing them to carve the wooden masks that protect people from the memory-erasing fog.',
      inkarnate: 'Village icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Greythorn Copse: fortified Thalren/Briaran copse',
      why: 'Greythorn Copse is a fortified woodland settlement serving as a joint refuge for registered Thalren citizens and undocumented Briaran outlaws. Hidden deep within a dense thicket of red-flowered thorn bushes, it is surrounded by treacherous briar patches. It was placed in this remote borderland to escape the Scribe-Cartel\'s ledger-checks, serving as a political flashpoint where the forgotten outlaws organize.',
      inkarnate: 'Village icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Skald\'s Landing: Skald trading post on the northern river',
      why: 'Skald\'s Landing is a riverside trading post and port settlement. Positioned along the northern river, it is surrounded by cold granite tundra and sparse ironwood trees. It was founded here to facilitate riverbound trade and serve as the official border crossing point between the Frostwood Reach and the glacier kingdom of Nordhalla.',
      inkarnate: 'Port icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Grevtholm: fortified stone keep in the Frostfang Wastes',
      why: 'Grevtholm is the northernmost fortified stone keep of the Reach, carved from dark volcanic rock. Situated in the freezing, windswept Frostfang Wastes, it is surrounded by barren granite plains, sparse twisted ironwood trees, and the frozen Iron Lake. It was built there as a military outpost to watch the northern ice-flows and guard the border against raiding Jutul warbands.',
      inkarnate: 'Fortress icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Meadowglen Crossing: waystation between Frostwood and Sundale',
      why: 'Meadowglen Crossing is a bustling crossroads waystation and trade hub. Situated in a fertile valley where the cold peat-brown forest transitions into the warm sun-drenched plains of Sundale, it is surrounded by geothermal hot springs and green pastures. It is placed there to handle trade between northern woodwrights and southern farmhouses, serving as a critical checkpoint before the Velling Pass.',
      inkarnate: 'Town icon'
    },
    // LANDMARKS
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Mistbarrow: pre-Thalreth burial mound, its own weather system',
      why: 'Mistbarrow is an ancient, pre-Thalreth burial mound built long before the Binding of the buried star. Located in the lawless Eastern Fens, it is surrounded by waterlogged peat-bogs and drowned ironwood trees. It is an untouched sacred site that generates its own localized weather bubble, constantly raining in a perfect circle above the tombs of the prehistoric kings.',
      inkarnate: 'Mound/ruin icon'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'The Stone Circles: pre-Binding runic monoliths in the Frostfang',
      why: 'The Stone Circles are prehistoric runic pillars wreathed in ancient protective wards. Located in the frozen plains of the Frostfang Wastes, they are surrounded by barren ice sheets and are tended by the nomadic Stone-Speakers who seek to read their pre-Binding celestial alignments.',
      inkarnate: 'Stone circle icon'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Bearsback Summit: double-peaked granite mountain in the far north',
      why: 'Bearsback Summit is a prominent double-peaked granite mountain. Located in the sub-arctic tundra of the far north, it is surrounded by the frozen reach of the Frostfang and represents the highest geographic peak in the region, steeped in local Skald folklore.',
      inkarnate: 'Peak icon'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Ledger Halls: collapsed underground archive, high-danger ruin',
      why: 'Ledger Halls is a collapsed underground vault and archival ruin. Located in the deep southern forest of the Reach, it is surrounded by petrified tree roots and ancient catacombs. It remains filled with rogue spirit-archivists and forbidden histories that predate the Sovereign Ledger.',
      inkarnate: 'Ruin icon'
    },
    // ROUTES
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Ironwood Palisade: fortified check-posts along the border',
      why: 'The Ironwood Palisade is a towering border defense wall made of petrified ironwood trunks and peat-stone watchtowers. Spanning the southern frontier of the Reach, it is surrounded by dense forest and security clearings. It was built by House Thalreth to control all entry and exit, serving as the physical barrier that keeps the memory-erasing fog contained within the Reach\'s borders.',
      inkarnate: 'Wall icon with watchtowers'
    },
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Silt-roads marked by rusted lantern-posts (throughout southern reach)',
      why: 'The Silt-roads are the primary highway network of the southern Reach, paved with compacted volcanic ash and peat. Surrounded by the dense, fog-choked forest, they are marked by magical rusted lantern-posts that burn heartwood resin to guide travelers safely through the memory-erasing mists.',
      inkarnate: 'Dotted line + lantern icons'
    },
    // EFFECTS
    {
      category: 'effects',
      action: 'FOG',
      text: 'Fog overlay: thickest in the south, thinnest in the Frostfang',
      why: 'The memory-erasing fog is the defining protective barrier of the Frostwood Reach. Shrouding the entire forest (thickest in the south near the borders, thinnest in the northern wastes), it is surrounded by the natural boundaries of the Reach. It exists because House Thalreth traded spatial clarity for insulating mist to prevent the forest from freezing under the northern front.',
      inkarnate: 'Inkarnate fog/wash tool'
    },
    {
      category: 'effects',
      action: 'FOG',
      text: 'Mistbarrow: its own weather bubble with rain inside',
      why: 'Mistbarrow is an atmospheric anomaly where rain constantly falls inside a tiny localized circle, wreathed in protective ancient mist and surrounded by the swampy Eastern Fens.',
      inkarnate: 'Local fog circle'
    },
    {
      category: 'effects',
      action: 'COLOR',
      text: 'Briaran hidden groves: small thorn-clusters as secret markers',
      why: 'The Briaran hidden groves are secret forest clearings where the outlawed descendants of the erased House Viridane hide. Surrounded by dense, impassable bramble hedges, they are marked on maps only by small thorn-cluster icons.',
      inkarnate: 'Small thorn icons scattered'
    },
    // LABELS
    {
      category: 'labels',
      action: 'LABEL',
      text: 'Subregion labels: Southern Reach, Frostfang Wastes, Eastern Fens',
      why: 'Key geographical boundaries defining the territorial zones of the Reach.',
      inkarnate: 'Italic small text'
    }
  ],
  'nordhalla': [
    // TERRAIN
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Glacier-Heart (interior): polar, perpetual blizzard, ice fields',
      why: 'The Glacier-Heart is the polar interior of Nordhalla. Wreathed in perpetual blizzard winds, it is surrounded by towering ice sheets and deep crevasses. It is an uninhabitable whiteout expanse where the advancing freeze-front was halted by House Skalvyr\'s ancient runic compact.',
      inkarnate: 'Ice biome'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Fjord-Coast (east): cold-temperate maritime, black granite fjords',
      why: 'The Fjord-Coast is the cold-temperate maritime eastern face of Nordhalla. Carved into black granite cliffs, it is cut deep by dark saltwater inlets and glaciers. It is the only habitable area in the region, where the majority of the Skald clans and fastboende fishermen reside.',
      inkarnate: 'Coast + stone texture'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Southern Shore: volcanic black-sand beaches, geothermal hot springs',
      why: 'The Southern Shore of Nordhalla is a volcanic coastline facing Sundale. Surrounded by geothermal hot springs and black-sand beaches, it features the mildest climate in the region, serving as a key trading zone where warm southern goods meet cold northern furs.',
      inkarnate: 'Black-sand beach'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Bearsbeard\'s Beak: highest peak, granite tooth in the north',
      why: 'Bearsbeard\'s Beak is a colossal, double-peaked mountain peak that resembles a granite tooth. Located in the cold northern ranges, it is surrounded by shifting glaciers. It is the geographic anchor of Nordhalla, chosen as the site where the royal Frosthold Citadel is carved directly into the rock.',
      inkarnate: 'Peak icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Skadi\'s Col: wind-scoured gap between two peaks',
      why: 'Skadi\'s Col is a wind-scoured mountain pass between two towering peaks. Located in the northern interior, it is surrounded by sheer ice cliffs. The winds here are so violent they can strip flesh from bone in minutes, making it a legendary and highly dangerous natural barrier.',
      inkarnate: 'Mountain pass icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Hunger Glaciers: shifting whiteout expanse',
      why: 'The Hunger Glaciers are a shifting whiteout expanse of slow-moving ice fields in the western interior. Surrounded by barren granite mountains, they represent the advancing edge of the polar ice sheet that mysteriously stopped during the Binding.',
      inkarnate: 'Glacier texture'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'The Still Crag: cliff face in absolute silence',
      why: 'The Still Crag is a massive cliff face wreathed in absolute silence. Located in the Glacier-Heart, it is surrounded by frozen plains. It is a sacred site where the Rime-Born perform their memory-freezing rites, utilizing the eerie lack of wind to meditate without distraction.',
      inkarnate: 'Cliff face icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Rimor\'s Hearth: buried mountain keep, still warm from steam vents',
      why: 'Rimor\'s Hearth is a buried mountain keep wreathed in volcanic steam vents. Located deep within the northern range, it is surrounded by barren ice fields. It is an ancient, half-buried ruin that remains warm from residual geothermal energy, serving as a sanctuary for travelers.',
      inkarnate: 'Ruin icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Rook\'s Promontory: black obsidian cliff over the frozen sea',
      why: 'Rook\'s Promontory is a sheer cliff of black volcanic obsidian towering over the frozen northern sea. Surrounded by icy winds, it is a sacred site for the Corvani raven-kin, who use the high volcanic ledge to launch their gliders and tend to their nesting eyries.',
      inkarnate: 'Cliff + raven icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Bloodhammer Sump: volcanic forge-crater, the industrial heart',
      why: 'Bloodhammer Sump is a volcanic forge-crater located in the southern range of Nordhalla. Surrounded by basalt walls and geothermal steam, it is the industrial heart of the region where Skald berserkers smelt runic iron plates and forge cold-iron weapons.',
      inkarnate: 'Volcanic crater icon'
    },
    // COAST
    {
      category: 'coast',
      action: 'DRAW',
      text: 'Southern coastline: long, broken, facing Sundale',
      why: 'The southern coastline is a long, broken border zone facing Sundale. Surrounded by black-sand beaches and geothermal vents, it represents the boundary where the cold northern waters meet the warm currents of the south.',
      inkarnate: 'Coastal line'
    },
    {
      category: 'coast',
      action: 'DRAW',
      text: 'Eastern Fjord-Coast: black granite fjords cut deep into cliffs',
      why: 'The eastern Fjord-Coast consists of deep saltwater channels cut into sheer black granite cliffs. Surrounded by pine-wooded hills and coastal glaciers, it represents the primary maritime boundary where settlements and fishing harbors are placed.',
      inkarnate: 'Fjord texture'
    },
    // CITIES
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Frosthold Citadel: royal seat carved into Bearsbeard\'s Beak',
      why: 'Frosthold Citadel is the royal seat of House Skalvyr. Carved directly into the granite face of Bearsbeard\'s Beak, it is surrounded by deep glaciers and steep cliffs, serving as the administrative and military capital of Nordhalla.',
      inkarnate: 'Fortress icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'The Frozen Archive: glacier-tomb with dead standing in ice',
      why: 'The Frozen Archive is a glacier-tomb and scriptorium located in the eastern fjords. Surrounded by sheer ice walls, it houses the frozen bodies of ancient Augurs preserved standing in the ice, serving as the historical record-center of the kingdom.',
      inkarnate: 'Tomb/ruin icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Fjord-Gate: massive harbor with stone doors to block storms',
      why: 'Fjord-Gate is a massive harbor city built at the mouth of the eastern fjords. Surrounded by towering black granite cliffs, it features colossal stone sea-doors that can be closed to block polar storms, serving as the primary trade port of the north.',
      inkarnate: 'Port icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Vargtor: watchtower on a granite tor (150 pop)',
      why: 'Vargtor is a tall stone watchtower built on a granite tor in the southern interior of Nordhalla. Surrounded by barren plains where packs of wolves gather at its base, it serves as a military lookout and a key border checkpoint.',
      inkarnate: 'Tower icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Eldonholm: pure-blooded Skald fishing town',
      why: 'Eldonholm is a traditional Skald fishing town located in the eastern fjords. Protected by high granite cliffs and wreathed in cold sea fog, it is populated exclusively by pure-blooded Skald clans who refuse to allow any foreign immigrants.',
      inkarnate: 'Village icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Xardin\'s Hearth: southernmost port, volcanic vent keeps harbor ice-free',
      why: 'Xardin\'s Hearth is Nordhalla\'s southernmost port town. Located on the volcanic southern shore, it is surrounded by geothermal hot springs that keep the harbor ice-free year-round, serving as a busy trade hub where Skalds and Merryn sailors mingle.',
      inkarnate: 'Port + spring icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Smuggler\'s Cove: Fredløse outlaw hangout on the southern shore',
      why: 'Smuggler\'s Cove is a hidden coastal inlet on the rocky southern shore. Surrounded by steep obsidian cliffs and treacherous reefs, it serves as a lawless haven for Fredløse outlaws who run smuggling operations to bypass taxes.',
      inkarnate: 'Hidden cove icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Vespera\'s Perch: Corvani cliff settlement on the Fjord-Coast',
      why: 'Vespera\'s Perch is a Corvani cliffside settlement. Situated on the sheer walls of the eastern Fjord-Coast, it is surrounded by rocky ledges and windy skies, consisting of wood-and-stone eyries lashed to the black granite.',
      inkarnate: 'Cliff settlement icon'
    },
    // LANDMARKS
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'The Spar\'s Folly: half-built black-granite sea-wall, abandoned',
      why: 'The Spar\'s Folly is a half-built, abandoned sea-wall made of black granite. Located on the southern shore, it is surrounded by freezing sea-currents. It was a failed project by the Icechamber Syndicate, now haunted by frozen stonemasons.',
      inkarnate: 'Wall ruin icon'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Skirmour\'s Crag: southern peak, on the border with Cragjaw (Jutul-sacred)',
      why: 'Skirmour\'s Crag is a towering peak on the southern border. Surrounded by steep ash-slopes and volcanic ravines, it is a sacred site to the Jutul giants. No human has ever reached its summit, which is marked with runic ward-stones.',
      inkarnate: 'Peak icon with red mark'
    },
    // ROUTES
    {
      category: 'routes',
      action: 'DRAW',
      text: 'The Sunder-Wall: ice/granite barrier cutting through the interior',
      why: 'The Sunder-Wall is a colossal barrier of stone, ice, and petrified wood cutting through the interior of Nordhalla. Surrounded by barren tundra, it was built by King-Jarl Halvar to regulate migration, enforce trade taxes, and control the clans.',
      inkarnate: 'Long wall icon'
    },
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Glacier Bargain Stone at Vargtor: deep carvings record Skalvyr compact',
      why: 'The Glacier Bargain Stone is a colossal runic monument located near Vargtor. Surrounded by barren rocky plains, it features deep carvings detailing the compact between House Skalvyr and the ice-front, validating the boundaries of the kingdom.',
      inkarnate: 'Stone monument icon'
    },
    // EFFECTS
    {
      category: 'effects',
      action: 'FOG',
      text: 'Perpetual blizzard overlay on the Glacier-Heart and Frostmaw peaks',
      why: 'The perpetual blizzard is a dense whiteout weather overlay shrouding the polar interior of Nordhalla. Surrounded by glaciers and high peaks, it represents the raw, unbound force of the freeze-front that threatens to consume the land.',
      inkarnate: 'Whiteout/blizzard tool'
    },
    {
      category: 'effects',
      action: 'COLOR',
      text: 'Geothermal vents as small orange dots in the south',
      why: 'The geothermal vents are small heat sources dotting the southern volcanic shore. Surrounded by obsidian sand and hot springs, they are placed to indicate the thermal activity needed to keep southern harbors ice-free.',
      inkarnate: 'Small orange markers'
    },
    // LABELS
    {
      category: 'labels',
      action: 'LABEL',
      text: 'Subregion labels: Glacier-Heart, Fjord-Coast, Southern Shore',
      why: 'Key geographical boundaries defining the territorial zones of Nordhalla: the frozen polar interior (Glacier-Heart), the habitable eastern cliffs (Fjord-Coast), and the warm volcanic south (Southern Shore).',
      inkarnate: 'Italic small text'
    }
  ],
  'sundale': [
    // TERRAIN: concentric rings
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Ash-Heart (center): black obsidian, basalt columns, uninhabitable',
      why: 'The Ash-Heart is the dead volcanic core of Sundale. Located directly around Emberspire, it is surrounded by vast fields of black obsidian glass and basalt columns, serving as an uninhabitable, warlock-guarded wasteland where the world\'s temperature gradient begins.',
      inkarnate: 'Inkarnate black volcanic'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Ashen Fringe (mid ring): hot volcanic plains, geothermal vents, sulfur sumps',
      why: 'The Ashen Fringe is a hot volcanic plain wreathed in geothermal vents and sulfur sumps. Positioned between the Ash-Heart and the Green Rim, it is surrounded by active steam vents and lava canals, serving as the industrial heartland where the Emberth mine volcanic ore.',
      inkarnate: 'Ash/desert biome'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Green Rim (coast): warm coastal plains, sheltered valleys, oasis groves',
      why: 'The Green Rim is a warm, fertile coastal plain. Encircling the outer edge of Sundale, it is surrounded by grassy cliffs, sheltered valleys, and natural hot-spring aquifers. It was placed there to represent the primary agricultural zone of the region where life thrives under constant sun.',
      inkarnate: 'Coastal grass'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Glitterwood (south-east peninsula): lush ancient broadleaf forest',
      why: 'The Glitterwood is a lush, ancient broadleaf forest located on Sundale\'s southeastern peninsula. Surrounded by warm seas and volcanic hot springs, it is wreathed in mossy canopy lanes, serving as the spiritual sanctuary where the Rime-Born and Risen sects gather.',
      inkarnate: 'Dense forest'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Emberspire: massive central volcano, red glow at peak',
      why: 'Emberspire is the colossal central volcano representing the heart of the world. Situated at the geometric center of Sundale, it is surrounded by basalt columns and obsidian plains. It serves as the physical manifestation of the buried star, pulsing heat outward through the land.',
      inkarnate: 'Volcano icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Sol\'s Anvil Mesa: flat-topped basalt mesa in the Ash-Heart',
      why: 'Sol\'s Anvil Mesa is a flat-topped basalt mesa. Situated deep within the uninhabitable Ash-Heart, it is surrounded by lava flows and volcanic ash. It was placed there as a sacred calendar site where ancient astronomers carved runic solar cycles to track the star\'s fading light.',
      inkarnate: 'Mesa icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'The Ashen Escarpment: long ridge of compacted volcanic ash',
      why: 'The Ashen Escarpment is a towering, miles-long defensive ridge made of compacted volcanic ash. Separating the Ashen Fringe from the Green Rim, it is surrounded by steep slopes and glass-scarred gullies, serving as a natural fortification dotted with watchtowers.',
      inkarnate: 'Cliff/escarpment'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Cinderhoodoo: forest of fire-scorched rock spires',
      why: 'Cinderhoodoo is a dense geological forest of fire-scorched rock spires. Located in the Ashen Fringe, it is surrounded by boiling sulfur mud-pots. These spires are capped with hard basalt, protecting the softer ash rock beneath from erosion, serving as a dangerous maze-like terrain.',
      inkarnate: 'Hoodoo texture'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Vulkar\'s Karst: honeycombed limestone with underground rivers',
      why: 'Vulkar\'s Karst is a honeycombed limestone plateau filled with hot underground rivers and volcanic caves. Located in the Green Rim, it is surrounded by lush green valleys and hot springs, famous for its mineral-rich waters and vivid orange-red crystal formations.',
      inkarnate: 'Limestone texture'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Cinderbloom Crater: secondary volcanic vent with red lichen',
      why: 'Cinderbloom Crater is a secondary volcanic vent wreathed in heat-resistant crimson lichen. Located on the edge of the Ash-Heart, it is surrounded by dry ash plains, serving as a sacred site for Martyr purification rites.',
      inkarnate: 'Crater icon'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'The Spinstones Columns: ring of basalt columns around Emberspire',
      why: 'The Spinstones Columns are a massive ring of towering basalt pillars enclosing the inner Ash-Heart. Surrounded by obsidian fields and volcanic fissures, they mark the boundary where the world\'s magical Wyrd-mist is thickest, serving as an ancient ward around the central volcano.',
      inkarnate: 'Stone column icons in ring'
    },
    // WATER
    {
      category: 'water',
      action: 'DRAW',
      text: 'Ember Lagoon: warm saltwater lagoon heated by volcanic vents (south coast)',
      why: 'Ember Lagoon is a warm, volcanic saltwater harbor on the southern coast of Sundale. Heated by underwater volcanic vents, it is surrounded by black-sand beaches and glowing coral reefs, serving as the primary shipping port of the region.',
      inkarnate: 'Lagoon with glow'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'Cinder Strait: sea route from Sundale to Iceheart',
      why: 'Cinder Strait is a critical sea route connecting Sundale to the Iceheart Sea. Bordered by volcanic cliffs and rocky islands, it is surrounded by warm sea-currents, serving as the primary naval shipping corridor for exporting sulfur and iron plates.',
      inkarnate: 'Strait'
    },
    // COAST
    {
      category: 'coast',
      action: 'DRAW',
      text: 'Green Rim coastline (north, west, south-east)',
      why: 'The Green Rim coastline is the outer maritime boundary of Sundale. Surrounded by volcanic cliffs, sandy harbors, and green bays, it represents the zone where fishing settlements and sea routes originate.',
      inkarnate: 'Coastal line'
    },
    {
      category: 'coast',
      action: 'DRAW',
      text: 'Glitterwood isthmus: narrow connection to the main landmass',
      why: 'The Glitterwood isthmus is a narrow land bridge connecting the Glitterwood peninsula to the main landmass of Sundale. Surrounded by coastal waters and rocky cliffs, it serves as a critical trade route and military checkpoint.',
      inkarnate: 'Narrow land bridge'
    },
    // CITIES
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Harath-Vault: underground Emberth capital, carved into volcanic caldera (600 pop)',
      why: 'Harath-Vault is the subterranean capital of the Emberth, carved directly into a dormant volcanic caldera. Surrounded by pools of bubbling magma and basalt walls, it is placed deep underground to protect the Emberth from surface ash-fall and houses the Great Forge.',
      inkarnate: 'Underground city icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'The Great Forge: sprawling smelting city inside a volcanic cavern',
      why: 'The Great Forge is a sprawling industrial smelting city. Built inside a massive volcanic cavern beneath the Ashen Fringe, it is surrounded by active magma streams and cooling vents, serving as the primary metal-manufacturing hub of the world.',
      inkarnate: 'City icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Solvan\'s Stand: dying capital of House Solvan (4,000 pop, was 30,000)',
      why: 'Solvan\'s Stand is the grand, ash-covered capital of House Solvan. Located in the heart of the Ashen Fringe, it is surrounded by vast plains of grey volcanic ash and basalt ruins. Once a metropolis of 30,000, its outer walls are half-buried by constant ash-fall.',
      inkarnate: 'City icon with ash overlay'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Ember Lagoon: Sundale\'s only port (350 pop)',
      why: 'Ember Lagoon is a warm-water port town located on the southern coast of Sundale. Heated by underwater volcanic vents, it is surrounded by black-sand beaches and glowing coral reefs, serving as the shipping gateway for trade caravans.',
      inkarnate: 'Port + glow'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Basalt Shyr: trade outpost atop cooling basalt columns',
      why: 'Basalt Shyr is a fortified trade outpost. Constructed atop a series of cooling, geometric basalt columns on the border of the Bryngloom Forest, it is surrounded by deep rocky ravines and volcanic sulfur vents, serving as a critical border tax checkpoint.',
      inkarnate: 'Town icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Slag Gulch: narrow ravine of forge waste',
      why: 'Slag Gulch is an industrial smelting hamlet and salvage camp. Tucked inside a narrow volcanic ravine in the Ashen Fringe, it is surrounded by piles of discarded iron dross and runic slag, housing Emberth outcasts who salvage metal scrap.',
      inkarnate: 'Town icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Konjaw Port: most cosmopolitan town (south coast)',
      why: 'Konjaw Port is Sundale\'s most cosmopolitan coastal town. Positioned on the warm southern coast, it is surrounded by volcanic black-sand beaches and geothermal lagoons, serving as an open harbor where captains and merchants exchange goods outside noble monopolies.',
      inkarnate: 'Port icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Ironjaw Village: Emberth fishing-and-smelting hamlet (south coast)',
      why: 'Ironjaw Village is a small fishing and smelting hamlet. Located on the rocky southern coastline of Sundale, it is surrounded by warm sea-currents and basalt cliffs, serving as a refuge for exiled Emberth who survive by diving for volcanic ore.',
      inkarnate: 'Village icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Thornshire Colony: Dawn Vigil penal colony (Ashen Fringe)',
      why: 'Thornshire Colony is a fortified penal colony operated by the Dawn Vigil. Situated in the hot volcanic plains of the Ashen Fringe, it is surrounded by active geothermal vents and a dense wall of magical bramble-thorns. It was established here to imprison dissidents, where the enclosing brambles grow inward by an inch every season.',
      inkarnate: 'Fortress icon with thorny border'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Meadowglen: breadbasket valley in the northern Green Rim',
      why: 'Meadowglen is a fertile breadbasket valley and agricultural hub. Located in the northern Green Rim zone of Sundale, it is surrounded by protective grassy ridges and a natural network of boiling hot springs, allowing crops to grow green and lush year-round despite ash-fall.',
      inkarnate: 'Town icon in green valley'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Warmheath: warm moor in the north (grazing land)',
      why: 'Warmheath is a sweeping, geothermal moorland and grazing pasture. Situated in the northern Green Rim, it is surrounded by low volcanic ridges and bubbling mud-pots, serving as the primary pastureland for woolly herds and a meeting ground for Risen preachers.',
      inkarnate: 'Settlement icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Breezebough: market-town at the western Green Rim edge',
      why: 'Breezebough is a bustling woodland market town. Located on the western edge of the Green Rim bordering the Frostwood Reach, it is surrounded by sparse broadleaf trees and agricultural plots, serving as a neutral trade hub for timber and food.',
      inkarnate: 'Town icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Glitterwood Heart: Risen capital, longhouses in living trees',
      why: 'Glitterwood Heart is the capital of the Risen faith. Built inside the ancient canopy of a massive, broadleaf forest on the southeastern peninsula, it is surrounded by towering mossy trees and bioluminescent groves, serving as the spiritual rival to the Dawn Vigil.',
      inkarnate: 'Tree-village icon'
    },
    // LANDMARKS
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'The Star Caves: lava-tubes beneath the Spinstones Columns',
      why: 'The Star Caves are a network of volcanic lava-tubes located directly beneath the Spinstones Columns. Surrounded by obsidian fields and subterranean ash chambers, they serve as a dangerous passage wreathed in raw magical energy and hunted by hostile Husque creatures.',
      inkarnate: 'Cave/ruin icon'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Old Sun Shrine: pre-Binding temple in the Glitterwood',
      why: 'Old Sun Shrine is a prehistoric temple dedicated to the pre-Binding solar alignment. Located in the heart of the Glitterwood, it is surrounded by circular basalt plazas and mossy trees, standing as a sacred monument that the Dawn Vigil has tried to destroy multiple times.',
      inkarnate: 'Ruin/shrine icon'
    },
    // ROUTES
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Dawn Vigil signal-fires along the Ashen Escarpment (towers every few miles)',
      why: 'The Dawn Vigil signal-towers are a line of stone watchtowers spanning the Ashen Escarpment. Surrounded by volcanic cliffs and ash slopes, they are placed to guard the border, using signal fires fueled by heartwood resin to coordinate defense.',
      inkarnate: 'Tower icons in line'
    },
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Velling Pass route connecting to Frostwood (through Meadowglen)',
      why: 'The Velling Pass route is the primary overland highway connecting Sundale to the Frostwood Reach. Surrounded by volcanic ridges and thermal springs, it is a critical trade road where caravans transport southern grains and northern ironwood.',
      inkarnate: 'Pass + dotted line'
    },
    // EFFECTS
    {
      category: 'effects',
      action: 'COLOR',
      text: 'Emberspire peak: bright red/orange glow color',
      why: 'The red/orange glow represents the volcanic energy pulsing from Emberspire\'s peak. Surrounded by the ash clouds of the Ash-Heart, it indicates the raw power of the buried star warming the central hemisphere.',
      inkarnate: 'Red color wash on peak'
    },
    {
      category: 'effects',
      action: 'FOG',
      text: 'Ash-fall overlay across Ashen Fringe (gray haze)',
      why: 'The ash-fall is a perpetual grey volcanic haze shrouding the Ashen Fringe. Surrounded by active craters and steam vents, it represents the harsh atmosphere that citizens must navigate daily.',
      inkarnate: 'Ash/gray overlay'
    },
    {
      category: 'effects',
      action: 'COLOR',
      text: 'Ember Lagoon: orange-red glow at night',
      why: 'The orange-red water glow is a volcanic thermal effect on Ember Lagoon. Heated by underwater volcanic vents and surrounded by black-sand beaches, it indicates the warm currents flowing along the southern coast.',
      inkarnate: 'Orange glow on water'
    },
    // LABELS
    {
      category: 'labels',
      action: 'LABEL',
      text: 'Subregion labels: Ash-Heart, Ashen Fringe, Green Rim, Glitterwood',
      why: 'Key geographical boundaries defining the territorial zones of Sundale: the dead volcanic center (Ash-Heart), the industrial plain (Ashen Fringe), the agricultural rim (Green Rim), and the ancient forest (Glitterwood).',
      inkarnate: 'Italic small text'
    }
  ],
  'iceheart-sea': [
    // TERRAIN
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Merrow Archipelago (central): volcanic seamounts, black-sand beaches',
      why: 'The Merrow Archipelago is the central inhabited island cluster of the Iceheart Sea. Surrounded by warm volcanic seamounts and black-sand beaches, it represents the primary dry land in the region where the nomadic Merryn sea-clans build their stilt-settlements.',
      inkarnate: 'Island icons clustered'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Storm-Belt (west): perpetual cyclone-belt, lightning, salt-rain',
      why: 'The Storm-Belt is a perpetual cyclone and lightning zone spanning the western reaches of the sea. Surrounded by massive whirlpools and constant salt-rain, it was placed there to represent the unstable atmospheric bounds wreathed around the Shard-Window Monolith.',
      inkarnate: 'Storm texture'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Deepwell Trench (east): frigid deep-sea, underwater basalt cave-cities',
      why: 'The Deepwell Trench is a frigid, lightless deep-sea rift in the eastern waters. Surrounded by steep underwater cliffs and geothermal steam vents, it houses the subterranean basalt cave-cities of the reclusive Myrathil deep-elves.',
      inkarnate: 'Deep blue, dark'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Northern Ice-Flows: polar marine, ice-floe year-round',
      why: 'The Northern Ice-Flows are a polar marine expanse of massive city-sized icebergs. Situated along the northern boundary of the sea, they are surrounded by freezing waves and ice-floes, serving as a geographic barrier between the sea and the glaciers of Nordhalla.',
      inkarnate: 'Ice floe'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Western Isles: cold maritime, fog-belt, salt-spray',
      why: 'The Western Isles are a rugged chain of cold, wind-scoured islands. Positioned at the western boundary of the map, they are surrounded by thick sea-fog and treacherous reefs, serving as the primary hideout for pirate fleets and smuggler crews.',
      inkarnate: 'Island chain'
    },
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Saltmaw Estuary (south): salt-marsh, glacial melt, tidal flats',
      why: 'The Saltmaw Estuary is a vast wetland of salt-marshes and tidal flats on the southern coast. Surrounded by glacial runoff streams, it is placed where the cold sea meets the warm rivers of Sundale, serving as a lawless transition zone.',
      inkarnate: 'Marsh'
    },
    // WATER
    {
      category: 'water',
      action: 'DRAW',
      text: 'The Shard-Window: 3-mile-wide storm-vortex over a Monolith (Storm-Belt)',
      why: 'The Shard-Window is a colossal, three-mile-wide storm vortex. Centered over the western Storm-Belt, it is surrounded by perpetual hurricanes and lightning walls. It is a legendary portal where the sky itself fractures, revealing the fading echoes of long-dead stars below.',
      inkarnate: 'Giant spiral storm'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'The Treakous Oceanic Rift: bottomless chasm in the east (Deepwell)',
      why: 'The Treakous Oceanic Rift is a bottomless marine chasm in the eastern Deepwell Trench. Surrounded by thermal volcanic vents, it is placed there as the deep resting site of a sunken runic Monolith, wreathed in ancient sea-serpent wards.',
      inkarnate: 'Deep chasm'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'The Shivering Bight: wide shallow bay with constant volcanic tremors',
      why: 'The Shivering Bight is a shallow, trembling bay located near the central islands. Surrounded by jagged rocky shoals, it experiences constant underwater volcanic tremors that heat the shallows, making the waters steam under the cold polar winds.',
      inkarnate: 'Bay'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'Gale-Storm Shallows: shallow reefs with perpetual storm-cycles',
      why: 'The Gale-Storm Shallows are a treacherous network of shallow coral reefs. Located in the central sea, they are surrounded by constant tidal shifts and heavy storms, requiring sea captains to navigate using bioluminescent moss charts.',
      inkarnate: 'Reef + storm'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'Wraithsound: sea-mist inlet that listens, remembers, speaks in the voices of the drowned',
      why: 'Wraithsound is a haunted, misty coastal inlet. Tucked inside the northern cliffs, it is wreathed in thick sea-fog and surrounded by petrified trees, famous for its magical waters that echo with the voices of drowned sailors.',
      inkarnate: 'Misty inlet'
    },
    {
      category: 'water',
      action: 'DRAW',
      text: 'The Saltmaw Estuary: glacial river meets salt water',
      why: 'The Saltmaw Estuary is a vast wetland of salt-marshes and tidal flats on the southern coast. Surrounded by glacial runoff streams, it is placed where the cold sea meets the warm rivers of Sundale, serving as a lawless transition zone.',
      inkarnate: 'Estuary'
    },
    // CITIES
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Merrowport: floating city on a warm volcanic seamount (500+ pop)',
      why: 'Merrowport is the floating capital city of the Iceheart Sea. Built on a series of lashed hulls and barges atop a warm volcanic seamount, it is surrounded by black-sand beaches, serving as the commercial and cultural hub for Merryn sailors.',
      inkarnate: 'Floating city icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Ironjaw Port: Neth-run fortress (east Merrow Archipelago)',
      why: 'Ironjaw Port is a fortified harbor city operated by the Neth. Located on the eastern side of the Merrow Archipelago, it is surrounded by massive stone sea-walls, built to enforce trade contracts and guard the regional shipping routes.',
      inkarnate: 'Port icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Saryreach Castle: pirate-queen\'s seat (Western Isles)',
      why: 'Saryreach Castle is a ruined stone fortress. Perched on a sheer cliff in the Western Isles, it is surrounded by treacherous rocky reefs, serving as the fortified headquarters for the pirate-queen\'s fleet after being abandoned by House Mereval.',
      inkarnate: 'Castle icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Spindrift Lagoon: warm bioluminescent coral inlet (250 pop)',
      why: 'Spindrift Lagoon is a warm, sheltered coral inlet. Tucked inside the central islands, it is surrounded by bioluminescent reefs that glow a brilliant blue-green at night, serving as the only place where the water is warm enough for swimming.',
      inkarnate: 'Glowing lagoon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Blackteeth Isle: Drift-Council representatives (Merrow Archipelago)',
      why: 'Blackteeth Isle is a volcanic island and trading port. Located in the Merrow Archipelago, it is surrounded by jagged basalt cliffs, serving as the second-busiest harbor where the Drift-Council representatives assemble.',
      inkarnate: 'Town icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'The Lucky Anchor: floating gambling den on 3 lashed warships',
      why: 'The Lucky Anchor is a famous floating gambling den built across three lashed warships. Anchored in the neutral waters of the archipelago, it is surrounded by small boat docks, serving as the legendary hub of the sea\'s gaming traditions.',
      inkarnate: 'Ship icon'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Tide-Court Cove: hidden tidal harbor (Western Isles)',
      why: 'Tide-Court Cove is a hidden tidal harbor. Tucked inside the Western Isles, it is surrounded by sheer stone cliffs and accessible only at high tide, serving as the ancient, sacred assembly grounds of the Mer-Court.',
      inkarnate: 'Hidden cove'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Brinehorse Cove: black-market port behind ice-shoals',
      why: 'Brinehorse Cove is a black-market port. Hidden behind a wall of shifting ice-shoals on the northern shore, it is surrounded by freezing waters, serving as a secret trading haven for Fredløse outlaws to exchange contraband.',
      inkarnate: 'Port icon'
    },
    // LANDMARKS
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'First Shore: ancient Mereval landing, encrusted in ice and barnacles',
      why: 'First Shore is an ancient, ice-encrusted stone ruin. Located on the northern coast, it is surrounded by glaciers and frozen beaches, representing the historic site where the human founders of House Mereval first landed centuries ago.',
      inkarnate: 'Ruin icon'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Berg of the Frozen Flame: city-sized iceberg with a gas-vent burning in its heart',
      why: 'The Berg of the Frozen Flame is a city-sized iceberg. Drifting in the northern flows, it is surrounded by pack-ice and wreathed in caves where Berg-Witches live, centered around a natural volcanic gas vent that burns with an eternal flame.',
      inkarnate: 'Iceberg + flame'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Whaleroot Floe: flat sea-ice pan with whalebone pillars',
      why: 'Whaleroot Floe is a vast, flat sea-ice pan. Located in the northern flows, it is surrounded by freezing waters and marked by colossal whalebone pillars, serving as the sacred assembly grounds for the Icewhisper Coven\'s bone-reading rites.',
      inkarnate: 'Floe with bones'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Blackteeth Skerry: jagged volcanic reef (western boundary)',
      why: 'Blackteeth Skerry is a jagged, volcanic obsidian reef. Located on the western edge of the sea, it is surrounded by crashing deep-ocean waves, serving as the traditional boundary separating the charted sea from the unknown depths.',
      inkarnate: 'Reef icon'
    },
    // ROUTES
    {
      category: 'routes',
      action: 'DRAW',
      text: 'The Unfreezing Booms: cold-iron chain checkpoints across shipping lanes',
      why: 'The Unfreezing Booms are a series of massive cold-iron chains and floating checkpoints. Spanning the main shipping lanes, they are surrounded by naval patrol boats, built by House Mereval to enforce trade taxes and monitor passing vessels.',
      inkarnate: 'Dotted line with chain markers'
    },
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Cinder Strait: sea route from Sundale to Iceheart (north of Sundale)',
      why: 'Cinder Strait is a critical sea route connecting Sundale to the Iceheart Sea. Bordered by volcanic cliffs and rocky islands, it is surrounded by warm sea-currents, serving as the primary naval shipping corridor for exporting sulfur and iron plates.',
      inkarnate: 'Sea lane'
    },
    // EFFECTS
    {
      category: 'effects',
      action: 'FOG',
      text: 'The Shard-Window: a giant spiral storm overlay (3 miles wide)',
      why: 'The Shard-Window is a colossal, three-mile-wide storm vortex. Centered over the western Storm-Belt, it is surrounded by perpetual hurricanes and lightning walls, indicating the raw magical storms wreathed around the western Monolith.',
      inkarnate: 'Big storm spiral'
    },
    {
      category: 'effects',
      action: 'COLOR',
      text: 'Spindrift Lagoon: blue-green bioluminescent glow at night',
      why: 'The blue-green bioluminescent water glow is a warm-water coral effect on Spindrift Lagoon. Surrounded by central islands, it indicates the presence of warm volcanic springs heating the coral reefs.',
      inkarnate: 'Glow effect'
    },
    {
      category: 'effects',
      action: 'FOG',
      text: 'Perpetual storm texture over the entire sea',
      why: 'The perpetual storm is a dense sea-mist and wave overlay covering the entire Iceheart Sea. Surrounded by icebergs and volcanic reefs, it indicates the turbulent maritime climate that sailors must navigate.',
      inkarnate: 'Storm overlay'
    },
    // LABELS
    {
      category: 'labels',
      action: 'LABEL',
      text: 'Subregion labels: Merrow Archipelago, Storm-Belt, Deepwell Trench, etc.',
      why: 'Key geographical boundaries defining the territorial zones of the Iceheart Sea: the central islands (Merrow Archipelago), the dangerous storm plains (Storm-Belt), and the deep eastern rift (Deepwell Trench).',
      inkarnate: 'Italic small text'
    }
  ],
  'cragjaw-peaks': [
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Draw the Frostmaw Massif (central spine, highest)',
      why: 'The central geographic anchor of the region. A towering, impassable spine of granite peaks that separates the eastern and western lands. It is perpetually shrouded in the blizzard that House Tesshan traded visibility for.',
      inkarnate: 'Use the mountain placement tool. Select the "Snowy Peaks" assets. Group them closely to form a continuous, vertical, wall-like ridge running north-south.'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Draw the Gorge-Web (mid-altitude chasms and bone-bridges)',
      why: 'The mid-altitude network of chasms and ravines. It is where the Groven bridge-clans reside, and represents the dangerous verticality of Cragjaw Peaks.',
      inkarnate: 'Use the subtraction tool/cliff pathing to carve deep cracks and chasms. Place suspension or stone bridge stamps across the fissures to represent the web.'
    },
    {
      category: 'terrain',
      action: 'DRAW',
      text: 'Draw the Iron Sumps (deep industrial mining heart)',
      why: 'The toxic, sulfuric underbelly of the peaks where Fexric engineers and miners harvest sulfur and cold-iron. It is hot, volcanically active, and packed with geothermal pipelines.',
      inkarnate: 'Use a volcanic/basalt texture wash with dark greys, blacks, and bright orange/red geothermal vents. Add steam or volcanic haze overlays.'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Place Frostmaw Holdfast (Groven capital, volcanic plug)',
      why: 'The ancient heart of Groven civilization. Built directly into a volcanic plug, it serves as the ceremonial seat of power and the site of the Vat-Breakers\' original rebellion.',
      inkarnate: 'Place a large stone fortress or citadel stamp inside a prominent crater or volcanic plug asset. Keep the surrounding terrain rocky and snow-dusted.'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Place the Stone Cog (Tesshan fortress-monastery, gear-tooth walls)',
      why: 'The administrative seat of House Tesshan\'s political power and Jarl Oda\'s Knotted Decree. It is famous for its massive outer walls carved to resemble gear-teeth.',
      inkarnate: 'Place a circular, gear-like or highly structured stone monastery stamp. Connect it visually to geothermal pipe lines running from the sumps.'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Place Gearworks Gulch, Driknell Foundry (Fexric industrial)',
      why: 'The industrial engine of the region. Driknell Foundry stamps the Tesshan sigil on every Ironclad plate, powered by boiling steam from the depths.',
      inkarnate: 'Use factory/forge stamps, mechanical wheels, and chimney stamps. Surround them with basalt cliffs and steam overlays.'
    },
    {
      category: 'cities',
      action: 'PLACE',
      text: 'Place Deepchasm Keep (across a fissure, bone-bridge)',
      why: 'The critical military checkpost of House Tesshan. It spans a massive fissure and controls all passage between the upper peaks and the mining sumps below.',
      inkarnate: 'Place a castle or gatehouse stamp spanning a deep chasm. Connect the keep structures on both sides with a bridge stamp.'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Mark the Ancestor-Spans (calcified bone bridges - the icon of the region)',
      why: 'The literal bones of Groven ancestors grown into bridges. They are the primary method of traversing the Gorge-Web and are the iconic landmark of Cragjaw Peaks.',
      inkarnate: 'Place white, skeletal, or gothic bridge stamps spanning the deepest canyons. Highlight them with small light/glow overlays to show their spiritual significance.'
    }
  ],
  'sundrift-vale': [
    // TERRAIN
    { category: 'terrain', action: 'COLOR', text: 'The Long Steppe (central): endless grass plains, low rolling hills', why: 'Vast central plain, the Vale\'s heart', inkarnate: 'Grass plain' },
    { category: 'terrain', action: 'COLOR', text: 'The Ancestor Wolds (east): cool upland, burial barrows', why: 'Burial hollows, fog in the hollows', inkarnate: 'Grass + mound texture' },
    { category: 'terrain', action: 'COLOR', text: 'The Starfall Basin (west): sheltered by ridges, meteor crater', why: 'The most spiritually significant site', inkarnate: 'Crater with crystal field' },
    { category: 'terrain', action: 'COLOR', text: 'The Bogpost March (south): marshy steppe, peat-edges, river-crossings', why: 'Transition zone to Bryngloom', inkarnate: 'Marsh' },
    { category: 'terrain', action: 'COLOR', text: 'The Blizzard Bluff (north): sub-arctic, perpetual wind, deep snow', why: 'The Snow-Tooth separating from Frostwood', inkarnate: 'Snow bluff' },
    { category: 'terrain', action: 'DRAW',  text: 'Kumis Downs: rolling hills of pale grass (mara-herd country)', why: 'The Mounted clans\' territory, horse-breeding', inkarnate: 'Rolling hills' },
    { category: 'terrain', action: 'DRAW',  text: 'Lien-Stalked Grazes: grass replaced by glowing crystal-infused stalks', why: 'Crystal grass, glows faintly at night', inkarnate: 'Crystal grass icons' },
    { category: 'terrain', action: 'DRAW',  text: 'Starfall Vale: crater carpeted with crystalline shards', why: 'Where Lumia\'s shards struck the earth, glows with trapped starlight', inkarnate: 'Crater + crystal icons' },
    { category: 'terrain', action: 'DRAW',  text: 'Nova\'s Heath: perfect circle of crystallized soil from a celestial impact', why: 'Astril meditation site, Unlit Veil hidden judgment-hill', inkarnate: 'Crystallized circle' },
    { category: 'terrain', action: 'DRAW',  text: 'The Unlit Knoll: where fire refuses to burn, no light persists', why: 'Unlit Veil headquarters', inkarnate: 'Dark hill' },
    { category: 'terrain', action: 'DRAW',  text: 'Grass Tundra: endless grey-green plains in the central Vale', why: 'Major nomad migration routes', inkarnate: 'Plain' },
    // CITIES
    { category: 'cities', action: 'PLACE', text: 'Synod Hold: Astril crystal-lattice fortress (800 pop)', why: 'Pale limestone, concentric rings, every entrance faces east', inkarnate: 'Fortress icon (crystal)' },
    { category: 'cities', action: 'PLACE', text: 'Mound-Camps: sprawling seasonal wool-yurt settlement', why: 'Commercial heartbeat of the Vale', inkarnate: 'Yurt circle' },
    { category: 'cities', action: 'PLACE', text: 'The Moundwatch: cairn-checkpoint with sentry-posts (eastern Wolds)', why: 'Herd-Tithe collection point, continuous chronicle of Ordan people', inkarnate: 'Checkpoint icon' },
    { category: 'cities', action: 'PLACE', text: 'Morren\'s Bogpost: Morren trading outpost at forest-steppe edge', why: 'Only major trade gateway between Bryngloom and Sundrift Vale', inkarnate: 'Trading post icon' },
    // LANDMARKS
    { category: 'landmarks', action: 'MARK', text: 'The Ancestor Mounds: vast network of 20 generations of burial barrows', why: 'Each mound emits a unique hum', inkarnate: 'Many mound icons' },
    // ROUTES
    { category: 'routes', action: 'DRAW', text: 'Migration routes: dotted lines across the Long Steppe following woolly herds', why: 'Ordan migration never stops', inkarnate: 'Dotted line with herd markers' },
    { category: 'routes', action: 'DRAW', text: 'Cairn-checkpoints across the Blizzard Bluff (Ordan March Wardens)', why: 'Border watch to Frostwood', inkarnate: 'Checkpoint icons' },
    { category: 'routes', action: 'DRAW', text: 'Cairn-Checkpoints (basalt) at every major crossroads', why: 'Herd-Tithe and migration control', inkarnate: 'Basalt stone markers' },
    // EFFECTS
    { category: 'effects', action: 'COLOR', text: 'Permanently dark sky (#2a2a2a base, NO stars)', why: 'Keth-Amar devoured the constellation-forge, the defining feature', inkarnate: 'Dark sky overlay' },
    { category: 'effects', action: 'COLOR', text: 'Pale silver-white glow from Lien-stalks, woolly herd antlers, Astril patterns', why: 'The only natural light in the dark sky', inkarnate: 'Pale glow patches' },
    { category: 'effects', action: 'FOG',   text: 'Wind-streak texture across the entire Vale (perpetual wind)', why: 'The wind never stops', inkarnate: 'Wind-line overlay' },
    // LABELS
    { category: 'labels', action: 'LABEL', text: 'Subregion labels: Long Steppe, Ancestor Wolds, Starfall Basin, etc.', why: 'Reference', inkarnate: 'Italic small text' }
  ],
  'bryngloom-forest': [
    // TERRAIN
    { category: 'terrain', action: 'COLOR', text: 'Canopy-Heart (center): living ironwood cathedral-grove, hanging slums', why: 'The political heart', inkarnate: 'Dense forest' },
    { category: 'terrain', action: 'COLOR', text: 'Sunken Basin (south-east): sinkhole with inverted gothic architecture', why: 'The Vreken domain', inkarnate: 'Sinkhole' },
    { category: 'terrain', action: 'COLOR', text: 'Peat-Wastes (north): acidic peat-bog, liquefying mud', why: 'Debt-Revenant labor territory', inkarnate: 'Acid bog' },
    { category: 'terrain', action: 'COLOR', text: 'Western Bayous (west): ironwood bayous, river-cliffs, ancient fae-contracts carved into bark', why: 'Kessen weaver country', inkarnate: 'Bayou' },
    { category: 'terrain', action: 'COLOR', text: 'The Great Mere (center-east): vast central lake dotted with small wooded islands', why: 'The hub of the forest, rises and falls with the moon', inkarnate: 'Big lake with island icons' },
    { category: 'terrain', action: 'COLOR', text: 'The Root-Veil (subterranean): mycelial network beneath everything', why: 'Morvane\'s domain', inkarnate: 'Dark layer under map' },
    { category: 'terrain', action: 'DRAW',  text: 'The Great Mere: vast central lake with small wooded islands', why: 'Trade hub, monastery on largest island', inkarnate: 'Big lake' },
    { category: 'terrain', action: 'DRAW',  text: 'Widow\'s Quagmire: stretch where the ground liquefies underfoot', why: 'The worst of the Peat-Wastes', inkarnate: 'Quagmire' },
    { category: 'terrain', action: 'DRAW',  text: 'Black Fen: the Final Clause, legal void where the Keeper has no jurisdiction', why: 'Neth\'s dumping ground, nothing grows', inkarnate: 'Black Silence' },
    { category: 'terrain', action: 'DRAW',  text: 'Vel-Keth Bayou: the water that remembers, flows uphill', why: 'Memory-glass deposits line the banks', inkarnate: 'Bayou' },
    { category: 'terrain', action: 'DRAW',  text: 'Fangmere Grove: perfect circle of ironwood, Vreken ancestral bones in roots', why: 'Preternaturally silent, Vreken sacred wood', inkarnate: 'Sacred circle' },
    { category: 'terrain', action: 'DRAW',  text: 'Drowned Dingle: permanently flooded woodland, petrified trees chime like bells', why: 'Smuggler route, sacred to Kessen', inkarnate: 'Flooded forest' },
    { category: 'terrain', action: 'DRAW',  text: 'Peat-Bog Sinks: bottomless preserving black peat', why: 'Preserves anything that falls in', inkarnate: 'Bog' },
    // CITIES
    { category: 'cities', action: 'PLACE', text: 'Atropolis: magnificent suspended canopy-city (Neth capital)', why: 'The First Contract is preserved here in the Heart-Vault', inkarnate: 'Canopy city icon' },
    { category: 'cities', action: 'PLACE', text: 'The Sunken Spire: Vreken inverted capital, 400 ft down into a sinkhole', why: 'Crypt-Council rules here', inkarnate: 'Inverted spire' },
    { category: 'cities', action: 'PLACE', text: 'Over-Shanty: hanging slum of rope-bridges beneath Atropolis (600 pop)', why: 'Drun outcasts, Morren peat-cutters, Dangling Keel tavern', inkarnate: 'Hanging slum' },
    { category: 'cities', action: 'PLACE', text: 'Aran-Glen: Kessen Neth village of living ironwood (300 pop)', why: 'Every structure is grown, not built', inkarnate: 'Living-wood village' },
    { category: 'cities', action: 'PLACE', text: 'Covenbane Stronghold: Inquisition seat in the western bayous', why: 'Black ironwood and cold-iron bars, hanging-cages preserved', inkarnate: 'Fortress icon' },
    { category: 'cities', action: 'PLACE', text: 'Monks of the Sunken Stone: Velun monastery on the largest Great Mere island', why: 'Half-submerged in high water, dive to read old record-stones', inkarnate: 'Monastery on island' },
    { category: 'cities', action: 'PLACE', text: 'Merryn\'s Drift: Merryn river-trading camp of lashed houseboats (western bayous)', why: 'Salt-scars fade within a generation (freshwater)', inkarnate: 'Houseboat icon' },
    { category: 'cities', action: 'PLACE', text: 'Merryn\'s Drift: Merryn river-trading camp of lashed houseboats', why: 'Salt-scars fade within a generation (freshwater)', inkarnate: 'Houseboat icon' },
    // LANDMARKS
    { category: 'landmarks', action: 'MARK', text: 'The Crypt of Aedris: deepest chamber of the Sunken Spire', why: 'Eternal pale-moonlight from Aedris\' sarcophagus', inkarnate: 'Crypt icon' },
    { category: 'landmarks', action: 'MARK', text: 'The Root-Veil Scriptorium: deepest archive in the Bryngloom', why: 'The Keeper guards the entrance', inkarnate: 'Library icon (deep)' },
    // ROUTES
    { category: 'routes', action: 'DRAW', text: 'Rope-bridges, hanging platforms, living-bridges across the canopy', why: 'How the forest is traversed', inkarnate: 'Bridge icons' },
    { category: 'routes', action: 'DRAW', text: 'Toll-Dike gates at the borders (living-ironwood)', why: 'Bryngloom border checkpoints', inkarnate: 'Gate icons' },
    { category: 'routes', action: 'DRAW', text: 'Hunter\'s Gully: narrow ravine, the only safe path to Covenbane', why: 'Echoes with purged swamp-singer songs', inkarnate: 'Ravine path' },
    // EFFECTS
    { category: 'effects', action: 'COLOR', text: 'Bioluminescent moss: patches of teal/amber light under the canopy', why: 'The only natural light, illumination from BELOW', inkarnate: 'Glow patches' },
    { category: 'effects', action: 'COLOR', text: 'Twilight canopy: never direct sunlight, everything illuminated from below or within', why: 'The defining atmosphere', inkarnate: 'Dark green overlay' },
    { category: 'effects', action: 'FOG',   text: 'Constant mist under the canopy', why: 'The forest is always damp', inkarnate: 'Mist overlay' },
    // LABELS
    { category: 'labels', action: 'LABEL', text: 'Subregion labels: Canopy-Heart, Sunken Basin, Peat-Wastes, Western Bayous, The Great Mere, Root-Veil', why: 'Reference', inkarnate: 'Italic small text' }
  ],
  'global': [
    {
      category: 'terrain',
      action: 'COLOR',
      text: 'Indicate the climate zones / temperature gradient',
      why: 'Closer to the buried sun = warmer. This is the world\'s central climate logic: the buried star\'s fading warmth still bleeds outward through the basalt. The further from Sundale, the colder the land gets.',
      inkarnate: 'Use color washes to create a smooth radial transition: vibrant red/orange at the center (Sundale), fading to lush greens and browns, and finally cold blues and greys at the outer edges (Nordhalla/Frostwood Reach).'
    },
    {
      category: 'landmarks',
      action: 'MARK',
      text: 'Indicate the 7 Monolith locations (but don\'t draw them)',
      why: 'These are pieces of Aex\'s flayed hide: the binding that once held Sol. They are scattered across the world. The Monoliths themselves will be added during campaign play; for now, mark the AREAS where they sit so players know there is something there.',
      inkarnate: 'Mark the 7 Monolith areas with faint circles, runes, or map symbols.'
    },
    {
      category: 'routes',
      action: 'DRAW',
      text: 'Indicate the trade routes (Velling Pass, Cinder Strait, Unfreezing Booms, Ancestor-Spans, etc.)',
      why: 'These represent the physical expression of the noble houses\' compacts and the lifeblood of regional resource exchanges (e.g. sulfur moving from Emberspire, iron plates from Cragjaw keeps).',
      inkarnate: 'Draw faint dashed lines or dotted trails. Label major trade links like Velling Pass, Cinder Strait, and the Unfreezing Booms.'
    },
    {
      category: 'effects',
      action: 'FOG',
      text: 'Show world tensions as visual cues (broken borders, abandoned holdings, etc.)',
      why: 'The world is on the edge of breaking. The tide has gone silent, the bog-dead are rising without covenant, the Monoliths are waking. Show decay at the edges.',
      inkarnate: 'Draw cracked or faded border lines. Add small ruined watchtower stamps, burnt farmhouse stamps, and distressed terrain textures near region borders.'
    },
    {
      category: 'effects',
      action: 'COLOR',
      text: 'Indicate the Wyrd-density (concentrated at the Sundered Monoliths)',
      why: 'The Wyrd bleeds through the cracks Keth-Amar opened, warping magic, spoiling venoms, and causing augur inaccuracies. It concentrates around the Monoliths.',
      inkarnate: 'Use a soft purple or dark magenta color wash around the 7 Monolith areas (e.g. Treakous Rift, Shard-Window, beneath Frostmaw) to represent the Wyrd-mist density.'
    },
    {
      category: 'labels',
      action: 'LABEL',
      text: 'Add a compass rose / sigil somewhere',
      why: 'Serves as a beautiful, functional anchor for orientation, incorporating the heraldry of one of the major houses.',
      inkarnate: 'Place a detailed Compass stamp in a corner (usually bottom-right or top-left) where there is open water.'
    },
    {
      category: 'labels',
      action: 'LABEL',
      text: 'Indicate where House Viridane used to be (negative space)',
      why: 'The erased 8th house. House Viridane refused Keth-Amar\'s bargain and was struck from all history. Leave a visible gap or broken sigil in the Frostwood Reach to hint at their hidden Briaran survivors.',
      inkarnate: 'Leave an empty, unmapped clearing or add a faint, cracked sigil stamp.'
    },
    {
      category: 'landmarks',
      action: 'DRAW',
      text: 'Add a small inset map of a key city (Greymark, Merrowport, Atropolis, etc.)',
      why: 'Provides scaling and a high-detail zoom of a key political hub (like the floating Merrowport or suspended canopy of Atropolis).',
      inkarnate: 'Use the shape/box drawing tool to create a clean parchment-textured inset frame in an empty corner. Sketch a simplified street grid or fortress layout inside.'
    }
  ]
};

const enrichChecklist = (parsedData) => {
  const clean = {};
  for (const [regionId, items] of Object.entries(parsedData || {})) {
    if (Array.isArray(items)) {
      const templateItems = CHECKLIST_TEMPLATE[regionId] || [];
      clean[regionId] = items.map(item => {
        if (item && typeof item === 'object' && typeof item.text === 'string') {
          const textLower = item.text.toLowerCase();
          // Filter out the brief.md check
          if (textLower.includes('brief.md') || textLower.includes('world_map_maker_brief')) {
            return null;
          }

          // Direct or loose keyword lookup in template
          let templateItem = templateItems.find(t => t.text.toLowerCase() === item.text.toLowerCase());
          
          if (!templateItem) {
            // Try loose keyword match
            const keywords = [
              { key: 'frostmaw massif', target: 'Frostmaw Massif' },
              { key: 'gorge-web', target: 'Gorge-Web' },
              { key: 'iron sumps', target: 'Iron Sumps' },
              { key: 'frostmaw holdfast', target: 'Frostmaw Holdfast' },
              { key: 'stone cog', target: 'Stone Cog' },
              { key: 'gearworks gulch', target: 'Gearworks Gulch' },
              { key: 'driknell foundry', target: 'Driknell Foundry' },
              { key: 'deepchasm keep', target: 'Deepchasm Keep' },
              { key: 'ancestor-spans', target: 'Ancestor-Spans' },
              { key: 'ancestor spans', target: 'Ancestor-Spans' },
              // Frostwood Reach
              { key: 'greymark keep', target: 'Greymark' },
              { key: 'greymark', target: 'Greymark' },
              { key: 'scribes\' tower', target: 'Scribes\' Tower' },
              { key: 'scribes', target: 'Scribes\' Tower' },
              { key: 'mirror mere', target: 'Mirror Mere' },
              { key: 'greythorn copse', target: 'Greythorn' },
              { key: 'skald\'s landing', target: 'Skald\'s Landing' },
              { key: 'grevtholm', target: 'Grevtholm' },
              { key: 'meadowglen crossing', target: 'Meadowglen' },
              { key: 'meadowglen', target: 'Meadowglen' },
              { key: 'mistbarrow', target: 'Mistbarrow' },
              { key: 'stone circles', target: 'Stone Circles' },
              { key: 'bearsback summit', target: 'Bearsback' },
              { key: 'ledger halls', target: 'Ledger Halls' },
              { key: 'ironwood palisade', target: 'Palisade' },
              { key: 'sentinel', target: 'Palisade' },
              { key: 'watchtowers', target: 'Palisade' },
              { key: 'silt-road', target: 'Silt-roads' },
              { key: 'silt road', target: 'Silt-roads' },
              { key: 'fog density', target: 'Fog overlay' },
              { key: 'fog overlay', target: 'Fog overlay' },
              { key: 'fog', target: 'Fog overlay' },
              { key: 'briaran', target: 'Briaran' },
              // Other regions
              { key: 'greythorn copse', target: 'Greythorn Copse' },
              { key: 'grevtholm', target: 'Grevtholm' },
              { key: 'meadowglen crossing', target: 'Meadowglen Crossing' },
              { key: 'mistbarrow', target: 'Mistbarrow' },
              { key: 'stone circles', target: 'Stone Circles' },
              { key: 'bearsback summit', target: 'Bearsback Summit' },
              { key: 'ledger halls', target: 'Ledger Halls' },
              { key: 'ironwood palisade', target: 'Ironwood Palisade' },
              { key: 'silt-road', target: 'Silt-road' },
              { key: 'frosthold citadel', target: 'Frosthold' },
              { key: 'frozen archive', target: 'Frozen Archive' },
              { key: 'fjord-gate', target: 'Fjord-Gate' },
              { key: 'vargtor', target: 'Vargtor' },
              { key: 'eldonholm', target: 'Eldonholm' },
              { key: 'xardin\'s hearth', target: 'Xardin' },
              { key: 'smuggler\'s cove', target: 'Smuggler' },
              { key: 'vespera\'s perch', target: 'Vespera' },
              { key: 'spar\'s folly', target: 'Spar' },
              { key: 'skirmour\'s crag', target: 'Skirmour' },
              { key: 'sunder-wall', target: 'Sunder-Wall' },
              { key: 'emberspire', target: 'Emberspire' },
              { key: 'sol\'s anvil', target: 'Anvil' },
              { key: 'ashen escarpment', target: 'Escarpment' },
              { key: 'harath-vault', target: 'Harath' },
              { key: 'great forge', target: 'Great Forge' },
              { key: 'solvan\'s stand', target: 'Solvan' },
              { key: 'ember lagoon', target: 'Lagoon' },
              { key: 'basalt shyr', target: 'Basalt' },
              { key: 'slag gulch', target: 'Slag' },
              { key: 'konjaw port', target: 'Konjaw' },
              { key: 'ironjaw village', target: 'Ironjaw' },
              { key: 'thornshire colony', target: 'Thornshire' },
              { key: 'meadowglen', target: 'Meadowglen' },
              { key: 'warmheath', target: 'Warmheath' },
              { key: 'breezebough', target: 'Breezebough' },
              { key: 'glitterwood heart', target: 'Glitterwood' },
              { key: 'old sun shrine', target: 'Old Sun' },
              { key: 'merrowport', target: 'Merrowport' },
              { key: 'ironjaw port', target: 'Ironjaw Port' },
              { key: 'saryreach castle', target: 'Saryreach' },
              { key: 'spindrift lagoon', target: 'Spindrift' },
              { key: 'blackteeth', target: 'Blackteeth' },
              { key: 'lucky anchor', target: 'Lucky Anchor' },
              { key: 'tide-court', target: 'Tide-Court' },
              { key: 'brinehorse cove', target: 'Brinehorse' },
              { key: 'first shore', target: 'First Shore' },
              { key: 'frozen flame', target: 'Frozen Flame' },
              { key: 'whaleroot floe', target: 'Whaleroot' },
              { key: 'unfreezing booms', target: 'Booms' },
              { key: 'shard-window', target: 'Shard-Window' },
              { key: 'synod hold', target: 'Synod' },
              { key: 'mound-camps', target: 'Mound-Camps' },
              { key: 'moundwatch', target: 'Moundwatch' },
              { key: 'morren\'s bogpost', target: 'Bogpost' },
              { key: 'ancestor mounds', target: 'Ancestor Mounds' },
              { key: 'unlit knoll', target: 'Knoll' },
              { key: 'blizzard bluff', target: 'Blizzard Bluff' },
              { key: 'long steppe', target: 'Long Steppe' },
              { key: 'grass tundra', target: 'Grass Tundra' },
              { key: 'kumis downs', target: 'Kumis' },
              { key: 'lien-stalk', target: 'Lien-Stalk' },
              { key: 'atropolis', target: 'Atropolis' },
              { key: 'sunken spire', target: 'Sunken Spire' },
              { key: 'over-shanty', target: 'Over-Shanty' },
              { key: 'aran-glen', target: 'Aran-Glen' },
              { key: 'covenbane', target: 'Covenbane' },
              { key: 'monks of the sunken stone', target: 'Monks' },
              { key: 'merryn\'s drift', target: 'Drift' },
              { key: 'crypt of aedris', target: 'Crypt' },
              { key: 'root-veil scriptorium', target: 'Scriptorium' },
              // Global checklist items
              { key: 'world tensions', target: 'world tensions' },
              { key: 'compass rose', target: 'compass rose' },
              { key: 'inset map', target: 'inset map' },
              { key: 'climate zones', target: 'climate zones' },
              { key: 'climate', target: 'climate zones' },
              { key: 'wyrd-density', target: 'Wyrd-density' },
              { key: 'wyrd density', target: 'Wyrd-density' },
              { key: 'trade routes', target: 'trade routes' },
              { key: 'monolith locations', target: 'Monolith locations' },
              { key: 'monoliths', target: 'Monolith locations' },
              { key: 'house viridane', target: 'House Viridane' },
              { key: 'viridane', target: 'House Viridane' },
              // Additional Frostwood Reach lookups
              { key: 'frostfang wastes', target: 'Northern half' },
              { key: 'frostfang', target: 'Northern half' },
              { key: 'southern half', target: 'Southern half' },
              { key: 'southern reach', target: 'Southern half' },
              { key: 'iron lake', target: 'Iron Lake' },
              { key: 'velling', target: 'Velling' },
              { key: 'shifting fen', target: 'Shifting Fen' },
              { key: 'bramble heath', target: 'Bramble Heath' },
              { key: 'ironwood heart', target: 'Ironwood Heart' },
              { key: 'eastern fens', target: 'Eastern Fens' }
            ];
            for (const kw of keywords) {
              if (textLower.includes(kw.key)) {
                templateItem = templateItems.find(t => t.text.toLowerCase().includes(kw.target.toLowerCase()));
                if (templateItem) break;
              }
            }
          }

          let whyText = templateItem ? templateItem.why : (item.why || '');
          
          // Try to enrich using LORE_DICTIONARY if the text matches a known term
          for (const [, entry] of Object.entries(LORE_DICTIONARY || {})) {
            if (entry && entry.term) {
              const termLower = entry.term.toLowerCase();
              if (termLower.length > 3 && textLower.includes(termLower)) {
                const entryText = entry.fullEntry || entry.summary;
                if (entryText && entryText.length > whyText.length) {
                  whyText = entryText.replace(/<LoreLink[^>]*>([^<]*)<\/LoreLink>/g, '$1');
                  break;
                }
              }
            }
          }

          return {
            ...item,
            why: whyText,
            inkarnate: templateItem ? templateItem.inkarnate : (item.inkarnate || ''),
            category: item.category || (templateItem ? templateItem.category : 'terrain'),
            action: item.action || (templateItem ? templateItem.action : 'DRAW')
          };
        }
        return null;
      }).filter(Boolean);
    }
  }
  return clean;
};

const getItemScope = (item) => {
  if (item.scope) return item.scope;

  const textLower = (item.text || '').toLowerCase();
  const category = item.category || '';

  // Explicit overworld items based on keyword matching
  const overworldKeywords = [
    'capital', 'massif', 'archipelago', 'strait', 'pass', 'route', 'oceanic',
    'boundary', 'coastline', 'mountain range', 'highway', 'escarpment', 'sea route',
    'emberspire', 'greymark', 'atropolis', 'synod hold', 'frosthold', 'merrowport',
    'frostmaw holdfast', 'climate zone', 'temperature gradient', 'signal-fires', 'signal-towers',
    'monolith locations', 'monolith areas', 'major landmarks', 'borders', 'border'
  ];

  if (overworldKeywords.some(kw => textLower.includes(kw))) {
    return 'overworld';
  }

  // Major geographical features like oceans, trenches, cyclones, zones
  if (['terrain', 'water', 'coast', 'effects', 'labels'].includes(category)) {
    // But minor details like caves, vents, shrines, camps are subregion details
    const subregionKeywords = ['caves', 'cave', 'vent', 'shrine', 'ruin', 'camp', 'village', 'hamlet', 'outpost', 'springs', 'pool', 'gulch', 'shanty', 'inn', 'tavern', 'dingle', 'quagmire', 'knoll', 'downs', 'crescent', 'crest', 'grove'];
    if (subregionKeywords.some(kw => textLower.includes(kw))) {
      return 'subregion';
    }
    return 'overworld';
  }

  return 'subregion';
};

const MapMakingSection = () => {
  const { isAdminBypass, user } = useAuthStore();
  const isAdmin = isAdminBypass || !!user?.isAdmin;

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(NOTES_KEY) || '';
    } catch (e) {
      return '';
    }
  });
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const enriched = enrichChecklist(parsed);
          if (Object.keys(enriched).length > 0) return enriched;
        }
      }
    } catch (e) {}
    const initial = {};
    for (const [regionId, items] of Object.entries(CHECKLIST_TEMPLATE || {})) {
      if (Array.isArray(items)) {
        initial[regionId] = items.map(item => ({ ...item, done: false }));
      }
    }
    return initial;
  });
  const [activeRegionId, setActiveRegionId] = useState('frostwood-reach');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeScope, setActiveScope] = useState('all');
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    try { localStorage.setItem(NOTES_KEY, notes); } catch (e) {}
  }, [notes]);

  useEffect(() => {
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist)); } catch (e) {}
  }, [checklist]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const enriched = enrichChecklist(parsed);
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(enriched));
      setChecklist(enriched);
    } catch (e) {}
  }, []);

  const toggleItem = useCallback((regionId, index) => {
    setChecklist(prev => {
      const region = Array.isArray(prev[regionId]) ? [...prev[regionId]] : [];
      if (!region[index] || typeof region[index] !== 'object') return prev;
      region[index] = { ...region[index], done: !region[index].done };
      return { ...prev, [regionId]: region };
    });
  }, []);

  const toggleExpanded = useCallback((regionId, index) => {
    setExpandedItems(prev => {
      const key = `${regionId}-${index}`;
      return { ...prev, [key]: !prev[key] };
    });
  }, []);

  const resetChecklist = useCallback(() => {
    if (!window.confirm('Reset the entire checklist? This cannot be undone.')) return;
    const initial = {};
    for (const [regionId, items] of Object.entries(CHECKLIST_TEMPLATE || {})) {
      if (Array.isArray(items)) {
        initial[regionId] = items.map(item => ({ ...item, done: false }));
      }
    }
    setChecklist(initial);
    setExpandedItems({});
  }, []);

  const openRegionLore = useCallback((regionId) => {
    setSelectedRegion(regionId);
  }, []);

  const closePopup = useCallback(() => {
    setSelectedRegion(null);
  }, []);

  const totalChecked = useMemo(() => {
    let total = 0, done = 0;
    for (const items of Object.values(checklist || {})) {
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item && typeof item === 'object') {
            total++;
            if (item.done) done++;
          }
        }
      }
    }
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [checklist]);

  const regionLore = useMemo(() => {
    if (!selectedRegion) return null;
    const originalLore = LORE_DICTIONARY[selectedRegion];
    if (!originalLore) return null;

    // Clean and strip HTML/code tags like LoreLink
    const cleanText = (txt) => {
      if (!txt) return '';
      return txt.replace(/<LoreLink[^>]*>([^<]*)<\/LoreLink>/g, '$1');
    };

    const lore = {
      ...originalLore,
      summary: cleanText(originalLore.summary),
      fullEntry: cleanText(originalLore.fullEntry)
    };

    const subregions = Object.values(SUBREGIONS).filter(s => s.regionId === selectedRegion);
    return { lore, subregions };
  }, [selectedRegion]);

  const regionDisplayInfo = useMemo(() => {
    if (!selectedRegion) return null;
    return REGION_DISPLAY.find(r => r.id === selectedRegion);
  }, [selectedRegion]);

  const subregionsForActiveRegion = useMemo(() => {
    return Object.values(SUBREGIONS).filter(s => s.regionId === activeRegionId);
  }, [activeRegionId]);

  const filteredChecklist = useMemo(() => {
    let items = checklist[activeRegionId] || [];
    if (activeCategory !== 'all') {
      items = items.filter(item => item && item.category === activeCategory);
    }
    if (activeScope !== 'all') {
      items = items.filter(item => item && getItemScope(item) === activeScope);
    }
    return items;
  }, [checklist, activeRegionId, activeCategory, activeScope]);

  const categoryCounts = useMemo(() => {
    let items = checklist[activeRegionId] || [];
    if (activeScope !== 'all') {
      items = items.filter(item => item && getItemScope(item) === activeScope);
    }
    const counts = { all: items.length };
    for (const item of items) {
      if (item && item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    }
    return counts;
  }, [checklist, activeRegionId, activeScope]);

  const scopeCounts = useMemo(() => {
    const items = checklist[activeRegionId] || [];
    const counts = { all: items.length, overworld: 0, subregion: 0 };
    for (const item of items) {
      if (item) {
        const sc = getItemScope(item);
        if (sc === 'overworld') counts.overworld++;
        if (sc === 'subregion') counts.subregion++;
      }
    }
    return counts;
  }, [checklist, activeRegionId]);

  const activeRegion = useMemo(
    () => REGION_DISPLAY.find(r => r.id === activeRegionId),
    [activeRegionId]
  );

  if (!isAdmin) {
    return (
      <div className="map-making-locked">
        <i className="fas fa-lock"></i>
        <h2>Map Making: Restricted</h2>
        <p>This section is reserved for the map maker. Please log in as an admin to access it.</p>
      </div>
    );
  }

  return (
    <div className="map-making-section">
      <header className="map-making-header">
        <div className="map-making-greeting">
          <i className="fas fa-feather-alt"></i>
          <div>
            <h2>A Letter to Lord Bertil, the Map Maker</h2>
            <p className="subtitle">
              Welcome. The world of Mythrill is laid out below: every region, every subregion,
              every city, every climate. Use the categorized checklist to place things on the map,
              scribble in the notes, and click any region to see the deeper lore. Each checklist
              item tells you what to draw, where to place it, and why it matters.
              This section will be removed once the map is done.
            </p>
          </div>
        </div>

        <div className="map-making-stats">
          <div className="stat-pill">
            <span className="stat-number">{totalChecked.done}</span>
            <span className="stat-sep">/</span>
            <span className="stat-total">{totalChecked.total}</span>
            <span className="stat-label">checklist items done</span>
          </div>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ width: `${totalChecked.percent}%` }}></div>
            <span className="progress-label">{totalChecked.percent}%</span>
          </div>
          <button className="reset-btn" onClick={resetChecklist} title="Reset the entire checklist">
            <i className="fas fa-undo"></i> Reset checklist
          </button>
        </div>
      </header>

      <div className="map-making-quickref">
        <h3><i className="fas fa-globe-europe"></i> Click a region: opens the lore</h3>
        <div className="region-pills">
          {REGION_DISPLAY.map(region => {
            const colors = REGION_COLORS[region.id];
            const isActive = activeRegionId === region.id;
            return (
              <button
                key={region.id}
                className={`region-pill ${isActive ? 'active' : ''}`}
                style={{
                  '--region-primary': colors.primary,
                  '--region-accent': colors.accent
                }}
                onClick={() => {
                  setActiveRegionId(region.id);
                  setActiveCategory('all');
                  setActiveScope('all');
                  openRegionLore(region.id);
                }}
              >
                <span className="region-pill-name">{region.name}</span>
                <span className="region-pill-tagline">{region.tagline}</span>
                <span className="region-pill-placement">{region.placement}</span>
                <div className="region-pill-palette">
                  {region.inkarnate.palette.map((c, i) => (
                    <span key={i} className="palette-swatch" style={{ background: c }} title={c}></span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="map-making-subregions">
        <h3>
          <i className="fas fa-map-marked-alt"></i>
          Subregions of {activeRegion?.name}
        </h3>
        <div className="subregion-grid">
          {subregionsForActiveRegion.map(sub => (
            <div key={sub.id} className="subregion-card">
              <h4>{sub.name}</h4>
              <p className="subregion-climate"><i className="fas fa-thermometer-half"></i> {sub.climate}</p>
              <p className="subregion-terrain"><i className="fas fa-mountain"></i> {sub.dominantTerrain}</p>
              <div className="subregion-meta">
                <div className="meta-row"><strong>Peoples:</strong> {sub.primaryRaces.join(', ')}</div>
                <div className="meta-row"><strong>Powers:</strong> {sub.primaryFactions.join(', ')}</div>
                <div className="meta-row"><strong>Zones ({sub.zoneIds.length}):</strong> {sub.zoneIds.slice(0, 4).join(', ')}{sub.zoneIds.length > 4 ? ', …' : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="map-making-checklist-section">
        <div className="checklist-header">
          <h3>
            <i className="fas fa-tasks"></i>
            What to place in {activeRegion?.name}
          </h3>
          <p className="checklist-help">
            Each item is a specific thing to add. The icon shows which Inkarnate layer/tool to use.
            Click any item to expand it and see why it matters.
          </p>
        </div>

        <div className="scope-filters">
          <span className="scope-filters-label">Map Level / Priority:</span>
          <div className="scope-tabs">
            <button
              className={`scope-tab ${activeScope === 'all' ? 'active' : ''}`}
              onClick={() => setActiveScope('all')}
            >
              <i className="fas fa-globe"></i>
              Show All ({scopeCounts.all})
            </button>
            <button
              className={`scope-tab ${activeScope === 'overworld' ? 'active' : ''}`}
              onClick={() => setActiveScope('overworld')}
            >
              <i className="fas fa-atlas"></i>
              Overworld Map ({scopeCounts.overworld})
            </button>
            <button
              className={`scope-tab ${activeScope === 'subregion' ? 'active' : ''}`}
              onClick={() => setActiveScope('subregion')}
            >
              <i className="fas fa-search-plus"></i>
              Subregion Details ({scopeCounts.subregion})
            </button>
          </div>
        </div>

        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <i className="fas fa-th-list"></i>
            All
            <span className="cat-count">{categoryCounts.all || 0}</span>
          </button>
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.id] || 0;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{ '--cat-color': cat.color }}
                title={cat.help}
              >
                <i className={cat.icon}></i>
                {cat.label}
                <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        <ul className="checklist">
          {filteredChecklist.map((item, i) => {
            const realIndex = (checklist[activeRegionId] || []).findIndex(x => x === item);
            const isExpanded = !!expandedItems[`${activeRegionId}-${realIndex}`];
            const actionType = ACTION_TYPES[item.action] || ACTION_TYPES.DRAW;
            const itemScope = getItemScope(item);
            return (
              <li key={realIndex} className={`checklist-item ${item.done ? 'done' : ''} ${isExpanded ? 'expanded' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!item.done}
                    onChange={() => toggleItem(activeRegionId, realIndex)}
                  />
                  <span className="action-badge" style={{ background: actionType.color, color: '#1a1410' }}>
                    <i className={actionType.icon}></i>
                    {actionType.verb}
                  </span>
                  
                  {itemScope === 'overworld' ? (
                    <span className="scope-badge scope-overworld" title="Draw on the primary Overworld Map">
                      <i className="fas fa-globe"></i> Overworld
                    </span>
                  ) : (
                    <span className="scope-badge scope-subregion" title="Zoomed-in Subregion detail for later maps">
                      <i className="fas fa-search-plus"></i> Subregion
                    </span>
                  )}

                  <span className="checklist-text">{item.text}</span>
                  <button
                    type="button"
                    className="expand-btn"
                    onClick={(e) => { e.preventDefault(); toggleExpanded(activeRegionId, realIndex); }}
                    aria-label="Show more"
                  >
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                  </button>
                </label>
                {isExpanded && (
                  <div className="map-item-details">
                    <div className="map-detail-row">
                      <span className="map-detail-label">Why:</span>
                      <span className="map-detail-value">{item.why}</span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="map-making-global">
        <h3>
          <i className="fas fa-globe"></i>
          Global items (apply to the whole map)
        </h3>
        <p className="checklist-help">These are cross-cutting items: climate logic, the Monoliths, trade routes, world tension cues, sigils.</p>
        <ul className="checklist">
          {(Array.isArray(checklist['global']) ? checklist['global'] : []).map((item, i) => {
            const isExpanded = !!expandedItems[`global-${i}`];
            const actionType = ACTION_TYPES[item.action] || ACTION_TYPES.DRAW;
            return (
              <li key={i} className={`checklist-item ${item.done ? 'done' : ''} ${isExpanded ? 'expanded' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!item.done}
                    onChange={() => toggleItem('global', i)}
                  />
                  <span className="action-badge" style={{ background: actionType.color, color: '#1a1410' }}>
                    <i className={actionType.icon}></i>
                    {actionType.verb}
                  </span>
                  <span className="checklist-text">{item.text}</span>
                  <button
                    type="button"
                    className="expand-btn"
                    onClick={(e) => { e.preventDefault(); toggleExpanded('global', i); }}
                    aria-label="Show more"
                  >
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                  </button>
                </label>
                {isExpanded && (
                  <div className="map-item-details">
                    <div className="map-detail-row">
                      <span className="map-detail-label">Why:</span>
                      <span className="map-detail-value">{item.why}</span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="map-making-notes">
        <h3>
          <i className="fas fa-pen-fancy"></i>
          Notes from Lord Bertil
        </h3>
        <p className="notes-hint">
          Scribble anything here. Notes save in this browser. Use this to track questions,
          what to add later, requests for the team, or to-dos for next session.
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Lord Bertil's notes: layout questions, ideas, what to add, what to clarify, requests for the team..."
          rows={14}
        />
      </section>

      {selectedRegion && regionLore && regionLore.lore && (
        <div className="lore-popup-overlay" onClick={closePopup}>
          <div className="lore-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
            <div
              className="popup-banner"
              style={{
                background: `linear-gradient(135deg, ${REGION_COLORS[selectedRegion].primary}, ${REGION_COLORS[selectedRegion].accent})`
              }}
            >
              <h2>{regionLore.lore.term}</h2>
              <p className="popup-tagline">{regionLore.lore.summary}</p>
            </div>
             <div className="popup-body">
               {regionDisplayInfo && (
                 <div className="popup-quick-ref">
                   <div className="quick-ref-item">
                     <span className="quick-ref-label">Where to Draw & Structure</span>
                     <span className="quick-ref-value">{regionDisplayInfo.placement}</span>
                   </div>
                   <div className="quick-ref-item">
                     <span className="quick-ref-label">Climate & Weather</span>
                     <span className="quick-ref-value">{regionDisplayInfo.inkarnate.climateNote}</span>
                   </div>
                   <div className="quick-ref-item">
                     <span className="quick-ref-label">Base Texture Style</span>
                     <span className="quick-ref-value" style={{ textTransform: 'capitalize' }}>
                       {regionDisplayInfo.inkarnate.base}
                     </span>
                   </div>
                   <div className="quick-ref-item">
                     <span className="quick-ref-label">Color Palette</span>
                     <div className="palette-swatches">
                       {regionDisplayInfo.inkarnate.palette.map((color, i) => (
                         <div
                           key={i}
                           className="palette-swatch"
                           style={{ backgroundColor: color }}
                           title={color}
                         />
                       ))}
                     </div>
                   </div>
                 </div>
               )}

               <div className="popup-fullentry-container">
                 <span className="quick-ref-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Region Context & Lore</span>
                 <p className="popup-fullentry">{regionLore.lore.fullEntry}</p>
               </div>
              {regionLore.subregions.length > 0 && (
                <div className="popup-subregions">
                  <h4>Subregions</h4>
                  <ul>
                    {regionLore.subregions.map(s => (
                      <li key={s.id}>
                        <strong>{s.name}</strong>: <em>{s.climate}</em>
                        <p>{s.dominantTerrain}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapMakingSection;
