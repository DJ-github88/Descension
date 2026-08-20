import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import './PhysicsCardScene.css';

// Card Themes Definition with expanded themes & PBR settings
export const CARD_THEMES = {
  royal_velvet: {
    id: 'royal_velvet',
    name: 'Royal Velvet',
    bgStart: '#7a001e',
    bgEnd: '#36000c',
    borderColor: '#d4af37',
    edgeColor: '#ffd700',
    backSymbol: '👑',
    metallic: 0.65,
    roughness: 0.35,
  },
  mystic_arcana: {
    id: 'mystic_arcana',
    name: 'Mystic Arcana',
    bgStart: '#0f172a',
    bgEnd: '#1e1b4b',
    borderColor: '#38bdf8',
    edgeColor: '#7dd3fc',
    backSymbol: '✨',
    metallic: 0.7,
    roughness: 0.3,
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    bgStart: '#2d120d',
    bgEnd: '#120705',
    borderColor: '#ea580c',
    edgeColor: '#f97316',
    backSymbol: '🐉',
    metallic: 0.55,
    roughness: 0.45,
  },
  celestial_silver: {
    id: 'celestial_silver',
    name: 'Celestial Silver',
    bgStart: '#334155',
    bgEnd: '#0f172a',
    borderColor: '#e2e8f0',
    edgeColor: '#ffffff',
    backSymbol: '🌙',
    metallic: 0.85,
    roughness: 0.2,
  },
  vintage_parchment: {
    id: 'vintage_parchment',
    name: 'Vintage Parchment',
    bgStart: '#8c6d46',
    bgEnd: '#543d22',
    borderColor: '#d4af37',
    edgeColor: '#c49a50',
    backSymbol: '📜',
    metallic: 0.4,
    roughness: 0.5,
  },
  blood_ruby: {
    id: 'blood_ruby',
    name: 'Blood Ruby',
    bgStart: '#450a0a',
    bgEnd: '#180202',
    borderColor: '#f87171',
    edgeColor: '#ef4444',
    backSymbol: '♦',
    metallic: 0.75,
    roughness: 0.28,
  },
  arcane_brass: {
    id: 'arcane_brass',
    name: 'Arcane Brass',
    bgStart: '#451a03',
    bgEnd: '#1c0a00',
    borderColor: '#f59e0b',
    edgeColor: '#fbbf24',
    backSymbol: '⚙',
    metallic: 0.8,
    roughness: 0.3,
  },
};

// Procedural Height Bump Map for Card Back Embossing
function createCardBackBumpMap() {
  const width = 512;
  const height = 768;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  // Outer border relief
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#303030';
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Center medallion bump
  const cx = width / 2;
  const cy = height / 2;

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#202020';
  ctx.beginPath();
  ctx.arc(cx, cy, 95, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

// Procedural Card Back Texture
function createCardBackTexture(themeKey = 'royal_velvet') {
  const theme = CARD_THEMES[themeKey] || CARD_THEMES.royal_velvet;
  const width = 512;
  const height = 768;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, theme.bgStart);
  grad.addColorStop(1, theme.bgEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Crosshatch filigree pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  for (let i = -height; i < width + height; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, height);
    ctx.lineTo(i + height, 0);
    ctx.stroke();
  }

  // Vignette darkening toward the edges for depth
  const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height * 0.72);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Outer gold filigree frame
  ctx.lineWidth = 16;
  ctx.strokeStyle = theme.borderColor;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Corner gemstones — rotated diamond studs
  [
    [20, 20],
    [width - 20, 20],
    [20, height - 20],
    [width - 20, height - 20],
  ].forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = theme.borderColor;
    ctx.fillRect(-11, -11, 22, 22);
    ctx.fillStyle = theme.edgeColor;
    ctx.fillRect(-6, -6, 12, 12);
    ctx.restore();
  });

  const cx = width / 2;
  const cy = height / 2;

  // Center medallion — dark field, double ring, radial glow
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = theme.borderColor;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.stroke();

  // Beaded inner ring
  ctx.fillStyle = theme.edgeColor;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * 96, cy + Math.sin(a) * 96, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = '92px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.edgeColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText(theme.backSymbol, cx, cy + 4);
  // Soft re-stamp above for a gilded double-strike look
  ctx.globalAlpha = 0.35;
  ctx.shadowBlur = 0;
  ctx.fillText(theme.backSymbol, cx, cy - 4);
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Standard playing-card pip layouts. Coordinates are in "pip space":
// x ∈ {-1, 0, 1} columns, y ∈ [-1, 1] rows. Bottom-half pips (y > 0) are
// rotated 180° like a real deck.
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

// Procedural Card Front Texture
function createCardFrontTexture(card) {
  const width = 512;
  const height = 768;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8f3e6';
  ctx.fillRect(0, 0, width, height);

  // Linen texture grain
  ctx.fillStyle = 'rgba(180, 160, 120, 0.07)';
  for (let i = 0; i < 500; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Double borders — outer leather tone, inner gold
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#7c4a21';
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(26, 26, width - 52, height - 52);

  const isRed = card.suit === '♥' || card.suit === '♦' || card.suit === 'Hearts' || card.suit === 'Diamonds';
  const color = isRed ? '#b3121f' : '#151b2e';

  const suitSymbol = card.suitSymbol || (card.suit === 'Hearts' ? '♥' : card.suit === 'Diamonds' ? '♦' : card.suit === 'Clubs' ? '♣' : '♠');
  const rank = String(card.value || card.rank || 'A').toUpperCase();

  const cx = width / 2;
  const cy = height / 2;

  // Corner indices — large with a white outline so they stay readable from
  // across the table.
  const drawCornerIndex = (x, y, flipped) => {
    ctx.save();
    ctx.translate(x, y);
    if (flipped) ctx.rotate(Math.PI);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.font = 'bold 64px "Cinzel", "Times New Roman", serif';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeText(rank, 0, 0);
    ctx.fillStyle = color;
    ctx.fillText(rank, 0, 0);

    ctx.font = 'bold 50px serif';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeText(suitSymbol, 0, 54);
    ctx.fillStyle = color;
    ctx.fillText(suitSymbol, 0, 54);
    ctx.restore();
  };
  drawCornerIndex(66, 88, false);
  drawCornerIndex(width - 66, height - 100, true);

  const faceGlyph = FACE_GLYPHS[rank];

  if (faceGlyph) {
    // Face cards (J/Q/K): ornate framed portrait panel with the royal glyph,
    // suit-colored backing and gold accents.
    const panelW = 250;
    const panelH = 380;
    const px = cx - panelW / 2;
    const py = cy - panelH / 2 - 14;

    const panelGrad = ctx.createLinearGradient(px, py, px + panelW, py + panelH);
    panelGrad.addColorStop(0, isRed ? 'rgba(179, 18, 31, 0.10)' : 'rgba(21, 27, 46, 0.10)');
    panelGrad.addColorStop(1, isRed ? 'rgba(179, 18, 31, 0.02)' : 'rgba(21, 27, 46, 0.02)');
    ctx.fillStyle = panelGrad;
    ctx.beginPath();
    ctx.roundRect(px, py, panelW, panelH, 18);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#d4af37';
    ctx.beginPath();
    ctx.roundRect(px, py, panelW, panelH, 18);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.beginPath();
    ctx.roundRect(px + 12, py + 12, panelW - 24, panelH - 24, 12);
    ctx.stroke();

    drawSuitGlyph(ctx, faceGlyph, cx, cy - 40, 210, color, false);

    // Small suit pips in the panel corners
    const pipOff = 34;
    [[px + pipOff, py + pipOff], [px + panelW - pipOff, py + pipOff],
     [px + pipOff, py + panelH - pipOff], [px + panelW - pipOff, py + panelH - pipOff]]
      .forEach(([qx, qy], i) => drawSuitGlyph(ctx, suitSymbol, qx, qy, 34, color, i > 1));
  } else if (rank === 'A') {
    // Ace: one grand center emblem
    drawSuitGlyph(ctx, suitSymbol, cx, cy - 20, 240, color, false);

    ctx.strokeStyle = isRed ? 'rgba(179, 18, 31, 0.25)' : 'rgba(21, 27, 46, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 150, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const layout = PIP_LAYOUTS[rank];
    if (layout) {
      // Number cards: classic pip grid
      const pipX = 96;
      const pipY = 178;
      layout.forEach(([lx, ly]) => {
        drawSuitGlyph(ctx, suitSymbol, cx + lx * pipX, cy - 20 + ly * pipY, 78, color, ly > 0);
      });
    } else {
      // Unknown rank fallback: big center suit
      drawSuitGlyph(ctx, suitSymbol, cx, cy - 20, 180, color, false);
    }
  }

  // Card Name Footer — recessed parchment ribbon keeps it legible without
  // fighting the pips.
  const footerY = height - 52;
  ctx.fillStyle = 'rgba(60, 44, 22, 0.85)';
  ctx.beginPath();
  ctx.roundRect(cx - 150, footerY - 24, 300, 38, 10);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.stroke();

  ctx.font = 'bold 24px "Cinzel", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f2e6c9';
  ctx.fillText(card.name || `${rank} of ${card.suit}`, cx, footerY - 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const PhysicsCardScene = ({
  cardsToDraw = [],
  cardTheme = 'royal_velvet',
  manualFlip = false,
  onDrawComplete,
  onDismiss,
  isVisible = false,
}) => {
  const mountRef = useRef(null);
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [allDrawn, setAllDrawn] = useState(false);

  const animFrameRef = useRef(null);
  const cardObjectsRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const theme = CARD_THEMES[cardTheme] || CARD_THEMES.royal_velvet;

  useEffect(() => {
    if (!isVisible || !mountRef.current || cardsToDraw.length === 0) return;

    setRevealedSet(new Set());
    setAllDrawn(false);

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    // Three.js Scene
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.75);
    dirLight.position.set(6, 10, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const bumpMap = createCardBackBumpMap();
    const backTex = createCardBackTexture(cardTheme);
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      bumpMap: bumpMap,
      bumpScale: 0.04,
      metalness: 0.2,
      roughness: 0.6,
    });
    const edgeMat = new THREE.MeshStandardMaterial({
      color: theme.edgeColor,
      metalness: 0.4,
      roughness: 0.5,
    });
    const cardGeometry = new THREE.BoxGeometry(2.0, 3.0, 0.04);
    const count = cardsToDraw.length;

    const maxCols = count > 5 ? Math.ceil(count / 2) : count;
    const spacingX = Math.min(2.1, 8.5 / maxCols);

    const cardObjects = [];

    cardsToDraw.forEach((cardData, idx) => {
      const frontTex = createCardFrontTexture(cardData);
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        metalness: 0.0,
        roughness: 0.72,
      });
      const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];
      const mesh = new THREE.Mesh(cardGeometry, materials);
      mesh.castShadow = true;

      const row = count > 5 && idx >= maxCols ? 1 : 0;
      const colIdx = row === 1 ? idx - maxCols : idx;
      const rowCount = row === 1 ? count - maxCols : maxCols;

      const targetX = (colIdx - (rowCount - 1) / 2) * spacingX;
      const targetY = row === 1 ? -1.8 : count > 5 ? 1.5 : 0;
      const targetRotZ = (colIdx - (rowCount - 1) / 2) * -0.04;

      mesh.position.set(6, 6, -2);
      mesh.rotation.set(0, Math.PI, Math.PI * 0.2); // Start face down

      scene.add(mesh);

      cardObjects.push({
        mesh,
        targetX,
        targetY,
        targetZ: 0,
        targetRotZ,
        cardData,
        idx,
        isFlipped: !manualFlip,
        currRotY: Math.PI,
        targetRotY: manualFlip ? Math.PI : 0, // 0 = front face, PI = back face
        delay: idx * 0.12,
        flipProgress: manualFlip ? 0 : 1,
      });
    });

    cardObjectsRef.current = cardObjects;

    const startTime = performance.now();
    const duration = 1.2;

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      let allLanded = true;

      cardObjects.forEach((c) => {
        const localTime = Math.max(0, elapsed - c.delay);
        const p = Math.min(1, localTime / duration);

        if (p < 1.0) {
          allLanded = false;
          const easeP = 1 - Math.pow(1 - p, 3);

          c.mesh.position.x = 6 + (c.targetX - 6) * easeP;
          c.mesh.position.y = 6 * (1 - easeP) + c.targetY * easeP;
          c.mesh.position.z = -2 * (1 - easeP);

          c.mesh.rotation.z = (Math.PI * 0.2) * (1 - easeP) + c.targetRotZ * easeP;

          // Y rotation flip lerp
          c.currRotY = THREE.MathUtils.lerp(Math.PI, c.targetRotY, easeP * easeP * (3 - 2 * easeP));
          c.mesh.rotation.y = c.currRotY;
        } else {
          c.mesh.position.x = c.targetX;
          c.mesh.position.y = c.targetY;
          c.mesh.rotation.z = c.targetRotZ;

          // Smooth lerp Y rotation for manual click flips with height pop (Z offset during flip)
          const rotDiff = Math.abs(c.currRotY - c.targetRotY);
          if (rotDiff > 0.005) {
            c.currRotY = THREE.MathUtils.lerp(c.currRotY, c.targetRotY, 0.18);
            c.mesh.rotation.y = c.currRotY;

            // Height pop offset during mid-flip
            const flipSin = Math.sin((c.currRotY / Math.PI) * Math.PI);
            c.mesh.position.z = Math.abs(flipSin) * 0.8;
          } else {
            c.currRotY = c.targetRotY;
            c.mesh.rotation.y = c.targetRotY;
            c.mesh.position.z = 0;
          }
        }
      });

      renderer.render(scene, camera);

      // Keep rendering as long as cards are dealing or being flipped
      const needsFlip = cardObjects.some((c) => Math.abs(c.currRotY - c.targetRotY) > 0.005);
      if (!allLanded || needsFlip) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = null;
        setAllDrawn(true);
      }
    };

    const triggerFlipAnimation = () => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Click Raycasting on the WebGL Canvas for 3D Card Flipping
    const handlePointerDown = (event) => {
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }

      if (!mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(cardObjects.map((c) => c.mesh));

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const hitCard = cardObjects.find((c) => c.mesh === hitMesh);

        if (hitCard) {
          // Toggle card flip state (works both individually or in reveal mode)
          hitCard.isFlipped = !hitCard.isFlipped;
          hitCard.targetRotY = hitCard.isFlipped ? 0 : Math.PI; // 0 = front face, Math.PI = back face

          setRevealedSet((prev) => {
            const next = new Set(prev);
            if (hitCard.isFlipped) {
              next.add(hitCard.idx);
            } else {
              next.delete(hitCard.idx);
            }
            return next;
          });

          // Trigger smooth 3D flip animation loop
          triggerFlipAnimation();
        }
      }
    };

    const domElement = mountRef.current;
    domElement.addEventListener('pointerdown', handlePointerDown);

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
      if (domElement) domElement.removeEventListener('pointerdown', handlePointerDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible, cardTheme, manualFlip]);

  if (!isVisible) return null;

  const revealedCount = manualFlip ? revealedSet.size : cardsToDraw.length;

  const handleRevealAll = (e) => {
    e.stopPropagation();
    if (!cardObjectsRef.current) return;

    cardObjectsRef.current.forEach((c) => {
      c.isFlipped = true;
      c.targetRotY = 0; // Rotate all to front face
    });
    const allIndices = new Set(cardsToDraw.map((_, i) => i));
    setRevealedSet(allIndices);

    // Trigger smooth 3D flip animation loop for all cards
    if (!animFrameRef.current && mountRef.current) {
      const renderNext = () => {
        let needsFlip = false;
        if (cardObjectsRef.current) {
          cardObjectsRef.current.forEach((c) => {
            const rotDiff = Math.abs(c.currRotY - c.targetRotY);
            if (rotDiff > 0.005) {
              needsFlip = true;
              c.currRotY = THREE.MathUtils.lerp(c.currRotY, c.targetRotY, 0.18);
              c.mesh.rotation.y = c.currRotY;
              const flipSin = Math.sin((c.currRotY / Math.PI) * Math.PI);
              c.mesh.position.z = Math.abs(flipSin) * 0.8;
            } else {
              c.currRotY = c.targetRotY;
              c.mesh.rotation.y = c.targetRotY;
              c.mesh.position.z = 0;
            }
          });
        }
        if (needsFlip) {
          animFrameRef.current = requestAnimationFrame(renderNext);
        } else {
          animFrameRef.current = null;
        }
      };
      animFrameRef.current = requestAnimationFrame(renderNext);
    }
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="physics-card-overlay"
      onClick={handleContainerClick}
      onMouseDown={handleContainerClick}
      onPointerDown={handleContainerClick}
    >
      <div className="card-canvas-container" ref={mountRef} />

      {/* Floating Card Summary Chip at top center */}
      {allDrawn && (
        <div className="card-3d-result-area" onClick={(e) => e.stopPropagation()}>
          <div className="card-result-header">
            <span className="card-result-title">Card Draw</span>
            <span className="card-theme-badge">{theme.name}</span>
          </div>

          {manualFlip && revealedCount < cardsToDraw.length && (
            <button className="card-reveal-all-btn" onClick={handleRevealAll}>
              Reveal All ({revealedCount}/{cardsToDraw.length})
            </button>
          )}

          <div className="card-drawn-list">
            {cardsToDraw.map((card, idx) => {
              const isRevealed = !manualFlip || revealedSet.has(idx);
              return (
                <div key={idx} className={`drawn-card-pill ${isRevealed ? 'revealed' : 'hidden'}`}>
                  <span className="card-rank">{isRevealed ? card.rank : '?'}</span>
                  <span className="card-suit">{isRevealed ? card.suitSymbol : '🂠'}</span>
                  <span className="card-title">{isRevealed ? card.name : 'Card'}</span>
                </div>
              );
            })}
          </div>

          <button
            className="card-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicsCardScene;
