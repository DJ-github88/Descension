import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import * as CANNON from 'cannon-es';
import useDiceStore, { DICE_PRESETS, DICE_MATERIALS } from '../../store/diceStore';
import useSettingsStore from '../../store/settingsStore';
import { useAdaptivePerformance } from '../../hooks/useAdaptivePerformance';
import './PhysicsDiceScene.css';

const FONT = "'Cinzel', 'Times New Roman', serif";
// HMR probe: trivial comment to trigger a hot update.

// Build a procedural body surface — a subtle noise normal map and a matching
// roughness map — that gives the dice a matte, slightly weathered stone feel
// rather than smooth plastic. Used for the dice BODY (not the number plates).
// Build a procedural body surface — a 2-octave FBM noise normal map + a
// matching roughness map — that gives the dice a matte, weathered-stone feel
// without producing blocky patterns. The previous version used a 24x24 grid
// with 2x tiling, which produced visible ~10px squares on small dice faces.
// This version samples a broad (48x48) octave plus a fine (256x256) octave
// through a smoothstep interpolator, with NO repeat (ClampToEdge wrapping) so
// each face shows the full continuous noise field once.
function createBodySurfaceTextures(seed = 1) {
  const size = 512;
  const GRID_BROAD = 48;   // broad stone features (~10px per cell)
  const GRID_FINE = 256;   // fine grain (~2px per cell)

  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const gridBroad = new Float32Array(GRID_BROAD * GRID_BROAD);
  const gridFine = new Float32Array(GRID_FINE * GRID_FINE);
  for (let i = 0; i < gridBroad.length; i++) gridBroad[i] = rand();
  for (let i = 0; i < gridFine.length; i++) gridFine[i] = rand();

  // Smoothstep (Hermite, C1-continuous) so the bilinear interpolation of
  // the noise grid has no visible seams between cells.
  const smooth = (t) => t * t * (3 - 2 * t);

  const sampleGrid = (grid, GRID, u, v) => {
    const fx = u * GRID;
    const fy = v * GRID;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const x1 = (x0 + 1) % GRID;
    const y1 = (y0 + 1) % GRID;
    const tx = smooth(fx - x0);
    const ty = smooth(fy - y0);
    const a = grid[y0 * GRID + x0];
    const b = grid[y0 * GRID + x1];
    const c = grid[y1 * GRID + x0];
    const d = grid[y1 * GRID + x1];
    const ab = a + (b - a) * tx;
    const cd = c + (d - c) * tx;
    return ab + (cd - ab) * ty;
  };

  // 2-octave FBM: broad features drive shape, fine grain drives texture.
  const fbm = (u, v) =>
    0.58 * sampleGrid(gridBroad, GRID_BROAD, u, v) +
    0.42 * sampleGrid(gridFine, GRID_FINE, u, v);

  const nCanvas = document.createElement('canvas');
  nCanvas.width = nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d');
  const nImg = nCtx.createImageData(size, size);

  const rCanvas = document.createElement('canvas');
  rCanvas.width = rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d');
  const rImg = rCtx.createImageData(size, size);

  // Tuned subtle: visible up close, not garish. Lower than the previous build.
  const NORMAL_STRENGTH = 0.38;
  const ROUGH_BASE = 0.80;
  const ROUGH_VAR = 0.10;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      // Central-difference gradient on the FBM field for the normal map.
      const e = 1 / size;
      const hL = fbm(((u - e) + 1) % 1, v);
      const hR = fbm((u + e) % 1, v);
      const hD = fbm(u, ((v - e) + 1) % 1);
      const hU = fbm(u, (v + e) % 1);
      let nx = (hL - hR) * NORMAL_STRENGTH;
      let ny = (hD - hU) * NORMAL_STRENGTH;
      let nz = 1.0;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;
      const i = (y * size + x) * 4;
      nImg.data[i]     = Math.round((nx * 0.5 + 0.5) * 255);
      nImg.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      nImg.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      nImg.data[i + 3] = 255;

      const h = fbm(u, v);
      const r = Math.min(1, Math.max(0, ROUGH_BASE + (h - 0.5) * ROUGH_VAR * 2));
      const g = Math.round(r * 255);
      rImg.data[i] = g;
      rImg.data[i + 1] = g;
      rImg.data[i + 2] = g;
      rImg.data[i + 3] = 255;
    }
  }
  nCtx.putImageData(nImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const normalMap = new THREE.CanvasTexture(nCanvas);
  normalMap.colorSpace = THREE.NoColorSpace; // normal maps are linear data
  normalMap.wrapS = normalMap.wrapT = THREE.ClampToEdgeWrapping;
  normalMap.anisotropy = 4;

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.anisotropy = 4;

  return { normalMap, roughnessMap };
}

// A subtle per-die color variation so a set of dice doesn't look stamped from
// the same mold. Returns a new THREE.Color derived from `base`.
function varyDieColor(base) {
  const c = base.clone();
  // HSL nudge — keep the hue, nudge lightness/saturation ±2%.
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  hsl.l = Math.max(0, Math.min(1, hsl.l + (Math.random() - 0.5) * 0.05));
  hsl.s = Math.max(0, Math.min(1, hsl.s + (Math.random() - 0.5) * 0.04));
  c.setHSL(hsl.h, hsl.s, hsl.l);
  return c;
}

// ============================================================================
// Procedural themed body paints.
// Each theme gets a hand-painted 512px albedo + emissive pair baked once per
// theme (cached, shared by every die in the roll). These make the die BODY
// itself read as the material — ice with crystalline veins, cracked basalt
// with magma glowing through, a nebula with stars, lichtenberg-scarred
// stormstone, mossy heartwood — instead of a flat colored stone.
// ============================================================================

const themeBodyTextureCache = new Map();

function getThemeBodyTextures(themeId) {
  let t = themeBodyTextureCache.get(themeId);
  if (!t) {
    t = createThemeBodyTextures(themeId);
    themeBodyTextureCache.set(themeId, t);
  }
  return t;
}

function disposeThemeBodyTextureCache() {
  themeBodyTextureCache.forEach((t) => {
    t.map?.dispose();
    t.emissiveMap?.dispose();
  });
  themeBodyTextureCache.clear();
}

// Procedural SURFACE textures for weight materials (wood grain, granite).
// The THEME stays the die's identity (ice, obsidian, ember...) — these
// surfaces composite ON TOP of the theme paint (multiply blend) so a
// frost+wood die still reads as an ICE die with visible timber grain.
// Painted pale so material.color tinting can season them. Cached singletons,
// shared by every die of that material.
const materialSurfaceCache = {};

function getWoodSurface() {
  if (materialSurfaceCache.wood) return materialSurfaceCache.wood;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Base — pale seasoned timber, brightest at one corner (banding comes later).
  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#f0e4cc');
  base.addColorStop(0.5, '#e3d3b3');
  base.addColorStop(1, '#d3bf97');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Long wavy grain streaks — the dominant feature. Bold beats dense at die
  // scale, so 16 strong boards with varying darkness and width.
  for (let g = 0; g < 16; g++) {
    const y0 = (g / 16) * size + (Math.random() - 0.5) * 16;
    const dark = 60 + Math.random() * 40 | 0;
    ctx.strokeStyle = `rgba(${dark + 30},${dark - 8},${dark - 30},${0.32 + Math.random() * 0.26})`;
    ctx.lineWidth = 2.5 + Math.random() * 3.5;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 10) {
      const y = y0 + Math.sin((x / size) * Math.PI * (2 + g % 3) + g * 1.9) * (7 + (g % 4) * 3);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Fine secondary streaks between the boards — tight grain detail.
  for (let g = 0; g < 26; g++) {
    const y0 = Math.random() * size;
    ctx.strokeStyle = `rgba(120,88,48,${0.10 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.8 + Math.random() * 0.8;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 14) {
      const y = y0 + Math.sin((x / size) * Math.PI * 3 + g * 1.4) * 6;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Light streaks between dark grain — gives the bands depth/shine.
  for (let g = 0; g < 8; g++) {
    const y0 = Math.random() * size;
    ctx.strokeStyle = `rgba(255,246,224,${0.18 + Math.random() * 0.14})`;
    ctx.lineWidth = 3 + Math.random() * 4;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 12) {
      const y = y0 + Math.sin((x / size) * Math.PI * 2 + g) * 8;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Knots — 2 knot cores with concentric growth rings around each.
  for (let k = 0; k < 2; k++) {
    const kx = 90 + Math.random() * (size - 180);
    const ky = 90 + Math.random() * (size - 180);
    const rot = Math.random() * Math.PI;
    // Dark core
    const core = ctx.createRadialGradient(kx, ky, 0, kx, ky, 12);
    core.addColorStop(0, 'rgba(52,32,14,0.95)');
    core.addColorStop(1, 'rgba(52,32,14,0)');
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(rot);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Concentric rings, eccentric to mimic real growth around the knot.
    for (let r = 10; r < 78; r += 6 + Math.random() * 3) {
      ctx.strokeStyle = `rgba(${74 + Math.random() * 26 | 0},${50 + Math.random() * 18 | 0},22,${Math.max(0.08, 0.42 - r / 200)})`;
      ctx.lineWidth = 2 + Math.random() * 1.5;
      ctx.save();
      ctx.translate(kx, ky);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.35, r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  materialSurfaceCache.wood = { tex, canvas };
  return materialSurfaceCache.wood;
}

function getStoneSurface() {
  if (materialSurfaceCache.stone) return materialSurfaceCache.stone;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Base — pale mineral granite.
  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#ece9e2');
  base.addColorStop(0.5, '#dcd7cc');
  base.addColorStop(1, '#c9c3b6');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Mineral speckle — three fleets of grains at die-readable sizes:
  // dark biotite, bright quartz, mid feldspar.
  const fleck = (count, colorFn, rMin, rMax) => {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const r = rMin + Math.random() * (rMax - rMin);
      ctx.fillStyle = colorFn();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  fleck(520, () => `rgba(46,40,34,${0.25 + Math.random() * 0.3})`, 0.6, 1.6);   // biotite
  fleck(420, () => `rgba(255,255,250,${0.3 + Math.random() * 0.3})`, 0.7, 1.9); // quartz
  fleck(300, () => `rgba(158,148,132,${0.22 + Math.random() * 0.2})`, 1.0, 2.6); // feldspar
  // Sparse larger mineral pools for coarse-grain granite feel.
  fleck(48, () => `rgba(120,110,96,${0.16 + Math.random() * 0.14})`, 2.6, 4.5);

  // A few hairline crystalline veins.
  const veinPaths = generateCrackPaths(size, 4, { straightness: 0.8, steps: 18, branchChance: 0.15, maxDepth: 1 });
  strokePaths(ctx, veinPaths, 1.1, (c) => { c.strokeStyle = 'rgba(92,86,76,0.30)'; c.stroke(); }, size);
  strokePaths(ctx, veinPaths, 0.45, (c) => { c.strokeStyle = 'rgba(250,248,242,0.35)'; c.stroke(); }, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  materialSurfaceCache.stone = { tex, canvas };
  return materialSurfaceCache.stone;
}

function getMaterialSurface(materialId) {
  if (materialId === 'wood') return getWoodSurface();
  if (materialId === 'stone') return getStoneSurface();
  return null; // steel reads via reflections, glass via translucency
}

function disposeMaterialSurfaces() {
  Object.values(materialSurfaceCache).forEach((s) => s.tex.dispose());
  Object.keys(materialSurfaceCache).forEach((k) => delete materialSurfaceCache[k]);
}

// Theme albedo × material surface composites — "frost dice with wood grain",
// "obsidian with granite speckle". Multiply-blend at ~0.6 keeps the theme's
// features (ice veins, ember seams) dominant while the grain clearly shows.
const compositeBodyTextureCache = new Map();

function getCompositedBodyTexture(themeId, materialId) {
  const surf = getMaterialSurface(materialId);
  if (!surf) return null;
  const themeEntry = themeId ? getThemeBodyTextures(themeId) : null;
  // No painted theme (e.g. classic obsidian) — the surface IS the albedo.
  if (!themeEntry || !themeEntry.map) return surf.tex;

  const key = `${themeId}|${materialId}`;
  let tex = compositeBodyTextureCache.get(key);
  if (tex) return tex;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(themeEntry.albedoCanvas, 0, 0);
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.62;
  ctx.drawImage(surf.canvas, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  compositeBodyTextureCache.set(key, tex);
  return tex;
}

function disposeCompositeBodyTextureCache() {
  compositeBodyTextureCache.forEach((t) => t.dispose());
  compositeBodyTextureCache.clear();
}

// Random-walk crack/vein painter with recursive branches. Returns the list of
// polylines so the albedo and emissive passes can stroke the SAME geometry.
function generateCrackPaths(size, count, opts = {}) {
  const {
    straightness = 0.55,   // 0 = pure jitter, 1 = straight shards
    steps = 24,
    branchChance = 0.16,
    maxDepth = 2,
  } = opts;
  const paths = [];
  const rand = Math.random;

  const walk = (x, y, angle, depth) => {
    const pts = [{ x, y }];
    const n = steps + Math.floor(rand() * steps * 0.6);
    for (let i = 0; i < n; i++) {
      const jitter = (rand() - 0.5) * (1 - straightness) * 2.4;
      angle += jitter;
      const len = size * (0.012 + rand() * 0.02);
      x += Math.cos(angle) * len;
      y += Math.sin(angle) * len;
      // wrap around the seam so edges continue on the opposite side
      if (x < 0) x += size; if (x > size) x -= size;
      if (y < 0) y += size; if (y > size) y -= size;
      pts.push({ x, y });
      if (depth < maxDepth && rand() < branchChance / (depth + 1)) {
        walk(x, y, angle + (rand() > 0.5 ? 1 : -1) * (0.5 + rand() * 0.9), depth + 1);
      }
    }
    paths.push(pts);
  };

  for (let c = 0; c < count; c++) {
    walk(rand() * size, rand() * size, rand() * Math.PI * 2, 0);
  }
  return paths;
}

function strokePaths(ctx, paths, width, strokeFn, size) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  paths.forEach((pts) => {
    ctx.lineWidth = width * (0.7 + Math.random() * 0.6);
    ctx.beginPath();
    // Split polylines at wrap seams so we never draw across the canvas.
    let prev = null;
    let started = false;
    for (const p of pts) {
      if (prev && (Math.abs(p.x - prev.x) > size * 0.5 || Math.abs(p.y - prev.y) > size * 0.5)) {
        strokeFn(ctx);
        ctx.beginPath();
        started = false;
      }
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
      prev = p;
    }
    if (started) strokeFn(ctx);
  });
}

function createThemeBodyTextures(themeId) {
  const size = 512;
    const albedo = document.createElement('canvas');
  albedo.width = albedo.height = size;
  const aCtx = albedo.getContext('2d');
  const emissive = document.createElement('canvas');
  emissive.width = emissive.height = size;
  const eCtx = emissive.getContext('2d');

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  const paintNebulaBlob = (ctx, cx, cy, r, color, alpha) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color.replace('ALPHA', alpha));
    g.addColorStop(1, color.replace('ALPHA', '0'));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  if (themeId === 'frozen') {
    // Base: pale glacial ice with depth falloff.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#bfe0f7');
    base.addColorStop(0.5, '#8fc2e8');
    base.addColorStop(1, '#6ea8d6');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Deep ice interior patches.
    for (let i = 0; i < 6; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 90 + Math.random() * 120, 'rgba(58,118,178,ALPHA)', 0.25);
    }
    // Crystalline veins: straight-ish shard fractures.
    const paths = generateCrackPaths(size, 9, { straightness: 0.85, steps: 16, branchChance: 0.35, maxDepth: 2 });
    strokePaths(aCtx, paths, 2.2, (c) => { c.strokeStyle = 'rgba(240,250,255,0.9)'; c.stroke(); }, size);
    strokePaths(eCtx, paths, 1.6, (c) => { c.strokeStyle = 'rgba(130,190,255,0.55)'; c.stroke(); }, size);
    // Faint sparkle flecks.
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      aCtx.fillStyle = 'rgba(255,255,255,0.5)';
      aCtx.fillRect(x, y, 1.5, 1.5);
      if (Math.random() < 0.3) {
        eCtx.fillStyle = 'rgba(180,220,255,0.5)';
        eCtx.fillRect(x, y, 1.5, 1.5);
      }
    }
  } else if (themeId === 'fiery') {
    // Clean "obsidian with lava seams". Prior versions were muddy brown and
    // messy (wide smeared fissures, glow pools, dense embers). Recipe now:
    // deep red-black charcoal base (red hue, NOT brown), exactly five crisp
    // thin fissures that glow, nothing else. At die scale, LESS reads BETTER.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#26070a');
    base.addColorStop(0.55, '#180409');
    base.addColorStop(1, '#0d0206');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Faint red depth so the charcoal isn't flat dead black.
    for (let i = 0; i < 5; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 70 + Math.random() * 90, 'rgba(110,18,14,ALPHA)', 0.16);
    }
    // Five crisp fissures: narrow char rim, molten seam, white-hot hairline.
    const paths = generateCrackPaths(size, 5, { straightness: 0.62, steps: 22, branchChance: 0.22, maxDepth: 2 });
    strokePaths(aCtx, paths, 3.0, (c) => { c.strokeStyle = 'rgba(6,0,2,0.9)'; c.stroke(); }, size);
    strokePaths(aCtx, paths, 1.5, (c) => { c.strokeStyle = 'rgba(255,96,24,0.9)'; c.stroke(); }, size);
    strokePaths(aCtx, paths, 0.65, (c) => { c.strokeStyle = 'rgba(255,218,130,0.9)'; c.stroke(); }, size);
    // Emissive carries the glow — thin seams only, no blur smears, no pools.
    strokePaths(eCtx, paths, 1.3, (c) => { c.strokeStyle = 'rgba(255,88,20,0.9)'; c.stroke(); }, size);
    strokePaths(eCtx, paths, 0.5, (c) => { c.strokeStyle = 'rgba(255,224,150,0.95)'; c.stroke(); }, size);
    // A whisper of embers — sparse and tiny.
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      eCtx.fillStyle = 'rgba(255,140,50,0.8)';
      eCtx.beginPath(); eCtx.arc(x, y, 0.8 + Math.random() * 0.5, 0, Math.PI * 2); eCtx.fill();
    }
  } else if (themeId === 'storm') {
    // Charged stormglass, take three. Prior version: pale flat slate base +
    // white strokes on the ALBEDO read as chalk scratches, and the surge
    // flicker pulsed weirdly. Recipe now: deeper storm-slate gradient with
    // cloud-depth mottling; the lightning lives in the EMISSIVE as electric
    // cyan-white arcs (glow, not paint); the albedo only carries a faint dark
    // scorch under each arc so seams are visible even at low emissive.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#3d4d75');
    base.addColorStop(0.55, '#232e4e');
    base.addColorStop(1, '#101830');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Cloud depth — darker cells plus one or two faint lightning-lit wisps.
    for (let i = 0; i < 6; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 70 + Math.random() * 110, 'rgba(14,22,46,ALPHA)', 0.35);
    }
    for (let i = 0; i < 3; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 40 + Math.random() * 70, 'rgba(96,118,168,ALPHA)', 0.12);
    }
    // ONE lightning web. Albedo: faint scorch + whisper of cyan (no white).
    const paths = generateCrackPaths(size, 7, { straightness: 0.7, steps: 20, branchChance: 0.35, maxDepth: 2 });
    strokePaths(aCtx, paths, 2.0, (c) => { c.strokeStyle = 'rgba(8,14,32,0.5)'; c.stroke(); }, size);
    strokePaths(aCtx, paths, 0.8, (c) => { c.strokeStyle = 'rgba(110,170,255,0.35)'; c.stroke(); }, size);
    // Emissive: the actual arcs — cyan body, white-hot core, tight glow.
    eCtx.shadowColor = 'rgba(110,190,255,0.85)';
    eCtx.shadowBlur = 5;
    strokePaths(eCtx, paths, 1.4, (c) => { c.strokeStyle = 'rgba(120,200,255,0.95)'; c.stroke(); }, size);
    eCtx.shadowBlur = 0;
    strokePaths(eCtx, paths, 0.55, (c) => { c.strokeStyle = 'rgba(238,249,255,0.98)'; c.stroke(); }, size);
    // Sparse charged glints; two or three get a cross-flare.
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      eCtx.fillStyle = 'rgba(235,244,255,0.9)';
      eCtx.fillRect(x, y, 1.5, 1.5);
      if (Math.random() < 0.3) {
        eCtx.fillStyle = 'rgba(170,210,255,0.5)';
        eCtx.fillRect(x - 3, y, 7, 0.8);
        eCtx.fillRect(x, y - 3, 0.8, 7);
      }
    }
  } else if (themeId === 'dark') {
    // Base: deep void purple-black.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#1e1038');
    base.addColorStop(0.5, '#130926');
    base.addColorStop(1, '#0a0418');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Nebula clouds — broad violet depth plus brighter inner wisps.
    for (let i = 0; i < 9; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 80 + Math.random() * 140, 'rgba(88,42,150,ALPHA)', 0.3);
    }
    for (let i = 0; i < 6; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 30 + Math.random() * 80, 'rgba(150,84,220,ALPHA)', 0.18);
    }
    // Faint nebula glow on the emissive layer so the clouds breathe.
    for (let i = 0; i < 4; i++) {
      paintNebulaBlob(eCtx, Math.random() * size, Math.random() * size, 60 + Math.random() * 90, 'rgba(90,40,160,ALPHA)', 0.14);
    }
    // Layered star field: pinpricks, glowing mediums, cross glints.
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const roll = Math.random();
      if (roll < 0.55) {
        eCtx.fillStyle = 'rgba(235,228,255,0.85)';
        eCtx.beginPath(); eCtx.arc(x, y, 0.9, 0, Math.PI * 2); eCtx.fill();
      } else if (roll < 0.85) {
        const g = eCtx.createRadialGradient(x, y, 0, x, y, 3.5);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(0.4, Math.random() < 0.4 ? 'rgba(190,160,255,0.8)' : 'rgba(230,235,255,0.8)');
        g.addColorStop(1, 'rgba(150,120,230,0)');
        eCtx.fillStyle = g;
        eCtx.beginPath(); eCtx.arc(x, y, 3.5, 0, Math.PI * 2); eCtx.fill();
      } else {
        eCtx.fillStyle = 'rgba(245,240,255,0.95)';
        eCtx.fillRect(x - 0.7, y - 4, 1.4, 8);
        eCtx.fillRect(x - 4, y - 0.7, 8, 1.4);
      }
      aCtx.fillStyle = 'rgba(225,215,255,0.4)';
      aCtx.beginPath(); aCtx.arc(x, y, 0.9, 0, Math.PI * 2); aCtx.fill();
    }
    // Elegant sigil — double ring with tick marks.
    aCtx.strokeStyle = 'rgba(150,90,220,0.35)';
    aCtx.lineWidth = 2;
    aCtx.beginPath(); aCtx.arc(size / 2, size / 2, 150, 0, Math.PI * 2); aCtx.stroke();
    aCtx.strokeStyle = 'rgba(150,90,220,0.22)';
    aCtx.beginPath(); aCtx.arc(size / 2, size / 2, 138, 0, Math.PI * 2); aCtx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      aCtx.beginPath();
      aCtx.moveTo(size / 2 + Math.cos(a) * 142, size / 2 + Math.sin(a) * 142);
      aCtx.lineTo(size / 2 + Math.cos(a) * 150, size / 2 + Math.sin(a) * 150);
      aCtx.stroke();
    }
  } else if (themeId === 'nature') {
    // Base: dark heartwood.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#332714');
    base.addColorStop(0.5, '#221b0e');
    base.addColorStop(1, '#151007');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Wood grain — coarse primary arcs plus fine secondary grain.
    aCtx.lineWidth = 1.8;
    for (let g = 0; g < 22; g++) {
      const y0 = (g / 22) * size + (Math.random() - 0.5) * 14;
      aCtx.strokeStyle = `rgba(${125 + Math.random() * 40 | 0},${98 + Math.random() * 30 | 0},58,${0.25 + Math.random() * 0.18})`;
      aCtx.beginPath();
      for (let x = 0; x <= size; x += 14) {
        const y = y0 + Math.sin((x / size) * Math.PI * (2 + g % 3) + g) * 11;
        if (x === 0) aCtx.moveTo(x, y); else aCtx.lineTo(x, y);
      }
      aCtx.stroke();
    }
    aCtx.lineWidth = 0.8;
    for (let g = 0; g < 30; g++) {
      const y0 = Math.random() * size;
      aCtx.strokeStyle = `rgba(90,70,40,${0.12 + Math.random() * 0.12})`;
      aCtx.beginPath();
      for (let x = 0; x <= size; x += 18) {
        const y = y0 + Math.sin((x / size) * Math.PI * 3 + g * 1.7) * 7;
        if (x === 0) aCtx.moveTo(x, y); else aCtx.lineTo(x, y);
      }
      aCtx.stroke();
    }
    // Knots — concentric elliptical rings.
    for (let k = 0; k < 2; k++) {
      const kx = 80 + Math.random() * (size - 160), ky = 80 + Math.random() * (size - 160);
      for (let r = 4; r < 34; r += 4.5) {
        aCtx.strokeStyle = `rgba(${70 + Math.random() * 30 | 0},52,30,${Math.max(0, 0.5 - r / 90)})`;
        aCtx.lineWidth = 2;
        aCtx.beginPath();
        aCtx.ellipse(kx, ky, r * 1.5, r, 0.3, 0, Math.PI * 2);
        aCtx.stroke();
      }
    }
    // Moss — two-tone layered patches (dark base, bright tips).
    for (let i = 0; i < 10; i++) {
      const mx = Math.random() * size, my = Math.random() * size;
      paintNebulaBlob(aCtx, mx, my, 30 + Math.random() * 70, 'rgba(52,92,40,ALPHA)', 0.38);
      paintNebulaBlob(aCtx, mx + (Math.random() - 0.5) * 20, my + (Math.random() - 0.5) * 20, 14 + Math.random() * 34, 'rgba(96,150,64,ALPHA)', 0.3);
    }
    // A vein of raw green sap — dark edge, bright core, glowing halo.
    const sapPath = generateCrackPaths(size, 3, { straightness: 0.7, steps: 18, branchChance: 0.2, maxDepth: 1 });
    strokePaths(aCtx, sapPath, 2.2, (c) => { c.strokeStyle = 'rgba(110,190,85,0.6)'; c.stroke(); }, size);
    strokePaths(aCtx, sapPath, 0.9, (c) => { c.strokeStyle = 'rgba(170,240,130,0.7)'; c.stroke(); }, size);
    eCtx.shadowColor = 'rgba(120,255,110,0.8)';
    eCtx.shadowBlur = 5;
    strokePaths(eCtx, sapPath, 1.2, (c) => { c.strokeStyle = 'rgba(140,255,110,0.55)'; c.stroke(); }, size);
    eCtx.shadowBlur = 0;
    // Firefly spores — soft glow halo with a bright core.
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const g = eCtx.createRadialGradient(x, y, 0, x, y, 4);
      g.addColorStop(0, 'rgba(210,255,180,0.9)');
      g.addColorStop(0.35, 'rgba(150,240,130,0.7)');
      g.addColorStop(1, 'rgba(120,220,110,0)');
      eCtx.fillStyle = g;
      eCtx.beginPath(); eCtx.arc(x, y, 4, 0, Math.PI * 2); eCtx.fill();
    }
  } else {
    return { map: null, emissiveMap: null, albedoCanvas: null };
  }

  const map = new THREE.CanvasTexture(albedo);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const emissiveMap = new THREE.CanvasTexture(emissive);
  emissiveMap.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.anisotropy = 4;
  return { map, emissiveMap, albedoCanvas: albedo };
}

/**
 * Draws a premium engraved-metallic number onto a face canvas.
 * Layered passes: deep shadow core -> metallic vertical gradient ->
 * dark outline -> crisp top highlight (embossed bevel look).
 */
function drawPremiumNumber(ctx, text, x, y, fontPx, numberColor, rotation = 0) {
  const base = new THREE.Color(numberColor || '#dbb85c');
  const lighter = base.clone().lerp(new THREE.Color('#ffffff'), 0.55);
  const darker = base.clone().lerp(new THREE.Color('#000000'), 0.45);

  ctx.save();
  ctx.translate(x, y);
  if (rotation) ctx.rotate(rotation);
  ctx.font = `bold ${fontPx}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Deep engraved shadow core
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = fontPx * 0.12;
  ctx.shadowOffsetY = fontPx * 0.05;
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillText(text, 0, 0);

  // Metallic gradient body
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  const grad = ctx.createLinearGradient(0, -fontPx * 0.55, 0, fontPx * 0.55);
  grad.addColorStop(0, `#${lighter.getHexString()}`);
  grad.addColorStop(0.45, `#${base.getHexString()}`);
  grad.addColorStop(1, `#${darker.getHexString()}`);
  ctx.fillStyle = grad;
  ctx.fillText(text, 0, 0);

  // Dark separation outline
  ctx.lineWidth = Math.max(1.5, fontPx * 0.02);
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.strokeText(text, 0, 0);

  // Crisp top highlight (embossed bevel)
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(text, 0, -fontPx * 0.045);

  ctx.restore();
}

// Face-number texture cache. Dice of the same type share identical face
// canvases — without this, a 6d6 pool bakes 36 identical 512px textures on
// the main thread at throw time (a visible multi-100ms stall, i.e. "laggy").
const numberTextureCache = new Map();
// Surface-noise texture pool. Baking a 512px FBM pair per die stalls the
// main thread ~50ms+ EACH at throw time. A small pool baked lazily (plus a
// random rotation per die) keeps variety without per-die cost.
const surfaceTexturePool = [];
function getSurfaceTextureFromPool() {
  if (surfaceTexturePool.length < 4) {
    surfaceTexturePool.push(createBodySurfaceTextures(Math.floor(Math.random() * 0x7fffffff)));
  }
  const t = surfaceTexturePool[Math.floor(Math.random() * surfaceTexturePool.length)];
  return {
    normalMap: t.normalMap,
    roughnessMap: t.roughnessMap,
    owned: false, // pooled — do not dispose per die
  };
}

function disposeSurfaceTexturePool() {
  surfaceTexturePool.forEach((t) => {
    t.normalMap?.dispose();
    t.roughnessMap?.dispose();
  });
  surfaceTexturePool.length = 0;
}

function createNumberTextureWithColor(num, type, numberColor) {
  const key = `${type}|${num}|${numberColor || 'default'}`;
  const cached = numberTextureCache.get(key);
  if (cached) return cached;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  let displayNum = num.toString();
  if (type === 'd10' && num === 10) displayNum = '0';
  if (type === 'dpercent') displayNum = (num * 10).toString().padStart(2, '0');

  const cx = size / 2;
  const cy = size / 2;

  // Soft dark medallion behind the number for readability on reflective faces
  const medallion = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.46);
  medallion.addColorStop(0, 'rgba(0,0,0,0.38)');
  medallion.addColorStop(0.7, 'rgba(0,0,0,0.16)');
  medallion.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = medallion;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.fill();

  const fontPx = displayNum.length > 2 ? size * 0.34 : displayNum.length > 1 ? size * 0.42 : size * 0.5;
  drawPremiumNumber(ctx, displayNum, cx, cy, fontPx, numberColor);

  // Disambiguation bar for 6 / 9
  if (displayNum === '6' || displayNum === '9') {
    const w = fontPx * 0.6;
    const h = Math.max(6, fontPx * 0.06);
    const uy = cy + fontPx * 0.58;
    const barColor = new THREE.Color(numberColor || '#dbb85c');
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = `#${barColor.getHexString()}`;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, uy, w, h, h / 2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  numberTextureCache.set(key, tex);
  return tex;
}

function disposeNumberTextureCache() {
  numberTextureCache.forEach((t) => t.dispose());
  numberTextureCache.clear();
}

function createD4FaceTexture(nTop, nRight, nLeft, numberColor) {
  const d4Key = `d4|${nTop}-${nRight}-${nLeft}|${numberColor || 'default'}`;
  const d4Cached = numberTextureCache.get(d4Key);
  if (d4Cached) return d4Cached;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const R = 100;
  const cx = 256, cy = 256;
  const fontPx = 88;

  drawPremiumNumber(ctx, nTop, cx, cy - R, fontPx, numberColor);
  drawPremiumNumber(ctx, nRight, cx + R * Math.cos(Math.PI / 6), cy + R * Math.sin(Math.PI / 6), fontPx, numberColor, 120 * Math.PI / 180);
  drawPremiumNumber(ctx, nLeft, cx - R * Math.cos(Math.PI / 6), cy + R * Math.sin(Math.PI / 6), fontPx, numberColor, -120 * Math.PI / 180);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  numberTextureCache.set(d4Key, tex);
  return tex;
}

function generateD10Geometry() {
  const geom = new THREE.BufferGeometry();
  const H = 1.15, R = 1.05;
  const cos36 = Math.cos(Math.PI / 5);
  const h = H * (1 - cos36) / (1 + cos36);
  const pos = [];

  const topPole = new THREE.Vector3(0, H, 0);
  const botPole = new THREE.Vector3(0, -H, 0);
  const V = [];

  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI / 5;
    V.push(new THREE.Vector3(Math.cos(a) * R, (i % 2 === 0) ? h : -h, Math.sin(a) * R));
  }

  const addFace = (v1, v2, v3) => {
    pos.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z);
  };

  for (let i = 0; i < 10; i += 2) {
    addFace(topPole, V[(i + 1) % 10], V[i]);
    addFace(topPole, V[(i + 2) % 10], V[(i + 1) % 10]);
  }
  for (let i = 1; i < 10; i += 2) {
    addFace(botPole, V[i], V[(i + 1) % 10]);
    addFace(botPole, V[(i + 1) % 10], V[(i + 2) % 10]);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return geom;
}

function generateBaseGeometry(type) {
  if (type === 'd4') return new THREE.TetrahedronGeometry(1.6);
  if (type === 'd6') return new RoundedBoxGeometry(1.5, 1.5, 1.5, 3, 0.16);
  if (type === 'd8') return new THREE.OctahedronGeometry(1.3);
  if (type === 'd12') return new THREE.DodecahedronGeometry(1.1);
  if (type === 'd20') return new THREE.IcosahedronGeometry(1.2);
  if (type === 'd10' || type === 'dpercent') return generateD10Geometry();
}

// Per-preset body material overrides. The generic stone-PBR body is the
// default; themed presets get clearcoat/transparency/emissive boosts so a
// "Glacial Frost" die genuinely reads as carved ice and "Infernal Flame" as
// molten rock, instead of a dark stone with particles sprinkled on top.
const THEME_MATERIAL_OVERRIDES = {
  frozen: {
    clearcoat: 1.0, clearcoatRoughness: 0.1,
    transparent: true, opacity: 0.95,
    envMapIntensity: 1.0,
    emissiveIntensityMul: 1.2,
    plateEmissiveIntensity: 0.6,
    bodyFlicker: 'frost',
  },
  fiery: {
    clearcoat: 0.7, clearcoatRoughness: 0.25,
    envMapIntensity: 0.55,
    emissiveIntensityMul: 1.0,
    plateEmissiveIntensity: 0.65,
    bodyFlicker: 'fire',
  },
  storm: {
    clearcoat: 0.9, clearcoatRoughness: 0.15,
    envMapIntensity: 0.8,
    emissiveIntensityMul: 1.35,
    plateEmissiveIntensity: 0.55,
    bodyFlicker: 'storm',
  },
  dark: {
    clearcoat: 0.8, clearcoatRoughness: 0.2,
    envMapIntensity: 0.7,
    emissiveIntensityMul: 1.15,
    plateEmissiveIntensity: 0.5,
  },
  nature: {
    clearcoat: 0.5, clearcoatRoughness: 0.4,
    envMapIntensity: 0.6,
    emissiveIntensityMul: 1.1,
    plateEmissiveIntensity: 0.5,
  },
};

// Animated emissive on the die body — SLOW and subtle. Earlier versions
// pulsed at 8-13Hz which read as strobing "weird colorization" on screen;
// these low-frequency breathing rates keep the material alive without
// flicker artifacts.
function updateBodyFlicker(mesh, time) {
  const base = mesh.userData.baseEmissiveIntensity;
  const mode = mesh.userData.bodyFlicker;
  if (mode === 'fire') {
    mesh.material.emissiveIntensity = base * (0.92 + 0.08 * Math.sin(time * 1.7 + 1.3) + 0.04 * Math.sin(time * 2.9));
  } else if (mode === 'frost') {
    mesh.material.emissiveIntensity = base * (0.9 + 0.1 * Math.sin(time * 1.8));
  } else if (mode === 'storm') {
    mesh.material.emissiveIntensity = base * (0.95 + 0.05 * Math.sin(time * 1.6) + 0.03 * Math.sin(time * 2.7 + 1.3));
  }
}

function buildDiceObject(type, colorHex, preset, renderer, scene) {
  const group = new THREE.Group();
  const edgeColor = preset ? preset.edgeColor : '#c9a84c';
  const numberColor = preset ? preset.numberColor : '#c9a84c';
  const baseBodyColor = colorHex || (preset ? preset.bodyColor : '#1a0f30');
  // Per-die subtle color variation so a set doesn't look stamped.
  const bodyColor = varyDieColor(new THREE.Color(baseBodyColor));
  const emissive = preset ? preset.emissive : '#1a0f30';
  const emissiveIntensity = preset ? preset.emissiveIntensity : 0.15;
  const transparent = preset ? preset.transparent : false;
  const opacity = preset ? preset.opacity : 1.0;
  // Less glossy floor: never let preset roughness drop below 0.45 (no plastic
  // mirror) and never let metalness exceed 0.35.
  const presetRoughness = preset ? (preset.roughness !== undefined ? preset.roughness : 0.55) : 0.55;
  const roughness = Math.max(0.45, presetRoughness);
  const presetMetalness = preset ? (preset.metalness !== undefined ? preset.metalness : 0.4) : 0.4;
  const metalness = Math.min(0.35, presetMetalness);

  // Themed body overrides (clearcoat ice, molten emissive, etc.)
  const ov = THEME_MATERIAL_OVERRIDES[preset?.id] || {};
  const plateEmissiveIntensity = ov.plateEmissiveIntensity !== undefined ? ov.plateEmissiveIntensity : 0.4;

  // Painted body albedo/emissive for themed presets (cached per theme).
  // Painted maps carry their own colors, so the material color/emissive go
  // white and let the texture hues through untouched.
  const themeMaps = preset?.id ? getThemeBodyTextures(preset.id) : null;
  const usePaintedBody = !!(themeMaps && themeMaps.map);

  // Weight-material finish — the material also SHOWS: PBR surface identity
  // (metalness/roughness/tint/clearcoat/transparency) layered on top of the
  // theme paint. Wood/stone additionally carry a procedural SURFACE texture
  // (grain / granite speckle) composited OVER the theme albedo — the theme
  // stays the die's identity (frost still reads ICE), the material adds the
  // surface you can feel. Steel reads via reflections, glass via
  // translucency — no albedo texture for those.
  const weightMat = DICE_MATERIALS[useDiceStore.getState().diceMaterial] || DICE_MATERIALS.stone;
  const wv = weightMat.visual || {};
  const matTint = new THREE.Color(wv.tint || '#ffffff');
  const hasSurface = weightMat.id === 'wood' || weightMat.id === 'stone';
  const finalBodyColor = usePaintedBody
    ? (hasSurface ? new THREE.Color(wv.tintPainted || '#ffffff') : matTint)
    : bodyColor.clone().lerp(matTint, 0.65);
  const bodyMap = hasSurface
    ? getCompositedBodyTexture(preset?.id, weightMat.id)
    : (usePaintedBody ? themeMaps.map : null);

  const makeBodyMaterial = () => new THREE.MeshPhysicalMaterial({
    color: finalBodyColor,
    map: bodyMap,
    roughness: wv.roughness !== undefined ? wv.roughness : roughness,
    metalness: wv.metalness !== undefined ? wv.metalness : metalness,
    envMapIntensity: wv.envMapIntensity !== undefined
      ? wv.envMapIntensity
      : (ov.envMapIntensity !== undefined ? ov.envMapIntensity : 0.3),
    specularIntensity: 0.2,
    emissive: usePaintedBody ? '#ffffff' : emissive,
    emissiveMap: usePaintedBody ? themeMaps.emissiveMap : null,
    emissiveIntensity: emissiveIntensity * (ov.emissiveIntensityMul || 1),
    transparent: wv.transparent !== undefined ? wv.transparent : (ov.transparent !== undefined ? ov.transparent : transparent),
    opacity: wv.opacity !== undefined ? wv.opacity : (ov.opacity !== undefined ? ov.opacity : opacity),
    clearcoat: wv.clearcoat !== undefined ? wv.clearcoat : (ov.clearcoat || 0.0),
    clearcoatRoughness: wv.clearcoatRoughness !== undefined ? wv.clearcoatRoughness : (ov.clearcoatRoughness || 0.5),
    sheen: 0.1,
    sheenColor: new THREE.Color(preset?.glowColor || '#ffffff'),
    sheenRoughness: 0.4,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: roughnessMap
  });

  // Per-die surface textures so no two dice look stamped from the same mold.
  // Cheap (a few ms) — a 512x512 canvas of smooth FBM noise.
  // Shared pool of surface-noise textures (cheap, keeps per-die variety via
  // random assignment without baking one per die).
  const surfaceTextures = getSurfaceTextureFromPool();
  const normalMap = surfaceTextures.normalMap;
  const roughnessMap = surfaceTextures.roughnessMap;

  let geom = generateBaseGeometry(type);
  geom = geom.index ? geom.toNonIndexed() : geom;
  geom.computeVertexNormals();

  const posAttr = geom.attributes.position;
  const sides = [];

  // For d6 (RoundedBoxGeometry), the 6 main faces have well-known axis-aligned
  // positions and normals regardless of how the underlying geometry clusters
  // its triangles. Hardcoding the 6 sides gives a deterministic number layout
  // (and a clean plate placement) without depending on the cluster filter.
  if (type === 'd6') {
    const D6_AXES = [
      { normal: new THREE.Vector3( 0,  1,  0), centroid: new THREE.Vector3( 0,  0.75,  0) },
      { normal: new THREE.Vector3( 0, -1,  0), centroid: new THREE.Vector3( 0, -0.75,  0) },
      { normal: new THREE.Vector3( 1,  0,  0), centroid: new THREE.Vector3( 0.75, 0,  0) },
      { normal: new THREE.Vector3(-1,  0,  0), centroid: new THREE.Vector3(-0.75, 0,  0) },
      { normal: new THREE.Vector3( 0,  0,  1), centroid: new THREE.Vector3( 0,  0,  0.75) },
      { normal: new THREE.Vector3( 0,  0, -1), centroid: new THREE.Vector3( 0,  0, -0.75) },
    ];
    for (const a of D6_AXES) {
      sides.push({
        normal: a.normal.clone(),
        referenceNormal: a.normal.clone(),
        vertices: [a.centroid.clone()], // placeholder; used for plate positioning
        centroid: a.centroid.clone(),
      });
    }
  } else {
    for (let i = 0; i < posAttr.count; i += 3) {
      const vA = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      const vB = new THREE.Vector3(posAttr.getX(i + 1), posAttr.getY(i + 1), posAttr.getZ(i + 1));
      const vC = new THREE.Vector3(posAttr.getX(i + 2), posAttr.getY(i + 2), posAttr.getZ(i + 2));

      const faceNormal = new THREE.Vector3().subVectors(vB, vA).cross(new THREE.Vector3().subVectors(vC, vA)).normalize();

      const tolerance = (type === 'd10' || type === 'dpercent') ? 0.2 : 0.05;
      let side = sides.find(s => s.referenceNormal.angleTo(faceNormal) < tolerance);
      if (!side) {
        side = { normal: faceNormal.clone(), referenceNormal: faceNormal.clone(), vertices: [], centroid: new THREE.Vector3() };
        sides.push(side);
      } else {
        side.normal.add(faceNormal).normalize();
      }
      side.vertices.push(vA, vB, vC);
    }
  }

  // Rounded/beveled geometry (d6) creates tiny extra normal clusters along the
  // bevels — keep only the N largest clusters, i.e. the true faces.
  const expectedFaces = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20, dpercent: 10 }[type];
  if (expectedFaces && sides.length > expectedFaces) {
    sides.sort((a, b) => b.vertices.length - a.vertices.length);
    sides.length = expectedFaces;
  }

  const N = sides.length;

  if (type === 'd4') {
    const uniqueVerts = [];
    sides.forEach(side => {
      side.vertices.forEach(v => {
        if (!uniqueVerts.find(uv => uv.distanceTo(v) < 0.1)) uniqueVerts.push(v);
      });
    });
    uniqueVerts.forEach((v, idx) => v.d4Num = idx + 1);

    sides.forEach((side) => {
      const sum = new THREE.Vector3();
      side.vertices.forEach(v => sum.add(v));
      side.centroid = sum.divideScalar(3);

      let bestV = side.vertices[0];
      let maxDist = -1;
      side.vertices.forEach(v => {
        const d = v.clone().sub(side.centroid).lengthSq();
        if (d > maxDist) { maxDist = d; bestV = v; }
      });

      const others = side.vertices.filter(v => v !== bestV);
      const upDir = bestV.clone().sub(side.centroid).normalize();
      const rightDir = upDir.clone().cross(side.normal).normalize();

      let vRight, vLeft;
      if (others[0].clone().sub(side.centroid).dot(rightDir) > 0) {
        vRight = others[0]; vLeft = others[1];
      } else {
        vRight = others[1]; vLeft = others[0];
      }

      const nTop = uniqueVerts.find(uv => uv.distanceTo(bestV) < 0.1).d4Num;
      const nRight = uniqueVerts.find(uv => uv.distanceTo(vRight) < 0.1).d4Num;
      const nLeft = uniqueVerts.find(uv => uv.distanceTo(vLeft) < 0.1).d4Num;

      const faceTex = createD4FaceTexture(nTop, nRight, nLeft, numberColor);
      const plateMat = new THREE.MeshStandardMaterial({
        map: faceTex,
        emissive: new THREE.Color(numberColor || '#dbb85c'),
        emissiveMap: faceTex,
        emissiveIntensity: plateEmissiveIntensity,
        roughness: 0.35,
        metalness: 0.55,
        transparent: true,
        depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1
      });

      const d_vert = bestV.distanceTo(side.centroid);
      const pSize = d_vert * 2.5;
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(pSize, pSize), plateMat);

      plate.up.copy(upDir);
      plate.position.copy(side.centroid).multiplyScalar(1.02);
      plate.lookAt(side.centroid.clone().add(side.normal));

      group.add(plate);
      side.plate = plate;
    });

    const solidMat = makeBodyMaterial();
    const mesh = new THREE.Mesh(geom, solidMat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData.baseEmissiveIntensity = solidMat.emissiveIntensity;
    mesh.userData.bodyFlicker = ov.bodyFlicker || null;
    group.add(mesh);

    // Thicker, screen-space edge lines via LineSegments2 (addons).
    const edgeGeo = new THREE.EdgesGeometry(geom, 15);
    const edgePositions = Array.from(edgeGeo.attributes.position.array);
    const lineGeo = new LineSegmentsGeometry();
    lineGeo.setPositions(edgePositions);
    const lineMat = new LineMaterial({
      color: edgeColor,
      linewidth: 2.5,
      worldUnits: false,
      transparent: true,
      opacity: 0.95,
      depthTest: true
    });
    const edges = new LineSegments2(lineGeo, lineMat);
    edges.computeLineDistances();
    group.add(edges);

    return { group, sides, maxNumber: 4, d4Verts: uniqueVerts, bodyMesh: mesh, surfaceTextures };
  }

  let numbers = [];
  if (type === 'dpercent') {
    // Standard d10 percentiles: 00-90 in opposite-pairs (00-90, 10-80, 20-70...).
    numbers = [10, 2, 8, 4, 6, 3, 7, 5, 1, 9];
  } else if (N === 10) {
    numbers = [10, 2, 8, 4, 6, 3, 7, 5, 1, 9];
  } else if (N === 20) {
    numbers = [20, 1, 14, 9, 12, 5, 8, 13, 3, 18, 7, 16, 2, 19, 6, 15, 11, 10, 4, 17];
  } else if (type === 'd6') {
    // Standard d6: opposite faces sum to 7. After sort-by-(y desc, angle asc)
    // the order is [top, side0, side1, side2, side3, bottom] — pairs of
    // opposite sides are at indices (0,5), (1,3), (2,4). Assign numbers
    // accordingly so 1↔6, 2↔5, 3↔4.
    numbers = [1, 2, 3, 5, 4, 6];
  } else {
    for (let i = 1; i <= N; i++) numbers.push(i);
  }

  sides.sort((a, b) => {
    if (Math.abs(a.normal.y - b.normal.y) > 0.1) return b.normal.y - a.normal.y;
    const angleA = Math.atan2(a.normal.z, a.normal.x);
    const angleB = Math.atan2(b.normal.z, b.normal.x);
    return angleA - angleB;
  });

  sides.forEach((side, i) => {
    // For d6 (RoundedBox), the centroid is exactly on the dominant axis
    // (±0.75) and the normal is the axis direction. This guarantees the
    // number plate is perfectly axis-aligned and centered on the face.
    if (type === 'd6') {
      const n = side.normal;
      const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
      if (ax > ay && ax > az) {
        const sx = Math.sign(side.normal.x);
        side.normal.set(sx, 0, 0);
        side.centroid.set(sx * 0.75, 0, 0);
      } else if (ay > az) {
        const sy = Math.sign(side.normal.y);
        side.normal.set(0, sy, 0);
        side.centroid.set(0, sy * 0.75, 0);
      } else {
        const sz = Math.sign(side.normal.z);
        side.normal.set(0, 0, sz);
        side.centroid.set(0, 0, sz * 0.75);
      }
    } else {
      const sum = new THREE.Vector3();
      side.vertices.forEach(v => sum.add(v));
      side.centroid = sum.divideScalar(side.vertices.length);
    }
    side.num = numbers[i];

    // d6 face is ~1.18 wide (RoundedBox 1.5 minus bevel) — a 0.95 plate covers
    // ~80% of the flat face so the number is clearly readable.
    // d20/d12/d10 use smaller plates because their faces are smaller polygons.
    let pSize = type === 'd6' ? 0.95
              : type === 'd20' ? 0.7
              : type === 'd12' ? 0.75
              : (type === 'd10' || type === 'dpercent') ? 0.62
              : 0.8;
    const numTex = createNumberTextureWithColor(side.num, type, numberColor);
    const plateMat = new THREE.MeshStandardMaterial({
      map: numTex,
      emissive: new THREE.Color(numberColor || '#dbb85c'),
      emissiveMap: numTex,
      emissiveIntensity: plateEmissiveIntensity,
      roughness: 0.35,
      metalness: 0.55,
      transparent: true,
      depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1
    });
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(pSize, pSize), plateMat);

    if (type === 'd10' || type === 'dpercent') {
      const pole = new THREE.Vector3(0, side.centroid.y > 0 ? 1 : -1, 0);
      const projUp = pole.sub(side.normal.clone().multiplyScalar(pole.dot(side.normal))).normalize();
      plate.up.copy(projUp);
      plate.position.copy(side.centroid).multiplyScalar(1.05);
      plate.lookAt(side.centroid.clone().add(side.normal));
    } else {
      if (type === 'd6' || type === 'd8' || type === 'd12') {
        const defaultUp = new THREE.Vector3(0, 1, 0);
        if (Math.abs(side.normal.y) > 0.9) defaultUp.set(0, 0, -1);
        const projUp = defaultUp.sub(side.normal.clone().multiplyScalar(defaultUp.dot(side.normal))).normalize();
        plate.up.copy(projUp);
      } else {
        let bestV = side.vertices[0];
        let maxDist = -1;
        side.vertices.forEach(v => {
          const d = v.clone().sub(side.centroid).lengthSq();
          if (d > maxDist) { maxDist = d; bestV = v; }
        });
        plate.up.copy(bestV.clone().sub(side.centroid).normalize());
      }
      // d6 RoundedBox face is a flat plane at the centroid's full extent
      // (±0.75), so 1.005 keeps the plate flush with the face (no z-fight,
      // polygonOffset handles the rest). Sharp polyhedra need a slight lift
      // (1.02-1.03) because their face centroids can sit inside the body.
      const platePosMul = type === 'd6' ? 1.005 : type === 'd20' ? 1.02 : 1.03;
      plate.position.copy(side.centroid).multiplyScalar(platePosMul);
      plate.lookAt(side.centroid.clone().add(side.normal));
    }

    group.add(plate);
    side.plate = plate;
  });

  const solidMat = makeBodyMaterial();
  const mesh = new THREE.Mesh(geom, solidMat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.userData.baseEmissiveIntensity = solidMat.emissiveIntensity;
  mesh.userData.bodyFlicker = ov.bodyFlicker || null;
  group.add(mesh);

  // Real 3D-feeling edge bevels via LineSegments2 (addons) — supports
  // screen-space pixel width that LineSegments can't.
  const edgeGeo = new THREE.EdgesGeometry(geom, 15);
  const edgePositions = Array.from(edgeGeo.attributes.position.array);
  const lineGeo = new LineSegmentsGeometry();
  lineGeo.setPositions(edgePositions);
  const lineMat = new LineMaterial({
    color: edgeColor,
    linewidth: 2.5,
    worldUnits: false,
    transparent: true,
    opacity: 0.95,
    depthTest: true
  });
  const edges = new LineSegments2(lineGeo, lineMat);
  edges.computeLineDistances();
  group.add(edges);

  return { group, sides, maxNumber: N, bodyMesh: mesh, surfaceTextures };
}

function createPhysicsBody(geom) {
  const cannonVertices = [];
  const cannonFaces = [];
  const posArray = geom.attributes.position.array;

  for (let i = 0; i < posArray.length; i += 9) {
    const face = [];
    for (let j = 0; j < 3; j++) {
      const x = posArray[i + j * 3], y = posArray[i + j * 3 + 1], z = posArray[i + j * 3 + 2];
      let vIdx = cannonVertices.findIndex(v => Math.abs(v.x - x) < 0.005 && Math.abs(v.y - y) < 0.005 && Math.abs(v.z - z) < 0.005);
      if (vIdx === -1) { vIdx = cannonVertices.length; cannonVertices.push(new CANNON.Vec3(x, y, z)); }
      face.push(vIdx);
    }
    cannonFaces.push(face);
  }

  const shape = new CANNON.ConvexPolyhedron({ vertices: cannonVertices, faces: cannonFaces });
  return shape;
}

const PhysicsDiceScene = ({
  diceToRoll = [],
  diceColor = '#14092b',
  activePreset = 'classic',
  onRollComplete,
  onDismiss,
  isVisible = false
}) => {
  const rollContext = useDiceStore(state => state.rollContext);
  const skillOutcome = useDiceStore(state => state.skillOutcome);
  const { shadowQuality, antiAliasing, pixelRatioCap } = useSettingsStore();
  
  // Real-time performance auto-recovery monitoring
  useAdaptivePerformance({ enabled: isVisible });

  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const worldRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(new THREE.Timer());
  const activeDiceRef = useRef([]);
  const physicsActiveRef = useRef(false);
  const resultsRef = useRef([]);
  const onCompleteFiredRef = useRef(false);
  const dieGlowRef = useRef(null);
  const [resultState, setResultState] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const groundBodyRef = useRef(null);
  const wallBodiesRef = useRef([]);
  const physicsMaterialRef = useRef(null);
  const contactMaterialRef = useRef(null);
  const boundsRef = useRef({ x: 10, z: 10 });
  const groundMeshRef = useRef(null);
  const envMapRef = useRef(null);
  const lineMaterialsRef = useRef([]);
  const dismissTimerRef = useRef(null);
  const lastRollContextRef = useRef(null);
  // Smoothed look-at target — drifts gently toward the dice centroid so the
  // "tray" follows the throw (DDB-style) without ever disorienting the view.
  const camTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  // Timestamp of the current throw — backs a hard settle deadline so a freak
  // spin-heavy rest can never hang the roll forever.
  const rollStartRef = useRef(0);

  const getPreset = useCallback(() => {
    return DICE_PRESETS[activePreset] || DICE_PRESETS.classic;
  }, [activePreset]);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const useAntialias = antiAliasing !== false;
    const maxPixelRatio = pixelRatioCap || 1.5;

    const renderer = new THREE.WebGLRenderer({ antialias: useAntialias, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0); // fully transparent — the table shows through

    const enableShadows = shadowQuality !== 'off';
    renderer.shadowMap.enabled = enableShadows;
    if (enableShadows) {
      renderer.shadowMap.type = shadowQuality === 'low' ? THREE.BasicShadowMap : THREE.PCFShadowMap;
    }

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Image-based lighting: realistic PBR reflections on the dice bodies
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.3;
    envMapRef.current = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
    camera.position.set(0, 16, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0x404050, 0.45));

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.2);
    keyLight.position.set(8, 16, 9);
    keyLight.castShadow = enableShadows;

    let shadowMapSize = 1024;
    if (shadowQuality === 'low') shadowMapSize = 512;
    else if (shadowQuality === 'high') shadowMapSize = 2048;

    keyLight.shadow.mapSize.width = shadowMapSize;
    keyLight.shadow.mapSize.height = shadowMapSize;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.bias = -0.0004;
    const d = 14;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x5a7aaa, 0.55);
    fillLight.position.set(-8, 10, -8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x6688cc, 0.45);
    rimLight.position.set(0, 5, -12);
    scene.add(rimLight);

    const dieGlow = new THREE.PointLight(0xffd060, 0, 10);
    dieGlowRef.current = dieGlow;
    scene.add(dieGlow);

    // Invisible ground plane: catches soft shadows so dice sit ON the table
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.38 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    groundMeshRef.current = ground;

    const world = new CANNON.World();
    // Gravity scaled to the dice: bodies are ~1.5 units, so a strong field
    // makes falls/bounces read at real-dice speed instead of moon speed.
    // Baseline is the default stone material; the chosen material re-tunes
    // this (and the contact) at every throw.
    world.gravity.set(0, DICE_MATERIALS.stone.gravity, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 25;

    const physicsMaterial = new CANNON.Material('standard');
    physicsMaterialRef.current = physicsMaterial;
    // Contact profile = the WEIGHT feel. Stiff contacts (no sink/overlap on
    // impact) plus stone defaults; throwAllDice overrides per material.
    const contactMaterial = new CANNON.ContactMaterial(
      physicsMaterial, physicsMaterial, {
        friction: DICE_MATERIALS.stone.friction,
        restitution: DICE_MATERIALS.stone.restitution,
        contactEquationStiffness: DICE_MATERIALS.stone.stiffness,
        contactEquationRelaxation: DICE_MATERIALS.stone.relaxation,
      }
    );
    world.addContactMaterial(contactMaterial);
    contactMaterialRef.current = contactMaterial;

    const groundBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: physicsMaterial });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);
    groundBodyRef.current = groundBody;

    worldRef.current = world;

    updateBounds(w, h);
  }, [activePreset]);

  const updateBounds = useCallback((w, h) => {
    const camera = cameraRef.current;
    const world = worldRef.current;
    if (!camera || !world) return;

    const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.y;
    const visibleWidth = visibleHeight * (w / h);
    const boundX = Math.max(2, (visibleWidth / 2) - 1.5);
    const boundZ = Math.max(2, (visibleHeight / 2) - 1.5);
    boundsRef.current = { x: boundX, z: boundZ };

    wallBodiesRef.current.forEach(b => world.removeBody(b));
    wallBodiesRef.current = [];
    const mat = physicsMaterialRef.current;

    const wallData = [
      { pos: [boundX, 0, 0], axis: [0, 1, 0], angle: -Math.PI / 2 },
      { pos: [-boundX, 0, 0], axis: [0, 1, 0], angle: Math.PI / 2 },
      { pos: [0, 0, boundZ], axis: [0, 1, 0], angle: Math.PI },
      { pos: [0, 0, -boundZ], axis: [0, 1, 0], angle: 0 },
    ];

    wallData.forEach(({ pos, axis, angle }) => {
      const wall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: mat });
      wall.position.set(pos[0], pos[1], pos[2]);
      wall.quaternion.setFromAxisAngle(new CANNON.Vec3(axis[0], axis[1], axis[2]), angle);
      world.addBody(wall);
      wallBodiesRef.current.push(wall);
    });
  }, []);

  const throwAllDice = useCallback(() => {
    const world = worldRef.current;
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    if (!world || !scene || !renderer || diceToRoll.length === 0) return;

    activeDiceRef.current.forEach(d => {
      scene.remove(d.diceObj.group);
      world.removeBody(d.body);
      // Result-highlight outlines are per-roll — dispose their geometry and
      // materials (the shared number/surface textures are pooled, not ours).
      (d.resultOutlines || []).forEach(l => {
        l.geometry.dispose();
        const idx = lineMaterialsRef.current.indexOf(l.material);
        if (idx !== -1) lineMaterialsRef.current.splice(idx, 1);
        l.material.dispose();
      });
    });
    activeDiceRef.current = [];
    resultsRef.current = [];
    onCompleteFiredRef.current = false;
    setResultState(null);
    // Clear stale skill outcome and any line materials from the previous roll.
    useDiceStore.setState({ skillOutcome: null });
    lineMaterialsRef.current.forEach((m) => m.dispose && m.dispose());
    lineMaterialsRef.current = [];

    const { x: boundX, z: boundZ } = boundsRef.current;
    const preset = getPreset();

    // Weight material — re-tunes the world BEFORE any bodies are thrown.
    // Mutating the shared ContactMaterial is safe here: nothing steps
    // between throws.
    const mat = DICE_MATERIALS[useDiceStore.getState().diceMaterial] || DICE_MATERIALS.stone;
    world.gravity.set(0, mat.gravity, 0);
    const cm = contactMaterialRef.current;
    if (cm) {
      cm.friction = mat.friction;
      cm.restitution = mat.restitution;
      cm.contactEquationStiffness = mat.stiffness;
      cm.contactEquationRelaxation = mat.relaxation;
    }

    diceToRoll.forEach((die, index) => {
      const diceType = die.type;
      const diceObj = buildDiceObject(diceType, diceColor, preset, renderer, scene);
      // Rounded d6 uses a simple box physics proxy — a ConvexPolyhedron built
      // from beveled geometry has near-degenerate faces that destabilize the
      // solver (dice never settle / fall through). A box is robust and feels right.
      let shape;
      if (diceType === 'd6') {
        shape = new CANNON.Box(new CANNON.Vec3(0.74, 0.74, 0.74));
      } else {
        let physGeom = generateBaseGeometry(diceType);
        physGeom = physGeom.index ? physGeom.toNonIndexed() : physGeom;
        physGeom.computeVertexNormals();
        shape = createPhysicsBody(physGeom);
      }
      const body = new CANNON.Body({
        mass: 10,
        material: physicsMaterialRef.current,
        // Damping carries the material's weight: heavy materials bleed spin
        // fast (a steel die lands and STOPS tumbling), light ones linger.
        linearDamping: mat.linearDamping,
        angularDamping: mat.angularDamping,
      });
      body.addShape(shape);
      world.addBody(body);
      scene.add(diceObj.group);

      const rollCtx = useDiceStore.getState().rollContext;
      const throwPower = typeof rollCtx?.throwPower === 'number' ? Math.max(0.5, Math.min(2.8, rollCtx.throwPower)) : 1.0;

      const hasAim = rollCtx?.throwDirection && (Math.abs(rollCtx.throwDirection.x) > 0.05 || Math.abs(rollCtx.throwDirection.z) > 0.05);

      // DDB-style throw: dice ENTER from a table edge already moving fast and
      // let physics decide the rest — no ballistic targeting. An exact-solve
      // trajectory (land exactly at X in exactly T seconds) reads "on rails";
      // a fast edge entry + invisible walls reads as a real handful of dice
      // flung across a tray, scattering wherever momentum takes them.
      const trayX = boundX * 0.82;
      const trayZ = boundZ * 0.82;

      let spawnX, spawnZ;
      if (hasAim) {
        // Aimed throws enter from the edge OPPOSITE the aim direction —
        // the throw literally crosses the screen along the fling vector.
        const aLen = Math.hypot(rollCtx.throwDirection.x, rollCtx.throwDirection.z) || 1;
        spawnX = -(rollCtx.throwDirection.x / aLen) * boundX * 0.9 + (Math.random() - 0.5) * 1.2;
        spawnZ = -(rollCtx.throwDirection.z / aLen) * boundZ * 0.9 + (Math.random() - 0.5) * 1.2;
      } else {
        // Unaimed: mostly from the top edge (results land in the lower 2/3,
        // clear of the result chip), sometimes the sides for variety.
        const r = Math.random();
        if (r < 0.5) {
          spawnX = (Math.random() - 0.5) * 1.6 * trayX;
          spawnZ = -boundZ * 0.9;
        } else if (r < 0.75) {
          spawnX = -boundX * 0.9;
          spawnZ = (Math.random() - 0.5) * 1.4 * trayZ;
        } else {
          spawnX = boundX * 0.9;
          spawnZ = (Math.random() - 0.5) * 1.4 * trayZ;
        }
      }
      spawnX = THREE.MathUtils.clamp(spawnX, -boundX * 0.95, boundX * 0.95);
      spawnZ = THREE.MathUtils.clamp(spawnZ, -boundZ * 0.95, boundZ * 0.95);

      // Aim point across the central tray (opposite-biased from the spawn so
      // throws cross the middle and scatter wide instead of hugging an edge).
      const aimX = THREE.MathUtils.clamp(
        -spawnX * (0.4 + Math.random() * 0.35) + (Math.random() - 0.5) * trayX * 0.6,
        -trayX, trayX
      );
      const aimZ = THREE.MathUtils.clamp(
        -spawnZ * (0.4 + Math.random() * 0.35) + (Math.random() - 0.5) * trayZ * 0.6,
        -trayZ, trayZ
      );

      let dirX = aimX - spawnX, dirZ = aimZ - spawnZ;
      const dLen = Math.hypot(dirX, dirZ) || 1;
      dirX /= dLen;
      dirZ /= dLen;

      // Entry speed carries the charge: a tap crosses the tray briskly, a
      // full-charge fling slams in and ricochets off the far wall. Per-die
      // jitter staggers the pool naturally (no timed delays needed).
      const speed = Math.min(30, (19 + 12 * throwPower) * (0.92 + Math.random() * 0.16));

      // Enter low over the table — the first ground strike, not a dead drop
      // from the sky, is what makes the bounce rhythm read DDB-crisp.
      const startY = 1.6 + Math.random() * 1.5 + index * 0.1;

      body.position.set(spawnX, startY, spawnZ);
      body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      body.velocity.set(dirX * speed, 0.5 + Math.random() * 2.5, dirZ * speed);

      // Chaotic all-axis tumble — the DDB signature. Concentric
      // end-over-end spin (all spin on the axis ⊥ the throw) looks metered,
      // like dice rotating on a spit; a random axis per die makes every
      // throw unpredictable and lets dice transition into genuine rolls.
      // d6 boxes carry more spin than polys: their flat faces shed rotation
      // on every face-plant, so they need a deeper energy budget to keep
      // tumbling as long as the round dice.
      const d6Mul = diceType === 'd6' ? 1.4 : 1.0;
      const spinMag = (40 + 18 * Math.pow(throwPower, 0.8)) * mat.spinMul * (0.8 + Math.random() * 0.4) * d6Mul;
      // Uniform random point on a sphere (y damped a touch — pure flat-spin
      // yaw doesn't tumble visually and grinds the felt).
      const sphA = Math.random() * Math.PI * 2;
      const sphB = Math.acos(2 * Math.random() - 1);
      body.angularVelocity.set(
        Math.sin(sphB) * Math.cos(sphA) * spinMag,
        Math.cos(sphB) * spinMag * 0.6,
        Math.sin(sphB) * Math.sin(sphA) * spinMag
      );
      // Clamp total spin so a max-power fling stays readable, not a blur.
      if (body.angularVelocity.length() > 45) {
        body.angularVelocity.scale(45 / body.angularVelocity.length(), body.angularVelocity);
      }

      activeDiceRef.current.push({
        diceObj,
        body,
        type: diceType,
        originalType: die.originalType || die.type,
        isPercentilePair: die.isPercentilePair || false,
        pairIndex: die.pairIndex,
        settled: false,
        stillTime: 0,
        slowTime: 0,
        damped: false,
        kickCount: 0,
        rolledNumber: 0,
      });

      // Register the new LineMaterial so its resolution tracks viewport size.
      diceObj.group.traverse((obj) => {
        if (obj.isLineSegments2 && obj.material && !lineMaterialsRef.current.includes(obj.material)) {
          obj.material.resolution.set(containerRef.current.clientWidth, containerRef.current.clientHeight);
          lineMaterialsRef.current.push(obj.material);
        }
      });
    });

    physicsActiveRef.current = true;
    rollStartRef.current = performance.now();
    setIsRolling(true);
  }, [diceToRoll, diceColor, getPreset]);

  // Read the rolled face plus an ambiguity margin. For d4 the result is the
  // highest vertex; the margin is how far it clears the runner-up, normalized
  // by vertex distance from center. For every other die the result is the
  // face whose normal points most upward; the margin is the dot gap to the
  // second-best face — near zero means the die rests on an edge between two
  // numbers and the read is visually ambiguous.
  const getTopFaceInfo = useCallback((die) => {
    const { diceObj, type, body } = die;
    const currentQuat = new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);

    if (type === 'd4') {
      let bestV = null;
      let bestY = -Infinity, runnerY = -Infinity;
      diceObj.d4Verts.forEach(v => {
        const wy = v.clone().applyQuaternion(currentQuat).y;
        if (wy > bestY) { runnerY = bestY; bestY = wy; bestV = v; }
        else if (wy > runnerY) { runnerY = wy; }
      });
      const scale = diceObj.d4Verts[0].length() || 1;
      return { num: bestV ? bestV.d4Num : 1, margin: (bestY - runnerY) / scale, vertex: bestV };
    }

    let bestDot = -Infinity, secondDot = -Infinity, topSide = null;
    const upVector = new THREE.Vector3(0, 1, 0);
    diceObj.sides.forEach(side => {
      const dot = side.normal.clone().applyQuaternion(currentQuat).dot(upVector);
      if (dot > bestDot) { secondDot = bestDot; bestDot = dot; topSide = side; }
      else if (dot > secondDot) { secondDot = dot; }
    });

    if (type === 'dpercent') {
      return { num: topSide ? topSide.num * 10 : 0, margin: bestDot - secondDot, side: topSide };
    }
    return { num: topSide ? topSide.num : 1, margin: bestDot - secondDot, side: topSide };
  }, []);

  // Attach the result highlight to a settled die: a glowing outline around
  // the winning face (d4: the three faces meeting at the winning vertex)
  // plus a gentle emissive lift on that face's number plate. The outline is
  // built from the face's own perimeter vertices, ordered around the
  // centroid — works for triangles (d20/d8/d4), quads (d6/d12), and kites
  // (d10) alike. Lines use depthTest:false + high renderOrder so the glow
  // reads cleanly from the top-down camera.
  const attachResultHighlight = useCallback((die, info) => {
    const group = die.diceObj.group;
    const preset = getPreset();
    const outlineColor = new THREE.Color(preset?.numberColor || '#dbb85c')
      .lerp(new THREE.Color('#ffffff'), 0.35);
    const res = new THREE.Vector2(
      containerRef.current?.clientWidth || 800,
      containerRef.current?.clientHeight || 600
    );

    const sidesToMark = [];
    if (die.type === 'd4' && info.vertex) {
      die.diceObj.sides.forEach(s => {
        if (s.vertices.some(v => v.distanceTo(info.vertex) < 0.1)) sidesToMark.push(s);
      });
    } else if (info.side) {
      sidesToMark.push(info.side);
    }

    die.resultOutlines = [];
    die.resultPlates = [];

    sidesToMark.forEach(side => {
      if (!side.plate) return;
      let pts = null;
      const n = side.normal.clone().normalize();

      if (die.type === 'd6') {
        // d6 sides carry only a centroid placeholder — build the flat-face
        // rectangle (1.5 body minus 0.16 bevel ⇒ ±0.59) from the axis.
        let u = Math.abs(n.x) > 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
        u.sub(n.clone().multiplyScalar(n.dot(u))).normalize();
        const w = new THREE.Vector3().crossVectors(n, u);
        const h = 0.59;
        const c = side.centroid.clone();
        pts = [
          c.clone().addScaledVector(u, h).addScaledVector(w, h),
          c.clone().addScaledVector(u, -h).addScaledVector(w, h),
          c.clone().addScaledVector(u, -h).addScaledVector(w, -h),
          c.clone().addScaledVector(u, h).addScaledVector(w, -h),
        ].map(p => p.addScaledVector(n, 0.03));
      } else {
        // Unique perimeter vertices, sorted by angle in the face plane.
        const uniq = [];
        side.vertices.forEach(v => {
          if (!uniq.some(q => q.distanceTo(v) < 0.02)) uniq.push(v.clone());
        });
        if (uniq.length >= 3) {
          const centroid = new THREE.Vector3();
          uniq.forEach(v => centroid.add(v));
          centroid.divideScalar(uniq.length);
          let u = Math.abs(n.x) > 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
          u.sub(n.clone().multiplyScalar(n.dot(u))).normalize();
          const w = new THREE.Vector3().crossVectors(n, u);
          uniq.sort((a, b) => {
            const aa = Math.atan2(a.clone().sub(centroid).dot(w), a.clone().sub(centroid).dot(u));
            const bb = Math.atan2(b.clone().sub(centroid).dot(w), b.clone().sub(centroid).dot(u));
            return aa - bb;
          });
          pts = uniq.map(p => p.clone().addScaledVector(n, 0.03));
        }
      }

      if (pts) {
        const positions = [];
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        const geo = new LineSegmentsGeometry();
        geo.setPositions(positions);
        const mat = new LineMaterial({
          color: outlineColor,
          linewidth: 3,
          worldUnits: false,
          transparent: true,
          opacity: 0.9,
          depthTest: false,
        });
        mat.resolution.copy(res);
        const line = new LineSegments2(geo, mat);
        line.computeLineDistances();
        line.renderOrder = 999;
        group.add(line);
        lineMaterialsRef.current.push(mat);

        die.resultOutlines.push(line);
        const plate = side.plate;
        if (plate.userData.basePlateEmissive === undefined) {
          plate.userData.basePlateEmissive = plate.material.emissiveIntensity;
        }
        die.resultPlates.push(plate);
      }
    });
  }, [getPreset]);

  const animate = useCallback(() => {
    animFrameRef.current = requestAnimationFrame(animate);

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const world = worldRef.current;
    if (!renderer || !scene || !camera || !world) return;

    timerRef.current.update();
    const dt = Math.min(timerRef.current.getDelta(), 0.05);

    if (physicsActiveRef.current && activeDiceRef.current.length > 0) {
      // 120Hz fixed stepping: at DDB entry speeds (~28 u/s) a 60Hz step lets
      // dice sink 0.45u into contacts before resolving — mushy first strikes.
      // Halving the step keeps impacts crisp and die-die contacts exact.
      world.step(1 / 120, dt, 8);

      let allSettled = true;
      activeDiceRef.current.forEach((die) => {
        if (die.settled) return;
        allSettled = false;

        die.diceObj.group.position.copy(die.body.interpolatedPosition);
        die.diceObj.group.quaternion.copy(die.body.interpolatedQuaternion);

        // DDB-style resolve: a die freezes only after staying GENUINELY
        // still for a beat — no scripted re-orientation after the stop, the
        // physics pose IS the result. (A rare edge-balance gets a small
        // physical kick below so it topples naturally, never a tween.)
        const speed = die.body.velocity.length();
        const spin = die.body.angularVelocity.length();
        const tSinceThrow = performance.now() - rollStartRef.current;
        const contactWith = (filterFn) => world.contacts.some(c => {
          const other = c.bi === die.body ? c.bj : (c.bj === die.body ? c.bi : null);
          return other != null && filterFn(other);
        });
        // A die may only freeze when genuinely supported — near the floor or
        // touching a non-wall body (the ground or another die). Wall contact
        // alone does NOT count: a die clipping an invisible wall mid-air
        // must never freeze hovering.
        const grounded =
          die.body.position.y < 1.05 ||
          contactWith(other => !wallBodiesRef.current.includes(other));

        if (tSinceThrow > 350 && grounded && speed < 0.12 && spin < 0.25) {
          die.stillTime += dt;
        } else {
          die.stillTime = 0;
        }

        // Slow-but-not-still trap: a die stuck micro-rocking on a corner,
        // chattering against a neighbor, or sliding forever in the slow band
        // would drag the roll out (or ride the timeout). After 1s in the
        // band, escalate its damping so PHYSICS bleeds the motion out —
        // after 2.4s, accept it as settled through the normal read path.
        if (tSinceThrow > 350 && grounded && speed < 0.6 && spin < 1.2) {
          die.slowTime += dt;
        } else if (die.slowTime < 1) {
          die.slowTime = 0;
        }
        if (die.slowTime > 1 && !die.damped) {
          die.damped = true;
          die.body.linearDamping = 0.5;
          die.body.angularDamping = 0.55;
        }
        const forceSettle = die.slowTime > 2.4;

        const timedOut = tSinceThrow > 8000;
        if (die.stillTime >= 0.35 || timedOut || forceSettle) {
          const info = getTopFaceInfo(die);
          // Only a die RESTING ON TOP of another die keeps an ambiguous
          // pose — toppling it would clip it through its support. Merely
          // touching the ground, a wall, or a side-by-side neighbor does
          // NOT exempt it.
          const supportedFromBelow = contactWith(other =>
            other !== groundBodyRef.current &&
            !wallBodiesRef.current.includes(other) &&
            other.position.y < die.body.position.y - 0.35);
          const marginThresh = die.type === 'd4' ? 0.3 : 0.22;

          if (!timedOut && !supportedFromBelow && info.margin < marginThresh && die.kickCount < 3) {
            // Edge-balanced rest (top face ambiguous): pop it with a small
            // PHYSICAL impulse so it topples like a table was bumped —
            // honest physics, max 3 attempts, closest face then wins. The
            // kick must be strong enough to clear a near-edge lean (weak
            // nudges just wobble the die back onto the same edge).
            die.kickCount += 1;
            die.stillTime = 0;
            die.slowTime = 0;
            die.body.velocity.y += 7.5 + Math.random() * 3.5;
            die.body.velocity.x += (Math.random() - 0.5) * 3.5;
            die.body.velocity.z += (Math.random() - 0.5) * 3.5;
            die.body.angularVelocity.x += (Math.random() - 0.5) * 16;
            die.body.angularVelocity.y += (Math.random() - 0.5) * 16;
            die.body.angularVelocity.z += (Math.random() - 0.5) * 16;
          } else {
            // Arrest cleanly and read the face the physics left on top.
            die.body.velocity.setZero();
            die.body.angularVelocity.setZero();
            world.removeBody(die.body);
            die.rolledNumber = info.num;
            die.settled = true;
            attachResultHighlight(die, info);
          }
        }
      });

      if (allSettled) {
        physicsActiveRef.current = false;
      }
    }

    // Only the material-level emissive flicker remains — a single uniform
    // update per die per frame (near-zero cost).
    activeDiceRef.current.forEach((die) => {
      if (die.diceObj.bodyMesh?.userData.bodyFlicker) {
        updateBodyFlicker(die.diceObj.bodyMesh, timerRef.current.getElapsed());
      }
    });

    // Result highlight: winning-face outline breathes (~0.8Hz — faster reads
    // as a strobing bug) and the number plate glows slightly with it.
    if (activeDiceRef.current.some(d => d.resultOutlines?.length)) {
      const tNow = timerRef.current.getElapsed();
      activeDiceRef.current.forEach((die, i) => {
        if (!die.resultOutlines?.length) return;
        const pulse = 0.5 + 0.5 * Math.sin(tNow * 5 + i * 1.3);
        die.resultOutlines.forEach(l => { l.material.opacity = 0.55 + 0.4 * pulse; });
        die.resultPlates?.forEach(p => {
          p.material.emissiveIntensity = p.userData.basePlateEmissive * (1.45 + 0.4 * pulse);
        });
      });
    }

    const allSettledComplete = activeDiceRef.current.every(d => d.settled);

    if (!physicsActiveRef.current && activeDiceRef.current.length > 0 && allSettledComplete && !onCompleteFiredRef.current) {
      onCompleteFiredRef.current = true;

      const results = [];
      const pairGroups = {};

      activeDiceRef.current.forEach((die, idx) => {
        if (die.isPercentilePair) {
          // Dice ids look like "d100_1730..._0_pct" / "d100_1730..._0_d10" —
          // strip the "_pct" / "_d10" suffix so both halves land in ONE group.
          const groupKey = diceToRoll[idx]?.id?.replace(/_(pct|d\d+)$/, '') || `pair_${idx}`;
          if (!pairGroups[groupKey]) pairGroups[groupKey] = {};
          if (die.type === 'dpercent') {
            pairGroups[groupKey].percentile = die.rolledNumber;
          } else {
            pairGroups[groupKey].d10 = die.rolledNumber;
          }
        } else {
          results.push({
            id: diceToRoll[idx]?.id || `die_${idx}`,
            type: die.originalType || die.type,
            value: die.rolledNumber,
          });
        }
      });

      Object.entries(pairGroups).forEach(([key, pair], i) => {
        const pctVal = pair.percentile || 0;
        const d10Val = pair.d10 || 0;
        const total = pctVal + d10Val;
        results.push({
          id: `d100_${i}`,
          type: 'd100',
          value: total === 0 ? 100 : total,
          percentileValue: pctVal,
          d10Value: d10Val,
        });
      });

      const total = results.reduce((sum, r) => sum + r.value, 0);
      // "MAXIMUM DAMAGE" / "CRITICAL FAILURE" labels are only accurate when
      // EVERY die in the pool hit its extreme. For a single die, that's its
      // own max/min; for multi-die pools, ALL dice need to be max/min
      // (e.g. 3d4=12 for max damage, 3d4=3 for min). Per-die max for 3d4
      // would say "MAXIMUM DAMAGE" for any total ≥ 4, which is wrong.
      const maxValues = results.map(r => {
        if (r.type === 'd100') return 100;
        const diceType = r.type.replace('d', '');
        return parseInt(diceType, 10) || 20;
      });
      const minValues = results.map(r => {
        if (r.type === 'd100') return 1;
        return 1;
      });
      const allMaxed = results.length > 0 && results.every((r, i) => r.value === maxValues[i]);
      const allMinned = results.length > 0 && results.every((r, i) => r.value === minValues[i]);
      const hasCrit = allMaxed;
      const hasFail = allMinned;

      setResultState({ results, total, hasCrit, hasFail });

      if (dieGlowRef.current) {
        if (hasCrit) {
          dieGlowRef.current.color.setHex(0x44ff88);
          dieGlowRef.current.intensity = 5;
        } else if (hasFail) {
          dieGlowRef.current.color.setHex(0xff4444);
          dieGlowRef.current.intensity = 3;
        } else {
          dieGlowRef.current.color.setHex(0xffd060);
          dieGlowRef.current.intensity = 2;
        }
      }

      setIsRolling(false);

      if (onRollComplete) {
        setTimeout(() => onRollComplete(results), 200);
      }
    }

    if (activeDiceRef.current.length > 0 && dieGlowRef.current) {
      const avgPos = new THREE.Vector3();
      activeDiceRef.current.forEach(d => avgPos.add(d.diceObj.group.position));
      avgPos.divideScalar(activeDiceRef.current.length);
      dieGlowRef.current.position.copy(avgPos);
      dieGlowRef.current.position.y += 1.5;

      // Gentle camera drift toward the dice cluster. Stronger while the dice
      // fly (the tray follows the throw), relaxing once they have settled.
      const follow = physicsActiveRef.current ? 0.45 : 0.3;
      const desiredX = THREE.MathUtils.clamp(avgPos.x * follow, -1.4, 1.4);
      const desiredZ = THREE.MathUtils.clamp(avgPos.z * follow, -1.4, 1.4);
      const smooth = 1 - Math.pow(0.0015, dt);
      camTargetRef.current.x += (desiredX - camTargetRef.current.x) * smooth;
      camTargetRef.current.z += (desiredZ - camTargetRef.current.z) * smooth;
      camTargetRef.current.y = 0;
      camera.lookAt(camTargetRef.current);
    } else {
      // Ease back to center when idle.
      const smooth = 1 - Math.pow(0.02, dt);
      camTargetRef.current.x += (0 - camTargetRef.current.x) * smooth;
      camTargetRef.current.z += (0 - camTargetRef.current.z) * smooth;
      camera.lookAt(camTargetRef.current);
    }

    renderer.render(scene, camera);
  }, [diceToRoll, onRollComplete, getTopFaceInfo]);

  useEffect(() => {
    if (!isVisible) return;

    if (!rendererRef.current) {
      initScene();
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isVisible, initScene]);

  useEffect(() => {
    if (!isVisible) return;

    const container = containerRef.current;
    if (!container || !rendererRef.current) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    if (rendererRef.current.domElement.parentElement !== container) {
      container.appendChild(rendererRef.current.domElement);
    }

    rendererRef.current.setSize(w, h);
    if (cameraRef.current) {
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    }
    updateBounds(w, h);
  }, [isVisible, updateBounds]);

  useEffect(() => {
    if (!isVisible || diceToRoll.length === 0) return;
    // When a roll kicks off, snapshot the current rollContext from the
    // dice store so a Reroll can re-apply the same mode (advantage /
    // disadvantage / etc.) — finishRoll clears rollContext from the
    // store on completion, so we wouldn't otherwise know it on reroll.
    if (useDiceStore.getState().rollContext) {
      lastRollContextRef.current = useDiceStore.getState().rollContext;
    }
    throwAllDice();
  }, [isVisible, diceToRoll, throwAllDice]);

  useEffect(() => {
    if (!isVisible) return;
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isVisible, animate]);

  useEffect(() => {
    if (!isVisible) return;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      // LineMaterial needs the viewport resolution for its screen-space line widths.
      lineMaterialsRef.current.forEach((m) => m.resolution.set(w, h));
      updateBounds(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible, updateBounds]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      if (envMapRef.current) {
        envMapRef.current.dispose();
        envMapRef.current = null;
      }
      lineMaterialsRef.current.forEach((m) => m.dispose && m.dispose());
      lineMaterialsRef.current = [];
      disposeThemeBodyTextureCache();
      disposeCompositeBodyTextureCache();
      disposeMaterialSurfaces();
      disposeNumberTextureCache();
      disposeSurfaceTexturePool();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
      sceneRef.current = null;
      cameraRef.current = null;
      worldRef.current = null;
      animFrameRef.current = null;
    };
  }, []);

  // Dice REMAIN on the table after resolving — the user clicks them away.
  // No auto-dismiss: the only dismissal paths are a click anywhere on the
  // overlay (handled in the JSX below), the Dismiss button, or Esc/parent.
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, []);

  const formatResultDisplay = useCallback((value, type) => {
    if (type === 'd10' && value === 10) return '0';
    if (type === 'dpercent') return value.toString().padStart(2, '0');
    if (type === 'd100') return value.toString();
    return value.toString();
  }, []);

  return (
    <div
      className={`dice-3d-overlay ${isVisible ? 'visible' : ''} ${resultState && !isRolling ? 'clickable' : ''}`}
      onClick={(e) => {
        // Once the dice have settled, clicking anywhere on the table clears
        // them. Clicks on the result chip itself (Reroll/Dismiss buttons)
        // are excluded — they manage their own actions.
        if (resultState && !isRolling && onDismiss && !e.target.closest('.dice-3d-result-area')) {
          onDismiss();
        }
      }}
    >
      <div className="dice-3d-canvas-container" ref={containerRef} />

      {resultState && (
        <div className={`dice-3d-result-area ${skillOutcome ? skillOutcome.type : (resultState.hasCrit ? 'crit' : '')} ${!skillOutcome && resultState.hasFail ? 'fail' : ''} ${skillOutcome?.mode && skillOutcome.mode !== 'normal' ? `mode-${skillOutcome.mode}` : ''}`}>
          <div className={`dice-3d-result-number ${!skillOutcome && resultState.hasCrit ? 'nat20' : ''} ${!skillOutcome && resultState.hasFail ? 'nat1' : ''}`}>
            {skillOutcome?.chosenValue != null
              ? skillOutcome.chosenValue
              : resultState.results.length === 1
                ? formatResultDisplay(resultState.results[0].value, resultState.results[0].type)
                : resultState.total}
          </div>
          <div className="dice-3d-result-info">
            <div className="dice-3d-result-label-row">
              <span className="dice-3d-result-label">
                {skillOutcome ? skillOutcome.skillName.toUpperCase() : 'Result'}
              </span>
              {skillOutcome?.mode && skillOutcome.mode !== 'normal' && (
                <span
                  className={`dice-3d-mode-badge dice-3d-mode-${skillOutcome.mode}`}
                  title={{
                    'advantage': 'Advantage — kept the highest of 2 dice',
                    'disadvantage': 'Disadvantage — kept the lowest of 2 dice',
                    'double-advantage': 'Double Advantage — kept the highest of 3 dice',
                    'double-disadvantage': 'Double Disadvantage — kept the lowest of 3 dice',
                  }[skillOutcome.mode] || ''}
                >
                  {skillOutcome.mode === 'advantage' ? 'ADV' :
                   skillOutcome.mode === 'disadvantage' ? 'DIS' :
                   skillOutcome.mode === 'double-advantage' ? '2×ADV' :
                   skillOutcome.mode === 'double-disadvantage' ? '2×DIS' : ''}
                </span>
              )}
            </div>
            {(() => {
              if (skillOutcome) {
                if (!skillOutcome.flavor) return null;
                return <div className="dice-3d-result-flavor">{skillOutcome.flavor}</div>;
              }
              if (resultState.hasCrit) {
                return <div className="dice-3d-result-flavor nat20">MAXIMUM DAMAGE!</div>;
              }
              if (resultState.hasFail) {
                return <div className="dice-3d-result-flavor nat1">CRITICAL FAILURE.</div>;
              }
              return <div className="dice-3d-result-flavor">Total: {resultState.total}</div>;
            })()}
            {skillOutcome ? (
              <div className="dice-3d-result-breakdown">
                <span className="dice-3d-breakdown-item">{skillOutcome.message}</span>
              </div>
            ) : (
              resultState.results.length > 1 && (
                <div className="dice-3d-result-breakdown">
                  {resultState.results.map((r, i) => (
                    <span key={i} className="dice-3d-breakdown-item">
                      {r.type === 'd100'
                        ? `D100: ${r.percentileValue !== undefined ? String(r.percentileValue).padStart(2, '0') : ''}+${r.d10Value || 0} = ${r.value}`
                        : `${r.type.toUpperCase()}: ${formatResultDisplay(r.value, r.type)}`}
                    </span>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="dice-3d-result-actions">
            <button className="dice-3d-reroll-btn" onClick={(e) => {
              e.stopPropagation();
              // finishRoll() in the store clears rollContext after a roll
              // completes; re-apply the last context so the advantage math
              // runs on the reroll too.
              if (lastRollContextRef.current) {
                useDiceStore.setState({ rollContext: lastRollContextRef.current });
              }
              throwAllDice();
            }}>
              Reroll
            </button>
            <button className="dice-3d-close-btn" onClick={(e) => { e.stopPropagation(); onDismiss && onDismiss(); }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isRolling && !resultState && (
        <div className="dice-3d-rolling-text">Rolling...</div>
      )}
    </div>
  );
};

export default PhysicsDiceScene;
