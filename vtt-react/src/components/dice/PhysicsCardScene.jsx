import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { drawEmblemShape } from './PhysicsCoinScene';
import './PhysicsCardScene.css';

// Deck themes: back colours, frame colours and the emblem on the back.
// (Emblems are vector-drawn — the old emoji backs rendered differently on
// every OS and read as clip-art.)
export const CARD_THEMES = {
  royal_velvet: {
    id: 'royal_velvet',
    name: 'Royal Velvet',
    bgStart: '#6e0b1f',
    bgEnd: '#32040d',
    borderColor: '#c9a24a',
    edgeColor: '#e3c477',
    emblem: { type: 'crown_sun', heads: true },
  },
  mystic_arcana: {
    id: 'mystic_arcana',
    name: 'Mystic Arcana',
    bgStart: '#172340',
    bgEnd: '#0c1226',
    borderColor: '#93b4cc',
    edgeColor: '#c3d6e4',
    emblem: { type: 'arcana_compass', heads: true },
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    bgStart: '#3a160c',
    bgEnd: '#170805',
    borderColor: '#c4733a',
    edgeColor: '#dd9a62',
    emblem: { type: 'phoenix_shield', heads: true },
  },
  celestial_silver: {
    id: 'celestial_silver',
    name: 'Celestial Silver',
    bgStart: '#3a4556',
    bgEnd: '#171d29',
    borderColor: '#d4dae2',
    edgeColor: '#eef1f5',
    emblem: { type: 'moon_star', heads: true },
  },
  vintage_parchment: {
    id: 'vintage_parchment',
    name: 'Vintage Parchment',
    bgStart: '#8c6d46',
    bgEnd: '#5a4126',
    borderColor: '#e2c98f',
    edgeColor: '#f0dfb4',
    emblem: { type: 'shield_swords', heads: false },
  },
  blood_ruby: {
    id: 'blood_ruby',
    name: 'Blood Ruby',
    bgStart: '#4a0c0e',
    bgEnd: '#1c0304',
    borderColor: '#c46a62',
    edgeColor: '#dc938a',
    emblem: { type: 'moon_star', heads: false },
  },
  arcane_brass: {
    id: 'arcane_brass',
    name: 'Arcane Brass',
    bgStart: '#4a2408',
    bgEnd: '#1e0e03',
    borderColor: '#c99a3e',
    edgeColor: '#e0bc6e',
    emblem: { type: 'gear_clockwork', heads: true },
  },
};

// ─── Card geometry & layout ─────────────────────────────────────────────────
const CARD_W = 2.0;
const CARD_H = 3.0;
const CARD_RADIUS = 0.13;
const CARD_THICK = 0.014;
const GAP = 0.28;
const DEAL_SECONDS = 0.55;
const DEAL_STAGGER = 0.09;
const FLIP_SECONDS = 0.38;
const CHIP_RESERVE_PX = 170;
const TEX_W = 512;
const TEX_H = 768;

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// ShapeGeometry UVs are in shape units — remap them to 0..1 over the card.
function faceGeometry(shape) {
  const g = new THREE.ShapeGeometry(shape, 6);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + CARD_W / 2) / CARD_W, (pos.getY(i) + CARD_H / 2) / CARD_H);
  }
  uv.needsUpdate = true;
  return g;
}

// Lay out n cards in one or two centred rows, scaled down if needed so the
// whole hand fits between the result chip and the bottom of the screen.
function layoutHand(n, area) {
  const rows = n > 5 ? 2 : 1;
  const perRow = rows === 2 ? Math.ceil(n / 2) : n;
  const needW = perRow * CARD_W + (perRow - 1) * GAP;
  const needH = rows * CARD_H + (rows - 1) * GAP;
  const scale = Math.min(1, (area.right - area.left) / needW, (area.top - area.bottom) / needH);
  const cx = (area.left + area.right) / 2;
  const cy = (area.top + area.bottom) / 2;
  const slots = [];
  for (let i = 0; i < n; i++) {
    const row = rows === 2 && i >= perRow ? 1 : 0;
    const inRow = row === 0 ? Math.min(n, perRow) : n - perRow;
    const col = row === 0 ? i : i - perRow;
    const x = cx + (col - (inRow - 1) / 2) * (CARD_W + GAP) * scale;
    const y = cy + (rows === 2 ? (row === 0 ? 0.5 : -0.5) * (CARD_H + GAP) * scale : 0);
    slots.push({ x, y, rot: (Math.random() - 0.5) * 0.06 });
  }
  return { slots, scale };
}

// ─── Card art ───────────────────────────────────────────────────────────────
function createCardBackTexture(theme) {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d');
  const w = TEX_W;
  const h = TEX_H;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, theme.bgStart);
  grad.addColorStop(1, theme.bgEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Fine diamond lattice.
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.055)';
  ctx.lineWidth = 1.5;
  for (let i = -h; i < w + h; i += 22) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(i, h); ctx.lineTo(i + h, 0); ctx.stroke();
  }
  ctx.restore();

  // Soft vignette.
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.72);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Double frame.
  ctx.lineWidth = 10;
  ctx.strokeStyle = theme.borderColor;
  ctx.strokeRect(30, 30, w - 60, h - 60);
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.edgeColor;
  ctx.globalAlpha = 0.7;
  ctx.strokeRect(44, 44, w - 88, h - 88);
  ctx.globalAlpha = 1;

  // Centre medallion with the deck emblem.
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath(); ctx.arc(cx, cy, 112, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = theme.borderColor;
  ctx.beginPath(); ctx.arc(cx, cy, 112, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = theme.edgeColor;
  ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(70, 70);
  ctx.fillStyle = theme.edgeColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6; // shadow settings are in canvas pixels, not scaled
  ctx.shadowOffsetY = 2;
  drawEmblemShape(ctx, theme.emblem.type, theme.emblem.heads);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const PIP_LAYOUTS = {
  '2': [[0, -1], [0, 1]],
  '3': [[0, -1], [0, 0], [0, 1]],
  '4': [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  '5': [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  '6': [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  '7': [[-1, -1], [1, -1], [0, -0.5], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  '8': [[-1, -1], [1, -1], [0, -0.5], [-1, 0], [1, 0], [0, 0.5], [-1, 1], [1, 1]],
  '9': [[-1, -1], [1, -1], [-1, -1 / 3], [1, -1 / 3], [0, 0], [-1, 1 / 3], [1, 1 / 3], [-1, 1], [1, 1]],
  '10': [[-1, -1], [1, -1], [0, -2 / 3], [-1, -1 / 3], [1, -1 / 3], [-1, 1 / 3], [1, 1 / 3], [0, 2 / 3], [-1, 1], [1, 1]],
};

// Face card glyphs — chess royalty reads instantly and stays thematic.
const FACE_GLYPHS = { J: '♞', Q: '♛', K: '♚' };

function drawSuitGlyph(ctx, glyph, x, y, size, color, rotated) {
  ctx.save();
  ctx.translate(x, y);
  if (rotated) ctx.rotate(Math.PI);
  ctx.font = `bold ${size}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = color;
  ctx.fillText(glyph, 0, 0);
  ctx.restore();
}


function createCardFrontTexture(card) {
  const width = TEX_W;
  const height = TEX_H;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8f3e6';
  ctx.fillRect(0, 0, width, height);

  // Linen grain.
  ctx.fillStyle = 'rgba(180, 160, 120, 0.07)';
  for (let i = 0; i < 500; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  // Thin ruled frame.
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(102, 60, 50, 0.55)';
  ctx.strokeRect(26, 26, width - 52, height - 52);

  const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';
  const color = isRed ? '#a3171f' : '#1b1f2e';
  const suitSymbol = card.suitSymbol;
  const rank = card.rank;
  const cx = width / 2;
  const cy = height / 2;

  const drawCornerIndex = (x, y, flipped) => {
    ctx.save();
    ctx.translate(x, y);
    if (flipped) ctx.rotate(Math.PI);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = 'bold 64px "Cinzel", "Times New Roman", serif';
    ctx.fillStyle = color;
    ctx.fillText(rank, 0, 0);
    ctx.font = 'bold 50px serif';
    ctx.fillText(suitSymbol, 0, 54);
    ctx.restore();
  };
  drawCornerIndex(70, 98, false);
  drawCornerIndex(width - 70, height - 98, true);

  const faceGlyph = FACE_GLYPHS[rank];
  if (faceGlyph) {
    const panelW = 250;
    const panelH = 380;
    const px = cx - panelW / 2;
    const py = cy - panelH / 2;
    ctx.fillStyle = isRed ? 'rgba(163, 23, 31, 0.07)' : 'rgba(27, 31, 46, 0.07)';
    ctx.fillRect(px, py, panelW, panelH);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(102, 60, 50, 0.6)';
    ctx.strokeRect(px, py, panelW, panelH);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px + 10, py + 10, panelW - 20, panelH - 20);
    drawSuitGlyph(ctx, faceGlyph, cx, cy - 20, 200, color, false);
    const pipOff = 34;
    [[px + pipOff, py + pipOff], [px + panelW - pipOff, py + pipOff],
     [px + pipOff, py + panelH - pipOff], [px + panelW - pipOff, py + panelH - pipOff]]
      .forEach(([qx, qy], i) => drawSuitGlyph(ctx, suitSymbol, qx, qy, 34, color, i > 1));
  } else if (rank === 'A') {
    drawSuitGlyph(ctx, suitSymbol, cx, cy, 230, color, false);
    ctx.strokeStyle = isRed ? 'rgba(163, 23, 31, 0.22)' : 'rgba(27, 31, 46, 0.22)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.stroke();
  } else {
    const layout = PIP_LAYOUTS[rank];
    (layout || [[0, 0]]).forEach(([lx, ly]) => {
      drawSuitGlyph(ctx, suitSymbol, cx + lx * 96, cy + ly * 178, layout ? 78 : 180, color, ly > 0);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const SUIT_IS_RED = { Hearts: true, Diamonds: true };
export const cardLabel = (c) => `${c.rank}${c.suitSymbol}`;

// ─── Component ──────────────────────────────────────────────────────────────
const PhysicsCardScene = ({ draw, onAllRevealed, onDismiss }) => {
  const mountRef = useRef(null);
  const controlsRef = useRef(null); // { revealAll }
  const onRevealedRef = useRef(onAllRevealed);
  onRevealedRef.current = onAllRevealed;

  const [dealt, setDealt] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [hoverCard, setHoverCard] = useState(false);

  const drawId = draw?.id;
  const theme = CARD_THEMES[draw?.theme] || CARD_THEMES.royal_velvet;

  useEffect(() => {
    const mount = mountRef.current;
    if (!draw || !mount || !draw.cards?.length) return undefined;

    const cards = draw.cards;
    const manual = !!draw.manual;
    const deckTheme = CARD_THEMES[draw.theme] || CARD_THEMES.royal_velvet;
    setDealt(false);
    setRevealed(cards.map(() => !manual));

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // Long lens looking straight down at the table (the XY plane here).
    const FOV = 20;
    const camera = new THREE.PerspectiveCamera(FOV, width / Math.max(1, height), 1, 200);
    const viewH = 9.1;
    camera.position.set(0, 0, viewH / (2 * Math.tan((FOV * Math.PI) / 360)));
    camera.lookAt(0, 0, 0);

    const halfH = viewH / 2;
    const halfW = halfH * (width / Math.max(1, height));
    const pxToWorld = viewH / Math.max(1, height);
    const area = {
      left: -halfW + 0.5,
      right: halfW - 0.5,
      top: halfH - Math.min(CHIP_RESERVE_PX, height * 0.32) * pxToWorld,
      bottom: -halfH + 0.45,
    };
    const { slots, scale } = layoutHand(cards.length, area);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    // Paper and ink: no filmic tone mapping (it greys the card stock and
    // dulls the red suits).
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    scene.environment = envTexture;
    scene.environmentIntensity = 0.35;

    scene.add(new THREE.AmbientLight(0xfff6e8, 0.75));
    const key = new THREE.DirectionalLight(0xfff3e0, 1.7);
    key.position.set(2.5, 3.5, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 4;
    key.shadow.bias = -0.0005;
    Object.assign(key.shadow.camera, { left: -halfW - 2, right: halfW + 2, top: halfH + 2, bottom: -halfH - 3, near: 1, far: 40 });
    scene.add(key);

    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.ShadowMaterial({ color: 0x2a1d12, opacity: 0.24 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.z = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const shape = roundedRectShape(CARD_W, CARD_H, CARD_RADIUS);
    const faceGeo = faceGeometry(shape);
    const edgeGeo = new THREE.ExtrudeGeometry(shape, { depth: CARD_THICK, bevelEnabled: false, curveSegments: 6 });
    edgeGeo.translate(0, 0, -CARD_THICK / 2);
    const hiddenMat = new THREE.MeshBasicMaterial({ visible: false });
    const edgeMat = new THREE.MeshStandardMaterial({ color: '#efe6d2', roughness: 0.8 });
    const backTex = createCardBackTexture(deckTheme);
    const backMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.55, metalness: 0.05 });
    const frontTexes = [];
    const frontMats = [];

    const deckStart = new THREE.Vector3(halfW * 0.15, -halfH - CARD_H, 1.2);
    const items = cards.map((card, i) => {
      const group = new THREE.Group();
      const frontTex = createCardFrontTexture(card);
      // Slightly toned so cream card stock doesn't blow out to pure white.
      const frontMat = new THREE.MeshStandardMaterial({ map: frontTex, color: '#ece5d6', roughness: 0.7 });
      frontTexes.push(frontTex);
      frontMats.push(frontMat);

      const front = new THREE.Mesh(faceGeo, frontMat);
      front.position.z = CARD_THICK / 2 + 0.001;
      const back = new THREE.Mesh(faceGeo, backMat);
      back.rotation.y = Math.PI;
      back.position.z = -CARD_THICK / 2 - 0.001;
      const edge = new THREE.Mesh(edgeGeo, [hiddenMat, edgeMat]);
      [front, back, edge].forEach((m) => { m.castShadow = true; group.add(m); });
      group.scale.setScalar(scale);
      group.position.copy(deckStart);
      group.rotation.set(0, Math.PI, 0.5);
      group.userData.index = i;
      scene.add(group);

      return {
        group,
        slot: slots[i],
        start: i * DEAL_STAGGER,
        faceUp: !manual,
        flipFrom: Math.PI,
        flipTo: manual ? Math.PI : 0,
        flipStart: null,
      };
    });

    let raf = 0;
    let finished = false;
    let reported = false;
    const t0 = performance.now();

    const reportIfAllUp = () => {
      if (reported || !items.every((it) => it.faceUp)) return;
      reported = true;
      if (onRevealedRef.current) onRevealedRef.current(cards);
    };

    const ease = (x) => 1 - Math.pow(1 - x, 3);

    const tick = () => {
      const now = (performance.now() - t0) / 1000;
      let busy = false;

      items.forEach((it) => {
        const g = it.group;
        const p = Math.min(1, Math.max(0, (now - it.start) / DEAL_SECONDS));
        if (p < 1) busy = true;
        const e = ease(p);
        // Deal: slide in from the player's side on a low arc, settling into
        // place; auto-reveal cards turn over in flight.
        g.position.x = THREE.MathUtils.lerp(deckStart.x, it.slot.x, e);
        g.position.y = THREE.MathUtils.lerp(deckStart.y, it.slot.y, e);
        let z = THREE.MathUtils.lerp(deckStart.z, 0, e) + Math.sin(Math.PI * p) * 0.9;
        g.rotation.z = THREE.MathUtils.lerp(0.5, it.slot.rot, e);
        let rotY = THREE.MathUtils.lerp(Math.PI, it.flipTo, it.flipStart === null ? e * e : 1);

        // Click-to-reveal flip after landing: lift, turn, set down.
        if (it.flipStart !== null) {
          const f = Math.min(1, (now - it.flipStart) / FLIP_SECONDS);
          if (f < 1) busy = true;
          rotY = THREE.MathUtils.lerp(it.flipFrom, it.flipTo, ease(f));
          z += Math.sin(Math.PI * f) * 0.7;
        }
        g.position.z = z;
        g.rotation.y = rotY;
      });

      renderer.render(scene, camera);

      if (!finished && now >= items[items.length - 1].start + DEAL_SECONDS) {
        finished = true;
        setDealt(true);
        reportIfAllUp();
      }
      raf = busy ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    const flip = (it) => {
      if (it.faceUp) return;
      it.faceUp = true;
      it.flipFrom = Math.PI;
      it.flipTo = 0;
      it.flipStart = (performance.now() - t0) / 1000;
      setRevealed(items.map((x) => x.faceUp));
      wake();
      reportIfAllUp();
    };

    // Clicking a face-down card turns it over.
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (event) => {
      const rect = mount.getBoundingClientRect();
      ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(items.map((it) => it.group), true)[0];
      if (!hit) return null;
      let o = hit.object;
      while (o && o.userData.index === undefined) o = o.parent;
      return o ? items[o.userData.index] : null;
    };
    const handleClick = (event) => {
      const it = pick(event);
      if (it && !it.faceUp) {
        event.stopPropagation();
        flip(it);
      }
    };
    const handleMove = (event) => {
      const it = pick(event);
      setHoverCard(!!(it && !it.faceUp));
    };
    mount.addEventListener('click', handleClick);
    mount.addEventListener('pointermove', handleMove);

    controlsRef.current = { revealAll: () => items.forEach(flip) };

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
      controlsRef.current = null;
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('click', handleClick);
      mount.removeEventListener('pointermove', handleMove);
      cancelAnimationFrame(raf);
      [faceGeo, edgeGeo, groundGeo].forEach((g) => g.dispose());
      [hiddenMat, edgeMat, backMat, groundMat, ...frontMats].forEach((m) => m.dispose());
      [backTex, envTexture, ...frontTexes].forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // A new draw id restarts the scene; theme/cards/mode come with the draw.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawId]);

  if (!draw) return null;

  const cards = draw.cards || [];
  const allUp = revealed.length > 0 && revealed.every(Boolean);
  const upCount = revealed.filter(Boolean).length;

  return (
    <div
      className={`physics-card-overlay ${dealt ? 'dealt' : ''} ${allUp ? 'settled' : ''} ${hoverCard ? 'over-card' : ''}`}
      onClick={dealt && allUp ? () => onDismiss(revealed) : undefined}
      title={dealt && allUp ? 'Click anywhere to clear the cards' : undefined}
    >
      <div className="card-canvas-container" ref={mountRef} />

      {dealt && (
        <div className="card-3d-result-area" onClick={(e) => e.stopPropagation()}>
          <div className="card-result-main">
            <span className="card-result-label">
              {cards.length === 1 ? 'Card draw' : `${cards.length} cards`} · <em>{theme.name}</em>
            </span>
            <span className="card-drawn-list">
              {cards.map((c, i) => (
                <span
                  key={c.id}
                  className={`card-drawn ${revealed[i] ? (SUIT_IS_RED[c.suit] ? 'red' : 'black') : 'down'}`}
                  title={revealed[i] ? c.name : 'Face down — click the card to turn it'}
                >
                  {revealed[i] ? cardLabel(c) : '?'}
                </span>
              ))}
            </span>
            {cards.length === 1 && revealed[0] && <span className="card-result-name">{cards[0].name}</span>}
          </div>
          <div className="card-result-actions">
            {!allUp && (
              <button type="button" className="card-reveal-all-btn" onClick={() => controlsRef.current?.revealAll()}>
                Reveal all ({upCount}/{cards.length})
              </button>
            )}
            <button type="button" className="card-close-btn" onClick={() => onDismiss(revealed)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicsCardScene;
