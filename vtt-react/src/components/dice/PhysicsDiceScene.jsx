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

function createNumberTextureWithColor(num, type, numberColor) {
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
  return tex;
}

function createD4FaceTexture(nTop, nRight, nLeft, numberColor) {
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
    frost: 0.28,
    fire: 0.26,
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
  const arcCount = 4;
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
  const tendrilCount = 6;
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
      const r = baseR + frac * 1.2;
      const y = frac * 2.5;
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
      opacity: 0.7,
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
  const crystalCount = 8;
  const crystals = [];
  const color = new THREE.Color(preset.outerColor || '#88ccff');

  for (let c = 0; c < crystalCount; c++) {
    const spikeGroup = new THREE.Group();
    const baseAngle = (c / crystalCount) * Math.PI * 2;
    const baseTilt = -0.3 + Math.random() * 0.6;
    const spikeLen = 0.6 + Math.random() * 0.8;

    const spikeGeo = new THREE.ConeGeometry(0.06, spikeLen, 4);
    const spikeMat = new THREE.MeshBasicMaterial({
      color: color.clone().offsetHSL(Math.random() * 0.05 - 0.025, 0, Math.random() * 0.2),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const spike = new THREE.Mesh(spikeGeo, spikeMat);

    const dir = new THREE.Vector3(Math.cos(baseAngle), baseTilt, Math.sin(baseAngle)).normalize();
    const pos = dir.clone().multiplyScalar(1.0 + Math.random() * 0.3);
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
  const tendrilCount = 5;
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
  const wispCount = 5;
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

  // Per-die surface textures so no two dice look stamped from the same mold.
  // Cheap (a few ms) — a 512x512 canvas of smooth FBM noise.
  const surfaceTextures = createBodySurfaceTextures(Math.floor(Math.random() * 0x7fffffff));
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
        emissiveIntensity: 0.35,
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

    const solidMat = new THREE.MeshPhysicalMaterial({
      color: bodyColor,
      roughness: roughness,
      metalness: metalness,
      envMapIntensity: 0.3,
      specularIntensity: 0.2,
      emissive: emissive,
      emissiveIntensity: emissiveIntensity,
      transparent: transparent,
      opacity: opacity,
      clearcoat: 0.0,
      sheen: 0.1,
      sheenColor: new THREE.Color(preset?.glowColor || '#ffffff'),
      sheenRoughness: 0.4,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: roughnessMap
    });
    const mesh = new THREE.Mesh(geom, solidMat);
    mesh.castShadow = true; mesh.receiveShadow = true;
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

    return { group, sides, maxNumber: 4, d4Verts: uniqueVerts, innerParticles, outerParticles, glowAura, themeGeometry, surfaceTextures };
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
      emissiveIntensity: 0.4,
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

  const solidMat = new THREE.MeshPhysicalMaterial({
    color: bodyColor,
    roughness: roughness,
    metalness: metalness,
    envMapIntensity: 0.3,
    specularIntensity: 0.2,
    emissive: emissive,
    emissiveIntensity: emissiveIntensity,
    transparent: transparent,
    opacity: opacity,
    clearcoat: 0.0,
    sheen: 0.1,
    sheenColor: new THREE.Color(preset?.glowColor || '#ffffff'),
    sheenRoughness: 0.4,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: roughnessMap
  });
  const mesh = new THREE.Mesh(geom, solidMat);
  mesh.castShadow = true; mesh.receiveShadow = true;
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

  return { group, sides, maxNumber: N, innerParticles, outerParticles, glowAura, themeGeometry, surfaceTextures };
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
    world.gravity.set(0, -40, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 25;

    const physicsMaterial = new CANNON.Material('standard');
    physicsMaterialRef.current = physicsMaterial;
    const contactMaterial = new CANNON.ContactMaterial(
      physicsMaterial, physicsMaterial, { friction: 0.5, restitution: 0.4 }
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
      // Dispose per-die surface textures (allocated per-die since the prior roll).
      d.diceObj.surfaceTextures?.normalMap?.dispose();
      d.diceObj.surfaceTextures?.roughnessMap?.dispose();
    });
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

    const count = diceToRoll.length;
    const angleStep = (Math.PI * 2) / count;

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
        linearDamping: 0.1,
        angularDamping: 0.1,
      });
      body.addShape(shape);
      world.addBody(body);
      scene.add(diceObj.group);

      const startX = (Math.random() - 0.5) * boundX * 0.6;
      const startZ = (Math.random() - 0.5) * boundZ * 0.6;
      body.position.set(
        startX,
        6 + Math.random() * 2 + index * 0.8,
        startZ
      );
      body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const landX = (Math.random() - 0.5) * boundX * 1.2;
      const landZ = (Math.random() - 0.5) * boundZ * 1.2;
      const dx = landX - startX;
      const dz = landZ - startZ;
      const dist = Math.sqrt(dx * dx + dz * dz) || 1;

      const throwForce = 8 + Math.random() * 5;
      body.velocity.set(
        (dx / dist) * throwForce,
        -2 - Math.random() * 2,
        (dz / dist) * throwForce
      );
      body.angularVelocity.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      );

      activeDiceRef.current.push({
        diceObj,
        body,
        type: diceType,
        originalType: die.originalType || die.type,
        isPercentilePair: die.isPercentilePair || false,
        pairIndex: die.pairIndex,
        settled: false,
        startQuat: new THREE.Quaternion(),
        finalQuat: new THREE.Quaternion(),
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

        die.diceObj.group.position.copy(die.body.position);
        die.diceObj.group.quaternion.copy(die.body.quaternion);

        if (die.diceObj.innerParticles) {
          updateInnerParticles(die.diceObj.innerParticles, dt);
        }
        if (die.diceObj.outerParticles) {
          updateOuterParticles(die.diceObj.outerParticles, dt);
        }
        if (die.diceObj.glowAura) {
          updateGlowAura(die.diceObj.glowAura, dt, timerRef.current.getElapsed());
        }
        if (die.diceObj.themeGeometry) {
          updateThemeGeometry(die.diceObj.themeGeometry, timerRef.current.getElapsed());
        }

        if (die.body.velocity.length() < 0.2 && die.body.angularVelocity.length() < 0.2 && die.body.position.y < 2.5) {
          settlingFramesRef.current[idx] = (settlingFramesRef.current[idx] || 0) + 1;

          die.body.velocity.x *= 0.9;
          die.body.velocity.y *= 0.9;
          die.body.velocity.z *= 0.9;
          die.body.angularVelocity.x *= 0.9;
          die.body.angularVelocity.y *= 0.9;
          die.body.angularVelocity.z *= 0.9;

          if (settlingFramesRef.current[idx] > 15) {
            const currentQuat = new THREE.Quaternion(
              die.body.quaternion.x, die.body.quaternion.y, die.body.quaternion.z, die.body.quaternion.w
            );
            die.startQuat.copy(currentQuat);
            die.finalQuat.copy(computeYawCorrection(die, currentQuat));
            die.rolledNumber = readDiceResult(die);
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
      if (die.diceObj.themeGeometry) {
        updateThemeGeometry(die.diceObj.themeGeometry, timerRef.current.getElapsed());
      }
    });

    let allYawDone = true;
    activeDiceRef.current.forEach((die) => {
      if (die.settled && die.yawActive) {
        die.yawT += dt * 3.0;
        let t = Math.min(die.yawT, 1.0);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        die.diceObj.group.quaternion.slerpQuaternions(die.startQuat, die.finalQuat, ease);

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
    }

    renderer.render(scene, camera);
  }, [diceToRoll, onRollComplete, computeYawCorrection, readDiceResult]);

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
