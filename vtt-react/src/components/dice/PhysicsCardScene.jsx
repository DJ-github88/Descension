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

  // Outer gold filigree frame
  ctx.lineWidth = 16;
  ctx.strokeStyle = theme.borderColor;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Corner embellishments
  const cornerSize = 40;
  [
    [20, 20],
    [width - 20, 20],
    [20, height - 20],
    [width - 20, height - 20],
  ].forEach(([x, y]) => {
    ctx.fillStyle = theme.borderColor;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
  });

  const cx = width / 2;
  const cy = height / 2;

  // Center emblem background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = theme.borderColor;
  ctx.stroke();

  ctx.font = '90px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.edgeColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText(theme.backSymbol, cx, cy);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Procedural Card Front Texture
function createCardFrontTexture(card) {
  const width = 512;
  const height = 768;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f6f0df';
  ctx.fillRect(0, 0, width, height);

  // Linen texture grain
  ctx.fillStyle = 'rgba(180, 160, 120, 0.07)';
  for (let i = 0; i < 500; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Double gold borders
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#8b5a2b';
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(26, 26, width - 52, height - 52);

  const isRed = card.suit === '♥' || card.suit === '♦' || card.suit === 'Hearts' || card.suit === 'Diamonds';
  const color = isRed ? '#b91c1c' : '#0f172a';

  const suitSymbol = card.suitSymbol || (card.suit === 'Hearts' ? '♥' : card.suit === 'Diamonds' ? '♦' : card.suit === 'Clubs' ? '♣' : '♠');
  const rank = card.value || card.rank || 'A';

  // Top-left rank & suit
  ctx.font = 'bold 54px "Cinzel", serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(rank, 60, 75);

  ctx.font = '46px serif';
  ctx.fillText(suitSymbol, 60, 125);

  // Bottom-right rank & suit (rotated 180 deg)
  ctx.save();
  ctx.translate(width - 60, height - 75);
  ctx.rotate(Math.PI);
  ctx.font = 'bold 54px "Cinzel", serif';
  ctx.fillText(rank, 0, 0);
  ctx.font = '46px serif';
  ctx.fillText(suitSymbol, 0, -50);
  ctx.restore();

  const cx = width / 2;
  const cy = height / 2;

  // Center watermark circle
  ctx.strokeStyle = isRed ? 'rgba(185, 28, 28, 0.18)' : 'rgba(15, 23, 42, 0.18)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 120, 0, Math.PI * 2);
  ctx.stroke();

  // Center large suit emblem
  ctx.font = 'bold 150px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 6;
  ctx.fillText(suitSymbol, cx, cy - 20);

  // Card Name Footer Label
  ctx.font = 'bold 26px "Cinzel", serif';
  ctx.fillStyle = '#334155';
  ctx.shadowBlur = 0;
  ctx.fillText(card.name || `${rank} of ${card.suit}`, cx, height - 64);

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

    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.55);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.45);
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
        roughness: 0.9,
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
