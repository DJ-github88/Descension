import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as CANNON from 'cannon-es';
import './PhysicsCoinScene.css';

// Coin themes: face colors, metal finish and the emblem pair (heads / tails).
export const COIN_THEMES = {
  ancient_gold: {
    id: 'ancient_gold',
    name: 'Ancient Gold',
    primaryColor: '#d4af37',
    secondaryColor: '#8a6508',
    edgeColor: '#5c4305',
    glowColor: '#fef08a',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'crown_sun',
    metallic: 0.75,
    roughness: 0.32,
  },
  silver_sovereign: {
    id: 'silver_sovereign',
    name: 'Silver Sovereign',
    primaryColor: '#d1d5db',
    secondaryColor: '#6b7280',
    edgeColor: '#374151',
    glowColor: '#f3f4f6',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'moon_star',
    metallic: 0.85,
    roughness: 0.28,
  },
  blood_copper: {
    id: 'blood_copper',
    name: 'Blood Copper',
    primaryColor: '#c86446',
    secondaryColor: '#5c2211',
    edgeColor: '#3d140a',
    glowColor: '#fb923c',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'shield_swords',
    metallic: 0.65,
    roughness: 0.42,
  },
  mythic_rune: {
    id: 'mythic_rune',
    name: 'Mythic Rune',
    primaryColor: '#1d4ed8',
    secondaryColor: '#0f172a',
    edgeColor: '#0284c7',
    glowColor: '#38bdf8',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'arcana_compass',
    metallic: 0.7,
    roughness: 0.35,
  },
  obsidian_void: {
    id: 'obsidian_void',
    name: 'Obsidian Void',
    primaryColor: '#2e1065',
    secondaryColor: '#0f0728',
    edgeColor: '#7e22ce',
    glowColor: '#c084fc',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'void_eye',
    metallic: 0.8,
    roughness: 0.25,
  },
  celestial_platinum: {
    id: 'celestial_platinum',
    name: 'Celestial Platinum',
    primaryColor: '#e2e8f0',
    secondaryColor: '#94a3b8',
    edgeColor: '#475569',
    glowColor: '#ffffff',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'phoenix_shield',
    metallic: 0.9,
    roughness: 0.2,
  },
  arcane_brass: {
    id: 'arcane_brass',
    name: 'Arcane Brass',
    primaryColor: '#b45309',
    secondaryColor: '#78350f',
    edgeColor: '#451a03',
    glowColor: '#fde047',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    symbolType: 'gear_clockwork',
    metallic: 0.7,
    roughness: 0.38,
  },
};


// ─── Scale & timing ─────────────────────────────────────────────────────────
// World units: the camera sits ~19u above the table, so a 0.7u coin reads as
// a real coin next to the dice (~80–90px on a desktop screen).
const COIN_RADIUS = 0.7;
const COIN_THICKNESS = 0.075;
const SIM_HZ = 120;                 // fixed physics step (deterministic replay)
const SIM_DT = 1 / SIM_HZ;
const RECORD_EVERY = 2;             // keyframe every 2 steps = 60 keyframes/s
const KEYFRAME_DT = RECORD_EVERY / SIM_HZ;
const MAX_SIM_SECONDS = 4;          // hard cap — flips settle in ~1.5–2.5s
const STAGGER_SECONDS = 0.09;       // cascade multiple coins off the thumb
const CHIP_RESERVE_PX = 150;        // keep coins clear of the result chip

const rand = (a, b) => a + Math.random() * (b - a);

// ─── Camera & tray ──────────────────────────────────────────────────────────
// Near top-down with a slight tilt: coins read as tokens lying on the map,
// while the tilt still gives the flip some depth. A long lens from further
// away (like the dice camera) keeps coins near the screen edge from looking
// stretched; the table area covered is the same as before.
function createCamera(width, height) {
  const camera = new THREE.PerspectiveCamera(24, width / Math.max(1, height), 1, 200);
  camera.position.set(0, 27.4, 4.9);
  camera.lookAt(0, 0, 0.3);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return camera;
}

// Where a screen point (normalized device coords) meets the table (y = 0).
function ndcToTable(camera, nx, ny) {
  const p = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
  const dir = p.sub(camera.position).normalize();
  const t = -camera.position.y / dir.y;
  return camera.position.clone().addScaledVector(dir, t);
}

// The walls are fitted to what the camera actually sees, so a coin can never
// come to rest off-screen or underneath the result chip at the top.
function computeTray(camera, width, height) {
  const reservePx = Math.min(CHIP_RESERVE_PX, height * 0.3);
  const reserveNdcY = 1 - (2 * reservePx) / Math.max(1, height);
  const topL = ndcToTable(camera, -1, reserveNdcY);
  const topR = ndcToTable(camera, 1, reserveNdcY);
  const botL = ndcToTable(camera, -1, -1);
  const botR = ndcToTable(camera, 1, -1);
  const margin = COIN_RADIUS + 0.2;
  const halfX = Math.max(1.2, Math.min(-topL.x, topR.x, -botL.x, botR.x) - margin);
  const maxZ = Math.min(botL.z, botR.z) - margin;
  const minZ = Math.min(Math.max(topL.z, topR.z) + margin, maxZ - 2.4);
  return { minX: -halfX, maxX: halfX, minZ, maxZ };
}

// ─── Physics: simulate the whole flip first, then replay it ────────────────
// The result of each coin is decided up front (fair coin), so instead of
// steering a live simulation (the old scripted "tip-over" pop), the flight is
// simulated to rest at a fixed step, and the face that physics leaves on top
// is simply painted with the requested side. A coin is symmetric, so swapping
// which cap carries heads changes nothing physically — the motion you see is
// exactly the motion that was simulated.
function simulateFlip(coins, tray) {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -32, 0) });
  world.solver.iterations = 14;
  // Resting coins go to sleep: cheaper to simulate, no micro-jitter, and a
  // sleeping coin is our "has come to rest" signal. Contacts still wake them.
  world.allowSleep = true;

  const coinMat = new CANNON.Material('coin');
  const tableMat = new CANNON.Material('table');
  world.addContactMaterial(new CANNON.ContactMaterial(coinMat, tableMat, { friction: 0.38, restitution: 0.26 }));
  world.addContactMaterial(new CANNON.ContactMaterial(coinMat, coinMat, { friction: 0.3, restitution: 0.22 }));

  const addPlane = (x, z, angleAxis, angle) => {
    const body = new CANNON.Body({ mass: 0, material: tableMat });
    body.addShape(new CANNON.Plane());
    body.position.set(x, 0, z);
    body.quaternion.setFromAxisAngle(angleAxis, angle);
    world.addBody(body);
  };
  const X = new CANNON.Vec3(1, 0, 0);
  const Y = new CANNON.Vec3(0, 1, 0);
  addPlane(0, 0, X, -Math.PI / 2);              // table
  addPlane(tray.minX, 0, Y, Math.PI / 2);       // left wall (normal +x)
  addPlane(tray.maxX, 0, Y, -Math.PI / 2);      // right wall (normal -x)
  addPlane(0, tray.minZ, Y, 0);                 // far wall (normal +z)
  addPlane(0, tray.maxZ, Y, Math.PI);           // near wall (normal -z)

  // cannon-es cylinders are Y-aligned, same as THREE.CylinderGeometry.
  const shape = new CANNON.Cylinder(COIN_RADIUS, COIN_RADIUS, COIN_THICKNESS, 14);
  const n = coins.length;
  const cx = (tray.minX + tray.maxX) / 2;
  const cz = (tray.minZ + tray.maxZ) / 2;
  const spanX = tray.maxX - tray.minX;
  const spanZ = tray.maxZ - tray.minZ;

  const entries = coins.map((coin, i) => {
    const body = new CANNON.Body({ mass: 0.3, material: coinMat, linearDamping: 0.04, angularDamping: 0.06 });
    body.addShape(shape);
    body.allowSleep = true;
    body.sleepSpeedLimit = 0.12;
    body.sleepTimeLimit = 0.15;

    // Launch from just below centre (the player's side of the table), fanned
    // out so a handful of coins land spread rather than stacked.
    const ang = (i / Math.max(1, n)) * Math.PI * 2 + rand(-0.5, 0.5);
    const spread = n > 1 ? rand(0.5, 1) * Math.min(spanX, spanZ) * 0.18 : rand(0, 0.3);
    body.position.set(
      cx + Math.cos(ang) * spread,
      0.5 + rand(0, 0.25),
      cz + spanZ * 0.12 + Math.sin(ang) * spread
    );
    // More coins → wider fan, so they land side by side instead of piled up.
    const drift = n > 1 ? rand(1.1, 2.2) + n * 0.12 : rand(0.2, 0.7);
    body.velocity.set(
      Math.cos(ang) * drift + rand(-0.3, 0.3),
      rand(13.5, 16),
      Math.sin(ang) * drift - rand(0.9, 1.9)
    );
    body.quaternion.setFromEuler(rand(-0.15, 0.15), rand(0, Math.PI * 2), rand(-0.15, 0.15));

    // Thumb flick: fast end-over-end spin about a random horizontal axis.
    const axis = rand(0, Math.PI * 2);
    const spin = rand(24, 36) * (Math.random() < 0.5 ? -1 : 1);
    body.angularVelocity.set(Math.cos(axis) * spin, rand(-1.2, 1.2), Math.sin(axis) * spin);

    return {
      id: coin.id,
      result: coin.result === 'tails' ? 'tails' : 'heads',
      body,
      addStep: Math.round(i * STAGGER_SECONDS * SIM_HZ),
      added: false,
      localSteps: 0,
      frames: [],
      restFrame: null,
      landed: false,
      kicks: 0,
    };
  });

  const record = (e) => {
    const { position: p, quaternion: q } = e.body;
    e.frames.push([p.x, p.y, p.z, q.x, q.y, q.z, q.w]);
  };

  const up = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const isAsleep = (b) => b.sleepState === CANNON.Body.SLEEPING;

  const maxSteps = MAX_SIM_SECONDS * SIM_HZ;
  for (let step = 0; step < maxSteps; step++) {
    for (const e of entries) {
      if (!e.added && step >= e.addStep) {
        world.addBody(e.body);
        e.added = true;
        record(e);
      }
    }

    world.step(SIM_DT);

    for (const e of entries) {
      if (!e.added) continue;
      const b = e.body;
      e.localSteps += 1;

      // Once a coin is back on the table, scrub its spin and slide quickly:
      // cannon's faceted cylinder under-models rim friction, so without this
      // coins wobble and skate far longer than a real coin does.
      if (!e.landed && b.position.y < COIN_THICKNESS * 3 && b.velocity.y <= 0.5) {
        e.landed = true;
        b.linearDamping = 0.4;
        b.angularDamping = 0.7;
      }

      if (isAsleep(b) && e.localSteps > SIM_HZ * 0.3) {
        q.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
        up.set(0, 1, 0).applyQuaternion(q);
        if (Math.abs(up.y) < 0.8 && e.kicks < 4) {
          // Came to rest propped on its edge (against a wall or another
          // coin): topple it with a small physical nudge, like a bumped table.
          e.kicks += 1;
          e.restFrame = null;
          const axis = new THREE.Vector3().crossVectors(up, new THREE.Vector3(0, 1, 0)).normalize();
          b.wakeUp();
          b.velocity.y += 1.4;
          b.angularVelocity.set(axis.x * 6, 0, axis.z * 6);
        } else if (e.restFrame === null) {
          e.restFrame = e.frames.length;
        }
      } else if (e.restFrame !== null && !isAsleep(b) && b.velocity.length() > 0.2) {
        e.restFrame = null; // knocked loose by another coin
      }

      if (e.localSteps % RECORD_EVERY === 0) record(e);
    }

    if (entries.every((e) => e.added && isAsleep(e.body) && e.restFrame !== null)) {
      entries.forEach(record); // final resting pose
      break;
    }
  }

  const finals = entries.map((e) => e.frames[e.frames.length - 1]);

  return entries.map((e, idx) => {
    const last = finals[idx];
    const q = new THREE.Quaternion(last[3], last[4], last[5], last[6]);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);

    // Still propped up after the nudges (against an invisible wall or a
    // neighbour) or caught mid-topple by the time cap — rare: lay it onto
    // its nearer face over a short ease so the result is never ambiguous and
    // nothing is left leaning on thin air or frozen mid-fall.
    if (Math.abs(up.y) < 0.9) {
      const flat = new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3(0, up.y >= 0 ? 1 : -1, 0)).multiply(q);
      const from = q.clone();
      // Come to rest on top of any coin it overlaps, not through it.
      const under = finals.filter((f, j) => j !== idx && Math.hypot(f[0] - last[0], f[2] - last[2]) < COIN_RADIUS * 1.8);
      const restY = COIN_THICKNESS / 2 + (under.length ? COIN_THICKNESS : 0);
      const steps = Math.round(0.3 / KEYFRAME_DT);
      for (let k = 1; k <= steps; k++) {
        const t = k / steps;
        const ease = 1 - Math.pow(1 - t, 3);
        const qq = from.clone().slerp(flat, ease);
        const y = THREE.MathUtils.lerp(last[1], restY, ease);
        e.frames.push([last[0], y, last[2], qq.x, qq.y, qq.z, qq.w]);
      }
      e.restFrame = e.frames.length - 1;
      up.set(0, 1, 0).applyQuaternion(flat);
    }

    return {
      id: e.id,
      result: e.result,
      startTime: e.addStep / SIM_HZ,
      frames: e.frames,
      // Label appears once the coin has come to rest (or at its last frame).
      settleTime: e.addStep / SIM_HZ + (e.restFrame ?? e.frames.length - 1) * KEYFRAME_DT,
      endTime: e.addStep / SIM_HZ + (e.frames.length - 1) * KEYFRAME_DT,
      topCapUp: up.y >= 0,
    };
  });
}

// ─── Coin face art ──────────────────────────────────────────────────────────
// Emblems are drawn in a normalized space (-1..1) on an offscreen canvas in
// white, then used three ways: tinted for the colour map, as the relief of the
// bump map, and offset dark for an engraved drop shadow.
export function drawEmblemShape(ctx, symbolType, isHeads) {
  const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
  const star = (points, rOuter, rInner, rot = -Math.PI / 2) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? rOuter : rInner;
      const a = rot + (i * Math.PI) / points;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  };
  const cutOut = (fn) => {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    fn();
    ctx.restore();
  };
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (symbolType) {
    case 'crown_sun':
      if (isHeads) {
        ctx.beginPath();
        ctx.moveTo(-0.62, 0.3);
        ctx.lineTo(-0.74, -0.34);
        ctx.lineTo(-0.34, -0.02);
        ctx.lineTo(0, -0.56);
        ctx.lineTo(0.34, -0.02);
        ctx.lineTo(0.74, -0.34);
        ctx.lineTo(0.62, 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-0.66, 0.36, 1.32, 0.18);
        circle(-0.74, -0.42, 0.09);
        circle(0, -0.66, 0.1);
        circle(0.74, -0.42, 0.09);
        cutOut(() => { circle(-0.33, 0.45, 0.045); circle(0, 0.45, 0.045); circle(0.33, 0.45, 0.045); });
      } else {
        star(16, 0.78, 0.5);
        cutOut(() => circle(0, 0, 0.42));
        circle(0, 0, 0.34);
      }
      break;
    case 'moon_star':
      if (isHeads) {
        circle(-0.08, 0, 0.66);
        cutOut(() => circle(0.2, -0.12, 0.56));
        ctx.save();
        ctx.translate(0.32, 0.12);
        star(4, 0.2, 0.06);
        ctx.restore();
      } else {
        star(8, 0.76, 0.3, -Math.PI / 2);
        cutOut(() => circle(0, 0, 0.12));
      }
      break;
    case 'shield_swords':
      if (isHeads) {
        ctx.beginPath();
        ctx.moveTo(-0.56, -0.62);
        ctx.lineTo(0.56, -0.62);
        ctx.lineTo(0.56, 0.02);
        ctx.quadraticCurveTo(0.5, 0.52, 0, 0.78);
        ctx.quadraticCurveTo(-0.5, 0.52, -0.56, 0.02);
        ctx.closePath();
        ctx.fill();
        cutOut(() => {
          ctx.beginPath();
          ctx.moveTo(-0.44, -0.08); ctx.lineTo(0, 0.24); ctx.lineTo(0.44, -0.08);
          ctx.lineTo(0.44, 0.08); ctx.lineTo(0, 0.4); ctx.lineTo(-0.44, 0.08);
          ctx.closePath(); ctx.fill();
        });
      } else {
        [-1, 1].forEach((dir) => {
          ctx.save();
          ctx.rotate((dir * Math.PI) / 4);
          ctx.beginPath();
          ctx.moveTo(0, -0.82); ctx.lineTo(0.07, -0.68); ctx.lineTo(0.07, 0.36);
          ctx.lineTo(-0.07, 0.36); ctx.lineTo(-0.07, -0.68); ctx.closePath(); ctx.fill();
          ctx.fillRect(-0.24, 0.36, 0.48, 0.08);
          ctx.fillRect(-0.045, 0.44, 0.09, 0.24);
          circle(0, 0.74, 0.08);
          ctx.restore();
        });
      }
      break;
    case 'arcana_compass':
      if (isHeads) {
        star(4, 0.8, 0.17);
        ctx.save(); ctx.rotate(Math.PI / 4); star(4, 0.46, 0.13); ctx.restore();
        ctx.lineWidth = 0.06;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath(); ctx.arc(0, 0, 0.56, 0, Math.PI * 2); ctx.stroke();
        cutOut(() => circle(0, 0, 0.07));
      } else {
        ctx.lineWidth = 0.13;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(0, -0.7); ctx.lineTo(0, 0.7);
        ctx.moveTo(0, -0.12); ctx.lineTo(-0.42, -0.6);
        ctx.moveTo(0, -0.12); ctx.lineTo(0.42, -0.6);
        ctx.moveTo(0, 0.2); ctx.lineTo(-0.36, 0.56);
        ctx.moveTo(0, 0.2); ctx.lineTo(0.36, 0.56);
        ctx.stroke();
      }
      break;
    case 'void_eye':
      if (isHeads) {
        ctx.beginPath();
        ctx.moveTo(-0.8, 0);
        ctx.quadraticCurveTo(0, -0.62, 0.8, 0);
        ctx.quadraticCurveTo(0, 0.62, -0.8, 0);
        ctx.fill();
        cutOut(() => circle(0, 0, 0.3));
        circle(0, 0, 0.17);
      } else {
        ctx.lineWidth = 0.09;
        ctx.strokeStyle = ctx.fillStyle;
        for (let i = 0; i < 3; i++) {
          const r = 0.28 + i * 0.22;
          const a0 = i * 1.3;
          ctx.beginPath(); ctx.arc(0, 0, r, a0, a0 + Math.PI * 1.45); ctx.stroke();
        }
        circle(0, 0, 0.1);
      }
      break;
    case 'phoenix_shield':
      if (isHeads) {
        ctx.beginPath();
        ctx.moveTo(0, -0.78);
        ctx.bezierCurveTo(0.22, -0.42, 0.58, -0.2, 0.46, 0.24);
        ctx.bezierCurveTo(0.38, 0.6, 0.12, 0.74, 0, 0.74);
        ctx.bezierCurveTo(-0.12, 0.74, -0.38, 0.6, -0.46, 0.24);
        ctx.bezierCurveTo(-0.56, -0.12, -0.24, -0.3, -0.16, -0.5);
        ctx.bezierCurveTo(-0.1, -0.3, 0.02, -0.4, 0, -0.78);
        ctx.fill();
        cutOut(() => {
          ctx.beginPath();
          ctx.moveTo(0.02, -0.1);
          ctx.bezierCurveTo(0.2, 0.1, 0.26, 0.4, 0, 0.54);
          ctx.bezierCurveTo(-0.24, 0.42, -0.18, 0.14, 0.02, -0.1);
          ctx.fill();
        });
      } else {
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = ctx.fillStyle;
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          ctx.beginPath(); ctx.arc(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0.3, 0, Math.PI * 2); ctx.stroke();
        }
      }
      break;
    case 'gear_clockwork':
    default:
      if (isHeads) {
        circle(0, 0, 0.52);
        for (let i = 0; i < 10; i++) {
          ctx.save();
          ctx.rotate((i / 10) * Math.PI * 2);
          ctx.fillRect(-0.1, -0.74, 0.2, 0.3);
          ctx.restore();
        }
        cutOut(() => circle(0, 0, 0.2));
      } else {
        ctx.beginPath();
        ctx.moveTo(-0.42, -0.6); ctx.lineTo(0.42, -0.6); ctx.lineTo(0.06, 0);
        ctx.lineTo(0.42, 0.6); ctx.lineTo(-0.42, 0.6); ctx.lineTo(-0.06, 0);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(-0.56, -0.74, 1.12, 0.12);
        ctx.fillRect(-0.56, 0.62, 1.12, 0.12);
      }
      break;
  }
}

function renderEmblemMask(size, symbolType, isHeads, scale) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  drawEmblemShape(ctx, symbolType, isHeads);
  return c;
}

function tintedCopy(mask, color) {
  const c = document.createElement('canvas');
  c.width = mask.width;
  c.height = mask.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(mask, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

function shade(hex, amount) {
  const c = new THREE.Color(hex);
  return `#${c.lerp(new THREE.Color(amount > 0 ? '#ffffff' : '#000000'), Math.abs(amount)).getHexString()}`;
}

const FACE_SIZE = 512;

function createCoinFaceTextures(side, theme) {
  const size = FACE_SIZE;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;
  const isHeads = side === 'heads';

  // ── Colour map ──
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Full-bleed base: the cylinder cap samples right to the canvas edge, so
  // nothing may be left transparent (that rendered as a black ring before).
  ctx.fillStyle = theme.secondaryColor;
  ctx.fillRect(0, 0, size, size);

  // Field — struck metal lit from the upper left.
  const field = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
  field.addColorStop(0, shade(theme.primaryColor, 0.12));
  field.addColorStop(0.55, theme.primaryColor);
  field.addColorStop(1, theme.secondaryColor);
  ctx.fillStyle = field;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // Fine patina so the field isn't plastic-flat.
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * R * 0.8;
    ctx.fillStyle = Math.random() < 0.5 ? '#000000' : '#ffffff';
    ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1 + Math.random() * 2, 1);
  }
  ctx.restore();

  // Raised rim: a lit band with a recessed line inside it.
  const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  rim.addColorStop(0, shade(theme.primaryColor, 0.35));
  rim.addColorStop(0.5, theme.primaryColor);
  rim.addColorStop(1, shade(theme.secondaryColor, -0.25));
  ctx.lineWidth = R * 0.11;
  ctx.strokeStyle = rim;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.93, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = R * 0.018;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.865, 0, Math.PI * 2);
  ctx.stroke();

  // Beaded border.
  const beads = 48;
  for (let i = 0; i < beads; i++) {
    const a = (i / beads) * Math.PI * 2;
    const bx = cx + Math.cos(a) * R * 0.8;
    const by = cy + Math.sin(a) * R * 0.8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath(); ctx.arc(bx + 1.5, by + 2, R * 0.017, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shade(theme.primaryColor, 0.45);
    ctx.beginPath(); ctx.arc(bx, by, R * 0.017, 0, Math.PI * 2); ctx.fill();
  }

  // Emblem: engraved shadow, metal body, top-left highlight.
  const emblemScale = R * 0.6;
  const mask = renderEmblemMask(size, theme.symbolType, isHeads, emblemScale);
  const emblemColor = shade(theme.primaryColor, 0.2);
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.drawImage(tintedCopy(mask, shade(theme.secondaryColor, -0.6)), 3, 5);
  ctx.restore();
  ctx.drawImage(tintedCopy(mask, emblemColor), 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.drawImage(tintedCopy(mask, '#ffffff'), -1.5, -2);
  ctx.restore();

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  // ── Bump map (relief) ──
  const bump = document.createElement('canvas');
  bump.width = size;
  bump.height = size;
  const b = bump.getContext('2d');
  b.fillStyle = '#7a7a7a';
  b.fillRect(0, 0, size, size);
  b.lineWidth = R * 0.11;
  b.strokeStyle = '#d8d8d8';
  b.beginPath(); b.arc(cx, cy, R * 0.93, 0, Math.PI * 2); b.stroke();
  b.lineWidth = R * 0.018;
  b.strokeStyle = '#404040';
  b.beginPath(); b.arc(cx, cy, R * 0.865, 0, Math.PI * 2); b.stroke();
  for (let i = 0; i < beads; i++) {
    const a = (i / beads) * Math.PI * 2;
    b.fillStyle = '#e0e0e0';
    b.beginPath(); b.arc(cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8, R * 0.017, 0, Math.PI * 2); b.fill();
  }
  b.filter = 'blur(2px)';
  b.drawImage(tintedCopy(mask, '#e6e6e6'), 0, 0);
  b.filter = 'none';
  const bumpMap = new THREE.CanvasTexture(bump);
  bumpMap.anisotropy = 8;

  return { map, bumpMap };
}

function createCoinEdgeTexture(theme) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = shade(theme.secondaryColor, -0.1);
  ctx.fillRect(0, 0, 512, 32);
  // Reeded edge: fine vertical ridges.
  const grooves = 96;
  const w = 512 / grooves;
  for (let i = 0; i < grooves; i++) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.fillRect(i * w, 0, w * 0.45, 32);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(i * w + w * 0.5, 0, w * 0.2, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

// ─── Component ──────────────────────────────────────────────────────────────
const PhysicsCoinScene = ({ flip, onFlipComplete, onDismiss }) => {
  const mountRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [results, setResults] = useState(null);
  const onCompleteRef = useRef(onFlipComplete);
  onCompleteRef.current = onFlipComplete;

  const flipId = flip?.id;
  const theme = COIN_THEMES[flip?.theme] || COIN_THEMES.ancient_gold;

  useEffect(() => {
    const mount = mountRef.current;
    if (!flip || !mount || !flip.coins?.length) return undefined;

    setMarkers([]);
    setResults(null);

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const coinTheme = COIN_THEMES[flip.theme] || COIN_THEMES.ancient_gold;

    const camera = createCamera(width, height);
    const tray = computeTray(camera, width, height);
    const plan = simulateFlip(flip.coins, tray);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    scene.environment = envTexture;
    scene.environmentIntensity = 0.42;

    scene.add(new THREE.AmbientLight(0xfff6e8, 0.35));
    const key = new THREE.DirectionalLight(0xfff3e0, 1.35);
    key.position.set(5, 20, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0004;
    key.shadow.radius = 3;
    const extent = Math.max(tray.maxX, tray.maxZ - tray.minZ) + 2;
    Object.assign(key.shadow.camera, { left: -extent, right: extent, top: extent, bottom: -extent, near: 1, far: 40 });
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc8d6ff, 0.35);
    fill.position.set(-8, 10, -6);
    scene.add(fill);

    // Invisible table that only catches the coins' soft shadows.
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.ShadowMaterial({ color: 0x2a1d12, opacity: 0.24 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const heads = createCoinFaceTextures('heads', coinTheme);
    const tails = createCoinFaceTextures('tails', coinTheme);
    const edgeTex = createCoinEdgeTexture(coinTheme);
    const faceParams = {
      bumpScale: 1.6,
      metalness: Math.min(0.85, coinTheme.metallic ?? 0.7),
      roughness: Math.max(0.3, coinTheme.roughness ?? 0.35),
    };
    const headsMat = new THREE.MeshStandardMaterial({ map: heads.map, bumpMap: heads.bumpMap, ...faceParams });
    const tailsMat = new THREE.MeshStandardMaterial({ map: tails.map, bumpMap: tails.bumpMap, ...faceParams });
    const rimMat = new THREE.MeshStandardMaterial({ map: edgeTex, metalness: faceParams.metalness, roughness: faceParams.roughness + 0.05 });
    const coinGeo = new THREE.CylinderGeometry(COIN_RADIUS, COIN_RADIUS, COIN_THICKNESS, 64);

    const coins = plan.map((p) => {
      // Cylinder material groups: [side, top cap (+Y), bottom cap (-Y)].
      // Paint the requested side on whichever cap physics leaves facing up.
      const up = p.result === 'heads' ? headsMat : tailsMat;
      const down = p.result === 'heads' ? tailsMat : headsMat;
      const mesh = new THREE.Mesh(coinGeo, p.topCapUp ? [rimMat, up, down] : [rimMat, down, up]);
      mesh.castShadow = true;
      mesh.visible = false;
      scene.add(mesh);
      return { ...p, mesh, labelled: false };
    });

    const qa = new THREE.Quaternion();
    const qb = new THREE.Quaternion();
    const poseAt = (coin, t) => {
      const local = t - coin.startTime;
      if (local < 0) return false;
      const f = local / KEYFRAME_DT;
      const last = coin.frames.length - 1;
      const i0 = Math.min(Math.floor(f), last);
      const i1 = Math.min(i0 + 1, last);
      const a = Math.min(1, f - i0);
      const A = coin.frames[i0];
      const B = coin.frames[i1];
      coin.mesh.position.set(
        A[0] + (B[0] - A[0]) * a,
        A[1] + (B[1] - A[1]) * a,
        A[2] + (B[2] - A[2]) * a
      );
      qa.set(A[3], A[4], A[5], A[6]);
      qb.set(B[3], B[4], B[5], B[6]);
      coin.mesh.quaternion.slerpQuaternions(qa, qb, a);
      return true;
    };

    const toScreen = (coin) => {
      const p = coin.mesh.position.clone().project(camera);
      const edge = coin.mesh.position.clone().add(new THREE.Vector3(0, 0, -COIN_RADIUS)).project(camera);
      const x = ((p.x + 1) * width) / 2;
      const yCenter = ((-p.y + 1) * height) / 2;
      const yTop = ((-edge.y + 1) * height) / 2;
      return { x, y: Math.min(yCenter, yTop) - 6 };
    };

    // Lay the tags out so two coins that landed close (or stacked) don't print
    // their tags on top of each other: nudge the later one upward.
    const layoutMarkers = (list) => {
      const placed = [];
      list
        .map((c) => ({ id: c.id, result: c.result, ...toScreen(c) }))
        .sort((a, b) => b.y - a.y)
        .forEach((m) => {
          let y = m.y;
          for (let guard = 0; guard < 10; guard++) {
            const hit = placed.find((p) => Math.abs(p.x - m.x) < 62 && Math.abs(p.y - y) < 19);
            if (!hit) break;
            y = hit.y - 20;
          }
          placed.push({ ...m, y });
        });
      return placed;
    };

    const duration = Math.max(...coins.map((c) => c.endTime));
    let raf = 0;
    let finished = false;
    const start = performance.now();

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      let labelsChanged = false;

      coins.forEach((coin) => {
        coin.mesh.visible = poseAt(coin, t);
        if (!coin.labelled && t >= coin.settleTime) {
          coin.labelled = true;
          labelsChanged = true;
        }
      });

      renderer.render(scene, camera);

      if (labelsChanged) {
        setMarkers(layoutMarkers(coins.filter((c) => c.labelled)));
      }

      if (t >= duration) {
        if (!finished) {
          finished = true;
          // Final positions (a coin nudged after its label appeared moves the label too).
          setMarkers(layoutMarkers(coins));
          const out = coins.map((c) => ({ id: c.id, result: c.result }));
          setResults(out);
          if (onCompleteRef.current) onCompleteRef.current(out);
        }
        return; // static from here on — no need to keep rendering
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const handleResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
      coins.forEach((c) => scene.remove(c.mesh));
      [coinGeo, groundGeo].forEach((g) => g.dispose());
      [headsMat, tailsMat, rimMat, groundMat].forEach((m) => m.dispose());
      [heads.map, heads.bumpMap, tails.map, tails.bumpMap, edgeTex, envTexture].forEach((tex) => tex.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // A new flip id restarts the scene; theme/coins are captured with the flip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipId]);

  if (!flip) return null;

  const shown = results || [];
  const headsCount = shown.filter((c) => c.result === 'heads').length;
  const tailsCount = shown.length - headsCount;
  const single = shown.length === 1;

  return (
    <div
      className={`physics-coin-overlay ${results ? 'settled' : ''}`}
      onClick={results ? onDismiss : undefined}
      title={results ? 'Click anywhere to clear the coins' : undefined}
    >
      <div className="coin-canvas-container" ref={mountRef} />

      {markers.map((m) => (
        <div
          key={m.id}
          className={`landed-coin-marker ${m.result}`}
          style={{ left: `${m.x}px`, top: `${m.y}px` }}
        >
          {m.result === 'heads' ? 'Heads' : 'Tails'}
        </div>
      ))}

      {results && (
        <div className="coin-3d-result-area" onClick={(e) => e.stopPropagation()}>
          <div className="coin-result-main">
            <span className="coin-result-label">{single ? 'Coin flip' : `${shown.length} coins`}</span>
            {single ? (
              <span className="coin-result-value">{headsCount ? 'Heads' : 'Tails'}</span>
            ) : (
              <span className="coin-result-value">
                {headsCount} heads <span className="coin-result-sep">·</span> {tailsCount} tails
              </span>
            )}
            <span className="coin-theme-badge">{theme.name}</span>
          </div>
          <button type="button" className="coin-close-btn" onClick={onDismiss}>
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicsCoinScene;
