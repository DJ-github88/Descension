import { create } from 'zustand';
import { ALL_CLASSES_DATA } from '../data/classes/index';

const NAME_TO_ID = {
  arcanoneer: 'arcanoneer',
  augur: 'augur',
  berserker: 'berserker',
  bladedancer: 'bladedancer',
  'chaos weaver': 'chaosWeaver',
  chronarch: 'chronarch',
  covenbane: 'covenbane',
  deathcaller: 'deathcaller',
  doomsayer: 'doomsayer',
  dreadnaught: 'dreadnaught',
  exorcist: 'exorcist',
  'false prophet': 'falseProphet',
  'fate weaver': 'fateWeaver',
  formbender: 'formbender',
  gambler: 'gambler',
  huntress: 'huntress',
  inscriptor: 'inscriptor',
  lichborne: 'lichborne',
  lunarch: 'lunarch',
  martyr: 'martyr',
  minstrel: 'minstrel',
  oracle: 'oracle',
  plaguebringer: 'plaguebringer',
  primalist: 'primalist',
  pyrofiend: 'pyrofiend',
  spellguard: 'spellguard',
  titan: 'titan',
  toxicologist: 'toxicologist',
  warden: 'warden',
  'witch doctor': 'witchDoctor'
};

const buildClassIndex = () => {
  const entries = [];

  Object.entries(ALL_CLASSES_DATA).forEach(([name, classData]) => {
    if (!classData || !classData.overview) return;

    const overview = classData.overview;
    const id = NAME_TO_ID[name.toLowerCase()] || name.toLowerCase().replace(/\s+/g, '');
    const notableFigures = [];
    const organizations = [];

    if (overview.roleplayIdentity && overview.roleplayIdentity.content) {
      const rp = overview.roleplayIdentity.content;

      if (rp['NOTABLE FIGURES']) {
        const figures = rp['NOTABLE FIGURES'];
        if (Array.isArray(figures)) {
          figures.forEach((f) => {
            if (typeof f === 'string') {
              notableFigures.push({ name: f, description: f });
            } else {
              notableFigures.push(f);
            }
          });
        }
      }

      if (rp['ORGANIZATIONS'] && Array.isArray(rp['ORGANIZATIONS'])) {
        rp['ORGANIZATIONS'].forEach((org) => organizations.push(org));
      }
    }

    entries.push({
      id,
      name: classData.name || id,
      illustration: classData.illustration || null,
      illustrationCaption: classData.illustrationCaption || '',
      originStory: overview.originStory || '',
      signatureQuote: overview.signatureQuote || null,
      philosophy: overview.philosophy || null,
      roleplayIdentity: overview.roleplayIdentity || null,
      subclasses: classData.subclasses || null,
      currentCrisis: overview.currentCrisis || '',
      meaningfulTradeoffs: overview.meaningfulTradeoffs || '',
      classSpecificLocations: overview.classSpecificLocations || [],
      notableFigures,
      organizations
    });
  });

  return entries.sort((a, b) => a.name.localeCompare(b.name));
};

const useClassLoreStore = create((set, get) => ({
  classes: [],
  loaded: false,

  loadClasses: () => {
    if (get().loaded) return;
    const classIndex = buildClassIndex();
    set({ classes: classIndex, loaded: true });
  },

  getClass: (classId) => get().classes.find((c) => c.id === classId) || null,

  getClassByName: (name) => get().classes.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null,

  getAllClasses: () => get().classes,

  getNotableFigures: () => {
    const figures = [];
    get().classes.forEach((c) => {
      (c.notableFigures || []).forEach((f) => {
        figures.push({ ...f, classId: c.id, className: c.name });
      });
    });
    return figures;
  },

  getNotableFiguresForClass: (classId) => {
    const c = get().getClass(classId);
    return c ? c.notableFigures || [] : [];
  },

  getAllOrganizations: () => {
    const orgs = [];
    get().classes.forEach((c) => {
      (c.organizations || []).forEach((org) => {
        orgs.push({ ...org, classId: c.id, className: c.name });
      });
    });
    return orgs;
  },

  getOrganizationsForClass: (classId) => {
    const c = get().getClass(classId);
    return c ? c.organizations || [] : [];
  },

  getClassesByLocation: (locationId) =>
    get().classes.filter((c) =>
      (c.classSpecificLocations || []).some((loc) => loc.locationId === locationId)
    ),

  getClassLocations: (classId) => {
    const c = get().getClass(classId);
    return c ? c.classSpecificLocations || [] : [];
  },

  getSubclassInfo: (classId, subclassKey) => {
    const c = get().getClass(classId);
    if (!c || !c.subclasses) return null;
    return c.subclasses[subclassKey] || null;
  },

  getAllSubclassInfo: (classId) => {
    const c = get().getClass(classId);
    if (!c || !c.subclasses) return {};
    const result = {};
    Object.entries(c.subclasses).forEach(([key, sub]) => {
      result[key] = {
        key,
        name: sub.name || key,
        philosophy: sub.philosophy || '',
        psychologicalProfile: sub.psychologicalProfile || '',
        roleInSociety: sub.roleInSociety || '',
        forbiddenPractices: sub.forbiddenPractices || '',
        signatureRitual: sub.signatureRitual || '',
        description: sub.description || ''
      };
    });
    return result;
  }
}));

export default useClassLoreStore;
