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
import { applyDiceThemeShader, applyThemeFinish, hasShaderTheme, lightningEnvelope } from './diceThemeShaders';
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
  // Percentile die faces read 00, 10 … 90. The "10" face slot is the 00 face
  // (it used to be stamped "100", which also broke every d100 total).
  if (type === 'dpercent') displayNum = ((num % 10) * 10).toString().padStart(2, '0');

  const cx = size / 2;
  const cy = size / 2;

  // Soft dark medallion behind the number for readability on reflective faces
  const medallion = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.46);
  medallion.addColorStop(0, 'rgba(0,0,0,0.16)');
  medallion.addColorStop(0.7, 'rgba(0,0,0,0.06)');
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

// Per-theme number-plate tuning. (The die bodies themselves are drawn by
// diceThemeShaders.js; these only adjust the numerals on top.)
const THEME_MATERIAL_OVERRIDES = {
  frozen: {
    // Deep-blue numerals on pale ice: matte ink with barely any glow — a
    // metallic numeral mirrors the light and washes out on the top face.
    plateEmissiveIntensity: 0.08,
    plateMetalness: 0.0,
    plateRoughness: 0.7,
  },
  fiery: { plateEmissiveIntensity: 0.65 },
  storm: { plateEmissiveIntensity: 0.55 },
  dark: { plateEmissiveIntensity: 0.5 },
  nature: { plateEmissiveIntensity: 0.5 },
};

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
  // Every built-in theme is drawn live by a shader (diceThemeShaders.js);
  // a plain tinted body is only the fallback for an unknown theme.
  const shaderTheme = hasShaderTheme(preset?.id);

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
  const finalBodyColor = shaderTheme ? new THREE.Color('#ffffff') : bodyColor.clone().lerp(matTint, 0.65);
  const bodyMap = !shaderTheme && hasSurface ? getMaterialSurface(weightMat.id)?.tex || null : null;

  // Give a body material its living theme surface (diceThemeShaders.js).
  // The weight material still sets the finish within limits per theme.
  const finishBodyMaterial = (mat, mesh) => {
    if (!shaderTheme) return;
    const id = preset.id;
    applyThemeFinish(mat, id, wv);
    mesh.userData.themeUniforms = applyDiceThemeShader(mat, id, Math.random() * 50);
    if (id === 'storm') mesh.userData.storm = { start: -10, next: -1 };
  };

  const makeBodyMaterial = () => new THREE.MeshPhysicalMaterial({
    color: finalBodyColor,
    map: bodyMap,
    roughness: wv.roughness !== undefined ? wv.roughness : roughness,
    metalness: wv.metalness !== undefined ? wv.metalness : metalness,
    envMapIntensity: wv.envMapIntensity !== undefined
      ? wv.envMapIntensity
      : (ov.envMapIntensity !== undefined ? ov.envMapIntensity : 0.3),
    specularIntensity: 0.2,
    emissive: emissive,
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
        roughness: ov.plateRoughness ?? 0.35,
        metalness: ov.plateMetalness ?? 0.55,
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
    finishBodyMaterial(solidMat, mesh);
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
              : type === 'd20' ? 0.76
              : type === 'd12' ? 0.82
              : (type === 'd10' || type === 'dpercent') ? 0.66
              : 0.86;
    const numTex = createNumberTextureWithColor(side.num, type, numberColor);
    const plateMat = new THREE.MeshStandardMaterial({
      map: numTex,
      emissive: new THREE.Color(numberColor || '#dbb85c'),
      emissiveMap: numTex,
      emissiveIntensity: plateEmissiveIntensity,
      roughness: ov.plateRoughness ?? 0.35,
      metalness: ov.plateMetalness ?? 0.55,
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
  finishBodyMaterial(solidMat, mesh);
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
  onReroll,
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
  // Blue-white flash light that fires with each storm-die lightning strike.
  const stormLightRef = useRef(null);
  const [resultState, setResultState] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const groundBodyRef = useRef(null);
  const wallBodiesRef = useRef([]);
  const physicsMaterialRef = useRef(null);
  const contactMaterialRef = useRef(null);
  // Tray in world units. The top edge is pulled in so dice never come to rest
  // underneath the result chip (cz = tray centre offset toward the player).
  const boundsRef = useRef({ x: 10, z: 10, cz: 0 });
  const groundMeshRef = useRef(null);
  const envMapRef = useRef(null);
  const lineMaterialsRef = useRef([]);
  const dismissTimerRef = useRef(null);
  const lastRollContextRef = useRef(null);
  // Timestamp of the current throw — backs a hard settle deadline so a freak
  // spin-heavy rest can never hang the roll forever.
  const rollStartRef = useRef(0);
  // Simulated seconds since the throw. Settle deadlines run on this clock, not
  // wall time: on a slow frame rate physics runs slower than real time (dt is
  // capped), and a wall-clock deadline froze dice mid-air with a wrong read.
  const simTimeRef = useRef(0);

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

    // Long-lens, fixed top-down camera. A wide lens (44°) made dice near the
    // screen edge look tipped over and stretched — the camera saw them from
    // ~30° off to the side while the map underneath is flat. At 18° from far
    // away the view is near-orthographic: a die looks the same anywhere on
    // screen. The table area covered is unchanged (≈15.4u tall).
    // (It also used to drift toward the dice, which made settled dice slide
    // across the map underneath the overlay — it stays fixed.)
    const camera = new THREE.PerspectiveCamera(18, w / h, 1, 200);
    camera.position.set(0, 48.5, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0x404050, 0.45));

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.2);
    keyLight.position.set(4, 24, 6);
    keyLight.castShadow = enableShadows;

    let shadowMapSize = 1024;
    if (shadowQuality === 'low') shadowMapSize = 512;
    else if (shadowQuality === 'high') shadowMapSize = 2048;

    keyLight.shadow.mapSize.width = shadowMapSize;
    keyLight.shadow.mapSize.height = shadowMapSize;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 4;
    const d = 17;
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

    const stormLight = new THREE.PointLight(0xb8d4ff, 0, 14, 2);
    stormLightRef.current = stormLight;
    scene.add(stormLight);

    // Invisible ground plane: catches soft shadows so dice sit ON the table
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.ShadowMaterial({ color: 0x2a1d12, opacity: 0.26 });
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
    // Keep the result chip's band (top ~190px) out of the tray.
    const chipReserve = (Math.min(200, h * 0.42) / Math.max(1, h)) * visibleHeight;
    const minZ = -(visibleHeight / 2) + Math.max(1.5, chipReserve + 0.6);
    const maxZ = (visibleHeight / 2) - 1.5;
    const boundX = Math.max(2, (visibleWidth / 2) - 1.5);
    const boundZ = Math.max(2, (maxZ - minZ) / 2);
    const cz = (minZ + maxZ) / 2;
    boundsRef.current = { x: boundX, z: boundZ, cz };

    wallBodiesRef.current.forEach(b => world.removeBody(b));
    wallBodiesRef.current = [];
    const mat = physicsMaterialRef.current;

    const wallData = [
      { pos: [boundX, 0, 0], axis: [0, 1, 0], angle: -Math.PI / 2 },
      { pos: [-boundX, 0, 0], axis: [0, 1, 0], angle: Math.PI / 2 },
      { pos: [0, 0, cz + boundZ], axis: [0, 1, 0], angle: Math.PI },
      { pos: [0, 0, cz - boundZ], axis: [0, 1, 0], angle: 0 },
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

    const { x: boundX, z: boundZ, cz: trayCZ = 0 } = boundsRef.current;
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

      // Spawn/aim maths above is in tray-local coordinates; shift by the tray
      // centre (the tray sits a little low to stay clear of the result chip).
      body.position.set(spawnX, startY, spawnZ + trayCZ);
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
    simTimeRef.current = 0;
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
      return { num: topSide ? (topSide.num % 10) * 10 : 0, margin: bestDot - secondDot, side: topSide };
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
    // Cap at 0.1s (10 fps): below that physics would fall behind real time.
    const dt = Math.min(timerRef.current.getDelta(), 0.1);

    if (physicsActiveRef.current && activeDiceRef.current.length > 0) {
      // 120Hz fixed stepping: at DDB entry speeds (~28 u/s) a 60Hz step lets
      // dice sink 0.45u into contacts before resolving — mushy first strikes.
      // Halving the step keeps impacts crisp and die-die contacts exact.
      world.step(1 / 120, dt, 12);
      simTimeRef.current += dt;

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
        const tSinceThrow = simTimeRef.current * 1000; // simulated ms
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
            // Arrest cleanly and read the face the physics left on top. The
            // body stays in the world as a STATIC obstacle — removing it let
            // dice that were still rolling pass straight into it and end up
            // clipped together.
            die.body.velocity.setZero();
            die.body.angularVelocity.setZero();
            die.body.type = CANNON.Body.STATIC;
            die.body.mass = 0;
            die.body.updateMassProperties();
            die.body.aabbNeedsUpdate = true;
            // Show exactly the pose the result was read from (the interpolated
            // render pose can lag the body by a fraction of a step).
            die.diceObj.group.position.copy(die.body.position);
            die.diceObj.group.quaternion.copy(die.body.quaternion);
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

    // Living theme surfaces (time uniform) and storm strikes.
    const tNow = timerRef.current.getElapsed();
    let strike = 0;
    let strikeAt = null;
    activeDiceRef.current.forEach((die) => {
      const mesh = die.diceObj.bodyMesh;
      const u = mesh?.userData.themeUniforms;
      if (u) {
        u.uDiceTime.value = tNow;
        const storm = mesh.userData.storm;
        if (storm) {
          // Frequent strikes while tumbling, occasional rumbles once at rest.
          if (storm.next < 0) storm.next = tNow + 0.15 + Math.random() * 0.6;
          if (tNow >= storm.next) {
            storm.start = tNow;
            storm.next = tNow + (die.settled ? 2.2 + Math.random() * 3.5 : 0.6 + Math.random() * 0.9);
          }
          const f = lightningEnvelope(tNow - storm.start);
          u.uDiceFlash.value = f;
          if (f > strike) { strike = f; strikeAt = die.diceObj.group.position; }
        }
      }
    });
    if (stormLightRef.current) {
      stormLightRef.current.intensity = strike * 90;
      if (strikeAt) stormLightRef.current.position.set(strikeAt.x, strikeAt.y + 2.2, strikeAt.z);
    }

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
        // Tens die reads 00–90, units die reads 0–9 (its "0" face is 10).
        // 00 + 0 is 100; everything else is a plain sum → uniform 1–100.
        const pctVal = pair.percentile || 0;
        const units = (pair.d10 || 0) % 10;
        const total = pctVal + units;
        results.push({
          id: `d100_${i}`,
          type: 'd100',
          value: total === 0 ? 100 : total,
          percentileValue: pctVal,
          d10Value: units,
        });
      });

      const total = results.reduce((sum, r) => sum + r.value, 0);
      // "MAXIMUM DAMAGE" / "CRITICAL FAILURE" labels are only accurate when
      // EVERY die in the pool hit its extreme. For a single die, that's its
      // own max/min; for multi-die pools, ALL dice need to be max/min
      // (e.g. 3d4=12 for max damage, 3d4=3 for min). Per-die max for 3d4
      // would say "MAXIMUM DAMAGE" for any total ≥ 4, which is wrong.
      // A standalone D% has no meaningful "max/min" (00–90 tens die), so it
      // never triggers the highlight.
      const maxValues = results.map(r => {
        if (r.type === 'd100') return 100;
        if (r.type === 'dpercent') return null;
        return parseInt(r.type.replace('d', ''), 10) || null;
      });
      const minValues = results.map(r => (r.type === 'dpercent' ? null : 1));
      const allMaxed = results.length > 0 && results.every((r, i) => maxValues[i] != null && r.value === maxValues[i]);
      const allMinned = results.length > 0 && results.every((r, i) => minValues[i] != null && r.value === minValues[i]);
      const hasCrit = allMaxed;
      const hasFail = allMinned;

      setResultState({ results, total, hasCrit, hasFail });

      if (dieGlowRef.current) {
        // A soft warm lift over the result. Kept low: stronger, it greyed out
        // the winning face of dark dice (obsidian, void, storm).
        if (hasCrit) {
          dieGlowRef.current.color.setHex(0x9fe0a8);
          dieGlowRef.current.intensity = 2;
        } else if (hasFail) {
          dieGlowRef.current.color.setHex(0xe08a7a);
          dieGlowRef.current.intensity = 1.2;
        } else {
          dieGlowRef.current.color.setHex(0xffd060);
          dieGlowRef.current.intensity = 0.8;
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
    }

    renderer.render(scene, camera);
  }, [diceToRoll, onRollComplete, getTopFaceInfo]);

  useEffect(() => {
    if (!isVisible) {
      // Drop the previous result so it can't flash up at the start of the
      // next roll before the new throw clears it.
      setResultState(null);
      setIsRolling(false);
      return;
    }

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
    lastRollContextRef.current = useDiceStore.getState().rollContext || null;
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

  // A d10's "0" face is worth 10, so it is shown as 10 here (the chip used to
  // say "0" while the total and chat said 10). Only the D% keeps two digits.
  const formatResultDisplay = useCallback((value, type) => {
    if (type === 'dpercent') return value.toString().padStart(2, '0');
    return value.toString();
  }, []);

  const dieLabel = (type) => (type === 'dpercent' ? 'D%' : String(type).toUpperCase());

  // "1d20 + 2d6" — what was rolled, shown under the total for plain rolls.
  const rollFormula = (results) => {
    const counts = [];
    results.forEach((r) => {
      const entry = counts.find((c) => c.type === r.type);
      if (entry) entry.n += 1; else counts.push({ type: r.type, n: 1 });
    });
    return counts.map((c) => `${c.n}${c.type === 'dpercent' ? 'd%' : c.type}`).join(' + ');
  };

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

      {resultState && (() => {
        const single = resultState.results.length === 1;
        const first = resultState.results[0];
        const modeLabel = {
          'advantage': 'ADV',
          'disadvantage': 'DIS',
          'double-advantage': '2×ADV',
          'double-disadvantage': '2×DIS',
        }[skillOutcome?.mode] || '';
        let flavor = null;
        if (skillOutcome) {
          flavor = skillOutcome.flavor ? { text: skillOutcome.flavor, tone: '' } : null;
        } else if (resultState.hasCrit) {
          flavor = { text: single ? `Natural ${first.value}` : 'Every die maxed', tone: 'nat20' };
        } else if (resultState.hasFail) {
          flavor = { text: single ? 'Natural 1' : 'All ones', tone: 'nat1' };
        }
        return (
          <div
            className={`dice-3d-result-area ${skillOutcome ? skillOutcome.type : (resultState.hasCrit ? 'crit' : '')} ${!skillOutcome && resultState.hasFail ? 'fail' : ''} ${skillOutcome?.mode && skillOutcome.mode !== 'normal' ? `mode-${skillOutcome.mode}` : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`dice-3d-result-number ${!skillOutcome && resultState.hasCrit ? 'nat20' : ''} ${!skillOutcome && resultState.hasFail ? 'nat1' : ''}`}>
              {skillOutcome?.chosenValue != null
                ? skillOutcome.chosenValue
                : single
                  ? formatResultDisplay(first.value, first.type)
                  : resultState.total}
            </div>
            <div className="dice-3d-result-info">
              <div className="dice-3d-result-label-row">
                <span className="dice-3d-result-label">
                  {skillOutcome ? skillOutcome.skillName : rollFormula(resultState.results)}
                </span>
                {modeLabel && (
                  <span
                    className={`dice-3d-mode-badge dice-3d-mode-${skillOutcome.mode}`}
                    title={{
                      'advantage': 'Advantage — kept the highest of 2 dice',
                      'disadvantage': 'Disadvantage — kept the lowest of 2 dice',
                      'double-advantage': 'Double Advantage — kept the highest of 3 dice',
                      'double-disadvantage': 'Double Disadvantage — kept the lowest of 3 dice',
                    }[skillOutcome.mode] || ''}
                  >
                    {modeLabel}
                  </span>
                )}
              </div>
              {flavor && <div className={`dice-3d-result-flavor ${flavor.tone}`}>{flavor.text}</div>}
              {skillOutcome ? (
                <div className="dice-3d-result-breakdown">
                  <span className="dice-3d-breakdown-item">{skillOutcome.message}</span>
                </div>
              ) : (
                (resultState.results.length > 1 || first.type === 'd100') && (
                  <div className="dice-3d-result-breakdown">
                    {resultState.results.map((r, i) => (
                      <span key={i} className="dice-3d-breakdown-item">
                        {r.type === 'd100'
                          ? `D100: ${String(r.percentileValue ?? 0).padStart(2, '0')} + ${r.d10Value ?? 0}`
                          : `${dieLabel(r.type)}: ${formatResultDisplay(r.value, r.type)}`}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
            <div className="dice-3d-result-actions">
              <button type="button" className="dice-3d-reroll-btn" onClick={(e) => {
                e.stopPropagation();
                // Rerolls go through the store (same dice + same context) so the
                // roll is tracked like any other: rolling state, safety timeout,
                // history, chat and multiplayer sync.
                if (onReroll) {
                  onReroll();
                  return;
                }
                if (lastRollContextRef.current) {
                  useDiceStore.setState({ rollContext: lastRollContextRef.current });
                }
                throwAllDice();
              }}>
                Reroll
              </button>
              <button type="button" className="dice-3d-close-btn" onClick={(e) => { e.stopPropagation(); onDismiss && onDismiss(); }}>
                Dismiss
              </button>
            </div>
          </div>
        );
      })()}

      {isRolling && !resultState && (
        <div className="dice-3d-rolling-text">Rolling...</div>
      )}
    </div>
  );
};

export default PhysicsDiceScene;
