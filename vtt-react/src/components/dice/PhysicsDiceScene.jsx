import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import * as CANNON from 'cannon-es';
import useDiceStore, { DICE_PRESETS } from '../../store/diceStore';
import useSettingsStore from '../../store/settingsStore';
import { useAdaptivePerformance } from '../../hooks/useAdaptivePerformance';
import './PhysicsDiceScene.css';

const FONT = "'Cinzel', 'Times New Roman', serif";

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
    // Base: charred basalt.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#241109');
    base.addColorStop(0.5, '#180a05');
    base.addColorStop(1, '#0e0503');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Magma crack network — glowing on the emissive pass.
    const paths = generateCrackPaths(size, 11, { straightness: 0.45, steps: 26, branchChance: 0.3, maxDepth: 3 });
    strokePaths(aCtx, paths, 3.2, (c) => { c.strokeStyle = 'rgba(255,120,30,0.85)'; c.stroke(); }, size);
    strokePaths(aCtx, paths, 1.2, (c) => { c.strokeStyle = 'rgba(255,220,120,0.9)'; c.stroke(); }, size);
    eCtx.shadowColor = 'rgba(255,120,20,0.9)';
    eCtx.shadowBlur = 6;
    strokePaths(eCtx, paths, 2.0, (c) => { c.strokeStyle = 'rgba(255,150,50,0.95)'; c.stroke(); }, size);
    strokePaths(eCtx, paths, 0.8, (c) => { c.strokeStyle = 'rgba(255,235,160,0.9)'; c.stroke(); }, size);
    eCtx.shadowBlur = 0;
    // Ember pores.
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * size, y = Math.random() * size, r = 0.8 + Math.random() * 1.8;
      eCtx.fillStyle = 'rgba(255,140,50,0.75)';
      eCtx.beginPath(); eCtx.arc(x, y, r, 0, Math.PI * 2); eCtx.fill();
    }
  } else if (themeId === 'storm') {
    // Base: dark storm slate.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#232a4e');
    base.addColorStop(0.5, '#161c38');
    base.addColorStop(1, '#0d1126');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Lichtenberg filaments — thin, heavily branched.
    const paths = generateCrackPaths(size, 13, { straightness: 0.6, steps: 20, branchChance: 0.45, maxDepth: 3 });
    strokePaths(aCtx, paths, 1.4, (c) => { c.strokeStyle = 'rgba(190,215,255,0.75)'; c.stroke(); }, size);
    eCtx.shadowColor = 'rgba(150,190,255,0.9)';
    eCtx.shadowBlur = 5;
    strokePaths(eCtx, paths, 1.1, (c) => { c.strokeStyle = 'rgba(210,230,255,0.95)'; c.stroke(); }, size);
    eCtx.shadowBlur = 0;
    // Discharge glints.
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      eCtx.fillStyle = 'rgba(230,240,255,0.85)';
      eCtx.fillRect(x, y, 1.6, 1.6);
    }
  } else if (themeId === 'dark') {
    // Base: deep void purple-black.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#1c0f33');
    base.addColorStop(0.5, '#120826');
    base.addColorStop(1, '#0a0418');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Nebula clouds.
    for (let i = 0; i < 7; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 80 + Math.random() * 140, 'rgba(96,44,160,ALPHA)', 0.3);
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 40 + Math.random() * 80, 'rgba(150,80,220,ALPHA)', 0.16);
    }
    // Pinprick stars — the only emissive feature.
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const r = Math.random() < 0.12 ? 1.8 : 0.9;
      eCtx.fillStyle = Math.random() < 0.2 ? 'rgba(200,160,255,0.95)' : 'rgba(235,225,255,0.8)';
      eCtx.beginPath(); eCtx.arc(x, y, r, 0, Math.PI * 2); eCtx.fill();
      aCtx.fillStyle = 'rgba(220,210,255,0.35)';
      aCtx.beginPath(); eCtx.arc(x, y, r * 0.8, 0, Math.PI * 2); aCtx.fill();
    }
    // One faint sigil ring for identity.
    aCtx.strokeStyle = 'rgba(150,90,220,0.35)';
    aCtx.lineWidth = 2;
    aCtx.beginPath(); aCtx.arc(size / 2, size / 2, 150, 0, Math.PI * 2); aCtx.stroke();
  } else if (themeId === 'nature') {
    // Base: dark heartwood.
    const base = aCtx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, '#2e2413');
    base.addColorStop(0.5, '#201a0e');
    base.addColorStop(1, '#141008');
    aCtx.fillStyle = base;
    aCtx.fillRect(0, 0, size, size);
    // Wavy wood grain arcs.
    aCtx.lineWidth = 1.6;
    for (let g = 0; g < 26; g++) {
      const y0 = (g / 26) * size + (Math.random() - 0.5) * 12;
      aCtx.strokeStyle = `rgba(${120 + Math.random() * 40 | 0},${95 + Math.random() * 30 | 0},55,${0.22 + Math.random() * 0.18})`;
      aCtx.beginPath();
      for (let x = 0; x <= size; x += 16) {
        const y = y0 + Math.sin((x / size) * Math.PI * (2 + g % 3) + g) * 9;
        if (x === 0) aCtx.moveTo(x, y); else aCtx.lineTo(x, y);
      }
      aCtx.stroke();
    }
    // Moss patches.
    for (let i = 0; i < 8; i++) {
      paintNebulaBlob(aCtx, Math.random() * size, Math.random() * size, 30 + Math.random() * 70, 'rgba(74,128,52,ALPHA)', 0.3);
    }
    // Glowing spores.
    for (let i = 0; i < 45; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      eCtx.fillStyle = 'rgba(150,240,130,0.7)';
      eCtx.beginPath(); eCtx.arc(x, y, 0.9 + Math.random() * 1.2, 0, Math.PI * 2); eCtx.fill();
    }
    // A vein of raw green sap.
    const sapPath = generateCrackPaths(size, 3, { straightness: 0.7, steps: 18, branchChance: 0.2, maxDepth: 1 });
    strokePaths(aCtx, sapPath, 1.8, (c) => { c.strokeStyle = 'rgba(120,200,90,0.55)'; c.stroke(); }, size);
    strokePaths(eCtx, sapPath, 1.1, (c) => { c.strokeStyle = 'rgba(140,255,110,0.5)'; c.stroke(); }, size);
  } else {
    return { map: null, emissiveMap: null };
  }

  const map = new THREE.CanvasTexture(albedo);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const emissiveMap = new THREE.CanvasTexture(emissive);
  emissiveMap.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.anisotropy = 4;
  return { map, emissiveMap };
}

// Per-preset cache so every die in a set shares the same particle texture
// (saves ~2-3ms per die and 2MB per die of GPU memory).
const particleTextureCache = new Map();
function getParticleTexture(effect) {
  let tex = particleTextureCache.get(effect);
  if (!tex) {
    tex = createParticleTexture(effect);
    particleTextureCache.set(effect, tex);
  }
  return tex;
}
function disposeParticleTextureCache() {
  particleTextureCache.forEach((t) => t.dispose());
  particleTextureCache.clear();
}

// Procedural point-sprite texture for the die's inner/outer particles. The
// previous version used bare PointsMaterial which renders as a flat square
// quad (sized to the point), so every preset looked like "colored squares
// floating around the die". Now each preset's effect has a real sprite
// drawn at 128px: a soft circular halo plus a themed foreground shape:
//   frost      -> 6-pointed snowflake
//   fire       -> teardrop flame
//   lightning  -> 4-pointed spark
//   void       -> dark orb with purple rim
//   nature     -> sparkle + small leaf
// Returns a 128x128 CanvasTexture with a soft alpha falloff for blending.
function createParticleTexture(effect) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  // Soft circular base — universal halo behind every themed shape.
  const base = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  base.addColorStop(0.00, 'rgba(255,255,255,1)');
  base.addColorStop(0.25, 'rgba(255,255,255,0.7)');
  base.addColorStop(0.60, 'rgba(255,255,255,0.2)');
  base.addColorStop(1.00, 'rgba(255,255,255,0)');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (effect === 'frost') {
    // 6-pointed snowflake with barbs.
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const tipX = cx + Math.cos(a) * 32;
      const tipY = cy + Math.sin(a) * 32;
      const midX = cx + Math.cos(a) * 18;
      const midY = cy + Math.sin(a) * 18;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      // Barbs branching off the middle of each arm.
      const barbLen = 9;
      for (const sign of [-1, 1]) {
        const ax = midX + Math.cos(a + sign * Math.PI / 3) * barbLen;
        const ay = midY + Math.sin(a + sign * Math.PI / 3) * barbLen;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(ax, ay);
        ctx.stroke();
      }
    }
    // Tiny center dot.
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (effect === 'fire') {
    // Teardrop flame with bright center, warm outer falloff.
    const flame = ctx.createRadialGradient(cx, cy + 6, 0, cx, cy + 6, 38);
    flame.addColorStop(0.0, 'rgba(255,255,220,1)');
    flame.addColorStop(0.35, 'rgba(255,190,90,0.85)');
    flame.addColorStop(0.7, 'rgba(255,110,40,0.5)');
    flame.addColorStop(1.0, 'rgba(220,40,10,0)');
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 32);
    ctx.bezierCurveTo(cx + 22, cy - 8, cx + 20, cy + 20, cx, cy + 30);
    ctx.bezierCurveTo(cx - 20, cy + 20, cx - 22, cy - 8, cx, cy - 32);
    ctx.closePath();
    ctx.fill();
  } else if (effect === 'lightning') {
    // 4-pointed spark/star with long arms.
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 34);
    ctx.lineTo(cx + 7, cy - 7);
    ctx.lineTo(cx + 34, cy);
    ctx.lineTo(cx + 7, cy + 7);
    ctx.lineTo(cx, cy + 34);
    ctx.lineTo(cx - 7, cy + 7);
    ctx.lineTo(cx - 34, cy);
    ctx.lineTo(cx - 7, cy - 7);
    ctx.closePath();
    ctx.fill();
  } else if (effect === 'void') {
    // Dark orb with purple rim glow.
    const orb = ctx.createRadialGradient(cx, cy, 4, cx, cy, 32);
    orb.addColorStop(0.00, 'rgba(35,18,55,1)');
    orb.addColorStop(0.45, 'rgba(60,30,85,0.95)');
    orb.addColorStop(0.70, 'rgba(120,60,170,0.7)');
    orb.addColorStop(0.90, 'rgba(180,110,230,0.35)');
    orb.addColorStop(1.00, 'rgba(120,60,170,0)');
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
  } else if (effect === 'nature') {
    // 4-pointed sparkle with a small leaf accent.
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 28);
    ctx.lineTo(cx + 9, cy - 9);
    ctx.lineTo(cx + 28, cy);
    ctx.lineTo(cx + 9, cy + 9);
    ctx.lineTo(cx, cy + 28);
    ctx.lineTo(cx - 9, cy + 9);
    ctx.lineTo(cx - 28, cy);
    ctx.lineTo(cx - 9, cy - 9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(180,240,130,0.75)';
    ctx.beginPath();
    ctx.ellipse(cx + 2, cy + 2, 5, 11, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Generic soft dot for unknown effects.
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
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

function createInnerParticles(preset, innerColor, spriteTexture) {
  if (!preset || !preset.innerEffect) return null;

  const effect = preset.innerEffect;
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const lifetimes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    lifetimes[i] = Math.random();

    let vy = 0, vx = 0, vz = 0;
    switch (effect) {
      case 'fire':
        vy = 0.5 + Math.random() * 0.8;
        vx = (Math.random() - 0.5) * 0.2;
        vz = (Math.random() - 0.5) * 0.2;
        break;
      case 'frost':
        const fa = Math.random() * Math.PI * 2;
        const fr = 0.1 + Math.random() * 0.3;
        vx = Math.cos(fa) * fr;
        vz = Math.sin(fa) * fr;
        vy = (Math.random() - 0.5) * 0.15;
        break;
      case 'void':
        const va = Math.random() * Math.PI * 2;
        const rad = 0.3 + Math.random() * 0.5;
        vx = Math.cos(va) * rad;
        vz = Math.sin(va) * rad;
        vy = (Math.random() - 0.5) * 0.2;
        break;
      case 'nature':
        vy = 0.1 + Math.random() * 0.3;
        vx = (Math.random() - 0.5) * 0.2;
        vz = (Math.random() - 0.5) * 0.2;
        break;
      case 'lightning':
        vy = (Math.random() - 0.5) * 0.6;
        vx = (Math.random() - 0.5) * 0.6;
        vz = (Math.random() - 0.5) * 0.6;
        break;
      default:
        vy = (Math.random() - 0.5) * 0.2;
        vx = (Math.random() - 0.5) * 0.2;
        vz = (Math.random() - 0.5) * 0.2;
    }
    velocities.push({ x: vx, y: vy, z: vz });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Dark-colored effects (frost blue, void purple) need NormalBlending on
  // the light parchment table — additive of dark on light is barely visible.
  // Everything else uses AdditiveBlending so the shapes glow.
  const useNormal = effect === 'frost' || effect === 'void';
  const materialColor = useNormal
    ? new THREE.Color('#ffffff')
    : new THREE.Color(innerColor || '#ffffff');

  const material = new THREE.PointsMaterial({
    color: materialColor,
    size: 0.20,
    map: spriteTexture || null,
    transparent: true,
    opacity: useNormal ? 0.75 : 0.9,
    blending: useNormal ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.userData = { velocities, lifetimes, effect, spriteTexture };

  return points;
}

function updateInnerParticles(particles, dt) {
  if (!particles) return;
  const positions = particles.geometry.attributes.position.array;
  const { velocities, lifetimes, effect } = particles.userData;
  const count = lifetimes.length;

  const speeds = { fire: 2.0, lightning: 4.0, frost: 1.2, void: 1.0, nature: 0.9 };
  const speed = speeds[effect] || 0.8;

  for (let i = 0; i < count; i++) {
    lifetimes[i] += dt * speed;

    if (lifetimes[i] > 1.0) {
      lifetimes[i] = 0;
      positions[i * 3] = (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      if (effect === 'fire') positions[i * 3 + 1] = -0.4;
    }

    positions[i * 3] += velocities[i].x * dt;
    positions[i * 3 + 1] += velocities[i].y * dt;
    positions[i * 3 + 2] += velocities[i].z * dt;

    const boundary = 0.5;
    if (Math.abs(positions[i * 3]) > boundary) positions[i * 3] *= 0.9;
    if (Math.abs(positions[i * 3 + 1]) > boundary) positions[i * 3 + 1] *= 0.9;
    if (Math.abs(positions[i * 3 + 2]) > boundary) positions[i * 3 + 2] *= 0.9;
  }

  particles.geometry.attributes.position.needsUpdate = true;

  if (effect === 'lightning' && Math.random() < 0.12) {
    particles.material.opacity = 1.0;
    particles.material.size = 0.26;
  } else if (effect === 'fire' && Math.random() < 0.15) {
    particles.material.opacity = 1.0;
    particles.material.size = 0.30;
  } else {
    particles.material.opacity += (0.85 - particles.material.opacity) * dt * 5;
    particles.material.size += (0.20 - particles.material.size) * dt * 5;
  }
}

function createOuterParticles(preset, spriteTexture) {
  if (!preset || !preset.outerEffect) return null;

  const effect = preset.outerEffect;
  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = [];
  const lifetimes = new Float32Array(particleCount);
  const maxLifetimes = new Float32Array(particleCount);

  const baseColor = new THREE.Color(preset.outerColor || '#ffffff');
  const altColor = new THREE.Color(preset.innerColor || preset.outerColor || '#ffffff');

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 0.9 + Math.random() * 0.3;
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.cos(phi) * r;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;

    const mix = Math.random();
    const c = baseColor.clone().lerp(altColor, mix);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    lifetimes[i] = Math.random();
    maxLifetimes[i] = 0.3 + Math.random() * 1.2;

    let vx = 0, vy = 0, vz = 0;
    switch (effect) {
      case 'lightning':
        vx = (Math.random() - 0.5) * 4.0;
        vy = (Math.random() - 0.5) * 4.0;
        vz = (Math.random() - 0.5) * 4.0;
        maxLifetimes[i] = 0.15 + Math.random() * 0.4;
        break;
      case 'fire':
        vy = 2.0 + Math.random() * 3.0;
        vx = (Math.random() - 0.5) * 1.5;
        vz = (Math.random() - 0.5) * 1.5;
        maxLifetimes[i] = 0.3 + Math.random() * 0.8;
        break;
      case 'frost':
        const fa = Math.random() * Math.PI * 2;
        const fr = 1.0 + Math.random() * 2.5;
        vx = Math.cos(fa) * fr;
        vz = Math.sin(fa) * fr;
        vy = (Math.random() - 0.5) * 0.8;
        maxLifetimes[i] = 0.4 + Math.random() * 1.0;
        break;
      case 'void':
        const va = Math.random() * Math.PI * 2;
        const vr = 0.3 + Math.random() * 0.6;
        vx = Math.cos(va) * vr;
        vz = Math.sin(va) * vr;
        vy = (Math.random() - 0.5) * 0.4;
        maxLifetimes[i] = 0.8 + Math.random() * 2.0;
        break;
      case 'nature':
        vy = 0.5 + Math.random() * 1.0;
        vx = (Math.random() - 0.5) * 0.6;
        vz = (Math.random() - 0.5) * 0.6;
        maxLifetimes[i] = 0.6 + Math.random() * 1.5;
        break;
      default:
        vx = (Math.random() - 0.5) * 0.5;
        vy = (Math.random() - 0.5) * 0.5;
        vz = (Math.random() - 0.5) * 0.5;
    }
    velocities.push({ x: vx, y: vy, z: vz });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Per-preset sized so each themed shape is clearly readable on the
  // parchment table. Particles drift just outside the die so they're not
  // occluded by the body.
  const sizeByEffect = {
    frost: 0.32,
    fire: 0.30,
    lightning: 0.22,
    void: 0.26,
    nature: 0.26,
  };

  // Particles with dark colors (frost blue, void purple) don't read well
  // additively on the light parchment table — additive of dark on light is
  // barely visible. Switch them to NormalBlending so the dark colors
  // actually paint over the background.
  const useNormal = effect === 'frost' || effect === 'void';

  const material = new THREE.PointsMaterial({
    size: sizeByEffect[effect] || 0.24,
    color: 0xffffff,
    map: spriteTexture || null,
    transparent: true,
    opacity: useNormal ? 0.85 : 0.95,
    blending: useNormal ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  points.userData = { velocities, lifetimes, maxLifetimes, effect, spriteTexture };
  return points;
}

function updateOuterParticles(particles, dt) {
  if (!particles) return;
  const positions = particles.geometry.attributes.position.array;
  const { velocities, lifetimes, maxLifetimes, effect } = particles.userData;
  const count = lifetimes.length;

  for (let i = 0; i < count; i++) {
    lifetimes[i] += dt / maxLifetimes[i];

    if (lifetimes[i] > 1.0) {
      lifetimes[i] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.85 + Math.random() * 0.2;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.cos(phi) * r;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }

    positions[i * 3] += velocities[i].x * dt;
    positions[i * 3 + 1] += velocities[i].y * dt;
    positions[i * 3 + 2] += velocities[i].z * dt;
  }

  particles.geometry.attributes.position.needsUpdate = true;

  if (effect === 'lightning') {
    if (Math.random() < 0.18) {
      particles.material.opacity = 1.0;
      particles.material.size = 0.32;
    } else {
      particles.material.opacity += (0.8 - particles.material.opacity) * dt * 8;
      particles.material.size += (0.22 - particles.material.size) * dt * 8;
    }
  } else if (effect === 'fire') {
    if (Math.random() < 0.1) {
      particles.material.opacity = 1.0;
      particles.material.size = 0.34;
    } else {
      particles.material.opacity += (0.9 - particles.material.opacity) * dt * 4;
      particles.material.size += (0.26 - particles.material.size) * dt * 4;
    }
  } else if (effect === 'frost') {
    if (Math.random() < 0.06) {
      particles.material.opacity = 1.0;
      particles.material.size = 0.34;
    } else {
      particles.material.opacity += (0.85 - particles.material.opacity) * dt * 3;
      particles.material.size += (0.28 - particles.material.size) * dt * 3;
    }
  } else if (effect === 'void') {
    particles.material.opacity += (0.95 - particles.material.opacity) * dt * 2;
    particles.material.size += (0.26 - particles.material.size) * dt * 2;
  } else if (effect === 'nature') {
    particles.material.opacity += (0.9 - particles.material.opacity) * dt * 3;
    particles.material.size += (0.26 - particles.material.size) * dt * 3;
  }
}

function createGlowAura(preset) {
  // Disabled: the additive aura sphere was designed for the old dark void
  // backdrop. On the real (light) table it renders as a hazy halo blob.
  return null;
}

function updateGlowAura(glow, dt, time) {
  if (!glow) return;
  const { baseOpacity, phase, effect } = glow.userData;

  let pulseSpeed = 2.0;
  let pulseAmount = 0.15;
  let scaleBase = 1.0;

  if (effect === 'lightning') {
    pulseSpeed = 10.0;
    pulseAmount = 0.5;
    scaleBase = 1.0;
    if (Math.random() < 0.1) {
      glow.material.opacity = baseOpacity * 3.0;
      glow.scale.setScalar(1.4);
      return;
    }
  } else if (effect === 'fire') {
    pulseSpeed = 5.0;
    pulseAmount = 0.35;
    scaleBase = 1.0 + Math.sin(time * 6 + phase) * 0.12;
  } else if (effect === 'void') {
    pulseSpeed = 2.0;
    pulseAmount = 0.3;
    scaleBase = 1.0 + Math.sin(time * 2 + phase) * 0.2;
  } else if (effect === 'frost') {
    pulseSpeed = 3.0;
    pulseAmount = 0.25;
    scaleBase = 1.0 + Math.sin(time * 4 + phase) * 0.1;
  } else if (effect === 'nature') {
    pulseSpeed = 2.5;
    pulseAmount = 0.2;
    scaleBase = 1.0 + Math.sin(time * 3 + phase) * 0.1;
  }

  const pulse = Math.sin(time * pulseSpeed + phase) * pulseAmount;
  glow.material.opacity = baseOpacity + pulse;
  glow.scale.setScalar(scaleBase);
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
    emissiveIntensityMul: 1.5,
    plateEmissiveIntensity: 0.65,
    bodyFlicker: 'fire',
  },
  storm: {
    clearcoat: 0.9, clearcoatRoughness: 0.15,
    envMapIntensity: 0.8,
    emissiveIntensityMul: 1.25,
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

// Per-die themed point light — makes frost dice cast icy light on the table
// and fire dice glow like embers. Only attached for themed presets (classic
// stays clean) and capped by dice count in throwAllDice.
function createThemeLight(preset) {
  if (!preset || !preset.innerEffect) return null;
  const conf = {
    frost: { color: 0x6fc3ff, intensity: 1.5, distance: 5.5 },
    fire: { color: 0xff6622, intensity: 2.4, distance: 6 },
    void: { color: 0x9944dd, intensity: 1.6, distance: 5 },
    lightning: { color: 0x88aaff, intensity: 1.8, distance: 5.5 },
    nature: { color: 0x66cc55, intensity: 1.1, distance: 4.5 },
  }[preset.innerEffect];
  if (!conf) return null;
  const light = new THREE.PointLight(conf.color, conf.intensity, conf.distance);
  light.position.set(0, 0.9, 0);
  light.userData = { effect: preset.innerEffect, baseIntensity: conf.intensity, phase: Math.random() * Math.PI * 2 };
  return light;
}

function updateThemeLight(light, time) {
  const { effect, baseIntensity, phase } = light.userData;
  if (effect === 'fire') {
    light.intensity = baseIntensity * (0.8 + 0.25 * Math.sin(time * 8.3 + phase) + 0.12 * Math.sin(time * 13.7 + phase * 2));
  } else if (effect === 'lightning') {
    const burst = Math.sin(time * 11.0 + phase) * Math.sin(time * 2.3 + 1.0);
    light.intensity = baseIntensity * (0.5 + 1.1 * Math.max(0, burst));
  } else if (effect === 'frost') {
    light.intensity = baseIntensity * (0.85 + 0.15 * Math.sin(time * 1.8 + phase));
  } else if (effect === 'void') {
    light.intensity = baseIntensity * (0.8 + 0.3 * Math.sin(time * 2.2 + phase));
  } else if (effect === 'nature') {
    light.intensity = baseIntensity * (0.85 + 0.15 * Math.sin(time * 2.6 + phase));
  }
}

// Animated emissive on the die body — a molten flicker for fire, a slow icy
// shimmer for frost, crackling surges for storm.
function updateBodyFlicker(mesh, time) {
  const base = mesh.userData.baseEmissiveIntensity;
  const mode = mesh.userData.bodyFlicker;
  if (mode === 'fire') {
    mesh.material.emissiveIntensity = base * (0.8 + 0.24 * Math.sin(time * 8.3 + 1.7) + 0.12 * Math.sin(time * 13.7));
  } else if (mode === 'frost') {
    mesh.material.emissiveIntensity = base * (0.9 + 0.1 * Math.sin(time * 1.8));
  } else if (mode === 'storm') {
    const burst = Math.sin(time * 11.0) * Math.sin(time * 2.3 + 1.0);
    mesh.material.emissiveIntensity = base * (0.85 + 0.4 * Math.max(0, burst));
  }
}

// Themed ground ring — a soft decal under each die that anchors the element
// on the table: frost gets an ice rime ring, fire an ember scorch, void a
// dark sigil, storm an electric halo, nature a mossy ring.
const groundRingTextureCache = new Map();
function getGroundRingTexture(effect) {
  let tex = groundRingTextureCache.get(effect);
  if (!tex) {
    tex = createGroundRingTexture(effect);
    groundRingTextureCache.set(effect, tex);
  }
  return tex;
}

function createGroundRingTexture(effect) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.42;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (effect === 'frost') {
    // Ice rime: crystalline ring with radial spikes and a cold inner sheen.
    const inner = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
    inner.addColorStop(0, 'rgba(140,200,255,0.30)');
    inner.addColorStop(0.8, 'rgba(150,210,255,0.10)');
    inner.addColorStop(1, 'rgba(150,210,255,0)');
    ctx.fillStyle = inner;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = 'rgba(190,230,255,0.85)';
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2); ctx.stroke();

    ctx.strokeStyle = 'rgba(210,240,255,0.7)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r1 = R * 0.95;
      const r2 = R * 1.12;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
      // small barbs
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * ((r1 + r2) / 2), cy + Math.sin(a) * ((r1 + r2) / 2));
        ctx.lineTo(cx + Math.cos(a + s * 0.5) * r2, cy + Math.sin(a + s * 0.5) * r2);
        ctx.stroke();
      }
    }
  } else if (effect === 'fire') {
    // Ember scorch: warm glow ring with rising sparks.
    const glow = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
    glow.addColorStop(0, 'rgba(255,120,30,0.35)');
    glow.addColorStop(0.75, 'rgba(255,80,10,0.12)');
    glow.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = 'rgba(255,150,60,0.9)';
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.88, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = 'rgba(255,200,90,0.9)';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + 0.2;
      const r = R * (0.55 + Math.random() * 0.35);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (effect === 'lightning') {
    // Electric halo: double thin rings with radial discharge ticks.
    ctx.strokeStyle = 'rgba(150,190,255,0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(200,225,255,0.75)';
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 3;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.72, cy + Math.sin(a) * R * 0.72);
      ctx.lineTo(cx + Math.cos(a + 0.12) * R * 1.0, cy + Math.sin(a + 0.12) * R * 1.0);
      ctx.stroke();
    }
  } else if (effect === 'void') {
    // Dark sigil: heavy dark ring with a purple rim (NormalBlending paints
    // over the light parchment table).
    ctx.strokeStyle = 'rgba(25,10,45,0.85)';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.86, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(150,80,220,0.8)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.86, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,60,190,0.55)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.3, cy + Math.sin(a) * R * 0.3);
      ctx.lineTo(cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8);
      ctx.stroke();
    }
  } else if (effect === 'nature') {
    // Sylvan ring: dashed vine ring with leaf dots.
    ctx.strokeStyle = 'rgba(110,220,120,0.8)';
    ctx.lineWidth = 6;
    for (let i = 0; i < 12; i++) {
      const a0 = (i / 12) * Math.PI * 2;
      const a1 = a0 + (Math.PI * 2 / 12) * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.86, a0, a1);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(160,240,140,0.85)';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.26;
      const r = R * 0.86;
      ctx.save();
      ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createGroundRing(preset) {
  if (!preset || !preset.innerEffect) return null;
  const effect = preset.innerEffect;
  const useNormal = effect === 'void';
  const ring = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({
      map: getGroundRingTexture(effect),
      transparent: true,
      opacity: 0,
      blending: useNormal ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  ring.renderOrder = -1;
  ring.userData = { effect, spin: (Math.random() - 0.5) * 0.7, maxOpacity: useNormal ? 0.8 : 0.75 };
  return ring;
}

function updateGroundRing(ring, dieGroup, dt) {
  ring.position.x = dieGroup.position.x;
  ring.position.z = dieGroup.position.z;
  ring.rotation.z += dt * ring.userData.spin;

  // Fade in as the die nears the table; fade out while it is airborne.
  const heightFade = THREE.MathUtils.clamp((2.6 - dieGroup.position.y) / 1.6, 0, 1);
  const target = heightFade * ring.userData.maxOpacity;
  ring.material.opacity += (target - ring.material.opacity) * Math.min(1, dt * 4);
}

function disposeGroundRingTextureCache() {
  groundRingTextureCache.forEach((t) => t.dispose());
  groundRingTextureCache.clear();
}

// --- Impact dust puff -----------------------------------------------------
// A quick expanding, fading soft blob where a die slams the table. Reads as
// the die physically hitting the paper/mat.
let dustPuffTexture = null;
function getDustPuffTexture() {
  if (dustPuffTexture) return dustPuffTexture;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2 - 4);
  g.addColorStop(0, 'rgba(196,184,156,0.85)');
  g.addColorStop(0.5, 'rgba(196,184,156,0.4)');
  g.addColorStop(1, 'rgba(196,184,156,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  dustPuffTexture = new THREE.CanvasTexture(canvas);
  dustPuffTexture.colorSpace = THREE.SRGBColorSpace;
  return dustPuffTexture;
}

function spawnDustPuff(scene, pos) {
  if (impactFxRefCurrent.length > 14) return;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: getDustPuffTexture(),
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = Math.random() * Math.PI * 2;
  mesh.position.set(pos.x, 0.025, pos.z);
  mesh.renderOrder = -1;
  mesh.userData.t = 0;
  scene.add(mesh);
  impactFxRefCurrent.push(mesh);
}

function updateImpactFx(scene, dt) {
  for (let i = impactFxRefCurrent.length - 1; i >= 0; i--) {
    const mesh = impactFxRefCurrent[i];
    mesh.userData.t += dt;
    const t = mesh.userData.t;
    const s = 0.7 + t * 4.4;
    mesh.scale.set(s, s, s);
    mesh.material.opacity = Math.max(0, 0.45 * (1 - t / 0.32));
    if (t > 0.32) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      impactFxRefCurrent.splice(i, 1);
    }
  }
}

// Module-level list so spawnDustPuff can be called from cannon collide
// callbacks without threading refs through closures.
const impactFxRefCurrent = [];

function createThemeGeometry(preset) {
  if (!preset || !preset.outerEffect) return null;
  const effect = preset.outerEffect;

  if (effect === 'lightning') {
    return createLightningArcs(preset);
  } else if (effect === 'fire') {
    return createFlameTendrils(preset);
  } else if (effect === 'frost') {
    return createIceCrystals(preset);
  } else if (effect === 'void') {
    return createVoidTendrils(preset);
  } else if (effect === 'nature') {
    return createNatureWisps(preset);
  }
  return null;
}

function updateThemeGeometry(obj, time) {
  if (!obj) return;
  const effect = obj.userData?.effect;
  if (effect === 'lightning') {
    updateLightningArcs(obj, time);
  } else if (effect === 'fire') {
    updateFlameTendrils(obj, time);
  } else if (effect === 'frost') {
    updateIceCrystals(obj, time);
  } else if (effect === 'void') {
    updateVoidTendrils(obj, time);
  } else if (effect === 'nature') {
    updateNatureWisps(obj, time);
  }
}

function createLightningArcs(preset) {
  const arcGroup = new THREE.Group();
  const arcCount = 6;
  const arcs = [];

  for (let a = 0; a < arcCount; a++) {
    const points = [];
    const segments = 10;
    const startAngle = (a / arcCount) * Math.PI * 2;

    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const angle = startAngle + t * 0.8;
      const r = 1.0 + t * 1.0;
      points.push(new THREE.Vector3(
        Math.cos(angle) * r + (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 2.0,
        Math.sin(angle) * r + (Math.random() - 0.5) * 0.4
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(preset.outerColor || '#88aaff'),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = { segments, startAngle, radius: 1.0 };
    arcGroup.add(line);
    arcs.push(line);
  }

  arcGroup.userData = { arcs, effect: 'lightning' };
  return arcGroup;
}

function updateLightningArcs(arcGroup, time) {
  if (!arcGroup) return;
  const { arcs } = arcGroup.userData;

  arcs.forEach((line, aIdx) => {
    const { segments, startAngle, radius } = line.userData;

    if (Math.random() > 0.82) {
      const points = [];
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const angle = startAngle + time * 2 + t * 0.8 + aIdx * 1.57;
        const r = radius + t * (0.8 + Math.random() * 0.8);
        points.push(new THREE.Vector3(
          Math.cos(angle) * r + (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 2.2,
          Math.sin(angle) * r + (Math.random() - 0.5) * 0.5
        ));
      }
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }

    line.material.opacity = 0.2 + Math.random() * 0.8;
  });
}

function createFlameTendrils(preset) {
  const group = new THREE.Group();
  const tendrilCount = 9;
  const tendrils = [];
  const color1 = new THREE.Color(preset.outerColor || '#ff6622');
  const color2 = new THREE.Color('#ffcc00');

  for (let t = 0; t < tendrilCount; t++) {
    const points = [];
    const segments = 12;
    const baseAngle = (t / tendrilCount) * Math.PI * 2;
    const baseR = 0.9;

    for (let s = 0; s <= segments; s++) {
      const frac = s / segments;
      const r = baseR + frac * 1.3;
      const y = frac * 3.0;
      const wobble = Math.sin(frac * 4 + t) * 0.3;
      points.push(new THREE.Vector3(
        Math.cos(baseAngle + wobble) * r + (Math.random() - 0.5) * 0.15,
        y + (Math.random() - 0.5) * 0.2,
        Math.sin(baseAngle + wobble) * r + (Math.random() - 0.5) * 0.15
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const c = color1.clone().lerp(color2, Math.random() * 0.5);
    const material = new THREE.LineBasicMaterial({
      color: c,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = { segments, baseAngle, baseR, color1, color2, idx: t };
    group.add(line);
    tendrils.push(line);
  }

  group.userData = { tendrils, effect: 'fire' };
  return group;
}

function updateFlameTendrils(group, time) {
  if (!group) return;
  const { tendrils } = group.userData;

  tendrils.forEach((line) => {
    const { segments, baseAngle, baseR, color1, color2, idx } = line.userData;

    if (Math.random() > 0.75) {
      const points = [];
      for (let s = 0; s <= segments; s++) {
        const frac = s / segments;
        const r = baseR + frac * (1.0 + Math.sin(time * 3 + idx + frac * 2) * 0.4);
        const y = frac * (2.0 + Math.sin(time * 4 + idx) * 0.5);
        const wobble = Math.sin(frac * 5 + time * 3 + idx) * 0.4;
        points.push(new THREE.Vector3(
          Math.cos(baseAngle + wobble) * r + (Math.random() - 0.5) * 0.2,
          y + (Math.random() - 0.5) * 0.15,
          Math.sin(baseAngle + wobble) * r + (Math.random() - 0.5) * 0.2
        ));
      }
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }

    line.material.opacity = 0.3 + Math.random() * 0.6;
  });
}

function createIceCrystals(preset) {
  const group = new THREE.Group();
  const crystalCount = 10;
  const crystals = [];
  const color = new THREE.Color(preset.outerColor || '#88ccff');

  for (let c = 0; c < crystalCount; c++) {
    const spikeGroup = new THREE.Group();
    const baseAngle = (c / crystalCount) * Math.PI * 2;
    const baseTilt = -0.35 + Math.random() * 0.7;
    const spikeLen = 0.75 + Math.random() * 0.95;

    const spikeGeo = new THREE.ConeGeometry(0.075, spikeLen, 4);
    const spikeMat = new THREE.MeshBasicMaterial({
      color: color.clone().offsetHSL(Math.random() * 0.05 - 0.025, 0, Math.random() * 0.25),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const spike = new THREE.Mesh(spikeGeo, spikeMat);

    const dir = new THREE.Vector3(Math.cos(baseAngle), baseTilt, Math.sin(baseAngle)).normalize();
    const pos = dir.clone().multiplyScalar(1.05 + Math.random() * 0.35);
    spike.position.copy(pos);
    spike.lookAt(pos.clone().add(dir));
    spike.rotateX(Math.PI / 2);

    spikeGroup.add(spike);
    spikeGroup.userData = { baseAngle, baseTilt, spikeLen, idx: c, dir: dir.clone() };
    group.add(spikeGroup);
    crystals.push(spikeGroup);
  }

  group.userData = { crystals, color, effect: 'frost' };
  return group;
}

function updateIceCrystals(group, time) {
  if (!group) return;
  const { crystals, color } = group.userData;

  crystals.forEach((crystal) => {
    const { baseAngle, baseTilt, spikeLen, idx, dir } = crystal.userData;

    const pulseDist = 1.0 + Math.sin(time * 2.5 + idx * 0.8) * 0.25;
    const newPos = dir.clone().multiplyScalar(pulseDist);
    crystal.position.copy(newPos);

    crystal.rotation.z += 0.02 * Math.sin(time * 1.5 + idx);

    const spike = crystal.children[0];
    if (spike && spike.material) {
      spike.material.opacity = 0.4 + Math.sin(time * 3 + idx * 1.2) * 0.3;

      if (Math.random() < 0.03) {
        spike.material.opacity = 1.0;
      }
    }
  });
}

function createVoidTendrils(preset) {
  const group = new THREE.Group();
  const tendrilCount = 7;
  const tendrils = [];
  const color = new THREE.Color(preset.outerColor || '#9944dd');

  for (let t = 0; t < tendrilCount; t++) {
    const points = [];
    const segments = 14;
    const baseAngle = (t / tendrilCount) * Math.PI * 2;

    for (let s = 0; s <= segments; s++) {
      const frac = s / segments;
      const spiralAngle = baseAngle + frac * Math.PI * 1.5;
      const r = 0.9 + frac * 1.5;
      const y = Math.sin(frac * Math.PI) * (1.0 - frac * 0.3);
      points.push(new THREE.Vector3(
        Math.cos(spiralAngle) * r,
        y + (Math.random() - 0.5) * 0.2,
        Math.sin(spiralAngle) * r
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color.clone().offsetHSL(Math.random() * 0.05, 0, Math.random() * 0.1 - 0.05),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = { segments, baseAngle, idx: t };
    group.add(line);
    tendrils.push(line);
  }

  group.userData = { tendrils, effect: 'void' };
  return group;
}

function updateVoidTendrils(group, time) {
  if (!group) return;
  const { tendrils } = group.userData;

  tendrils.forEach((line) => {
    const { segments, baseAngle, idx } = line.userData;

    if (Math.random() > 0.88) {
      const points = [];
      for (let s = 0; s <= segments; s++) {
        const frac = s / segments;
        const spiralAngle = baseAngle + frac * Math.PI * 1.5 + time * 0.8 + idx;
        const r = 0.9 + frac * (1.2 + Math.sin(time + idx) * 0.4);
        const y = Math.sin(frac * Math.PI) * (1.0 + Math.sin(time * 1.5 + idx) * 0.3);
        points.push(new THREE.Vector3(
          Math.cos(spiralAngle) * r + (Math.random() - 0.5) * 0.15,
          y + (Math.random() - 0.5) * 0.15,
          Math.sin(spiralAngle) * r + (Math.random() - 0.5) * 0.15
        ));
      }
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }

    line.material.opacity = 0.3 + Math.sin(time * 2 + idx) * 0.25;
  });
}

function createNatureWisps(preset) {
  const group = new THREE.Group();
  const wispCount = 7;
  const wisps = [];
  const color = new THREE.Color(preset.outerColor || '#55cc33');

  for (let w = 0; w < wispCount; w++) {
    const points = [];
    const segments = 10;
    const baseAngle = (w / wispCount) * Math.PI * 2;

    for (let s = 0; s <= segments; s++) {
      const frac = s / segments;
      const spiralAngle = baseAngle + frac * Math.PI * 0.8;
      const r = 0.9 + frac * 0.8;
      const y = frac * 1.5;
      const wobble = Math.sin(frac * 3 + w) * 0.25;
      points.push(new THREE.Vector3(
        Math.cos(spiralAngle + wobble) * r,
        y + (Math.random() - 0.5) * 0.15,
        Math.sin(spiralAngle + wobble) * r
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color.clone().offsetHSL(Math.random() * 0.08, 0, Math.random() * 0.15),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = { segments, baseAngle, idx: w };
    group.add(line);
    wisps.push(line);
  }

  const glowGeo = new THREE.SphereGeometry(0.12, 8, 8);
  for (let g = 0; g < 8; g++) {
    const angle = Math.random() * Math.PI * 2;
    const y = 0.5 + Math.random() * 1.5;
    const r = 0.8 + Math.random() * 0.6;
    const glowMat = new THREE.MeshBasicMaterial({
      color: color.clone().offsetHSL(Math.random() * 0.1, 0, Math.random() * 0.2),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
    glow.userData = { angle, baseY: y, baseR: r, phase: Math.random() * Math.PI * 2 };
    group.add(glow);
    wisps.push(glow);
  }

  group.userData = { wisps, effect: 'nature' };
  return group;
}

function updateNatureWisps(group, time) {
  if (!group) return;
  const { wisps } = group.userData;

  wisps.forEach((item) => {
    if (item.isLine) {
      const { segments, baseAngle, idx } = item.userData;

      if (Math.random() > 0.85) {
        const points = [];
        for (let s = 0; s <= segments; s++) {
          const frac = s / segments;
          const spiralAngle = baseAngle + frac * Math.PI * 0.8 + Math.sin(time + idx) * 0.3;
          const r = 0.9 + frac * (0.8 + Math.sin(time * 2 + idx) * 0.2);
          const y = frac * (1.5 + Math.sin(time * 1.5 + idx) * 0.3);
          const wobble = Math.sin(frac * 3 + time * 2 + idx) * 0.3;
          points.push(new THREE.Vector3(
            Math.cos(spiralAngle + wobble) * r + (Math.random() - 0.5) * 0.1,
            y + (Math.random() - 0.5) * 0.1,
            Math.sin(spiralAngle + wobble) * r + (Math.random() - 0.5) * 0.1
          ));
        }
        item.geometry.dispose();
        item.geometry = new THREE.BufferGeometry().setFromPoints(points);
      }

      item.material.opacity = 0.3 + Math.sin(time * 2 + item.userData.idx) * 0.25;
    } else if (item.isMesh) {
      const { angle, baseY, baseR, phase } = item.userData;
      const newAngle = angle + time * 0.5 + phase;
      item.position.x = Math.cos(newAngle) * baseR;
      item.position.z = Math.sin(newAngle) * baseR;
      item.position.y = baseY + Math.sin(time * 1.5 + phase) * 0.3;
      item.material.opacity = 0.3 + Math.sin(time * 3 + phase) * 0.3;
    }
  });
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

  const makeBodyMaterial = () => new THREE.MeshPhysicalMaterial({
    color: usePaintedBody ? 0xffffff : bodyColor,
    map: usePaintedBody ? themeMaps.map : null,
    roughness: roughness,
    metalness: metalness,
    envMapIntensity: ov.envMapIntensity !== undefined ? ov.envMapIntensity : 0.3,
    specularIntensity: 0.2,
    emissive: usePaintedBody ? '#ffffff' : emissive,
    emissiveMap: usePaintedBody ? themeMaps.emissiveMap : null,
    emissiveIntensity: emissiveIntensity * (ov.emissiveIntensityMul || 1),
    transparent: ov.transparent !== undefined ? ov.transparent : transparent,
    opacity: ov.opacity !== undefined ? ov.opacity : opacity,
    clearcoat: ov.clearcoat || 0.0,
    clearcoatRoughness: ov.clearcoatRoughness || 0.5,
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

    const innerSprite = preset?.innerEffect ? getParticleTexture(preset.innerEffect) : null;
    const outerSprite = preset?.outerEffect ? getParticleTexture(preset.outerEffect) : null;
    const innerParticles = createInnerParticles(preset, preset?.innerColor, innerSprite);
    if (innerParticles) group.add(innerParticles);

    const outerParticles = createOuterParticles(preset, outerSprite);
    if (outerParticles) group.add(outerParticles);

    const glowAura = createGlowAura(preset);
    if (glowAura) group.add(glowAura);

    const themeGeometry = createThemeGeometry(preset);
    if (themeGeometry) group.add(themeGeometry);

    const themeLight = createThemeLight(preset);
    if (themeLight) group.add(themeLight);

    return { group, sides, maxNumber: 4, d4Verts: uniqueVerts, innerParticles, outerParticles, glowAura, themeGeometry, themeLight, bodyMesh: mesh, surfaceTextures };
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

  const innerSprite = preset?.innerEffect ? getParticleTexture(preset.innerEffect) : null;
  const outerSprite = preset?.outerEffect ? getParticleTexture(preset.outerEffect) : null;
  const innerParticles = createInnerParticles(preset, preset?.innerColor, innerSprite);
  if (innerParticles) group.add(innerParticles);

  const outerParticles = createOuterParticles(preset, outerSprite);
  if (outerParticles) group.add(outerParticles);

  const glowAura = createGlowAura(preset);
  if (glowAura) group.add(glowAura);

  const themeGeometry = createThemeGeometry(preset);
  if (themeGeometry) group.add(themeGeometry);

  const themeLight = createThemeLight(preset);
  if (themeLight) group.add(themeLight);

  return { group, sides, maxNumber: N, innerParticles, outerParticles, glowAura, themeGeometry, themeLight, bodyMesh: mesh, surfaceTextures };
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
  const settlingFramesRef = useRef([]);
  const resultsRef = useRef([]);
  const onCompleteFiredRef = useRef(false);
  const dieGlowRef = useRef(null);
  const [resultState, setResultState] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const groundBodyRef = useRef(null);
  const wallBodiesRef = useRef([]);
  const physicsMaterialRef = useRef(null);
  const boundsRef = useRef({ x: 10, z: 10 });
  const groundMeshRef = useRef(null);
  const envMapRef = useRef(null);
  const lineMaterialsRef = useRef([]);
  const dismissTimerRef = useRef(null);
  const lastRollContextRef = useRef(null);
  // Smoothed look-at target — drifts gently toward the dice centroid so the
  // "tray" follows the throw (DDB-style) without ever disorienting the view.
  const camTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  // Decaying impact-shake amplitude applied to the camera position.
  const impactShakeRef = useRef(0);
  // Frame counter for throttling per-frame visual rebuilds.
  const frameCounterRef = useRef(0);

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
    // Gravity scaled to the dice: bodies are ~1.5 units, so a stronger field
    // makes falls/bounces read at real-dice speed instead of moon speed.
    world.gravity.set(0, -55, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 25;

    const physicsMaterial = new CANNON.Material('standard');
    physicsMaterialRef.current = physicsMaterial;
    const contactMaterial = new CANNON.ContactMaterial(
      physicsMaterial, physicsMaterial, { friction: 0.62, restitution: 0.32 }
    );
    world.addContactMaterial(contactMaterial);

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
      if (d.groundRing) {
        scene.remove(d.groundRing);
        d.groundRing.geometry.dispose();
        d.groundRing.material.dispose();
      }
      // Surface textures are pooled/shared — nothing per-die to dispose.
    });
    // Reset impact FX + shake from the previous roll.
    impactFxRefCurrent.forEach((m) => {
      scene.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    });
    impactFxRefCurrent.length = 0;
    impactShakeRef.current = 0;
    activeDiceRef.current = [];
    resultsRef.current = [];
    settlingFramesRef.current = [];
    onCompleteFiredRef.current = false;
    setResultState(null);
    // Clear stale skill outcome and any line materials from the previous roll.
    useDiceStore.setState({ skillOutcome: null });
    lineMaterialsRef.current.forEach((m) => m.dispose && m.dispose());
    lineMaterialsRef.current = [];

    const { x: boundX, z: boundZ } = boundsRef.current;
    const preset = getPreset();

    // Themed ground rings are per-scene decals; one shared texture cache.
    // Cap the per-die point lights on huge pools for performance.
    const lightBudget = 6;
    let lightsUsed = 0;

    diceToRoll.forEach((die, index) => {
      const diceType = die.type;
      const diceObj = buildDiceObject(diceType, diceColor, preset, renderer, scene);
      // Themed presets get one light per die, capped — the scene reads fine
      // with a shared glow once the budget is spent.
      if (diceObj.themeLight && lightsUsed >= lightBudget) {
        diceObj.group.remove(diceObj.themeLight);
        diceObj.themeLight.dispose?.();
        diceObj.themeLight = null;
      }
      if (diceObj.themeLight) lightsUsed += 1;
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
        // Real dice don't drag in air — damping near zero so spin and speed
        // survive until impact, then friction does the stopping.
        linearDamping: 0.01,
        angularDamping: 0.01,
      });
      body.addShape(shape);
      world.addBody(body);
      scene.add(diceObj.group);

      // Impact feedback: camera shake + a dust puff when the die slams the
      // table. Sells the "hit the paper" moment.
      body.addEventListener('collide', (e) => {
        const v = Math.abs(e.contact?.getImpactVelocityAlongNormal?.() || 0);
        if (v > 3.2) {
          impactShakeRef.current = Math.min(0.5, impactShakeRef.current + v * 0.009);
          if (v > 4.5) spawnDustPuff(scene, body.position);
        }
      });

      const rollCtx = useDiceStore.getState().rollContext;
      const throwPower = typeof rollCtx?.throwPower === 'number' ? Math.max(0.5, Math.min(2.8, rollCtx.throwPower)) : 1.0;

      const hasAim = rollCtx?.throwDirection && (Math.abs(rollCtx.throwDirection.x) > 0.05 || Math.abs(rollCtx.throwDirection.z) > 0.05);

      // D&D Beyond-style throw geometry: dice are hurled in from a screen
      // edge and arc toward a central "tray". Landing targets stay within
      // ~40% of the visible table so results always settle near the center
      // of the screen instead of scattering to the distorted edges.
      const trayX = boundX * 0.40;
      const trayZ = boundZ * 0.40;

      let targetX, targetZ, startX, startZ;

      if (hasAim) {
        const dLen = Math.hypot(rollCtx.throwDirection.x, rollCtx.throwDirection.z) || 1;
        const normAimX = rollCtx.throwDirection.x / dLen;
        const normAimZ = rollCtx.throwDirection.z / dLen;
        // Aimed throws land along the aim direction, launched from the
        // opposite edge — the throw literally crosses the screen.
        targetX = normAimX * boundX * 0.28 + (Math.random() - 0.5) * trayX * 0.8;
        targetZ = normAimZ * boundZ * 0.28 + (Math.random() - 0.5) * trayZ * 0.8;
        startX = -normAimX * boundX * 0.88 + (Math.random() - 0.5) * 1.4;
        startZ = -normAimZ * boundZ * 0.88 + (Math.random() - 0.5) * 1.4;
      } else {
        // Default: hurled from the bottom edge of the screen toward the tray.
        targetX = (Math.random() - 0.5) * 2 * trayX;
        targetZ = (Math.random() - 0.5) * 2 * trayZ;
        startX = targetX * 0.35 + (Math.random() - 0.5) * boundX * 0.45;
        startZ = boundZ * 0.92;
      }

      targetX = THREE.MathUtils.clamp(targetX, -trayX, trayX);
      targetZ = THREE.MathUtils.clamp(targetZ, -trayZ, trayZ);
      startX = THREE.MathUtils.clamp(startX, -boundX * 0.95, boundX * 0.95);
      startZ = THREE.MathUtils.clamp(startZ, -boundZ * 0.95, boundZ * 0.95);

      // Flat, hard throw — real hand throws skid low across the table, they
      // don't lob. Short flight time + low start height = fast whip with a
      // couple of sharp bounces instead of a floaty hang.
      const startY = 1.5 + Math.random() * 0.35 + index * 0.25;

      // Ballistic solve: pick a flight time, then derive the initial
      // velocity that lands the die on the table at its target.
      // y(t) = y0 + vy*t - (g/2)*t²  with g = 55 (world gravity).
      const flightT = (0.34 + Math.random() * 0.10) / Math.sqrt(throwPower);
      const restY = 0.9;
      const vx = (targetX - startX) / flightT;
      const vz = (targetZ - startZ) / flightT;
      const vy = (restY - startY + 27.5 * flightT * flightT) / flightT;

      body.position.set(startX, startY, startZ);
      body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      body.velocity.set(vx, vy, vz);
      const spinForce = (26 + Math.random() * 14) * throwPower;
      body.angularVelocity.set(
        (Math.random() - 0.5) * 2 * spinForce,
        (Math.random() - 0.5) * 2 * spinForce,
        (Math.random() - 0.5) * 2 * spinForce
      );

      const groundRing = createGroundRing(preset);
      if (groundRing) scene.add(groundRing);

      activeDiceRef.current.push({
        diceObj,
        body,
        groundRing,
        type: diceType,
        originalType: die.originalType || die.type,
        isPercentilePair: die.isPercentilePair || false,
        pairIndex: die.pairIndex,
        settled: false,
        startQuat: new THREE.Quaternion(),
        finalQuat: new THREE.Quaternion(),
        startPos: new THREE.Vector3(),
        finalPos: new THREE.Vector3(),
        yawT: 0,
        yawActive: false,
        rolledNumber: 0,
      });

      // Register the new LineMaterial so its resolution tracks viewport size.
      diceObj.group.traverse((obj) => {
        if (obj.isLineSegments2 && obj.material && !lineMaterialsRef.current.includes(obj.material)) {
          obj.material.resolution.set(containerRef.current.clientWidth, containerRef.current.clientHeight);
          lineMaterialsRef.current.push(obj.material);
        }
      });

      settlingFramesRef.current.push(0);
    });

    physicsActiveRef.current = true;
    setIsRolling(true);
  }, [diceToRoll, diceColor, getPreset]);

  const readDiceResult = useCallback((die) => {
    const { diceObj, type, body } = die;
    const currentQuat = new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);

    if (type === 'd4') {
      let highestV = diceObj.d4Verts[0];
      let maxY = -Infinity;
      diceObj.d4Verts.forEach(v => {
        const worldV = v.clone().applyQuaternion(currentQuat);
        if (worldV.y > maxY) { maxY = worldV.y; highestV = v; }
      });
      return highestV.d4Num;
    }

    let bestDot = -Infinity;
    let topSide = null;
    const upVector = new THREE.Vector3(0, 1, 0);
    diceObj.sides.forEach(side => {
      const worldNormal = side.normal.clone().applyQuaternion(currentQuat);
      const dot = worldNormal.dot(upVector);
      if (dot > bestDot) { bestDot = dot; topSide = side; }
    });

    if (type === 'dpercent') {
      return topSide ? topSide.num * 10 : 0;
    }

    return topSide ? topSide.num : 1;
  }, []);

  const computeYawCorrection = useCallback((die, currentQuat) => {
    const { diceObj, type } = die;

    if (type === 'd4') {
      let highestV = diceObj.d4Verts[0];
      let maxY = -Infinity;
      diceObj.d4Verts.forEach(v => {
        const worldV = v.clone().applyQuaternion(currentQuat);
        if (worldV.y > maxY) { maxY = worldV.y; highestV = v; }
      });

      let frontSide = null;
      let bestZ = -Infinity;
      diceObj.sides.forEach(side => {
        if (side.vertices.some(v => v.distanceTo(highestV) < 0.1)) {
          const worldNormal = side.normal.clone().applyQuaternion(currentQuat);
          if (worldNormal.z > bestZ) { bestZ = worldNormal.z; frontSide = side; }
        }
      });

      if (frontSide) {
        const localUp = frontSide.plate.up.clone();
        const worldUp = localUp.applyQuaternion(currentQuat);
        worldUp.y = 0;
        if (worldUp.lengthSq() > 0.001) {
          worldUp.normalize();
          const currentAngle = Math.atan2(worldUp.x, worldUp.z);
          const targetAngle = Math.atan2(0, -1);
          let diff = targetAngle - currentAngle;
          while (diff <= -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), diff).multiply(currentQuat);
        }
      }
      return currentQuat.clone();
    }

    let bestDot = -Infinity;
    let topSide = null;
    const upVector = new THREE.Vector3(0, 1, 0);
    diceObj.sides.forEach(side => {
      const worldNormal = side.normal.clone().applyQuaternion(currentQuat);
      const dot = worldNormal.dot(upVector);
      if (dot > bestDot) { bestDot = dot; topSide = side; }
    });

    if (topSide) {
      const localTextUp = new THREE.Vector3(0, 1, 0).applyQuaternion(topSide.plate.quaternion);
      const worldTextUp = localTextUp.applyQuaternion(currentQuat);
      worldTextUp.y = 0;

      if (worldTextUp.lengthSq() > 0.001) {
        worldTextUp.normalize();
        const currentAngle = Math.atan2(worldTextUp.x, worldTextUp.z);
        const targetAngle = Math.atan2(0, -1);
        let diff = targetAngle - currentAngle;
        while (diff <= -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), diff).multiply(currentQuat);
      }
    }
    return currentQuat.clone();
  }, []);

  // Full "presentation" orientation for the settle: the rolled face ends up
  // EXACTLY up (number flat toward the camera) and the face's text-up points
  // at the top of the screen — every die reads directly. Also returns the
  // exact resting height (center-to-face distance) so the die sits flush on
  // the table. d4 keeps the yaw-only correction (vertex-up read).
  const computePresentation = useCallback((die) => {
    const displayedQuat = die.diceObj.group.quaternion;

    if (die.type === 'd4') {
      return { quat: computeYawCorrection(die, displayedQuat.clone()), restY: null };
    }

    // Same top-face choice as readDiceResult (body's last physics pose).
    const bodyQuat = new THREE.Quaternion(
      die.body.quaternion.x, die.body.quaternion.y, die.body.quaternion.z, die.body.quaternion.w
    );
    const up = new THREE.Vector3(0, 1, 0);
    let bestDot = -Infinity;
    let topSide = null;
    die.diceObj.sides.forEach(side => {
      const worldNormal = side.normal.clone().applyQuaternion(bodyQuat);
      const dot = worldNormal.dot(up);
      if (dot > bestDot) { bestDot = dot; topSide = side; }
    });
    if (!topSide) {
      return { quat: computeYawCorrection(die, displayedQuat.clone()), restY: null };
    }

    const n = topSide.normal.clone().normalize();
    const u = new THREE.Vector3(0, 1, 0).applyQuaternion(topSide.plate.quaternion);
    u.addScaledVector(n, -u.dot(n));
    if (u.lengthSq() < 1e-6) {
      return { quat: computeYawCorrection(die, displayedQuat.clone()), restY: null };
    }
    u.normalize();
    const w = new THREE.Vector3().crossVectors(n, u);

    const mLocal = new THREE.Matrix4().makeBasis(n, u, w);
    const yUp = new THREE.Vector3(0, 1, 0);
    const camUp = new THREE.Vector3(0, 0, -1);
    const zAxisW = new THREE.Vector3().crossVectors(yUp, camUp);
    const mWorld = new THREE.Matrix4().makeBasis(yUp, camUp, zAxisW);
    const quat = new THREE.Quaternion().setFromRotationMatrix(
      mWorld.clone().multiply(mLocal.clone().invert())
    );

    return { quat, restY: topSide.centroid.length() + 0.01 };
  }, [computeYawCorrection]);

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
      world.step(1 / 60, dt, 3);

      let allSettled = true;
      activeDiceRef.current.forEach((die, idx) => {
        if (die.settled) return;
        allSettled = false;

        die.diceObj.group.position.copy(die.body.interpolatedPosition);
        die.diceObj.group.quaternion.copy(die.body.interpolatedQuaternion);

        if (die.body.velocity.length() < 0.5 && die.body.angularVelocity.length() < 0.5 && die.body.position.y < 1.6) {
          settlingFramesRef.current[idx] = (settlingFramesRef.current[idx] || 0) + 1;

          // Clamp hard so a nearly-stopped die never crawls across the grid.
          die.body.velocity.scale(0.55, die.body.velocity);
          die.body.angularVelocity.scale(0.55, die.body.angularVelocity);

          if (settlingFramesRef.current[idx] > 5) {
            // Fully arrest the body and drop it from the simulation — no
            // background gravity/collision jitter while the visual settles.
            die.body.velocity.setZero();
            die.body.angularVelocity.setZero();
            world.removeBody(die.body);

            die.rolledNumber = readDiceResult(die);

            // Capture the DISPLAYED (interpolated) pose — capturing the raw
            // body pose here made the mesh visibly snap one physics step.
            die.startQuat.copy(die.diceObj.group.quaternion);
            die.startPos.copy(die.diceObj.group.position);

            const pres = computePresentation(die);
            die.finalQuat.copy(pres.quat);
            die.finalPos.set(
              die.diceObj.group.position.x,
              pres.restY !== null ? pres.restY : die.diceObj.group.position.y,
              die.diceObj.group.position.z
            );

            die.yawActive = true;
            die.yawT = 0;
            die.settled = true;
          }
        } else {
          settlingFramesRef.current[idx] = 0;
        }
      });

      if (allSettled && activeDiceRef.current.every(d => d.yawActive)) {
        physicsActiveRef.current = false;
      }
    }

    // Theme geometry (arcs/tendrils) rebuilds BufferGeometries — throttle to
    // every other frame to halve the GC churn without a visible difference.
    frameCounterRef.current++;

    activeDiceRef.current.forEach((die) => {
      if (die.diceObj.innerParticles) {
        updateInnerParticles(die.diceObj.innerParticles, dt);
      }
      if (die.diceObj.outerParticles) {
        updateOuterParticles(die.diceObj.outerParticles, dt);
      }
      if (die.diceObj.glowAura) {
        updateGlowAura(die.diceObj.glowAura, dt, timerRef.current.getElapsed());
      }
      if (die.diceObj.themeGeometry && frameCounterRef.current % 2 === 0) {
        updateThemeGeometry(die.diceObj.themeGeometry, timerRef.current.getElapsed());
      }
      if (die.groundRing) {
        updateGroundRing(die.groundRing, die.diceObj.group, dt);
      }
      if (die.diceObj.themeLight) {
        updateThemeLight(die.diceObj.themeLight, timerRef.current.getElapsed());
      }
      if (die.diceObj.bodyMesh?.userData.bodyFlicker) {
        updateBodyFlicker(die.diceObj.bodyMesh, timerRef.current.getElapsed());
      }
    });

    let allYawDone = true;
    activeDiceRef.current.forEach((die) => {
      if (die.settled && die.yawActive) {
        // ~0.18s ease-out into the presentation pose: face flat, number
        // upright, resting flush. Eases from the displayed pose so there is
        // never a visible snap or crawl.
        die.yawT += dt * 5.5;
        const t = Math.min(die.yawT, 1.0);
        const ease = 1 - Math.pow(1 - t, 3);
        die.diceObj.group.quaternion.slerpQuaternions(die.startQuat, die.finalQuat, ease);
        die.diceObj.group.position.lerpVectors(die.startPos, die.finalPos, ease);

        if (t < 1.0) allYawDone = false;
      }
    });

    if (!physicsActiveRef.current && activeDiceRef.current.length > 0 && activeDiceRef.current.every(d => d.settled) && !onCompleteFiredRef.current) {
      const allYawComplete = activeDiceRef.current.every(d => !d.yawActive || d.yawT >= 1.0);
      if (allYawComplete) {
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
        // EVERY die in the pool hit its extreme. For a single die, that's
        // its own max/min; for multi-die pools, ALL dice need to be max/min
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

    // Impact FX: dust puffs expand/fade; camera shake decays fast.
    updateImpactFx(scene, dt);
    if (impactShakeRef.current > 0.002) {
      const s = impactShakeRef.current;
      camera.position.set(
        (Math.random() - 0.5) * s,
        16 + (Math.random() - 0.5) * s,
        (Math.random() - 0.5) * s * 0.6
      );
      impactShakeRef.current = s * Math.pow(0.001, dt);
    } else if (camera.position.x !== 0 || camera.position.z !== 0) {
      camera.position.set(0, 16, 0);
    }

    renderer.render(scene, camera);
  }, [diceToRoll, onRollComplete, computeYawCorrection, computePresentation, readDiceResult]);

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
      disposeParticleTextureCache();
      disposeGroundRingTextureCache();
      disposeThemeBodyTextureCache();
      disposeNumberTextureCache();
      disposeSurfaceTexturePool();
      impactFxRefCurrent.forEach((m) => {
        sceneRef.current?.remove(m);
        m.geometry.dispose();
        m.material.dispose();
      });
      impactFxRefCurrent.length = 0;
      if (dustPuffTexture) {
        dustPuffTexture.dispose();
        dustPuffTexture = null;
      }
      activeDiceRef.current.forEach((d) => {
        if (d.groundRing) {
          d.groundRing.geometry.dispose();
          d.groundRing.material.dispose();
        }
      });
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

  // Auto-dismiss the result chip after a few seconds — it is informational,
  // not modal. A reroll or a manual Dismiss clears the timer.
  useEffect(() => {
    if (!resultState || isRolling || !onDismiss) return;
    dismissTimerRef.current = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [resultState, isRolling, onDismiss]);

  const formatResultDisplay = useCallback((value, type) => {
    if (type === 'd10' && value === 10) return '0';
    if (type === 'dpercent') return value.toString().padStart(2, '0');
    if (type === 'd100') return value.toString();
    return value.toString();
  }, []);

  return (
    <div className={`dice-3d-overlay ${isVisible ? 'visible' : ''}`}>
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
