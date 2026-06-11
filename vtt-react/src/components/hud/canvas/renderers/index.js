import ArcanoneerSphereRenderer from './arcanoneerSphereRenderer';
import BerserkerRageRenderer from './berserkerRageRenderer';
import ShaperStanceRenderer from './shaperStanceRenderer';
import HarbingerMayhemRenderer from './chaosWeaverMayhemRenderer';
import PyrofiendInfernoRenderer from './pyrofiendInfernoRenderer';
import MinstrelMusicalRenderer from './minstrelMusicalRenderer';

const RENDERER_REGISTRY = {
  'elemental-spheres': () => new ArcanoneerSphereRenderer(),
  'rage-bar': () => new BerserkerRageRenderer(),
  'shaper-stance': () => new ShaperStanceRenderer(),
  'mayhem-bar': () => new HarbingerMayhemRenderer(),
  'inferno-bar': () => new PyrofiendInfernoRenderer(),
  'musical-staff': () => new MinstrelMusicalRenderer(),
};

export function createRenderer(visualType) {
  const factory = RENDERER_REGISTRY[visualType];
  if (!factory) return null;
  return factory();
}

export { RENDERER_REGISTRY };