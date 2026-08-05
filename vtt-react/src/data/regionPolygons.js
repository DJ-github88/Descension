export const REGION_POLYGONS = {
  'iceheart-sea': {
    id: 'iceheart-sea',
    name: 'Iceheart Sea',
    points: [[200,1050],[800,950],[1350,1100],[1400,1700],[1200,2200],[700,2250],[300,2100],[180,1600]],
    color: 'rgba(70, 100, 130, 0.15)',
    glowColor: 'rgba(90, 120, 160, 0.5)',
    labelPosition: [800, 1500]
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
    points: [[2820,130],[3300,90],[3850,150],[3930,380],[3870,620],[3350,690],[2870,620],[2820,380]],
    color: 'rgba(74, 103, 65, 0.25)',
    glowColor: 'rgba(107, 143, 94, 0.6)',
    labelPosition: [3400, 300]
  },
  'sundale': {
    id: 'sundale',
    name: 'Sundale',
    points: [[1100,870],[1800,820],[2550,900],[2620,1280],[2530,1620],[1800,1660],[1180,1600],[1110,1280]],
    color: 'rgba(139, 105, 20, 0.25)',
    glowColor: 'rgba(184, 150, 31, 0.6)',
    labelPosition: [1800, 1150]
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    name: 'Cragjaw Peaks',
    points: [[2960,1020],[3450,970],[3900,1080],[3960,1500],[3920,1950],[3450,2100],[3000,2000],[2930,1500]],
    color: 'rgba(107, 26, 26, 0.25)',
    glowColor: 'rgba(167, 46, 46, 0.6)',
    labelPosition: [3600, 1500]
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    name: 'Sundrift Vale',
    points: [[2580,2380],[3300,2330],[3900,2400],[3960,2750],[3850,2980],[3200,3000],[2620,2980],[2540,2700]],
    color: 'rgba(74, 103, 65, 0.25)',
    glowColor: 'rgba(107, 143, 94, 0.6)',
    labelPosition: [3300, 2800]
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    name: 'Bryngloom Forest',
    points: [[120,2280],[600,2230],[1200,2240],[1480,2550],[1420,2950],[800,2980],[250,2960],[110,2600]],
    color: 'rgba(139, 105, 20, 0.25)',
    glowColor: 'rgba(184, 150, 31, 0.6)',
    labelPosition: [300, 2700]
  }
};

export const BASELINE_REGION_POLYGONS = JSON.parse(JSON.stringify(REGION_POLYGONS));

export default REGION_POLYGONS;
