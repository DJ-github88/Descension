import ArcanoneerSphereRenderer from './arcanoneerSphereRenderer';
import BerserkerRageRenderer from './berserkerRageRenderer';
import BladedancerStanceRenderer from './bladedancerStanceRenderer';
import ChaosWeaverMayhemRenderer from './chaosWeaverMayhemRenderer';
import ExorcistDominanceRenderer from './exorcistDominanceRenderer';
import PyrofiendInfernoRenderer from './pyrofiendInfernoRenderer';
import MinstrelMusicalRenderer from './minstrelMusicalRenderer';
import FateWeaverThreadsRenderer from './fateWeaverThreadsRenderer';

const RENDERER_REGISTRY = {
  'elemental-spheres': () => new ArcanoneerSphereRenderer(),
  'rage-bar': () => new BerserkerRageRenderer(),
  'stance-flow': () => new BladedancerStanceRenderer(),
  'mayhem-bar': () => new ChaosWeaverMayhemRenderer(),
  'dominance-chain': () => new ExorcistDominanceRenderer(),
  'inferno-bar': () => new PyrofiendInfernoRenderer(),
  'musical-staff': () => new MinstrelMusicalRenderer(),
  'threads-of-destiny': () => new FateWeaverThreadsRenderer(),
};

export function createRenderer(visualType) {
  const factory = RENDERER_REGISTRY[visualType];
  if (!factory) return null;
  return factory();
}

export { RENDERER_REGISTRY };