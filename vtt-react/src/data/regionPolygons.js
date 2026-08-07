export const REGION_POLYGONS = {
  'iceheart-sea': {
    id: 'iceheart-sea',
    name: 'Iceheart Sea',
    points: [],
    color: 'rgba(70, 100, 130, 0.15)',
    glowColor: 'rgba(90, 120, 160, 0.5)',
    labelPosition: [0, 0],
    hasSubregionMap: true
  },
  'nordhalla': {
    id: 'nordhalla',
    name: 'Nordhalla',
    points: [[5, 200], [35, 182], [64, 169], [88, 169], [105, 193], [121, 218], [139, 223], [153, 245], [183, 242], [190, 213], [238, 209], [247, 182], [251, 141], [218, 113], [241, 109], [263, 125], [274, 148], [319, 153], [322, 177], [347, 190], [364, 218], [400, 213], [398, 253], [417, 266], [441, 271], [443, 295], [545, 305], [545, 268], [589, 284], [619, 269], [673, 269], [690, 317], [767, 329], [788, 303], [836, 304], [802, 350], [814, 392], [811, 435], [844, 452], [870, 420], [880, 399], [936, 373], [973, 396], [1010, 389], [1036, 387], [1064, 363], [1100, 353], [1116, 312], [1148, 351], [1226, 346], [1266, 365], [1311, 343], [1368, 346], [1437, 324], [1472, 277], [1474, 219], [1418, 180], [1407, 130], [1437, 106], [1486, 84], [1522, 4], [3, 2]],
    color: 'rgba(70, 150, 220, 0.18)',
    glowColor: 'rgba(120, 200, 255, 0.75)',
    labelPosition: [686, 256],
    hasSubregionMap: true,
    mapImage: '/assets/images/backgrounds/nordhalla.jpeg'
  },
  'frostwood-reach': {
    id: 'frostwood-reach',
    name: 'Frostwood Reach',
    points: [],
    color: 'rgba(74, 103, 65, 0.25)',
    glowColor: 'rgba(107, 143, 94, 0.6)',
    labelPosition: [0, 0],
    hasSubregionMap: true
  },
  'sundale': {
    id: 'sundale',
    name: 'Sundale',
    points: [],
    color: 'rgba(139, 105, 20, 0.25)',
    glowColor: 'rgba(184, 150, 31, 0.6)',
    labelPosition: [0, 0],
    hasSubregionMap: true
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    name: 'Cragjaw Peaks',
    points: [],
    color: 'rgba(107, 26, 26, 0.25)',
    glowColor: 'rgba(167, 46, 46, 0.6)',
    labelPosition: [0, 0],
    hasSubregionMap: true
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    name: 'Sundrift Vale',
    points: [],
    color: 'rgba(74, 103, 65, 0.25)',
    glowColor: 'rgba(107, 143, 94, 0.6)',
    labelPosition: [0, 0],
    hasSubregionMap: true
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    name: 'Bryngloom Forest',
    points: [],
    color: 'rgba(139, 105, 20, 0.25)',
    glowColor: 'rgba(184, 150, 31, 0.6)',
    labelPosition: [0, 0],
    hasSubregionMap: true
  }
};

export const BASELINE_REGION_POLYGONS = JSON.parse(JSON.stringify(REGION_POLYGONS));

export default REGION_POLYGONS;
