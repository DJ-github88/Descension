import * as THREE from 'three';

/**
 * Material sources for the low-poly terrain kit.
 *
 * Two families of models exist in the dungeon kit:
 *  - textured plates that sample the shared `dungeon_texture.png` atlas, and
 *  - "prototype" plates (road, flagstone path, boardwalk) that ship a flat
 *    `baseColorFactor` only, which is why they used to read as one grey slab.
 *
 * The prototype plates carry UVs measured in inches: a 1 x 1 model spans UV
 * -19.685..19.685 (39.37 UV units per model cell). The authored 512px 2D tile
 * art therefore maps one texture per grid cell with this repeat — the same
 * density the walls use for their seamless 2.5D textures.
 */
export const TERRAIN_UV_PER_CELL = 39.37;

const tileTextureCache = new Map();
const textureLoader = typeof THREE.TextureLoader === 'function' ? new THREE.TextureLoader() : null;

export function getTerrainTileTexture(url, repeat = 1 / TERRAIN_UV_PER_CELL) {
  if (!url || !textureLoader) return null;
  const key = `${url}|${repeat}`;
  if (tileTextureCache.has(key)) return tileTextureCache.get(key);

  const texture = textureLoader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  tileTextureCache.set(key, texture);
  return texture;
}

// ---------------------------------------------------------------------------
// Procedural liquid surfaces
// ---------------------------------------------------------------------------

const LIQUID_TEXTURE_SIZE = 256;
const liquidTextureCache = new Map();

// Integer wave vectors keep the generated height field seamless in both axes,
// so one small texture tiles across a whole lake without visible seams.
// `facetLevels` quantises the field into flat bands so liquids render as
// low-poly faceted contours instead of a blurred sine smear.
const RIPPLE_PROFILES = {
  water: {
    waves: [[1, 0, 1], [0, 1, 0.9], [2, 1, 0.5], [1, -2, 0.4], [-3, 2, 0.25]],
    facetLevels: 0,
    smooth: true,
    normalStrength: 0.8,
    albedoBase: 240,
    albedoContrast: 10
  },
  ice: {
    waves: [[1, 0, 0.6], [0, 2, 0.5], [3, 1, 0.28]],
    facetLevels: 4,
    normalStrength: 0.8,
    albedoBase: 246,
    albedoContrast: 12
  },
  lava: {
    waves: [[1, 1, 0.8], [2, -1, 0.6], [0, 2, 0.5], [3, 2, 0.35]],
    facetLevels: 5,
    normalStrength: 1.0,
    albedoBase: 142,
    albedoContrast: 110
  },
  acid: {
    waves: [[3, 0, 0.7], [0, 3, 0.7], [2, 2, 0.5], [1, -3, 0.4]],
    facetLevels: 4,
    normalStrength: 1.0,
    albedoBase: 208,
    albedoContrast: 46
  }
};

function createCanvas(size) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  if (!canvas || typeof canvas.getContext !== 'function') return null;
  try {
    if (!canvas.getContext('2d')) return null;
  } catch (e) {
    return null;
  }
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function sampleField(waves, u, v) {
  let sum = 0;
  let weight = 0;
  for (let i = 0; i < waves.length; i += 1) {
    const [fx, fy, amp] = waves[i];
    sum += amp * Math.sin(2 * Math.PI * (fx * u + fy * v) + i * 1.7);
    weight += amp;
  }
  return weight > 0 ? sum / weight : 0;
}

/**
 * Ripple albedo + normal pair for a liquid family. The albedo stays near white
 * (it multiplies the material colour) except for lava, where the strong
 * dark/bright crust also drives the emissive map so cracks glow.
 */
export function getLiquidSurfaceTextures(profile) {
  const config = RIPPLE_PROFILES[profile];
  if (!config) return null;
  if (liquidTextureCache.has(profile)) return liquidTextureCache.get(profile);

  const size = LIQUID_TEXTURE_SIZE;
  const albedoCanvas = createCanvas(size);
  const normalCanvas = createCanvas(size);
  if (!albedoCanvas || !normalCanvas) return null;

  const albedoCtx = albedoCanvas.getContext('2d');
  const normalCtx = normalCanvas.getContext('2d');
  const albedoImage = albedoCtx.createImageData(size, size);
  const normalImage = normalCtx.createImageData(size, size);

  const step = 1 / size;
  const clamp = (value) => (value < 0 ? 0 : value > 255 ? 255 : value);

  for (let y = 0; y < size; y += 1) {
    const v = y * step;
    for (let x = 0; x < size; x += 1) {
      const u = x * step;
      const offset = (y * size + x) * 4;
      let height = sampleField(config.waves, u, v);
      if (config.facetLevels > 1) {
        const levels = config.facetLevels;
        height = Math.round((height * 0.5 + 0.5) * levels) / levels * 2 - 1;
      }

      const left = sampleField(config.waves, u - step, v);
      const right = sampleField(config.waves, u + step, v);
      const down = sampleField(config.waves, u, v - step);
      const up = sampleField(config.waves, u, v + step);
      const nx = -(right - left) * config.normalStrength;
      const ny = -(up - down) * config.normalStrength;
      const length = Math.sqrt(nx * nx + ny * ny + 1);

      const bright = clamp(Math.round(config.albedoBase + height * config.albedoContrast));
      albedoImage.data[offset] = bright;
      albedoImage.data[offset + 1] = bright;
      albedoImage.data[offset + 2] = bright;
      albedoImage.data[offset + 3] = 255;

      normalImage.data[offset] = clamp(Math.round((nx / length) * 127.5 + 127.5));
      normalImage.data[offset + 1] = clamp(Math.round((ny / length) * 127.5 + 127.5));
      normalImage.data[offset + 2] = clamp(Math.round((1 / length) * 127.5 + 127.5));
      normalImage.data[offset + 3] = 255;
    }
  }

  albedoCtx.putImageData(albedoImage, 0, 0);
  normalCtx.putImageData(normalImage, 0, 0);

  const albedo = new THREE.CanvasTexture(albedoCanvas);
  const normal = new THREE.CanvasTexture(normalCanvas);
  [albedo, normal].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    if (config.smooth) {
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
    } else {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestMipmapLinearFilter;
    }
    texture.generateMipmaps = true;
  });
  albedo.colorSpace = THREE.SRGBColorSpace;

  const pair = { albedo, normal };
  liquidTextureCache.set(profile, pair);
  return pair;
}

export function disposeTerrainMaterialTextures() {
  tileTextureCache.forEach((texture) => texture.dispose());
  tileTextureCache.clear();
  liquidTextureCache.forEach(({ albedo, normal }) => {
    albedo.dispose();
    normal.dispose();
  });
  liquidTextureCache.clear();
}
