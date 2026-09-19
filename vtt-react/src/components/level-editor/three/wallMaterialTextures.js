import * as THREE from 'three';

/**
 * Generated wall materials for wall types the KayKit kit has no dedicated
 * model for (brick, metal). The kit's models all sample a 1024px gradient
 * atlas with a single texel density: the straight wall (4 x 4 world units)
 * maps to UV U 0.055..0.215 / V 0.006..0.214. Patterns drawn across the whole
 * canvas at that density therefore tile seamlessly in world space, so a run,
 * its end caps and its corner pieces all show matching courses/bricks.
 */

const TEXTURE_SIZE = 1024;
const WALL_UNIT = 4;
const U_SPAN = 0.16;
const V_SPAN = 0.208;
const UV_PER_WORLD_U = U_SPAN / WALL_UNIT;
const UV_PER_WORLD_V = V_SPAN / WALL_UNIT;

const cache = new Map();

function createCanvas() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  if (!canvas || typeof canvas.getContext !== 'function') return null;
  try {
    const testCtx = canvas.getContext('2d');
    if (!testCtx) return null;
  } catch (e) {
    return null;
  }
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  return canvas;
}

// Cheap deterministic pseudo-random so a texture always regenerates the same
// way (no per-session noise flicker between HMR reloads).
function hash(x, y, seed = 1) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function shade(hex, amount) {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, 0, amount);
  return `#${color.getHexString()}`;
}

function createBrickTexture() {
  const canvas = createCanvas();
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return null;

  // Mortar backing
  ctx.fillStyle = '#8d857a';
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  // One world unit ≈ 41px in U, 53px in V. Bricks are 0.5 x 0.25 world units.
  const brickW = 0.5 * UV_PER_WORLD_U * TEXTURE_SIZE;
  const brickH = 0.25 * UV_PER_WORLD_V * TEXTURE_SIZE;
  const mortar = Math.max(1, Math.round(brickW * 0.09));

  let row = 0;
  for (let y = 0; y < TEXTURE_SIZE; y += brickH, row += 1) {
    const offset = (row % 2) * (brickW / 2);
    for (let x = -brickW; x < TEXTURE_SIZE + brickW; x += brickW) {
      const bx = x + offset;
      const tone = (hash(row, Math.floor(bx / brickW)) - 0.5) * 0.14;
      ctx.fillStyle = shade('#7d3a2e', tone);
      ctx.fillRect(bx + mortar / 2, y + mortar / 2, brickW - mortar, brickH - mortar);
      // Top-left bevel highlight
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(bx + mortar / 2, y + mortar / 2, brickW - mortar, 1);
      ctx.fillRect(bx + mortar / 2, y + mortar / 2, 1, brickH - mortar);
      // Bottom-right shadow
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(bx + mortar / 2, y + brickH - mortar / 2 - 1, brickW - mortar, 1);
      ctx.fillRect(bx + brickW - mortar / 2 - 1, y + mortar / 2, 1, brickH - mortar);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function createMetalTexture() {
  const canvas = createCanvas();
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#5b6470';
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  // Riveted plate seams every 2 world units.
  const plateU = 2 * UV_PER_WORLD_U * TEXTURE_SIZE;
  const plateV = 2 * UV_PER_WORLD_V * TEXTURE_SIZE;

  for (let y = 0; y < TEXTURE_SIZE; y += plateV) {
    for (let x = 0; x < TEXTURE_SIZE; x += plateU) {
      const tone = (hash(Math.floor(x / plateU), Math.floor(y / plateV)) - 0.5) * 0.09;
      ctx.fillStyle = shade('#626c78', tone);
      ctx.fillRect(x + 1, y + 1, plateU - 2, plateV - 2);
      // Bevel
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.fillRect(x + 1, y + 1, plateU - 2, 2);
      ctx.fillRect(x + 1, y + 1, 2, plateV - 2);
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(x + 1, y + plateV - 3, plateU - 2, 2);
      ctx.fillRect(x + plateU - 3, y + 1, 2, plateV - 2);
      // Rivets in the plate corners
      const rivet = Math.max(1.5, plateU * 0.028);
      [[x + rivet * 2.4, y + rivet * 2.4], [x + plateU - rivet * 3.4, y + rivet * 2.4],
        [x + rivet * 2.4, y + plateV - rivet * 3.4], [x + plateU - rivet * 3.4, y + plateV - rivet * 3.4]]
        .forEach(([rx, ry]) => {
          ctx.fillStyle = '#7c8894';
          ctx.beginPath();
          ctx.arc(rx, ry, rivet, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.22)';
          ctx.beginPath();
          ctx.arc(rx - rivet * 0.3, ry - rivet * 0.3, rivet * 0.45, 0, Math.PI * 2);
          ctx.fill();
        });
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function createWoodTexture() {
  const canvas = createCanvas();
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return null;

  // Dark backing shows through as plank seams.
  ctx.fillStyle = '#3d2a1a';
  ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  // Vertical timber planks ~0.35 world units wide.
  const plankW = 0.35 * UV_PER_WORLD_U * TEXTURE_SIZE;
  const seam = Math.max(1, Math.round(plankW * 0.14));
  let index = 0;
  for (let x = 0; x < TEXTURE_SIZE; x += plankW, index += 1) {
    const tone = (hash(index, 3) - 0.5) * 0.16;
    ctx.fillStyle = shade('#8a6239', tone);
    ctx.fillRect(x + seam / 2, 0, plankW - seam, TEXTURE_SIZE);
    // Wood grain streaks
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = 1;
    for (let g = 0; g < 5; g += 1) {
      const gx = x + seam / 2 + (plankW - seam) * (0.15 + 0.18 * g);
      const wobble = (hash(index, g, 7) - 0.5) * plankW * 0.2;
      ctx.beginPath();
      ctx.moveTo(gx + wobble, 0);
      ctx.bezierCurveTo(
        gx, TEXTURE_SIZE * 0.33,
        gx + wobble, TEXTURE_SIZE * 0.66,
        gx - wobble, TEXTURE_SIZE
      );
      ctx.stroke();
    }
    // Occasional knot
    if (hash(index, 11) > 0.72) {
      const kx = x + plankW / 2;
      const ky = TEXTURE_SIZE * (0.15 + hash(index, 13) * 0.7);
      const r = Math.max(2, plankW * 0.16);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(kx, ky, r, r * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Left highlight for a rounded plank feel
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(x + seam / 2, 0, 1, TEXTURE_SIZE);
  }

  // Horizontal crossbeams every 2 world units.
  const beamH = 0.3 * UV_PER_WORLD_V * TEXTURE_SIZE;
  const beamStep = 2 * UV_PER_WORLD_V * TEXTURE_SIZE;
  for (let y = 0; y < TEXTURE_SIZE; y += beamStep) {
    ctx.fillStyle = '#5b3f24';
    ctx.fillRect(0, y, TEXTURE_SIZE, beamH);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(0, y, TEXTURE_SIZE, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(0, y + beamH - 2, TEXTURE_SIZE, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

const GENERATORS = {
  brick: createBrickTexture,
  metal: createMetalTexture,
  wood: createWoodTexture
};

export function getWallMaterialTexture(kind) {
  if (!kind || !GENERATORS[kind]) return null;
  if (!cache.has(kind)) {
    const texture = GENERATORS[kind]();
    if (texture) cache.set(kind, texture);
    return texture;
  }
  return cache.get(kind);
}

/**
 * Apply a generated material family to a cloned kit material. Returns true when
 * the material was changed.
 */
export function applyWallMaterial(material, kind) {
  if (!material) return false;
  const texture = getWallMaterialTexture(kind);
  if (!texture) return false;
  const mats = Array.isArray(material) ? material : [material];
  mats.forEach((m) => {
    m.map = texture;
    m.color.setHex(0xffffff);
    m.emissive.setHex(0x000000);
    m.needsUpdate = true;
  });
  return true;
}
