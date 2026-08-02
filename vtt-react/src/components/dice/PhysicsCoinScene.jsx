import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as CANNON from 'cannon-es';
import './PhysicsCoinScene.css';

// Coin Themes Definition with PBR properties and emblem definitions
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

// Draw classical embossed vector emblems with crisp contrast
function drawCoinEmblem(ctx, cx, cy, radius, symbolType, isHeads, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;

  if (symbolType === 'crown_sun') {
    if (isHeads) {
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy + 20);
      ctx.lineTo(cx - 60, cy - 30);
      ctx.lineTo(cx - 25, cy - 5);
      ctx.lineTo(cx, cy - 45);
      ctx.lineTo(cx + 25, cy - 5);
      ctx.lineTo(cx + 60, cy - 30);
      ctx.lineTo(cx + 50, cy + 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      [cx - 60, cx, cx + 60].forEach((px) => {
        ctx.beginPath();
        ctx.arc(px, cy - 35, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 30, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 36, cy - 10 + Math.sin(a) * 36);
        ctx.lineTo(cx + Math.cos(a) * 58, cy - 10 + Math.sin(a) * 58);
        ctx.stroke();
      }
    }
  } else if (symbolType === 'moon_star') {
    if (isHeads) {
      ctx.beginPath();
      ctx.arc(cx - 10, cy - 10, 42, 0, Math.PI * 2);
      ctx.arc(cx + 8, cy - 18, 38, 0, Math.PI * 2, true);
      ctx.fill();
    } else {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r1 = 55;
        const r2 = 22;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx + Math.cos(a) * r1, cy - 10 + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a + Math.PI / 8) * r2, cy - 10 + Math.sin(a + Math.PI / 8) * r2);
        ctx.fill();
      }
    }
  } else if (symbolType === 'shield_swords') {
    if (isHeads) {
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 45);
      ctx.lineTo(cx + 40, cy - 45);
      ctx.lineTo(cx + 40, cy);
      ctx.quadraticCurveTo(cx + 35, cy + 45, cx, cy + 55);
      ctx.quadraticCurveTo(cx - 35, cy + 45, cx - 40, cy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy - 45);
      ctx.lineTo(cx + 45, cy + 35);
      ctx.moveTo(cx + 45, cy - 45);
      ctx.lineTo(cx - 45, cy + 35);
      ctx.stroke();
    }
  } else if (symbolType === 'phoenix_shield') {
    if (isHeads) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 50);
      ctx.bezierCurveTo(cx - 50, cy - 20, cx - 40, cy + 30, cx, cy + 50);
      ctx.bezierCurveTo(cx + 40, cy + 30, cx + 50, cy - 20, cx, cy - 50);
      ctx.fill();
      ctx.stroke();
    } else {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 20, cy - 10 + Math.sin(a) * 20, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  } else if (symbolType === 'gear_clockwork') {
    if (isHeads) {
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 32, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.fillRect(cx + Math.cos(a) * 32 - 6, cy - 10 + Math.sin(a) * 32 - 6, 12, 12);
      }
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 44, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 45, cy - 10);
    ctx.lineTo(cx + 45, cy - 10);
    ctx.moveTo(cx, cy - 55);
    ctx.lineTo(cx, cy + 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy - 10, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function createCoinEdgeTexture(themeKey) {
  const theme = COIN_THEMES[themeKey] || COIN_THEMES.ancient_gold;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = theme.edgeColor;
  ctx.fillRect(0, 0, 512, 64);

  const grooveCount = 64;
  const w = 512 / grooveCount;
  for (let i = 0; i < grooveCount; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(i * w, 0, w, 64);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(i * w, 0, w / 2, 64);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

// Procedural Bump Map for Coin Relief Depth
function createCoinBumpMap(side, symbolType) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;

  // Outer relief rim
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#303030';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 20, 0, Math.PI * 2);
  ctx.stroke();

  // Beaded rim dots
  const dotCount = 36;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    const dx = cx + Math.cos(angle) * (radius - 14);
    const dy = cy + Math.sin(angle) * (radius - 14);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(dx, dy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Emblem Bump
  drawCoinEmblem(ctx, cx, cy, radius, symbolType, side === 'heads', '#ffffff');

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

// Procedural Matte Metallic Face Texture
function createCoinFaceTexture(side, themeKey = 'ancient_gold') {
  const theme = COIN_THEMES[themeKey] || COIN_THEMES.ancient_gold;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;

  // Metallic radial gradient
  const bgGrad = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, radius);
  bgGrad.addColorStop(0, theme.primaryColor);
  bgGrad.addColorStop(0.65, theme.secondaryColor);
  bgGrad.addColorStop(1, theme.edgeColor);
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Recessed inner disc
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 28, 0, Math.PI * 2);
  ctx.fill();

  // Outer relief rim
  ctx.lineWidth = 16;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.stroke();

  ctx.lineWidth = 8;
  ctx.strokeStyle = theme.edgeColor;
  ctx.stroke();

  // Beaded rim dots
  const dotCount = 36;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    const dx = cx + Math.cos(angle) * (radius - 16);
    const dy = cy + Math.sin(angle) * (radius - 16);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 28, 0, Math.PI * 2);
  ctx.stroke();

  // Draw Emblem
  drawCoinEmblem(ctx, cx, cy, radius, theme.symbolType, side === 'heads', theme.glowColor);

  // Label text ("HEADS" or "TAILS")
  const label = side === 'heads' ? theme.headsLabel : theme.tailsLabel;
  ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText(label, cx + 2, cy + radius * 0.65 + 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, cx, cy + radius * 0.65);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const PhysicsCoinScene = ({
  coinsToFlip = [],
  coinTheme = 'ancient_gold',
  onFlipComplete,
  onDismiss,
  isVisible = false,
}) => {
  const mountRef = useRef(null);
  const [isSettled, setIsSettled] = useState(false);
  const [landedMarkers, setLandedMarkers] = useState([]);
  const [finalResults, setFinalResults] = useState([]);

  const animFrameRef = useRef(null);
  const activeTheme = COIN_THEMES[coinTheme] || COIN_THEMES.ancient_gold;
  const coinsDataRef = useRef(coinsToFlip);
  coinsDataRef.current = coinsToFlip;

  const sessionIdRef = useRef(0);

  useEffect(() => {
    if (!isVisible || !mountRef.current || coinsToFlip.length === 0) return;

    sessionIdRef.current += 1;
    const currentSessionId = sessionIdRef.current;
    setIsSettled(false);
    setLandedMarkers([]);
    setFinalResults([]);

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    // Three.js Scene
    const scene = new THREE.Scene();

    // 3D Perspective camera angled down for clear, realistic tabletop view
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 9.0, 4.0);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.01).texture;

    // Ambient & Directional Lighting for crisp metallic shading
    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 0.6);
    keyLight.position.set(8, 14, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b0ff, 0.3);
    fillLight.position.set(-6, 10, -5);
    scene.add(fillLight);

    // =========================================================================
    // CANNON-ES REAL RIGID BODY PHYSICS WORLD SETUP
    // =========================================================================
    const world = new CANNON.World();
    world.gravity.set(0, -18, 0);

    // Realistic metal coin & tabletop contact materials
    const coinMat = new CANNON.Material({ restitution: 0.28, friction: 0.30 });
    const floorMat = new CANNON.Material({ restitution: 0.28, friction: 0.30 });
    const contactMat = new CANNON.ContactMaterial(coinMat, floorMat, {
      restitution: 0.28,
      friction: 0.30,
    });
    world.addContactMaterial(contactMat);

    // Self-contact between coins
    const coinCoinContactMat = new CANNON.ContactMaterial(coinMat, coinMat, {
      restitution: 0.25,
      friction: 0.30,
    });
    world.addContactMaterial(coinCoinContactMat);

    // Tabletop Floor Plane
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0, material: floorMat });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floorBody);

    // Bounding Walls
    const wallShapeX = new CANNON.Plane();
    const wallLeft = new CANNON.Body({ mass: 0, material: floorMat });
    wallLeft.addShape(wallShapeX);
    wallLeft.position.set(-5.5, 0, 0);
    wallLeft.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    world.addBody(wallLeft);

    const wallRight = new CANNON.Body({ mass: 0, material: floorMat });
    wallRight.addShape(wallShapeX);
    wallRight.position.set(5.5, 0, 0);
    wallRight.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    world.addBody(wallRight);

    const wallShapeZ = new CANNON.Plane();
    const wallTop = new CANNON.Body({ mass: 0, material: floorMat });
    wallTop.addShape(wallShapeZ);
    wallTop.position.set(0, 0, -3.8);
    wallTop.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
    world.addBody(wallTop);

    const wallBottom = new CANNON.Body({ mass: 0, material: floorMat });
    wallBottom.addShape(wallShapeZ);
    wallBottom.position.set(0, 0, 4.2);
    wallBottom.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
    world.addBody(wallBottom);

    // Textures & Materials
    const headsTex = createCoinFaceTexture('heads', coinTheme);
    const tailsTex = createCoinFaceTexture('tails', coinTheme);
    const edgeTex = createCoinEdgeTexture(coinTheme);
    const headsBump = createCoinBumpMap('heads', activeTheme.symbolType);
    const tailsBump = createCoinBumpMap('tails', activeTheme.symbolType);

    const headsMaterial = new THREE.MeshStandardMaterial({
      map: headsTex,
      bumpMap: headsBump,
      bumpScale: 0.04,
      metalness: 0.4,
      roughness: 0.4,
    });
    const tailsMaterial = new THREE.MeshStandardMaterial({
      map: tailsTex,
      bumpMap: tailsBump,
      bumpScale: 0.04,
      metalness: 0.4,
      roughness: 0.4,
    });
    const rimMaterial = new THREE.MeshStandardMaterial({
      map: edgeTex,
      color: activeTheme.edgeColor,
      metalness: 0.4,
      roughness: 0.4,
    });

    // Realistic smaller coin scale
    const coinRadius = 0.55;
    const coinThickness = 0.05;
    const coinGeometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 48);
    const materials = [rimMaterial, headsMaterial, tailsMaterial];

    const currentCoins = coinsDataRef.current;
    const count = currentCoins.length;
    const coinPhysicsPairs = [];

    // Staggered launch setup for cascading flips
    currentCoins.forEach((item, index) => {
      const group = new THREE.Group();
      group.visible = false; // Initially hidden until launch delay
      const mesh = new THREE.Mesh(coinGeometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      scene.add(group);

      const coinShape = new CANNON.Cylinder(coinRadius, coinRadius, coinThickness, 24);
      const shapeQuat = new CANNON.Quaternion();
      shapeQuat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);

      const coinBody = new CANNON.Body({
        mass: 0.5,
        material: coinMat,
        linearDamping: 0.08,
        angularDamping: 0.08,
      });
      coinBody.addShape(coinShape, new CANNON.Vec3(0, 0, 0), shapeQuat);

      const requestedResult = item.result || (Math.random() < 0.5 ? 'heads' : 'tails');
      const startPitch = requestedResult === 'heads' ? 0 : Math.PI;
      const initialEuler = new THREE.Euler(startPitch, (Math.random() - 0.5) * 1.2, 0, 'YXZ');
      const initialQuat = new THREE.Quaternion().setFromEuler(initialEuler);
      coinBody.quaternion.copy(initialQuat);

      const spreadAngle = (index / Math.max(1, count)) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const startDist = 0.15 + Math.random() * 0.3;
      const startX = Math.cos(spreadAngle) * startDist;
      const startZ = Math.sin(spreadAngle) * startDist + 0.3;
      coinBody.position.set(startX, 2.2 + Math.random() * 0.3, startZ);

      const launchVy = 10.5 + Math.random() * 2.0;
      const scatterSpeed = 0.6 + Math.random() * 0.6;
      const launchVx = Math.cos(spreadAngle) * scatterSpeed;
      const launchVz = Math.sin(spreadAngle) * scatterSpeed;

      const flipDirection = Math.random() > 0.5 ? 1 : -1;
      const spinX = flipDirection * (Math.PI * 8 + (Math.random() - 0.5) * 0.4);
      const spinY = (Math.random() - 0.5) * 2;
      const spinZ = (Math.random() - 0.5) * 2;

      coinBody.velocity.set(launchVx, launchVy, launchVz);
      coinBody.angularVelocity.set(spinX, spinY, spinZ);

      coinPhysicsPairs.push({
        id: item.id,
        group,
        mesh,
        body: coinBody,
        delay: index * 0.12, // 120ms stagger delay between coins
        launched: false,
        requestedResult,
        settled: false,
        settleFrames: 0,
        finalResult: requestedResult,
        landedPos: new THREE.Vector3(),
        landedQuat: new THREE.Quaternion(),
        slerpProgress: 0,
      });
    });

    const startTime = performance.now();
    let lastTime = performance.now();

    const animate = (currentTime) => {
      if (sessionIdRef.current !== currentSessionId) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.04);
      lastTime = currentTime;
      const totalElapsed = (currentTime - startTime) / 1000;

      world.step(1 / 60, dt, 3);

      let allSettled = true;
      const updatedMarkers = [];

      coinPhysicsPairs.forEach((pair) => {
        // Handle staggered launching
        if (!pair.launched) {
          if (totalElapsed >= pair.delay) {
            pair.launched = true;
            pair.group.visible = true;
            world.addBody(pair.body);
          } else {
            allSettled = false;
            return;
          }
        }

        const { group, body } = pair;

        if (!pair.settled) {
          allSettled = false;

          // Apply natural tipping torque when coin is near floor to naturally knock it flat onto face
          const worldUp = new THREE.Vector3(0, 1, 0).applyQuaternion(group.quaternion);
          const absUpY = Math.abs(worldUp.y);

          // As coin comes close to tabletop (y < 0.30), smoothly guide orientation flat onto Heads or Tails
          if (body.position.y < 0.30) {
            const landedSide = worldUp.y >= 0 ? 'heads' : 'tails';
            const euler = new THREE.Euler().setFromQuaternion(group.quaternion, 'YXZ');
            const flatPitch = landedSide === 'heads' ? 0 : Math.PI;
            const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(flatPitch, euler.y, 0, 'YXZ'));

            const currentQuat = new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
            currentQuat.slerp(targetQuat, Math.min(1.0, dt * 6.5));
            body.quaternion.copy(currentQuat);
          }

          group.position.copy(body.position);
          group.quaternion.copy(body.quaternion);

          const speed = body.velocity.length();
          const angSpeed = body.angularVelocity.length();
          const isNearFloor = body.position.y < 0.15;

          if (isNearFloor && absUpY > 0.92 && speed < 0.25 && angSpeed < 0.3) {
            pair.settleFrames += 1;
            body.velocity.scale(0.85);
            body.angularVelocity.scale(0.85);
          } else if (isNearFloor && speed < 0.15) {
            pair.settleFrames += 1;
          } else {
            pair.settleFrames = 0;
          }

          if (pair.settleFrames > 8 || totalElapsed > pair.delay + 3.0) {
            body.velocity.set(0, 0, 0);
            body.angularVelocity.set(0, 0, 0);

            const landedSide = worldUp.y >= 0 ? 'heads' : 'tails';
            pair.finalResult = landedSide;

            const euler = new THREE.Euler().setFromQuaternion(group.quaternion, 'YXZ');
            const landedYaw = euler.y;
            const flatPitch = landedSide === 'heads' ? 0 : Math.PI;

            pair.landedQuat.setFromEuler(new THREE.Euler(flatPitch, landedYaw, 0, 'YXZ'));
            pair.landedPos.set(body.position.x, coinThickness / 2 + 0.003, body.position.z);

            pair.settled = true;
            group.position.copy(pair.landedPos);
            group.quaternion.copy(pair.landedQuat);
          }
        } else {
          group.position.copy(pair.landedPos);
          group.quaternion.copy(pair.landedQuat);
        }

        // Calculate screen markers from camera projection of landed position
        if (pair.settled) {
          const screenPos = pair.landedPos.clone().project(camera);
          const px = ((screenPos.x + 1) * width) / 2;
          const py = ((-screenPos.y + 1) * height) / 2;
          updatedMarkers.push({
            id: pair.id,
            result: pair.finalResult,
            x: px,
            y: py,
          });
        }
      });

      setLandedMarkers(updatedMarkers);
      renderer.render(scene, camera);

      if (!allSettled) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        const finalResultsList = coinPhysicsPairs.map((c) => ({
          id: c.id,
          result: c.finalResult,
        }));
        setFinalResults(finalResultsList);
        setIsSettled(true);
        if (onFlipComplete) {
          onFlipComplete(finalResultsList);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible, coinTheme]);

  if (!isVisible) return null;

  const displayCoins = finalResults.length > 0 ? finalResults : coinsToFlip;
  const headsCount = displayCoins.filter((c) => c.result === 'heads').length;
  const tailsCount = displayCoins.filter((c) => c.result === 'tails').length;

  return (
    <div className="physics-coin-overlay" onClick={onDismiss}>
      <div className="coin-canvas-container" ref={mountRef} />

      {/* World-space Landed Coin Markers */}
      {landedMarkers.map((marker) => (
        <div
          key={marker.id}
          className={`landed-coin-marker ${marker.result}`}
          style={{
            left: `${marker.x}px`,
            top: `${marker.y}px`,
          }}
        >
          <span>{marker.result.toUpperCase()}</span>
        </div>
      ))}

      {/* Floating Result Chip at top center */}
      {isSettled && (
        <div className="coin-3d-result-area" onClick={(e) => e.stopPropagation()}>
          <div className="coin-result-header">
            <span className="coin-result-title">Coin Flip Results</span>
            <span className="coin-theme-badge">{activeTheme.name}</span>
          </div>

          <div className="coin-result-counts">
            <div className="coin-count-pill heads">
              <span>Heads: {headsCount}</span>
            </div>
            <div className="coin-count-pill tails">
              <span>Tails: {tailsCount}</span>
            </div>
          </div>

          <button className="coin-close-btn" onClick={onDismiss}>
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicsCoinScene;
