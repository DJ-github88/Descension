import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { DICE_PRESETS } from '../../store/diceStore';
import './PhysicsDiceScene.css';

const FONT = "'Cinzel', 'Times New Roman', serif";

function createNumberTexture(num, type) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  let displayNum = num.toString();
  if (type === 'd10' && num === 10) displayNum = '0';
  if (type === 'dpercent') displayNum = (num * 10).toString().padStart(2, '0');

  ctx.fillStyle = '#c9a84c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = displayNum.length > 2 ? 90 : displayNum.length > 1 ? 110 : 130;
  ctx.font = `bold ${fontSize}px ${FONT}`;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText(displayNum, size / 2, size / 2);

  if (displayNum === '6' || displayNum === '9') {
    ctx.fillRect(size / 2 - 30, size / 2 + 65, 60, 6);
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createNumberTextureWithColor(num, type, numberColor) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  let displayNum = num.toString();
  if (type === 'd10' && num === 10) displayNum = '0';
  if (type === 'dpercent') displayNum = (num * 10).toString().padStart(2, '0');

  ctx.fillStyle = numberColor || '#c9a84c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = displayNum.length > 2 ? 90 : displayNum.length > 1 ? 110 : 130;
  ctx.font = `bold ${fontSize}px ${FONT}`;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText(displayNum, size / 2, size / 2);

  if (displayNum === '6' || displayNum === '9') {
    ctx.fillRect(size / 2 - 30, size / 2 + 65, 60, 6);
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createD4FaceTexture(nTop, nRight, nLeft, numberColor) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = numberColor || '#c9a84c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold 80px ${FONT}`;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const R = 95;
  const cx = 256, cy = 256;

  ctx.save();
  ctx.translate(cx, cy - R);
  ctx.fillText(nTop, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(cx + R * Math.cos(Math.PI / 6), cy + R * Math.sin(Math.PI / 6));
  ctx.rotate(120 * Math.PI / 180);
  ctx.fillText(nRight, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(cx - R * Math.cos(Math.PI / 6), cy + R * Math.sin(Math.PI / 6));
  ctx.rotate(-120 * Math.PI / 180);
  ctx.fillText(nLeft, 0, 0);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
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
  if (type === 'd6') return new THREE.BoxGeometry(1.4, 1.4, 1.4);
  if (type === 'd8') return new THREE.OctahedronGeometry(1.3);
  if (type === 'd12') return new THREE.DodecahedronGeometry(1.1);
  if (type === 'd20') return new THREE.IcosahedronGeometry(1.2);
  if (type === 'd10' || type === 'dpercent') return generateD10Geometry();
}

function createInnerParticles(preset, innerColor) {
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

  const color = new THREE.Color(innerColor || '#ffffff');
  const material = new THREE.PointsMaterial({
    color: color,
    size: 0.1,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.userData = { velocities, lifetimes, effect };

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
    particles.material.size = 0.18;
  } else if (effect === 'fire' && Math.random() < 0.15) {
    particles.material.opacity = 1.0;
    particles.material.size = 0.16;
  } else {
    particles.material.opacity += (0.75 - particles.material.opacity) * dt * 5;
    particles.material.size += (0.1 - particles.material.size) * dt * 5;
  }
}

function createOuterParticles(preset) {
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

  const material = new THREE.PointsMaterial({
    size: effect === 'lightning' ? 0.14 : effect === 'fire' ? 0.12 : 0.1,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  points.userData = { velocities, lifetimes, maxLifetimes, effect };
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
      particles.material.size = 0.22;
    } else {
      particles.material.opacity += (0.5 - particles.material.opacity) * dt * 8;
      particles.material.size += (0.14 - particles.material.size) * dt * 8;
    }
  } else if (effect === 'fire') {
    if (Math.random() < 0.1) {
      particles.material.opacity = 1.0;
      particles.material.size = 0.2;
    } else {
      particles.material.opacity += (0.7 - particles.material.opacity) * dt * 4;
      particles.material.size += (0.12 - particles.material.size) * dt * 4;
    }
  } else if (effect === 'frost') {
    if (Math.random() < 0.06) {
      particles.material.opacity = 1.0;
      particles.material.size = 0.18;
    } else {
      particles.material.opacity += (0.65 - particles.material.opacity) * dt * 3;
      particles.material.size += (0.1 - particles.material.size) * dt * 3;
    }
  } else if (effect === 'void') {
    particles.material.opacity += (0.55 - particles.material.opacity) * dt * 2;
    particles.material.size += (0.1 - particles.material.size) * dt * 2;
  } else if (effect === 'nature') {
    particles.material.opacity += (0.6 - particles.material.opacity) * dt * 3;
    particles.material.size += (0.1 - particles.material.size) * dt * 3;
  }
}

function createGlowAura(preset) {
  if (!preset || !preset.glowColor) return null;

  const glowColor = new THREE.Color(preset.glowColor);
  const geometry = new THREE.SphereGeometry(1.8, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: preset.glowIntensity * 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {
    baseIntensity: preset.glowIntensity,
    baseOpacity: preset.glowIntensity * 0.3,
    phase: Math.random() * Math.PI * 2,
    effect: preset.innerEffect || preset.outerEffect,
  };

  return mesh;
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
  const bodyColor = colorHex || (preset ? preset.bodyColor : '#1a0f30');
  const emissive = preset ? preset.emissive : '#1a0f30';
  const emissiveIntensity = preset ? preset.emissiveIntensity : 0.15;
  const transparent = preset ? preset.transparent : false;
  const opacity = preset ? preset.opacity : 1.0;
  const roughness = preset ? (preset.roughness !== undefined ? preset.roughness : 0.2) : 0.2;
  const metalness = preset ? (preset.metalness !== undefined ? preset.metalness : 0.6) : 0.6;

  let geom = generateBaseGeometry(type);
  geom = geom.toNonIndexed();
  geom.computeVertexNormals();

  const posAttr = geom.attributes.position;
  const sides = [];

  for (let i = 0; i < posAttr.count; i += 3) {
    const vA = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    const vB = new THREE.Vector3(posAttr.getX(i + 1), posAttr.getY(i + 1), posAttr.getZ(i + 1));
    const vC = new THREE.Vector3(posAttr.getX(i + 2), posAttr.getY(i + 2), posAttr.getZ(i + 2));

    const faceNormal = new THREE.Vector3().subVectors(vB, vA).cross(new THREE.Vector3().subVectors(vC, vA)).normalize();

    const tolerance = (type === 'd10' || type === 'dpercent') ? 0.2 : 0.05;
    let side = sides.find(s => s.normal.angleTo(faceNormal) < tolerance);
    if (!side) {
      side = { normal: faceNormal.clone(), vertices: [], centroid: new THREE.Vector3() };
      sides.push(side);
    } else {
      side.normal.add(faceNormal).normalize();
    }
    side.vertices.push(vA, vB, vC);
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

      const plateMat = new THREE.MeshStandardMaterial({
        map: createD4FaceTexture(nTop, nRight, nLeft, numberColor), transparent: true,
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

    const solidMat = new THREE.MeshStandardMaterial({
      color: bodyColor, roughness: roughness, metalness: metalness,
      emissive: emissive, emissiveIntensity: emissiveIntensity,
      transparent: transparent, opacity: opacity
    });
    const mesh = new THREE.Mesh(geom, solidMat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2, transparent: true, opacity: 0.8 })
    );
    group.add(edges);

    const innerParticles = createInnerParticles(preset, preset?.innerColor);
    if (innerParticles) group.add(innerParticles);

    const outerParticles = createOuterParticles(preset);
    if (outerParticles) group.add(outerParticles);

    const glowAura = createGlowAura(preset);
    if (glowAura) group.add(glowAura);

    const themeGeometry = createThemeGeometry(preset);
    if (themeGeometry) group.add(themeGeometry);

    return { group, sides, maxNumber: 4, d4Verts: uniqueVerts, innerParticles, outerParticles, glowAura, themeGeometry };
  }

  let numbers = [];
  if (type === 'dpercent') {
    numbers = [10, 2, 8, 4, 6, 3, 7, 5, 1, 9];
  } else if (N === 10) {
    numbers = [10, 2, 8, 4, 6, 3, 7, 5, 1, 9];
  } else if (N === 20) {
    numbers = [20, 1, 14, 9, 12, 5, 8, 13, 3, 18, 7, 16, 2, 19, 6, 15, 11, 10, 4, 17];
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
    const sum = new THREE.Vector3();
    side.vertices.forEach(v => sum.add(v));
    side.centroid = sum.divideScalar(side.vertices.length);
    side.num = numbers[i];

    let pSize = type === 'd20' ? 0.65 : (type === 'd10' || type === 'dpercent') ? 0.6 : type === 'd12' ? 0.7 : 0.8;
    const plateMat = new THREE.MeshStandardMaterial({
      map: createNumberTextureWithColor(side.num, type, numberColor), transparent: true,
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
      plate.position.copy(side.centroid).multiplyScalar(type === 'd20' ? 1.02 : 1.03);
      plate.lookAt(side.centroid.clone().add(side.normal));
    }

    group.add(plate);
    side.plate = plate;
  });

  const solidMat = new THREE.MeshStandardMaterial({
    color: bodyColor, roughness: roughness, metalness: metalness,
    emissive: emissive, emissiveIntensity: emissiveIntensity,
    transparent: transparent, opacity: opacity
  });
  const mesh = new THREE.Mesh(geom, solidMat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  group.add(mesh);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2, transparent: true, opacity: 0.8 })
  );
  group.add(edges);

  const innerParticles = createInnerParticles(preset, preset?.innerColor);
  if (innerParticles) group.add(innerParticles);

  const outerParticles = createOuterParticles(preset);
  if (outerParticles) group.add(outerParticles);

  const glowAura = createGlowAura(preset);
  if (glowAura) group.add(glowAura);

  const themeGeometry = createThemeGeometry(preset);
  if (themeGeometry) group.add(themeGeometry);

  return { group, sides, maxNumber: N, innerParticles, outerParticles, glowAura, themeGeometry };
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
  const gridRef = useRef(null);

  const getPreset = useCallback(() => {
    return DICE_PRESETS[activePreset] || DICE_PRESETS.classic;
  }, [activePreset]);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a10, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 24, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0x3a3a50, 0.8));

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.5);
    keyLight.position.set(4, 20, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    const d = 14;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x5a7aaa, 0.9);
    fillLight.position.set(-8, 10, -8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x6688cc, 0.6);
    rimLight.position.set(0, 5, -12);
    scene.add(rimLight);

    const dieGlow = new THREE.PointLight(0xffd060, 0, 10);
    dieGlowRef.current = dieGlow;
    scene.add(dieGlow);

    const preset = DICE_PRESETS[activePreset] || DICE_PRESETS.classic;
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: preset.groundColor || 0x14141c, roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    groundMeshRef.current = ground;

    const gridHelper = new THREE.GridHelper(100, 50, 0x303040, 0x1e1e28);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

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
    });
    activeDiceRef.current = [];
    resultsRef.current = [];
    settlingFramesRef.current = [];
    onCompleteFiredRef.current = false;
    setResultState(null);

    const { x: boundX, z: boundZ } = boundsRef.current;
    const preset = getPreset();

    const count = diceToRoll.length;
    const angleStep = (Math.PI * 2) / count;

    diceToRoll.forEach((die, index) => {
      const diceType = die.type;
      const diceObj = buildDiceObject(diceType, diceColor, preset, renderer, scene);
      const geom = generateBaseGeometry(diceType).toNonIndexed();
      geom.computeVertexNormals();
      const shape = createPhysicsBody(geom);
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
            const groupKey = diceToRoll[idx]?.id?.replace(/_[dp][0-9]*$/, '') || `pair_${idx}`;
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
        const maxValues = results.map(r => {
          const diceType = r.type.replace('d', '');
          return parseInt(diceType) || 20;
        });
        const hasCrit = results.some((r, i) => r.value === maxValues[i] && r.type !== 'd100');
        const hasFail = results.some(r => r.value === 1);

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
      updateBounds(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible, updateBounds]);

  useEffect(() => {
    return () => {
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

  const handleClickBackground = useCallback((e) => {
    if (e.target.closest('.dice-3d-result-area') || e.target.closest('.dice-3d-reroll-btn') || e.target.closest('.dice-3d-close-btn')) {
      return;
    }
    if (onDismiss && resultState && !isRolling) {
      onDismiss();
    }
  }, [onDismiss, resultState, isRolling]);

  const formatResultDisplay = useCallback((value, type) => {
    if (type === 'd10' && value === 10) return '0';
    if (type === 'dpercent') return value.toString().padStart(2, '0');
    if (type === 'd100') return value.toString();
    return value.toString();
  }, []);

  return (
    <div className={`dice-3d-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClickBackground}>
      <div className="dice-3d-canvas-container" ref={containerRef} />

      {resultState && (
        <div className={`dice-3d-result-area ${resultState.hasCrit ? 'crit' : ''} ${resultState.hasFail ? 'fail' : ''}`}>
          <div className="dice-3d-result-label">Result</div>
          <div className={`dice-3d-result-number ${resultState.hasCrit ? 'nat20' : ''} ${resultState.hasFail ? 'nat1' : ''}`}>
            {resultState.results.length === 1
              ? formatResultDisplay(resultState.results[0].value, resultState.results[0].type)
              : resultState.total}
          </div>
          {resultState.results.length > 1 && (
            <div className="dice-3d-result-breakdown">
              {resultState.results.map((r, i) => (
                <span key={i} className="dice-3d-breakdown-item">
                  {r.type === 'd100'
                    ? `D100: ${r.percentileValue !== undefined ? String(r.percentileValue).padStart(2, '0') : ''}+${r.d10Value || 0} = ${r.value}`
                    : `${r.type.toUpperCase()}: ${formatResultDisplay(r.value, r.type)}`}
                </span>
              ))}
            </div>
          )}
          <div className={`dice-3d-result-flavor ${resultState.hasCrit ? 'nat20' : ''} ${resultState.hasFail ? 'nat1' : ''}`}>
            {resultState.hasCrit ? 'MAXIMUM DAMAGE!' : resultState.hasFail ? 'CRITICAL FAILURE.' : `Total: ${resultState.total}`}
          </div>
          <div className="dice-3d-result-actions">
            <button className="dice-3d-reroll-btn" onClick={(e) => { e.stopPropagation(); throwAllDice(); }}>
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
