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
    points: [[180,140],[700,70],[1250,150],[1320,400],[1180,620],[700,700],[250,620]],
    color: 'rgba(107, 26, 26, 0.25)',
    glowColor: 'rgba(167, 46, 46, 0.6)',
    labelPosition: [600, 250]
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

// Pristine snapshot of committed region boundaries, captured at module load
// before localStorage overrides. Used by the dev editor to diff boundary
// edits for agent export.
export const BASELINE_REGION_POLYGONS = JSON.parse(JSON.stringify(REGION_POLYGONS));

export default REGION_POLYGONS;
