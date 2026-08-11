/**
 * Subregion Maps Database & Registry
 *
 * Maps regional and sub-regional map assets, bounding areas, child polygons,
 * and user custom uploaded maps (stored safely in IndexedDB + memory cache).
 *
 * Registry structure:
 *   - One regional entry per continent region (id === region id) carrying the
 *     region's child subregion polygon metadata (drawn in the DevEditor).
 *   - One leaf entry per subregion (id === subregion id). Leaf entries WITHOUT
 *     an `image` resolve up to their parent region, then to the 8K master map
 *     (MapCanvas fallback), until a hand-drawn asset is attached.
 */

import { SUBREGIONS } from './subregions';
import { REGION_POLYGONS } from './regionPolygons';

export const BUILTIN_SUBREGION_MAPS = {
  'frostwood-reach': {
    id: 'frostwood-reach',
    name: 'Frostwood Reach Regional Map',
    regionId: 'frostwood-reach',
    parentMapId: 'mythril',
    width: 4096,
    height: 3072,
    description: 'The ironwood realm of the Frostwood Reach: the Thalreth Ledger-states, the Drowned Fens, and the Frostfang Wastes.',
    subregions: [
      {
        id: 'frostwood-south-reach',
        name: 'The Ironheart Vales',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'frostwood-north-reach',
        name: 'The Frostfang Wastes',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'frostwood-eastern-fens',
        name: 'The Drowned Fens',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'frostwood-frostdeep-gloom',
        name: 'Frostdeep Gloom',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'frostwood-deep-of-ilisha',
        name: 'The Deep of Ilisha',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },
  'nordhalla': {
    id: 'nordhalla',
    name: 'Nordhalla Regional Map',
    regionId: 'nordhalla',
    parentMapId: 'mythril',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The frozen northern realm of Nordhalla, featuring black fjords, glaciers, and ancient Skald strongholds.',
    subregions: [
      {
        id: 'nordhalla-glacier-heart',
        name: 'Rime-Spire Peaks',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [370, 199],
        points: [[2, 2], [5, 196], [60, 162], [114, 208], [154, 254], [298, 219], [263, 156], [360, 260], [424, 324], [646, 328], [764, 353], [743, 220], [684, 99], [662, 8]]
      },
      {
        id: 'nordhalla-fjord-coast',
        name: 'Skaldfjord Dal',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'nordhalla-frostfang-wastes',
        name: 'Frostfang Wastes',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },
  'sundale': {
    id: 'sundale',
    name: 'Sundale Regional Map',
    regionId: 'sundale',
    parentMapId: 'mythril',
    width: 4096,
    height: 3072,
    description: 'The volcanic heartland of Sundale: Ash-Heart, the Ashen Fringe, the Green Rim, and the Glitterwood.',
    subregions: [
      {
        id: 'sundale-ash-heart',
        name: 'Emberspire Caldera & Cinder Badlands',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundale-ashen-fringe',
        name: 'Sootstone Escarpment',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundale-green-rim',
        name: 'Warmhearth Valley & Meadowglen Shallows',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundale-glitterwood',
        name: 'Glitterwood Ridge & Glimmering Forest',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundale-flooded-hills',
        name: 'The Flooded Hills',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundale-heathens-gate',
        name: 'Heathens Gate',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },
  'iceheart-sea': {
    id: 'iceheart-sea',
    name: 'Iceheart Sea Regional Map',
    regionId: 'iceheart-sea',
    parentMapId: 'mythril',
    width: 4096,
    height: 3072,
    description: 'The storm-wracked Iceheart Sea: the Merrow Archipelago, Storm Belt, Deepwell Trench, and the Three Dukes.',
    subregions: [
      {
        id: 'iceheart-merrow-archipelago',
        name: 'The Merrow Archipelago',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-storm-belt',
        name: 'The Storm-Belt',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-deepwell-trench',
        name: 'The Deepwell Trench',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-northern-iceflows',
        name: 'The Frozen-Flows',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-western-isles',
        name: 'The Saryreach Isles',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-saltmaw',
        name: 'The Saltmaw Estuary Marshes',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-waters-of-eziara',
        name: 'The Waters of Eziara',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-three-dukes',
        name: 'The Three Dukes Spire Chain',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'iceheart-twin-gates',
        name: 'The Twin Gates Strait',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    name: 'Cragjaw Peaks Regional Map',
    regionId: 'cragjaw-peaks',
    parentMapId: 'mythril',
    width: 4096,
    height: 3072,
    description: 'The towering Cragjaw Peaks: the Massif, the Gorge-Web, and the Iron Sumps.',
    subregions: [
      {
        id: 'cragjaw-massif',
        name: 'The Frostmaw Massif Range',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'cragjaw-gorge-web',
        name: 'The Gorge-Web',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'cragjaw-iron-sumps',
        name: 'The Iron Sumps',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    name: 'Sundrift Vale Regional Map',
    regionId: 'sundrift-vale',
    parentMapId: 'mythril',
    width: 4096,
    height: 3072,
    description: 'The open plains of the Sundrift Vale: the Long Steppe, Ancestor-Wolds, Starfall Basin, Bogpost March, and Blizzard Bluff.',
    subregions: [
      {
        id: 'sundrift-long-steppe',
        name: 'The Endless Steppe',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundrift-ancestor-wolds',
        name: 'The Ancestor Wolds',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundrift-starfall-basin',
        name: 'The Starfall Basin',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundrift-bogpost-march',
        name: 'The Bogpost March',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'sundrift-blizzard-bluff',
        name: 'Blizzard Bluff',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    name: 'Bryngloom Forest Regional Map',
    regionId: 'bryngloom-forest',
    parentMapId: 'mythril',
    width: 4096,
    height: 3072,
    description: 'The vast Bryngloom forest: the Canopy-Heart, Sunken Basin, Peat-Wastes, Western Bayous, Great Mere, and the Root-Veil.',
    subregions: [
      {
        id: 'bryngloom-canopy-heart',
        name: 'The Canopy-Heart',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'bryngloom-sunken-basin',
        name: 'The Sunken Basin',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'bryngloom-peat-wastes',
        name: 'The Peat-Wastes',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'bryngloom-western-bayous',
        name: 'The Western Bayous',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'bryngloom-great-mere',
        name: 'The Great Mere',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
      {
        id: 'bryngloom-root-veil',
        name: 'The Root-Veil (Subterranean)',
        color: 'rgba(70, 150, 220, 0.18)',
        glowColor: 'rgba(120, 200, 255, 0.75)',
        labelPosition: [0, 0],
        points: []
      },
    ]
  },

  // ======== Subregion leaf maps (hand-drawn assets attach here) ========
  'frostwood-south-reach': {
    id: 'frostwood-south-reach',
    name: 'The Ironheart Vales',
    regionId: 'frostwood-reach',
    parentMapId: 'frostwood-reach',
    width: 4096,
    height: 3072,
    description: 'The warmer, denser southern half of the Frostwood Reach, closest to the world-heart and the volcanic warmth bleeding out of Sundale. The ironwood here is the oldest and tallest in the region, and the fog is at its thickest. This is Thalreth country: the Sovereign Ledger is enforced at every check-post, the Scribe-Cartel holds its monopoly on ink, and the Mist-Sentinels patrol the Ironwood Palisade.'
  },
  'frostwood-north-reach': {
    id: 'frostwood-north-reach',
    name: 'The Frostfang Wastes',
    regionId: 'frostwood-reach',
    parentMapId: 'frostwood-reach',
    width: 4096,
    height: 3072,
    description: 'The cold, stony northern half of the Frostwood Reach, far from the volcanic warmth. The forests thin into tundra and bare granite, and the ironwoods grow short and twisted. Stone structures replace living timber; carved runic monoliths and watch-posts built into cliff faces mark the few roads. Frozen lakes surface in summer; the rest of the year, only their location is remembered. Rumors persist of giant Jutul-like beings in the deep wastes, but the few who travel that far rarely return to confirm.'
  },
  'frostwood-eastern-fens': {
    id: 'frostwood-eastern-fens',
    name: 'The Drowned Fens',
    regionId: 'frostwood-reach',
    parentMapId: 'frostwood-reach',
    width: 4096,
    height: 3072,
    description: 'A lawless stretch of peat-bog and brackish marsh on the eastern fringe of the Reach, where the fog thins into a low, clinging haze. The Forgotten, undocumented people stripped of their rights by the Sovereign Ledger, hide here, alongside the Mimir outcasts and the most desperate Florae exiles.'
  },
  'nordhalla-glacier-heart': {
    id: 'nordhalla-glacier-heart',
    name: 'Rime-Spire Peaks',
    regionId: 'nordhalla',
    parentMapId: 'nordhalla',
    image: '/assets/images/backgrounds/rime-spire-peaks.jpg',
    width: 4096,
    height: 3072,
    description: 'The warm, varied west-central region of Nordhalla — encompassing the Icetalon Peaks, the geothermal-warmed Whispering Pine Forest, and the southern coast facing Sundale. Here lies Snowcall City, the Corvani roosts, the Berserker trial grounds of Blóðhöll, the sacred cliff of Þögn, and the sinister fortress of Sválghjarta\'s Keep built around the Swallow-Heart.'
  },
  'nordhalla-fjord-coast': {
    id: 'nordhalla-fjord-coast',
    name: 'Skaldfjord Dal',
    regionId: 'nordhalla',
    parentMapId: 'nordhalla',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The settled river and fjord corridor of Nordhalla, anchored by the capital Frostholm and the Sunder-Wall. Home to the legendary Frozen Archive, the Bloodhammer Sump forges, and the primary naval harbors of the Icechamber Syndicate.'
  },
  'nordhalla-frostfang-wastes': {
    id: 'nordhalla-frostfang-wastes',
    name: 'Frostfang Wastes',
    regionId: 'nordhalla',
    parentMapId: 'nordhalla',
    image: '/assets/images/backgrounds/nordhalla.jpeg',
    width: 4096,
    height: 3072,
    description: 'The desolate, wind-scoured whiteout glaciers beyond the Sunder-Wall. The nomadic Øsling clans hunt mammoths here, where ancient ruins like Blizzard\'s End and the dark Heir-Mounds mark the true history of the Seal-Breaking.'
  },
  'sundale-ash-heart': {
    id: 'sundale-ash-heart',
    name: 'Emberspire Caldera & Cinder Badlands',
    regionId: 'sundale',
    parentMapId: 'sundale',
    width: 4096,
    height: 3072,
    description: 'The dead volcanic core of Sundale, a ring of obsidian and basalt around Emberspire that no one lives in and few cross. The Spinstones Columns, the Cinderbloom Crater, the Sunstone Mesa, the Emberspire Caldera itself, all volcanic features, all lethal without preparation. The Wyrd bleeds thickest here.'
  },
  'sundale-ashen-fringe': {
    id: 'sundale-ashen-fringe',
    name: 'Sootstone Escarpment',
    regionId: 'sundale',
    parentMapId: 'sundale',
    width: 4096,
    height: 3072,
    description: 'The wide ring of ashen flatland and volcanic rock that surrounds the Ash-Heart. The bulk of Sundale\'s population lives here, the Ash-Dwellers who work the sulfur mines, the Solari refugees clinging to their ancient capital, the Solari forge-clans whose forges burn on the residual heat. The Dawn Vigil\'s Obsidian Citadels ring the Ashen Escarpment that separates the fringe from the green lands beyond.'
  },
  'sundale-green-rim': {
    id: 'sundale-green-rim',
    name: 'Warmhearth Valley & Meadowglen Shallows',
    regionId: 'sundale',
    parentMapId: 'sundale',
    width: 4096,
    height: 3072,
    description: 'The coastal ring of Sundale, green because the volcanic heat meets the sea and the resulting microclimate supports life. Fishing villages, port towns, oasis-like sheltered valleys, and the famous meadow-lands that the Dawn Vigil struggles to control. This is where the rest of the world trades with Sundale. Meadowglen in the north is the most fertile valley in the region.'
  },
  'sundale-glitterwood': {
    id: 'sundale-glitterwood',
    name: 'Glitterwood Ridge & Glimmering Forest',
    regionId: 'sundale',
    parentMapId: 'sundale',
    width: 4096,
    height: 3072,
    description: 'A peninsula connected to the main Sundale landmass by a narrow isthmus, a half-island, lush and forested, the greenest land in the region. Crystal-rich volcanic soil supports ancient growth; the trees here drink the heat bleeding from Emberspire. Long thought uninhabitable, the Dawn Vigil\'s collapse has seen it recolonized by hermits, the Risen (old Solari faith), and the Shorn descendants of the old Solvarn nobility who fled the capital.'
  },
  'iceheart-merrow-archipelago': {
    id: 'iceheart-merrow-archipelago',
    name: 'The Merrow Archipelago',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The central cluster of inhabited islands in the Iceheart Sea, the heart of Merryn seafaring, the seat of the Sea-Charter, and the only place the Board of Trade fully controls. Merrowport floats at the center. Ironjaw Port anchors the eastern reach. Dozens of smaller islands host fishing camps, salt-works, and the Drift-Council representatives.'
  },
  'iceheart-storm-belt': {
    id: 'iceheart-storm-belt',
    name: 'The Storm-Belt',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The western stretch of the Iceheart Sea, dominated by the Shard-Window, a three-mile-wide circular storm-vortex hovering over a Sundered Monolith. The waters here never rest. Pirate fleets use the storm-veins to escape Board of Trade patrols; the Myriad wraiths and storm-spirits stalk the lanes.'
  },
  'iceheart-deepwell-trench': {
    id: 'iceheart-deepwell-trench',
    name: 'The Deepwell Trench',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The eastern reach of the Iceheart Sea, where the continental shelf drops away into the Treakous Oceanic Rift, a bottomless abyss. The Myrathil rule this depth; their Deep dwell in pressurized cave-cities carved into underwater basalt columns. Surface access is by Breathers-Born (merfolk-blooded) liaisons only.'
  },
  'iceheart-northern-iceflows': {
    id: 'iceheart-northern-iceflows',
    name: 'The Frozen-Flows',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The northern edge of the Iceheart Sea, where the waters freeze into icebergs the size of cities. Ancient ruins protrude from the bergs. First Shore is the largest, the original Mereval landing site, now preserved as a pilgrimage. Few venture here. The Berg-Witches and the Boreal Huldra live in the floes.'
  },
  'iceheart-western-isles': {
    id: 'iceheart-western-isles',
    name: 'The Saryreach Isles',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The chain of broken islands along the western edge of the Iceheart Sea, the boundary between the Merryn and the continental coasts. Saryreach Castle, the largest, was once a Mereval naval fortress and is now a pirate-queen\'s seat. Smaller islands host smuggler-coves, exile colonies, and the Mer-Court of the Tides.'
  },
  'iceheart-saltmaw': {
    id: 'iceheart-saltmaw',
    name: 'The Saltmaw Estuary Marshes',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The southernmost reach of the Iceheart Sea, where a glacial river from the Bryngloom meets the salt water. The estuary is a vast marshland of half-fresh, half-salt water; the Saltmaw Bog is a place of smugglers, exiled Neth, and forgotten spirits.'
  },
  'iceheart-waters-of-eziara': {
    id: 'iceheart-waters-of-eziara',
    name: 'The Waters of Eziara',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'The vast central ocean basin separating Sundale, Cragjaw, and Sundrift Vale. The primary shipping lane of the known world, patrolled by Merryn merchant fleets and targeted by Leviathan Empire Siren raids.'
  },
  'iceheart-three-dukes': {
    id: 'iceheart-three-dukes',
    name: 'The Three Dukes Spire Chain',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'Three towering basalt sea-spires standing between southern Nordhalla and northern Sundale, named after rebel Skald dukes who fled the Glacier Bargain.'
  },
  'iceheart-twin-gates': {
    id: 'iceheart-twin-gates',
    name: 'The Twin Gates Strait',
    regionId: 'iceheart-sea',
    parentMapId: 'iceheart-sea',
    width: 4096,
    height: 3072,
    description: 'A narrow, cliff-flanked sea strait at the mouth of the East Sea. The primary naval choke-point where Crown Coalition warships demand trade tolls.'
  },
  'sundale-flooded-hills': {
    id: 'sundale-flooded-hills',
    name: 'The Flooded Hills',
    regionId: 'sundale',
    parentMapId: 'sundale',
    width: 4096,
    height: 3072,
    description: 'A marshy, island-dotted archipelago of semi-submerged hills connecting southern Sundale to northern Sundrift Vale, formed when Mereval sea-bargains flooded the lowland valleys.'
  },
  'sundale-heathens-gate': {
    id: 'sundale-heathens-gate',
    name: 'Heathens Gate',
    regionId: 'sundale',
    parentMapId: 'sundale',
    width: 4096,
    height: 3072,
    description: 'A volcanic sea-chasm surrounded by black obsidian reefs north of Sundale, used by Scoured Syndicate cultists to perform dark solar rituals.'
  },
  'frostwood-frostdeep-gloom': {
    id: 'frostwood-frostdeep-gloom',
    name: 'Frostdeep Gloom',
    regionId: 'frostwood-reach',
    parentMapId: 'frostwood-reach',
    width: 4096,
    height: 3072,
    description: 'An ominous, fog-choked rift valley where petrified ironwoods meet the granite cliffs of Cragjaw Peaks, serving as a strategic mountain-pass battleground.'
  },
  'frostwood-deep-of-ilisha': {
    id: 'frostwood-deep-of-ilisha',
    name: 'The Deep of Ilisha',
    regionId: 'frostwood-reach',
    parentMapId: 'frostwood-reach',
    width: 4096,
    height: 3072,
    description: 'A sheltered, deep-water gulf between Sundale and Frostwood Reach, filled with pre-Binding sunken shipwrecks and submerged archives.'
  },
  'cragjaw-massif': {
    id: 'cragjaw-massif',
    name: 'The Frostmaw Massif Range',
    regionId: 'cragjaw-peaks',
    parentMapId: 'cragjaw-peaks',
    width: 4096,
    height: 3072,
    description: 'The central spine of the Cragjaw Peaks, the highest, coldest, and most impassable. Frostmaw Holdfast, seat of House Tesshan, sits in a volcanic crater near the center. The peaks here are taller than any tree grows. Jutul, the great trolls, and the primordial Thrumm stalk the high ice. Few humans have climbed above the Terraced level and returned.'
  },
  'cragjaw-gorge-web': {
    id: 'cragjaw-gorge-web',
    name: 'The Gorge-Web',
    regionId: 'cragjaw-peaks',
    parentMapId: 'cragjaw-peaks',
    width: 4096,
    height: 3072,
    description: 'The mid-altitude network of chasms, gorges, and bone-bridges that connect the keeps to the deep industrial sumps. The Groven rule here, their calcified Ancestor-Spans are the only safe routes through the chasms. Deepchasm Keep is the military hub. Tessen patrols, Groven toll-posts, and the Mist-Cobblers watch the high passes.'
  },
  'cragjaw-iron-sumps': {
    id: 'cragjaw-iron-sumps',
    name: 'The Iron Sumps',
    regionId: 'cragjaw-peaks',
    parentMapId: 'cragjaw-peaks',
    width: 4096,
    height: 3072,
    description: 'The deep industrial heart of the Cragjaw Peaks, the toxic mining shafts, geothermal plants, and Fexric workshops that keep the high keeps alive. The Sump Galleries, Gearworks Gulch, and Iron Ravine are all here. Chasm-Dwellers work the mines; Deep Alchemists run the vats; the Lost Brood Vats are the abandoned ruins of a guild that went too deep.'
  },
  'sundrift-long-steppe': {
    id: 'sundrift-long-steppe',
    name: 'The Endless Steppe',
    regionId: 'sundrift-vale',
    parentMapId: 'sundrift-vale',
    width: 4096,
    height: 3072,
    description: 'The vast central plain of the Sundrift Vale, endless grass, endless wind, endless migration. The Mounted clans roam here, following the mare-herds across The Long Steppe and the Grass Tundra. Few landmarks. The Unlit Knoll rises in the distance. The Lien-Stalked Grazes glow faintly at night.'
  },
  'sundrift-ancestor-wolds': {
    id: 'sundrift-ancestor-wolds',
    name: 'The Ancestor Wolds',
    regionId: 'sundrift-vale',
    parentMapId: 'sundrift-vale',
    width: 4096,
    height: 3072,
    description: 'The eastern uplands of the Vale, rolling hills covered with thousands of burial barrows. The Mound-Camps gather here for in summer; the Astril pilgrimage to the deepest mounds to hear Lumia\'s echo. The Ordavan Herd-Tithe is enforced at cairn-checkpoints; the Echo-Singers come here to die.'
  },
  'sundrift-starfall-basin': {
    id: 'sundrift-starfall-basin',
    name: 'The Starfall Basin',
    regionId: 'sundrift-vale',
    parentMapId: 'sundrift-vale',
    width: 4096,
    height: 3072,
    description: 'The western basin of the Vale, dominated by the great crater of Starfall Vale, where the crystalline remnants of Lumia\'s destruction struck Mythrill during the Breach. The Synod Hold, the Astril crystal-lattice fortress, rises at the basin\'s center. The most spiritually significant site in the Vale, and the most contested.'
  },
  'sundrift-bogpost-march': {
    id: 'sundrift-bogpost-march',
    name: 'The Bogpost March',
    regionId: 'sundrift-vale',
    parentMapId: 'sundrift-vale',
    width: 4096,
    height: 3072,
    description: 'The southern march of the Vale, the transition zone where the steppe meets the Bryngloom Forest. Morren\'s Bogpost is the only major settlement, a trade outpost where Ordan horse-traders meet Vreken peat-cutters and Bryngloom Neth scribes. The cultural mixing here is intense; many Marred folk live in the bogpost.'
  },
  'sundrift-blizzard-bluff': {
    id: 'sundrift-blizzard-bluff',
    name: 'Blizzard Bluff',
    regionId: 'sundrift-vale',
    parentMapId: 'sundrift-vale',
    width: 4096,
    height: 3072,
    description: 'The northern edge of the Vale, where a high cold bluff separates the warmer steppe from the deep ice of the Frostwood Reach. The Ordavan call this the Snow-Tooth, the wind here never stops. Small Ordan sentry-posts watch the passes; Frostwood Thalren patrols meet them at the cairns.'
  },
  'bryngloom-canopy-heart': {
    id: 'bryngloom-canopy-heart',
    name: 'The Canopy-Heart',
    regionId: 'bryngloom-forest',
    parentMapId: 'bryngloom-forest',
    width: 4096,
    height: 3072,
    description: 'The political heart of the Bryngloom, the ironwood cathedral-grove of Atropolis, the Great Mere (the central lake), the Over-Shanty hanging slum. The Neth Velun rule here; the Great Registry is enforced; the Vreken are bound to debt-covenants beneath the towering ironwood. The Peat-Bog Sinks surround the capital.'
  },
  'bryngloom-sunken-basin': {
    id: 'bryngloom-sunken-basin',
    name: 'The Sunken Basin',
    regionId: 'bryngloom-forest',
    parentMapId: 'bryngloom-forest',
    width: 4096,
    height: 3072,
    description: 'The south-eastern depression of the Bryngloom, where the Vreken have carved their inverted gothic cathedral into a four-hundred-foot sinkhole. The Sunken Spire, the crypt of Aedris the First-Lit, the fungal shroud-shrines, all here. The basin floor glows faintly with the eternal pale-moonlight of Aedris.'
  },
  'bryngloom-peat-wastes': {
    id: 'bryngloom-peat-wastes',
    name: 'The Peat-Wastes',
    regionId: 'bryngloom-forest',
    parentMapId: 'bryngloom-forest',
    width: 4096,
    height: 3072,
    description: 'The northern reaches of the forest, vast stretches of acidic peat-bog where the ironwood roots rot and the water is poison. The Widow\'s Quagmire is the worst, a stretch that liquefies underfoot. Debt-Revenants are conscripted to work the peat-presses here; the Black Fen is where broken contracts are dumped.'
  },
  'bryngloom-western-bayous': {
    id: 'bryngloom-western-bayous',
    name: 'The Western Bayous',
    regionId: 'bryngloom-forest',
    parentMapId: 'bryngloom-forest',
    width: 4096,
    height: 3072,
    description: 'The western edge of the forest, where Vel-Keth Bayou (the water-that-remembers) winds through the oldest ironwood groves. The Kessen weavers of Aran-Glen live here, reading probability in their living-ironwood looms. The Inquisition keeps the Covenbane Stronghold in the eastern bayous; the swamp-singers were purged from these waters.'
  },
  'bryngloom-great-mere': {
    id: 'bryngloom-great-mere',
    name: 'The Great Mere',
    regionId: 'bryngloom-forest',
    parentMapId: 'bryngloom-forest',
    width: 4096,
    height: 3072,
    description: 'The vast central lake of the Bryngloom, dotted with small wooded islands, some inhabited, some forbidden, some not even on any map. Merryn barges tie up at the lake-ports; Vreken shrines hide on the western islands; an old Velun monastery stands on the largest. The lake level rises and falls with the moon.'
  },
  'bryngloom-root-veil': {
    id: 'bryngloom-root-veil',
    name: 'The Root-Veil (Subterranean)',
    regionId: 'bryngloom-forest',
    parentMapId: 'bryngloom-forest',
    width: 4096,
    height: 3072,
    description: 'Beneath the entire forest, the mycelial network the Neth call the Root-Veil connects every ironwood root. Morvane rules here, in the deepest dark, where the First Contract was signed. The Root-Veil Scriptorium, the fabled archive of unbreakable memory, sits at the network\'s heart.'
  },

};

const DB_NAME = 'mythrill_maps_db';
const STORE_NAME = 'custom_subregion_maps';
const CUSTOM_MAPS_STORAGE_KEY = 'mythrill_custom_subregion_maps';

// In-memory cache for immediate synchronous lookups
let inMemoryCustomMaps = {};

// Initialize in-memory cache from localStorage on load if available
try {
  const raw = localStorage.getItem(CUSTOM_MAPS_STORAGE_KEY);
  if (raw) inMemoryCustomMaps = JSON.parse(raw);
} catch (e) {
  // ignore
}

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const initCustomMaps = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const items = request.result || [];
        items.forEach(item => {
          inMemoryCustomMaps[item.id] = item;
        });
        resolve(inMemoryCustomMaps);
      };
      request.onerror = () => {
        resolve(inMemoryCustomMaps);
      };
    });
  } catch (err) {
    console.warn('Could not load IndexedDB maps:', err);
    return inMemoryCustomMaps;
  }
};

// Immediately invoke background initialization
initCustomMaps();

export const getCustomMaps = () => {
  return { ...inMemoryCustomMaps };
};

export const saveCustomMap = async (mapData) => {
  const mapId = mapData.id || `custom-map-${Date.now()}`;
  const newMap = {
    ...mapData,
    id: mapId,
    createdAt: mapData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Update in-memory cache immediately
  inMemoryCustomMaps[mapId] = newMap;

  // 2. Persist to IndexedDB (supports multi-megabyte images)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(newMap);
  } catch (err) {
    console.warn('Could not save to IndexedDB, falling back:', err);
  }

  // 3. Fallback attempt to localStorage (lightweight metadata)
  try {
    localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(inMemoryCustomMaps));
  } catch (e) {
    // If image is too large for 5MB localStorage, save light copy to localStorage
    try {
      const lightCopy = {};
      Object.keys(inMemoryCustomMaps).forEach(k => {
        const item = inMemoryCustomMaps[k];
        lightCopy[k] = { ...item, image: item.image.startsWith('data:') ? 'indexeddb_stored' : item.image };
      });
      localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(lightCopy));
    } catch (e2) {
      // Ignore localStorage quota errors since IndexedDB handles large images
    }
  }

  return newMap;
};

export const deleteCustomMap = async (mapId) => {
  if (inMemoryCustomMaps[mapId]) {
    delete inMemoryCustomMaps[mapId];

    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(mapId);
    } catch (err) {
      console.warn('Could not delete from IndexedDB:', err);
    }

    try {
      localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(inMemoryCustomMaps));
    } catch (e) {
      // ignore
    }
    return true;
  }
  return false;
};

export const getSubregionMap = (mapId) => {
  if (!mapId || mapId === 'mythril') return null;

  // 1. Check custom uploaded maps first (user hand-drawn assets override built-ins)
  if (inMemoryCustomMaps[mapId] && inMemoryCustomMaps[mapId].image) {
    return inMemoryCustomMaps[mapId];
  }

  // 2. Custom map lookup by matching regionId property
  const subregionObj = SUBREGIONS[mapId];
  const customByRegion = Object.values(inMemoryCustomMaps).find(
    m => (m.regionId === mapId || (subregionObj && m.regionId === subregionObj.regionId)) && m.image
  );
  if (customByRegion) return customByRegion;

  // 3. Builtin entry with a real (non-fallback) image
  const builtin = BUILTIN_SUBREGION_MAPS[mapId];
  if (builtin && builtin.image) {
    return builtin;
  }

  // 4. Walk up to the parent region: a subregion without its own asset renders
  //    its parent region's map if that regional map has a real image.
  if (subregionObj && subregionObj.regionId) {
    const parentBuiltin = BUILTIN_SUBREGION_MAPS[subregionObj.regionId];
    if (parentBuiltin && parentBuiltin.image) {
      return parentBuiltin;
    }
  }

  // 5. Fallback to null so MapCanvas uses the 8192x6016 8K master map asset
  return null;
};

export const getAllAvailableSubregionMaps = () => {
  return {
    ...BUILTIN_SUBREGION_MAPS,
    ...inMemoryCustomMaps
  };
};

/**
 * Resolve where a drawn boundary belongs based on the map currently being viewed.
 * Drawing on a regional map (activeMapId !== 'mythril') places the subregion's
 * boundary polygon in that regional map's child polygon list (regional 4096x3072
 * coordinate space). Drawing on the world map uses the legacy master-space stores.
 *
 * Returns { target, kind } where:
 *   - target: the mutable entry object to write points/labelPosition into
 *   - kind: 'regional-subregion' | 'region' | 'subregion' | null
 */
export const resolveBoundaryTarget = (currentRegion, activeMapId) => {
  if (currentRegion && activeMapId && activeMapId !== 'mythril') {
    const regionalEntry = BUILTIN_SUBREGION_MAPS[activeMapId];
    if (regionalEntry && Array.isArray(regionalEntry.subregions)) {
      const sub = regionalEntry.subregions.find(s => s.id === currentRegion);
      if (sub) return { target: sub, kind: 'regional-subregion' };
    }
  }
  const target = REGION_POLYGONS?.[currentRegion] || SUBREGIONS?.[currentRegion] || null;
  return target
    ? { target, kind: REGION_POLYGONS?.[currentRegion] ? 'region' : 'subregion' }
    : { target: null, kind: null };
};

export default BUILTIN_SUBREGION_MAPS;
