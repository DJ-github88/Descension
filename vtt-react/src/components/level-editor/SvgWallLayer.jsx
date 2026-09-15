import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import polygonClipping from 'polygon-clipping';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import {
  SUN_WORLD,
  buildWallRenderItem,
  collectWallNodes,
  computeWallFootprint,
  getWallHeightWorld,
  nodeConnectedSolidCount,
  nodeKeyForWorld,
  getWallWorldEndpoints,
  parseWallKey,
  polygonBBox,
  projectWorldPoint,
  registerWallPattern,
  wallPatternDescriptor
} from '../../utils/WallGeometry';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const hexToRgb = (hex) => {
  if (typeof hex !== 'string') return null;
  let raw = hex.replace('#', '');
  if (raw.length === 3) raw = raw.split('').map((c) => c + c).join('');
  if (raw.length !== 6) return null;
  const num = parseInt(raw, 16);
  if (!Number.isFinite(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const shade = (hex, amount) => {
  const rgb = hexToRgb(hex) || { r: 111, g: 106, b: 97 };
  return `rgb(${clamp(rgb.r + amount, 0, 255)}, ${clamp(rgb.g + amount, 0, 255)}, ${clamp(rgb.b + amount, 0, 255)})`;
};

const mulColor = (hex, factor) => {
  const rgb = hexToRgb(hex) || { r: 111, g: 106, b: 97 };
  const f = Number.isFinite(factor) ? factor : 1;
  return `rgb(${clamp(Math.round(rgb.r * f), 0, 255)}, ${clamp(Math.round(rgb.g * f), 0, 255)}, ${clamp(Math.round(rgb.b * f), 0, 255)})`;
};

const withAlpha = (hex, alpha) => {
  const rgb = hexToRgb(hex) || { r: 111, g: 106, b: 97 };
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

const mixColors = (a, b, t) => {
  const ca = hexToRgb(a) || { r: 111, g: 106, b: 97 };
  const cb = hexToRgb(b) || { r: 111, g: 106, b: 97 };
  return `rgb(${Math.round(ca.r + (cb.r - ca.r) * t)}, ${Math.round(ca.g + (cb.g - ca.g) * t)}, ${Math.round(ca.b + (cb.b - ca.b) * t)})`;
};

/**
 * Stylized 3-tone face shading. `facing` is +1 for camera-facing (near) walls
 * and -1 for far walls, `sky` is the world-space sun dot, and `lateral` is how
 * much the face normal leans screen-right. The screen-space key light keeps
 * perpendicular walls distinguishable even when their sun dots match, which is
 * what makes the isometric volume readable.
 */
const faceLightFactor = (facing, sky, lateral) => (facing > 0
  ? clamp(0.74 + 0.24 * Math.max(0, sky) - 0.12 * lateral, 0.52, 1.06)
  : clamp(0.34 + 0.2 * Math.max(0, sky) - 0.07 * lateral, 0.2, 0.6));

const faceLightFromItem = (light, near) => {
  const lateral = Number.isFinite(light?.lateralNear) ? light.lateralNear : 0;
  return near
    ? faceLightFactor(1, light?.near || 0, lateral)
    : faceLightFactor(-1, light?.far || 0, -lateral);
};

const pointsAttr = (points) => points.map((p) => `${p.x},${p.y}`).join(' ');

const lineProps = (line) => ({ x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 });

const polygonCentroid = (poly) => {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
};

const pointInRings = (x, y, rings) => {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0];
      const yi = ring[i][1];
      const xj = ring[j][0];
      const yj = ring[j][1];
      if ((yi > y) !== (yj > y) &&
          x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
};

const ringToPath = (screenRing) => {
  if (!screenRing || screenRing.length < 2) return '';
  return `M ${screenRing.map((p) => `${p.x},${p.y}`).join(' L ')} Z`;
};

// polygon-clipping repeats the first vertex as the last one. Iterating the raw
// ring as edges therefore yields a zero-length edge, whose direction is (0,0):
// registering a pattern for it produced a degenerate `...-0-*` pattern id that
// clobbered the real east-west pattern (missing wall textures), plus invisible
// zero-area side quads. Drop the closing duplicate and any consecutive dupes.
const normalizeRing = (ring) => {
  const out = [];
  for (const point of ring) {
    const last = out[out.length - 1];
    if (last && Math.abs(last[0] - point[0]) < 1e-9 && Math.abs(last[1] - point[1]) < 1e-9) {
      continue;
    }
    out.push(point);
  }
  if (out.length > 1) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.abs(first[0] - last[0]) < 1e-9 && Math.abs(first[1] - last[1]) < 1e-9) {
      out.pop();
    }
  }
  return out;
};

const hexCornersForTile = (gridSystem, gridType, tileX, tileY, gridSize) => {
  if (gridType === 'hex') {
    const center = gridSystem.hexToWorld(tileX, tileY);
    return {
      center,
      footprint: gridSystem.getHexCorners(center.x, center.y, gridSize / Math.sqrt(3))
    };
  }
  const corner = gridSystem.gridToWorldCorner(tileX, tileY);
  return {
    center: { x: corner.x + gridSize / 2, y: corner.y + gridSize / 2 },
    footprint: [
      { x: corner.x, y: corner.y },
      { x: corner.x + gridSize, y: corner.y },
      { x: corner.x + gridSize, y: corner.y + gridSize },
      { x: corner.x, y: corner.y + gridSize }
    ]
  };
};

const buildTerrainOccluders = ({
  items,
  elevatedTiles,
  gridSystem,
  gridType,
  gridSize,
  viewportWidth,
  viewportHeight
}) => {
  const BUCKET_SIZE = 4;
  const buckets = new Map();
  const bucketKey = (x, y) => `${Math.floor(x / BUCKET_SIZE)},${Math.floor(y / BUCKET_SIZE)}`;

  const raised = [];
  for (const tile of elevatedTiles) {
    const topZ = tile.level * gridSize;
    const { center, footprint } = hexCornersForTile(gridSystem, gridType, tile.x, tile.y, gridSize);
    const top = footprint.map((p) => gridSystem.worldToScreen3D(p.x, p.y, topZ, viewportWidth, viewportHeight));
    const bbox = polygonBBox(top) || { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    const entry = {
      x: tile.x,
      y: tile.y,
      center,
      footprint,
      top,
      topZ,
      depth: gridSystem.depthKey(center.x, center.y),
      bbox
    };
    raised.push(entry);
    const key = bucketKey(tile.x, tile.y);
    let list = buckets.get(key);
    if (!list) {
      list = [];
      buckets.set(key, list);
    }
    list.push(entry);
  }
  if (raised.length === 0) return;

  const candidatesForItem = (item) => {
    const tiles = [item.worldStart, item.worldEnd].map((world) => gridSystem.worldToGrid(world.x, world.y));
    const minX = Math.min(tiles[0].x, tiles[1].x) - 3;
    const maxX = Math.max(tiles[0].x, tiles[1].x) + 3;
    const minY = Math.min(tiles[0].y, tiles[1].y) - 3;
    const maxY = Math.max(tiles[0].y, tiles[1].y) + 3;

    const candidates = [];
    for (let bx = Math.floor(minX / BUCKET_SIZE); bx <= Math.floor(maxX / BUCKET_SIZE); bx++) {
      for (let by = Math.floor(minY / BUCKET_SIZE); by <= Math.floor(maxY / BUCKET_SIZE); by++) {
        const list = buckets.get(`${bx},${by}`);
        if (list) candidates.push(...list);
      }
    }
    return candidates;
  };

  for (const item of items) {
    const bbox = polygonBBox([...item.faces.near, ...item.faces.top]);
    if (!bbox) continue;

    let occluders = null;
    let count = 0;
    for (const tile of candidatesForItem(item)) {
      if (count >= 5) break;
      if (tile.depth <= item.depth) continue;
      if (tile.topZ <= item.baseZStart) continue;
      if (tile.bbox.maxX < bbox.minX - 4 || tile.bbox.minX > bbox.maxX + 4 ||
          tile.bbox.maxY < bbox.minY - 4 || tile.bbox.minY > bbox.maxY + 4) {
        continue;
      }

      const polygons = [pointsAttr(tile.top)];
      for (let i = 0; i < tile.footprint.length; i++) {
        const a = tile.footprint[i];
        const b = tile.footprint[(i + 1) % tile.footprint.length];
        const baseA = gridSystem.worldToScreen3D(a.x, a.y, 0, viewportWidth, viewportHeight);
        const baseB = gridSystem.worldToScreen3D(b.x, b.y, 0, viewportWidth, viewportHeight);
        const topA = gridSystem.worldToScreen3D(a.x, a.y, tile.topZ, viewportWidth, viewportHeight);
        const topB = gridSystem.worldToScreen3D(b.x, b.y, tile.topZ, viewportWidth, viewportHeight);
        polygons.push(`${baseA.x},${baseA.y} ${baseB.x},${baseB.y} ${topB.x},${topB.y} ${topA.x},${topA.y}`);
      }

      if (!occluders) occluders = [];
      occluders.push(...polygons);
      count += 1;
    }

    if (occluders) {
      item.occluders = occluders;
      item.maskId = `wallOccl-${item.key.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    }
  }
};

const renderSide = (side) => (
  <>
    <polygon points={side.points} fill={side.fill} />
    {side.patternId && <polygon points={side.points} fill={`url(#${side.patternId})`} />}
    <polygon points={side.points} fill={`url(#${side.shadeId || 'svgWallSideShade'})`} />
    {side.topLine && (
      <line
        {...lineProps(side.topLine)}
        stroke={side.topStroke}
        strokeWidth={side.topStrokeWidth}
        opacity="0.42"
      />
    )}
    {side.baseLine && (
      <line
        {...lineProps(side.baseLine)}
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={side.baseStrokeWidth}
      />
    )}
  </>
);

// The top plate is drawn without texture; the rim strips are separate sorted
// primitives so they can be occluded/cast occlusion locally along a wall.
const renderTop = (top) => (
  <>
    <path d={top.topPath} fill={top.topFill} fillRule="evenodd" />
    <path d={top.topPath} fill="url(#svgWallTopShade)" fillRule="evenodd" />
    <path d={top.topPath} fill="none" stroke="rgba(0,0,0,0.42)" strokeWidth="1" />
  </>
);

const renderTopStrip = (strip) => (
  <g clipPath={`url(#${strip.clipId})`}>
    {strip.patternId && <polygon points={strip.points} fill={`url(#${strip.patternId})`} />}
  </g>
);

const renderWindow = (item) => {
  const w = item.window;
  const { color, light } = item;
  const masonry = item.masonryColor || color;
  const nearFill = mulColor(masonry, faceLightFromItem(light, true));
  const farFill = mulColor(masonry, faceLightFromItem(light, false));
  const sillFill = mulColor(masonry, 1.12);
  const frameFill = mixColors(masonry, '#4a3b2a', 0.35);
  const frameEdge = mulColor(masonry, 1.3);
  const revealFill = 'rgba(16, 13, 10, 0.8)';
  const revealSide = mulColor(masonry, 0.45);
  const barFill = mulColor(color, 0.32);

  const frameQuads = (frame) => (
    <>
      <polygon points={pointsAttr(frame.left)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
      <polygon points={pointsAttr(frame.right)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
      <polygon points={pointsAttr(frame.top)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
      <polygon points={pointsAttr(frame.bottom)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
    </>
  );

  return (
    <>
      <polygon points={pointsAttr(w.breastFar)} fill={farFill} />
      <polygon points={pointsAttr(w.lintelFar)} fill={farFill} />
      <polygon points={pointsAttr(w.sideStart.far)} fill={farFill} />
      <polygon points={pointsAttr(w.sideEnd.far)} fill={farFill} />
      {item.showEndStart && <polygon points={pointsAttr(item.faces.endStart)} fill={mulColor(color, 0.38)} />}
      {item.showEndEnd && <polygon points={pointsAttr(item.faces.endEnd)} fill={mulColor(color, 0.38)} />}
      <polygon points={pointsAttr(w.jambStart)} fill={farFill} />
      <polygon points={pointsAttr(w.jambEnd)} fill={farFill} />
      {frameQuads(w.frameFar)}

      <polygon points={pointsAttr(w.soffit)} fill={revealFill} />
      <polygon points={pointsAttr(w.revealStart)} fill={revealSide} />
      <polygon points={pointsAttr(w.revealEnd)} fill={revealSide} />
      {w.interior && <polygon points={pointsAttr(w.interior)} fill={revealFill} />}

      {w.pane && (
        <>
          <polygon points={pointsAttr(w.pane)} fill="url(#svgWindowGlass)" />
          <polygon
            points={pointsAttr(w.pane)}
            fill="none"
            stroke="rgba(210, 235, 250, 0.65)"
            strokeWidth="1.2"
          />
        </>
      )}

      {w.bars.map((bar, idx) => (
        <line
          key={`bar-${idx}`}
          {...lineProps(bar)}
          stroke={barFill}
          strokeWidth={Math.max(1.6, item.thickness * 0.09)}
          strokeLinecap="round"
        />
      ))}

      {w.mullions.map((mullion, idx) => (
        <line
          key={`mullion-${idx}`}
          {...lineProps(mullion)}
          stroke={frameFill}
          strokeWidth={Math.max(2, item.thickness * 0.16)}
        />
      ))}

      <polygon points={pointsAttr(w.sideStart.near)} fill={nearFill} />
      <polygon points={pointsAttr(w.sideEnd.near)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(w.sideStart.near)} fill={`url(#${item.patternId})`} />}
      {item.patternId && <polygon points={pointsAttr(w.sideEnd.near)} fill={`url(#${item.patternId})`} />}
      <polygon points={pointsAttr(w.sideStart.near)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(w.sideEnd.near)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(w.breastNear)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(w.breastNear)} fill={`url(#${item.patternId})`} />}
      <polygon points={pointsAttr(w.breastNear)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(w.sillShadow)} fill="rgba(0,0,0,0.28)" />

      <polygon points={pointsAttr(w.lintelNear)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(w.lintelNear)} fill={`url(#${item.patternId})`} />}
      <polygon points={pointsAttr(w.lintelNear)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(w.aoStart)} fill="rgba(0,0,0,0.24)" />
      <polygon points={pointsAttr(w.aoEnd)} fill="rgba(0,0,0,0.24)" />

      {frameQuads(w.frameNear)}

      <polygon points={pointsAttr(w.sillFront)} fill={mulColor(masonry, 0.78)} />
      <polygon points={pointsAttr(w.sillTop)} fill={sillFill} />
      <polygon points={pointsAttr(w.sillTop)} fill="url(#svgWallTopShade)" />
      <polygon points={pointsAttr(w.sillTop)} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1" />

      <line {...lineProps(w.sillEdge)} stroke={frameEdge} strokeWidth={Math.max(1.6, item.thickness * 0.14)} />
      <line {...lineProps(w.headEdge)} stroke={frameEdge} strokeWidth={Math.max(1.4, item.thickness * 0.12)} opacity="0.85" />

      <polygon points={pointsAttr(item.faces.top)} fill={mulColor(masonry, 1.07 + Math.max(0, light.top) * 0.05)} />
      {item.pattern && <polygon points={pointsAttr(item.faces.top)} fill={`url(#${item.pattern.top.id})`} opacity="0.9" />}
      <polygon points={pointsAttr(item.faces.top)} fill="url(#svgWallTopShade)" />
      <polygon points={pointsAttr(item.faces.top)} fill="none" stroke="rgba(0,0,0,0.48)" strokeWidth="1" />
    </>
  );
};

const renderDoor = (item, updateWall) => {
  const d = item.door;
  const { color, light } = item;
  const masonry = item.masonryColor || color;
  const frameFill = mixColors(color, '#33230f', 0.55);
  const frameEdge = mixColors(color, '#1f1408', 0.5);
  const leafFill = mixColors(color, '#7a4f26', 0.2);
  const leafDark = mixColors(color, '#2c1a0a', 0.5);
  const farFill = mulColor(masonry, faceLightFromItem(light, false));
  const nearFill = mulColor(masonry, faceLightFromItem(light, true));
  const swingFarFill = mulColor(color, 0.5);
  const swingTopFill = mulColor(color, 1.2);
  const swingEdgeFill = mulColor(color, 0.62);
  const ironFill = 'rgba(38, 38, 44, 0.92)';
  const ironEdge = 'rgba(12, 12, 16, 0.9)';
  const revealFill = 'rgba(14, 11, 8, 0.82)';

  const frameQuads = (frame) => (
    <>
      <polygon points={pointsAttr(frame.left)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
      <polygon points={pointsAttr(frame.right)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
      <polygon points={pointsAttr(frame.head)} fill={frameFill} stroke={frameEdge} strokeWidth="1" />
    </>
  );

  const handleClick = (event) => {
    event.stopPropagation();
    const parts = item.key.split(',').map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return;
    if (item.state === 'locked') return;
    updateWall(parts[0], parts[1], parts[2], parts[3], {
      state: item.state === 'open' ? 'closed' : 'open'
    });
  };

  const renderLeafDetails = () => (
    <>
      {d.leaf.planks.map((line, idx) => (
        <line key={`plank-${idx}`} {...lineProps(line)} stroke="rgba(34, 19, 7, 0.5)" strokeWidth={Math.max(1, item.thickness * 0.1)} />
      ))}
      {d.leaf.bands.map((line, idx) => (
        <line
          key={`band-${idx}`}
          {...lineProps(line)}
          stroke={ironFill}
          strokeWidth={Math.max(2.4, item.thickness * 0.3)}
          strokeLinecap="round"
        />
      ))}
      {d.leaf.bands.map((line, idx) => (
        <line
          key={`band-edge-${idx}`}
          {...lineProps(line)}
          stroke={ironEdge}
          strokeWidth={Math.max(3.4, item.thickness * 0.42)}
          strokeLinecap="round"
          opacity="0.35"
        />
      ))}
      {d.leaf.hinges.map((pt, idx) => (
        <circle
          key={`hinge-${idx}`}
          cx={pt.x}
          cy={pt.y}
          r={Math.max(2, item.thickness * 0.16)}
          fill={ironFill}
          stroke={ironEdge}
          strokeWidth="1"
        />
      ))}
      <circle
        cx={d.leaf.handle.x}
        cy={d.leaf.handle.y}
        r={Math.max(3.4, item.thickness * 0.28)}
        fill="rgba(20, 14, 8, 0.85)"
        stroke="rgba(60, 42, 16, 0.9)"
        strokeWidth="1"
      />
      <circle
        cx={d.leaf.handle.x}
        cy={d.leaf.handle.y}
        r={Math.max(2.1, item.thickness * 0.17)}
        fill="none"
        stroke="#d9b96a"
        strokeWidth={Math.max(1.6, item.thickness * 0.1)}
      />
      {item.state === 'locked' && (
        <circle
          cx={d.leaf.lock.x}
          cy={d.leaf.lock.y}
          r={Math.max(2.4, item.thickness * 0.2)}
          fill="#cfcfcf"
          stroke="rgba(30, 30, 30, 0.9)"
          strokeWidth="1"
        />
      )}
    </>
  );

  return (
    <>
      <polygon points={pointsAttr(d.lintelFar)} fill={farFill} />
      <polygon points={pointsAttr(d.stubStart.far)} fill={farFill} />
      <polygon points={pointsAttr(d.stubEnd.far)} fill={farFill} />
      <polygon points={pointsAttr(d.jambStart)} fill={farFill} />
      <polygon points={pointsAttr(d.jambEnd)} fill={farFill} />
      {item.showEndStart && <polygon points={pointsAttr(item.faces.endStart)} fill={mulColor(color, 0.38)} />}
      {item.showEndEnd && <polygon points={pointsAttr(item.faces.endEnd)} fill={mulColor(color, 0.38)} />}
      {frameQuads(d.frameFar)}
      <polygon points={pointsAttr(d.floor)} fill={revealFill} />
      <polygon points={pointsAttr(d.soffit)} fill={'rgba(10, 8, 6, 0.86)'} />
      <polygon points={pointsAttr(d.jambStart)} fill="url(#svgWallSideShade)" opacity="0.7" />
      <polygon points={pointsAttr(d.jambEnd)} fill="url(#svgWallSideShade)" opacity="0.7" />

      {d.leaf && (
        <>
          <polygon points={pointsAttr(d.leaf.face)} fill={leafFill} />
          <polygon points={pointsAttr(d.leaf.face)} fill={leafDark} opacity="0.28" />
          {renderLeafDetails()}
        </>
      )}

      <polygon points={pointsAttr(d.lintelNear)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(d.lintelNear)} fill={`url(#${item.patternId})`} opacity="0.9" />}
      <polygon points={pointsAttr(d.lintelNear)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(d.stubStart.near)} fill={nearFill} />
      <polygon points={pointsAttr(d.stubEnd.near)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(d.stubStart.near)} fill={`url(#${item.patternId})`} opacity="0.9" />}
      {item.patternId && <polygon points={pointsAttr(d.stubEnd.near)} fill={`url(#${item.patternId})`} opacity="0.9" />}
      <polygon points={pointsAttr(d.stubStart.near)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(d.stubEnd.near)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(d.aoStart)} fill="rgba(0,0,0,0.24)" />
      <polygon points={pointsAttr(d.aoEnd)} fill="rgba(0,0,0,0.24)" />
      {frameQuads(d.frameNear)}

      <line
        {...lineProps(d.threshold)}
        stroke="rgba(0, 0, 0, 0.55)"
        strokeWidth={Math.max(1.6, item.thickness * 0.18)}
      />

      <polygon points={pointsAttr(item.faces.top)} fill={mulColor(masonry, 1.07 + Math.max(0, light.top) * 0.05)} />
      {item.pattern && <polygon points={pointsAttr(item.faces.top)} fill={`url(#${item.pattern.top.id})`} opacity="0.9" />}
      <polygon points={pointsAttr(item.faces.top)} fill="url(#svgWallTopShade)" />
      <polygon points={pointsAttr(item.faces.top)} fill="none" stroke="rgba(0,0,0,0.48)" strokeWidth="1" />

      {d.swing && (
        <>
          <polygon points={pointsAttr(d.swing.shadow)} fill="rgba(0,0,0,0.16)" />
          <polyline
            points={pointsAttr(d.swing.arc)}
            fill="none"
            stroke="rgba(255, 244, 214, 0.3)"
            strokeWidth="1.3"
            strokeDasharray="5 6"
          />
          <polygon points={pointsAttr(d.swing.far)} fill={swingFarFill} />
          <polygon points={pointsAttr(d.swing.edgeHinge)} fill={swingEdgeFill} />
          <polygon points={pointsAttr(d.swing.edgeFree)} fill={swingEdgeFill} />
          <polygon points={pointsAttr(d.swing.top)} fill={swingTopFill} />
          <polygon points={pointsAttr(d.swing.near)} fill={leafFill} />
          <polygon points={pointsAttr(d.swing.near)} fill={leafDark} opacity="0.2" />
          <polygon points={pointsAttr(d.swing.near)} fill="url(#svgWallSideShade)" opacity="0.5" />
          {d.swing.planks.map((line, idx) => (
            <line key={`swing-plank-${idx}`} {...lineProps(line)} stroke="rgba(34, 19, 7, 0.45)" strokeWidth={Math.max(1, item.thickness * 0.09)} />
          ))}
          {d.swing.bands.map((line, idx) => (
            <line
              key={`swing-band-${idx}`}
              {...lineProps(line)}
              stroke={ironFill}
              strokeWidth={Math.max(2.4, item.thickness * 0.3)}
              strokeLinecap="round"
            />
          ))}
          {d.swing.bands.map((line, idx) => (
            <line
              key={`swing-band-edge-${idx}`}
              {...lineProps(line)}
              stroke={ironEdge}
              strokeWidth={Math.max(3.4, item.thickness * 0.42)}
              strokeLinecap="round"
              opacity="0.3"
            />
          ))}
          {d.swing.hinges.map((pt, idx) => (
            <circle
              key={`swing-hinge-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r={Math.max(1.8, item.thickness * 0.14)}
              fill={ironFill}
              stroke={ironEdge}
              strokeWidth="1"
            />
          ))}
          <circle
            cx={d.swing.handle.x}
            cy={d.swing.handle.y}
            r={Math.max(3, item.thickness * 0.26)}
            fill="rgba(20, 14, 8, 0.85)"
            stroke="rgba(60, 42, 16, 0.9)"
            strokeWidth="1"
          />
          <circle
            cx={d.swing.handle.x}
            cy={d.swing.handle.y}
            r={Math.max(1.9, item.thickness * 0.15)}
            fill="none"
            stroke="#d9b96a"
            strokeWidth={Math.max(1.4, item.thickness * 0.09)}
          />
          <polygon
            points={pointsAttr(d.swing.near)}
            fill="none"
            stroke={ironEdge}
            strokeWidth="1"
            opacity="0.65"
          />
        </>
      )}

      <polygon
        points={pointsAttr(item.faces.near)}
        fill="rgba(0, 0, 0, 0.001)"
        style={{ pointerEvents: 'auto', cursor: item.state === 'locked' ? 'not-allowed' : 'pointer' }}
        onClick={handleClick}
      />
    </>
  );
};

const renderMagic = (item) => {
  const { faces, color } = item;
  const topFace = pointsAttr(faces.top);
  const nearFace = pointsAttr(faces.near);
  const farFace = pointsAttr(faces.far);
  return (
    <>
      <polygon points={farFace} fill={withAlpha(color, 0.16)} />
      <polygon points={nearFace} fill={withAlpha(color, 0.26)} className="svg-magic-face" />
      <polygon
        points={nearFace}
        fill="none"
        stroke={withAlpha(color, 0.85)}
        strokeWidth="1.4"
        strokeDasharray="7 5"
      />
      <polygon points={topFace} fill={withAlpha(color, 0.34)} />
      <polygon points={topFace} fill="url(#svgWallTopShade)" />
      <polygon points={topFace} fill="none" stroke={withAlpha(color, 0.7)} strokeWidth="1" />
      <line
        {...lineProps({
          x1: faces.near[0].x,
          y1: faces.near[0].y,
          x2: faces.near[1].x,
          y2: faces.near[1].y
        })}
        stroke={withAlpha(color, 0.9)}
        strokeWidth={Math.max(1.6, item.thickness * 0.16)}
        strokeDasharray="4 4"
      />
    </>
  );
};

const renderFeature = (item, updateWall) => {
  if (item.isMagic) return renderMagic(item);
  if (item.isWindow) return renderWindow(item);
  if (item.isDoor) return renderDoor(item, updateWall);
  return null;
};

const wallFeatureCutRects = (items) => items
  .filter((item) => item.isDoor || item.isWindow)
  .map((item) => {
    const half = item.thickness / 2;
    const nx = item.nwx;
    const ny = item.nwy;
    const s = item.worldStart;
    const e = item.worldEnd;
    const ux = item.ux;
    const uy = item.uy;
    const pad = 0.02;
    return [[
      [s.x + nx * half - ux * pad, s.y + ny * half - uy * pad],
      [e.x + nx * half + ux * pad, e.y + ny * half + uy * pad],
      [e.x - nx * half + ux * pad, e.y - ny * half + uy * pad],
      [s.x - nx * half - ux * pad, s.y - ny * half - uy * pad]
    ]];
  });

// Faces this small on screen are slivers from nearly edge-on walls; drawing
// them only produces noise (and degenerate texture matrices).
const WALL_SIDE_MIN_SCREEN_AREA = 2.5;

const screenPolygonArea = (points) => {
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += points[j].x * points[i].y - points[i].x * points[j].y;
  }
  return Math.abs(area) / 2;
};

const buildRuns = ({ solidItems, transform, fogOfWarEnabled, nodes, featureCuts = [], gridSize, patternsById }) => {
  const groups = new Map();
  for (const item of solidItems) {
    const key = `${item.typeId}|${Math.round(item.baseZStart)}|${Math.round(item.topZ)}|${item.color}`;
    let group = groups.get(key);
    if (!group) {
      group = { key, items: [], typeId: item.typeId, color: item.color, baseZ: item.baseZStart, topZ: item.topZ };
      groups.set(key, group);
    }
    group.items.push(item);
    if (item.baseZStart < group.baseZ) group.baseZ = item.baseZStart;
    // Descend the run to the lowest adjacent ground so walls along elevation
    // steps read as retaining walls instead of floating slabs.
    const lowStart = Number.isFinite(item.baseZLowStart) ? item.baseZLowStart : item.baseZStart;
    const lowEnd = Number.isFinite(item.baseZLowEnd) ? item.baseZLowEnd : item.baseZEnd;
    if (lowStart < group.baseZ) group.baseZ = lowStart;
    if (lowEnd < group.baseZ) group.baseZ = lowEnd;
    if (item.topZ > group.topZ) group.topZ = item.topZ;
  }

  const viewX = -transform.sinYaw;
  const viewY = transform.cosYaw;
  const sunLength = Math.max(1e-6, Math.hypot(SUN_WORLD.x, SUN_WORLD.y));
  const sunUnit = { x: SUN_WORLD.x / sunLength, y: SUN_WORLD.y / sunLength };

  // Painter key = ground-space depth along the camera axis. Screen Y would be
  // wrong here: it embeds height, so a distant tall wall's face could outrank
  // a near wall's top plate and hide the top of the nearer wall.
  const depthOfWorld = (x, y) =>
    -((x - transform.cameraX) * transform.sinYaw) +
    (y - transform.cameraY) * transform.cosYaw;

  const primitives = [];
  const shadowByBase = new Map();
  const gradients = [];
  let runIndex = 0;

  for (const group of groups.values()) {
    const half = group.items[0].thickness / 2;
    const groupKeys = new Set(group.items.map((item) => item.key));
    const rects = [];
    for (const item of group.items) {
      const footprint = computeWallFootprint({
        item,
        startNode: nodes?.get(item.nodeKeys?.[0]),
        endNode: nodes?.get(item.nodeKeys?.[1]),
        half,
        partnerKeys: groupKeys
      });
      if (footprint) rects.push([footprint]);
    }
    if (rects.length === 0) continue;
    let unioned;
    try {
      unioned = polygonClipping.union(rects[0], ...rects.slice(1));
    } catch (error) {
      unioned = rects;
    }
    if (featureCuts.length > 0 && unioned && unioned.length > 0) {
      try {
        unioned = polygonClipping.difference(unioned, ...featureCuts);
      } catch (error) {
        // Keep the un-cut union if the difference fails
      }
    }
    if (!unioned || unioned.length === 0) continue;

    const thickness = group.items[0].thickness;
    const heightWorld = Math.max(1, group.topZ - group.baseZ);
    const pattern = wallPatternDescriptor({
      typeId: group.typeId || 'stone_wall',
      ux: group.items[0].ux,
      uy: group.items[0].uy,
      gridSize,
      transform,
      color: group.color
    });
    registerWallPattern(patternsById, pattern);
    const topFill = mulColor(group.color, 1.07);
    const shadowLength = Math.min(heightWorld * 0.4, thickness * 3.2);
    const showShadow = !fogOfWarEnabled && !group.items.every((item) => item.dimmed);
    const groupDimmed = group.items.every((item) => item.dimmed);
    const wallKeys = group.items.map((item) => item.key);
    const runOccluders = group.items.flatMap((item) => item.occluders || []);
    const minSegment = Math.max((gridSize || 50) * 0.75, thickness * 3, 4);

    for (const polygon of unioned) {
      const worldRings = polygon
        .map(normalizeRing)
        .filter((ring) => ring.length >= 3);
      if (worldRings.length === 0) continue;
      const screenTopRings = worldRings.map((ring) =>
        ring.map((p) => projectWorldPoint(transform, p[0], p[1], group.topZ))
      );
      const topPath = screenTopRings.map(ringToPath).join(' ');
      if (!topPath) continue;

      const runKey = `run-${runIndex}-${group.key}`;
      runIndex += 1;
      const clipId = `wallTopClip-${runKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      const maskId = runOccluders.length > 0
        ? `runOccl-${runKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`
        : null;
      const stripDepth = thickness * 1.02;
      const shadeBase = `svgWallFaceShade-${runIndex}`;

      worldRings.forEach((ring, ringIndex) => {
        for (let i = 0; i < ring.length; i++) {
          const a = ring[i];
          const b = ring[(i + 1) % ring.length];
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const len = Math.hypot(dx, dy);
          if (len < 1e-6) continue;

          let normal = { x: dy / len, y: -dx / len };
          const mid = { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 };
          const probe = { x: mid.x + normal.x * 0.5, y: mid.y + normal.y * 0.5 };
          if (pointInRings(probe.x, probe.y, worldRings)) {
            normal = { x: -normal.x, y: -normal.y };
          }
          const facing = normal.x * viewX + normal.y * viewY;

          const edgePattern = wallPatternDescriptor({
            typeId: group.typeId || 'stone_wall',
            ux: dx / len,
            uy: dy / len,
            gridSize,
            transform,
            color: group.color
          });
          registerWallPattern(patternsById, edgePattern);

          // Split each edge into short segments: the painter can then order
          // every piece locally instead of sorting one giant quad by a single
          // depth, which is what made long walls fight over who is in front.
          const segments = Math.max(1, Math.ceil(len / minSegment));

          // Top-face rim strip for this edge, segmented the same way as the
          // side face so both sort locally. Strips are clipped to the union
          // footprint at render time so they cannot poke past miters.
          const inward = { x: -normal.x * stripDepth, y: -normal.y * stripDepth };
          for (let s = 0; s < segments; s++) {
            const t0 = s / segments;
            const t1 = (s + 1) / segments;
            const ax = a[0] + dx * t0;
            const ay = a[1] + dy * t0;
            const bx = a[0] + dx * t1;
            const by = a[1] + dy * t1;
            const s0 = projectWorldPoint(transform, ax, ay, group.topZ);
            const s1 = projectWorldPoint(transform, bx, by, group.topZ);
            const s2 = projectWorldPoint(transform, bx + inward.x, by + inward.y, group.topZ);
            const s3 = projectWorldPoint(transform, ax + inward.x, ay + inward.y, group.topZ);
            const stripQuad = [s0, s1, s2, s3];
            if (screenPolygonArea(stripQuad) < WALL_SIDE_MIN_SCREEN_AREA * 0.4) continue;
            primitives.push({
              kind: 'topStrip',
              key: `${runKey}-strip-${ringIndex}-${i}-${s}`,
              runKey,
              wallKeys,
              thickness,
              dimmed: groupDimmed,
              maskId,
              occluders: runOccluders,
              clipId,
              points: stripQuad.map((p) => `${p.x},${p.y}`).join(' '),
              polygon: stripQuad,
              bbox: polygonBBox(stripQuad),
              centroid: polygonCentroid(stripQuad),
              patternId: edgePattern ? edgePattern.top.id : null,
              sortKey: depthOfWorld((ax + bx) / 2, (ay + by) / 2),
              minY: Math.min(s0.y, s1.y, s2.y, s3.y)
            });
          }

          // Backfaces of a grounded prism are never visible; drawing them
          // leaked flat, untextured slabs past silhouettes at some angles.
          if (facing <= 0) continue;

          const dot = normal.x * SUN_WORLD.x + normal.y * SUN_WORLD.y;
          const lateral = normal.x * transform.cosYaw + normal.y * transform.sinYaw;
          const fill = mulColor(group.color, faceLightFactor(facing, dot, lateral));

          // One shade gradient per ring edge, shared by all of its segments so
          // a long face still darkens uniformly toward its base.
          const edgeTopA = projectWorldPoint(transform, a[0], a[1], group.topZ);
          const edgeTopB = projectWorldPoint(transform, b[0], b[1], group.topZ);
          const edgeBaseA = projectWorldPoint(transform, a[0], a[1], group.baseZ);
          const edgeX = edgeTopB.x - edgeTopA.x;
          const edgeY = edgeTopB.y - edgeTopA.y;
          const edgeLen = Math.max(1e-6, Math.hypot(edgeX, edgeY));
          let shadeNx = -edgeY / edgeLen;
          let shadeNy = edgeX / edgeLen;
          const toBaseX = edgeBaseA.x - edgeTopA.x;
          const toBaseY = edgeBaseA.y - edgeTopA.y;
          if (toBaseX * shadeNx + toBaseY * shadeNy < 0) {
            shadeNx = -shadeNx;
            shadeNy = -shadeNy;
          }
          const shadeDist = Math.max(1e-6, toBaseX * shadeNx + toBaseY * shadeNy);
          const shadeId = `${shadeBase}-${ringIndex}-${i}`;
          gradients.push({
            id: shadeId,
            x1: edgeTopA.x,
            y1: edgeTopA.y,
            x2: edgeTopA.x + shadeNx * shadeDist,
            y2: edgeTopA.y + shadeNy * shadeDist
          });

          for (let s = 0; s < segments; s++) {
            const t0 = s / segments;
            const t1 = (s + 1) / segments;
            const ax = a[0] + dx * t0;
            const ay = a[1] + dy * t0;
            const bx = a[0] + dx * t1;
            const by = a[1] + dy * t1;
            const baseA = projectWorldPoint(transform, ax, ay, group.baseZ);
            const baseB = projectWorldPoint(transform, bx, by, group.baseZ);
            const topA = projectWorldPoint(transform, ax, ay, group.topZ);
            const topB = projectWorldPoint(transform, bx, by, group.topZ);
            const quad = [baseA, baseB, topB, topA];
            if (screenPolygonArea(quad) < WALL_SIDE_MIN_SCREEN_AREA) continue;

            primitives.push({
              kind: 'side',
              key: `${runKey}-side-${ringIndex}-${i}-${s}`,
              runKey,
              wallKeys,
              thickness,
              dimmed: groupDimmed,
              maskId,
              occluders: runOccluders,
              points: quad.map((p) => `${p.x},${p.y}`).join(' '),
              polygon: quad,
              bbox: polygonBBox(quad),
              centroid: polygonCentroid(quad),
              fill,
              shadeId,
              patternId: edgePattern ? edgePattern.side.id : null,
              topStroke: mulColor(group.color, 1.6),
              topStrokeWidth: Math.max(1.2, thickness * 0.17),
              baseStrokeWidth: Math.max(1.4, thickness * 0.14),
              baseLine: { x1: baseA.x, y1: baseA.y, x2: baseB.x, y2: baseB.y },
              topLine: { x1: topA.x, y1: topA.y, x2: topB.x, y2: topB.y },
              sortKey: depthOfWorld((ax + bx) / 2, (ay + by) / 2),
              minY: Math.min(baseA.y, baseB.y, topA.y, topB.y)
            });
          }
        }
      });

      const silhouette = (screenTopRings[0] || []).slice();
      let minY = Infinity;
      let plateDepth = Infinity;
      for (const ring of worldRings) {
        for (const p of ring) {
          const d = depthOfWorld(p[0], p[1]);
          if (d < plateDepth) plateDepth = d;
        }
      }
      for (const ring of screenTopRings) {
        for (const p of ring) {
          if (p.y < minY) minY = p.y;
        }
      }

      primitives.push({
        kind: 'top',
        key: `${runKey}-top`,
        runKey,
        wallKeys,
        thickness,
        dimmed: groupDimmed,
        maskId,
        occluders: runOccluders,
        topPath,
        topFill,
        clipId,
        silhouette,
        silhouetteRings: screenTopRings,
        bbox: polygonBBox(silhouette) || { minX: 0, minY: 0, maxX: 0, maxY: 0 },
        centroid: polygonCentroid(silhouette),
        // The plate is the backdrop for its own rim strips (which carry the
        // texture and sort locally): key it by the run's farthest ground point
        // so every wall closer to the camera paints over it.
        sortKey: plateDepth,
        minY
      });

      if (showShadow) {
        const shiftX = sunUnit.x * shadowLength;
        const shiftY = sunUnit.y * shadowLength;
        const shifted = worldRings.map((ring) =>
          ring.map(([x, y]) => [x - shiftX, y - shiftY])
        );
        let list = shadowByBase.get(group.baseZ);
        if (!list) {
          list = [];
          shadowByBase.set(group.baseZ, list);
        }
        list.push(shifted);
      }
    }
  }

  // Union each elevation's shadow polygons before projecting: separate
  // translucent paths double-darken where they overlap, and a single nonzero
  // path with several rings can cancel a hole ring against another run's fill
  // and punch light holes in the shadow.
  const shadowPaths = [];
  for (const [baseZ, polygons] of shadowByBase) {
    let merged = polygons;
    if (polygons.length > 1) {
      try {
        merged = polygonClipping.union(polygons[0], ...polygons.slice(1));
      } catch (error) {
        merged = polygons;
      }
    }
    const rings = [];
    for (const polygon of merged) {
      for (const rawRing of polygon) {
        const ring = normalizeRing(rawRing);
        if (ring.length < 3) continue;
        const path = ringToPath(ring.map((p) => projectWorldPoint(transform, p[0], p[1], baseZ)));
        if (path) rings.push(path);
      }
    }
    if (rings.length > 0) shadowPaths.push(rings.join(' '));
  }

  return { primitives, shadowPaths, gradients };
};

const SvgWallLayer = () => {
  const {
    gridSize,
    gridType,
    zoomLevel,
    playerZoom,
    viewMode,
    viewRotation,
    viewTilt,
    isGMMode
  } = useGameStore(useShallow((state) => ({
    gridSize: state.gridSize,
    gridType: state.gridType,
    zoomLevel: state.zoomLevel,
    playerZoom: state.playerZoom,
    viewMode: state.viewMode,
    viewRotation: state.viewRotation,
    viewTilt: state.viewTilt,
    isGMMode: state.isGMMode
  })));

  const wallData = useLevelEditorStore((state) => state.wallData);
  const elevationData = useLevelEditorStore((state) => state.elevationData) || {};
  const updateWall = useLevelEditorStore((state) => state.updateWall);
  const selectedWallKey = useLevelEditorStore((state) => state.selectedWallKey);
  const visibleArea = useLevelEditorStore((state) => state.visibleArea);
  const viewingFromToken = useLevelEditorStore((state) => state.viewingFromToken);
  const fogOfWarEnabled = useLevelEditorStore((state) => state.fogOfWarEnabled);
  const showWallLayer = useLevelEditorStore((state) => state.showWallLayer);

  // The wall SVG is projected in screen space, so a camera pan only translates
  // the committed scene. During camera drag the canvas grid redraws in a rAF
  // loop while React commits lag a frame or two, which reads as walls sliding
  // and then snapping. Compensate imperatively so walls track the cursor, and
  // only rebuild the (expensive) scene when the drag settles.
  const svgRef = useRef(null);
  const sceneCameraRef = useRef(null);
  const [commitTick, setCommitTick] = useState(0);

  useEffect(() => {
    const forceCommit = () => setCommitTick((tick) => tick + 1);
    const unsubscribe = useGameStore.subscribe((state, prev) => {
      const cameraChanged = state.cameraX !== prev.cameraX || state.cameraY !== prev.cameraY;
      const dragEnded = prev.isDraggingCamera && !state.isDraggingCamera;
      if (!cameraChanged && !dragEnded) return;

      if (state.isDraggingCamera && cameraChanged) {
        const svg = svgRef.current;
        const scene = sceneCameraRef.current;
        if (svg && scene) {
          const zoom = (state.zoomLevel || 1) * (state.playerZoom || 1);
          const panOnly = state.viewRotation === scene.rotation &&
            state.viewTilt === scene.tilt &&
            state.viewMode === scene.mode &&
            zoom === scene.zoom;
          if (panOnly) {
            const transform = getGridSystem().getProjectionTransform(window.innerWidth, window.innerHeight);
            const sx = scene.x - state.cameraX;
            const sy = scene.y - state.cameraY;
            const tx = (sx * transform.cosYaw + sy * transform.sinYaw) * transform.effectiveZoom;
            const ty = (-sx * transform.sinYaw + sy * transform.cosYaw) * transform.sinTilt * transform.effectiveZoom;
            svg.style.transform = `translate(${tx}px, ${ty}px)`;
            return;
          }
        }
        // Non-pan camera change (orbit/zoom) cannot be compensated by translation
        return;
      }

      // Not dragging (or drag just ended): let React rebuild the scene.
      forceCommit();
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    const camera = scene?.camera;
    if (!camera) return;
    const current = sceneCameraRef.current;
    const changed = !current ||
      current.x !== camera.x ||
      current.y !== camera.y ||
      current.zoom !== camera.zoom ||
      current.rotation !== camera.rotation ||
      current.tilt !== camera.tilt ||
      current.mode !== camera.mode;
    if (!changed) return;
    sceneCameraRef.current = camera;
    const svg = svgRef.current;
    if (svg && svg.style.transform) {
      svg.style.transform = '';
    }
  });

  const isProjected = viewMode === '2.5d' ||
    Math.abs(((viewRotation % 360) + 360) % 360) > 0.001;

  const scene = useMemo(() => {
    const cameraState = useGameStore.getState();
    const sceneCamera = {
      x: cameraState.cameraX,
      y: cameraState.cameraY,
      zoom: (cameraState.zoomLevel || 1) * (cameraState.playerZoom || 1),
      rotation: cameraState.viewRotation,
      tilt: cameraState.viewTilt,
      mode: cameraState.viewMode
    };
    if (!isProjected || !showWallLayer || !wallData) {
      return { items: [], patterns: [], selection: null, gradients: [], camera: sceneCamera };
    }

    const gridSystem = getGridSystem();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const transform = gridSystem.getProjectionTransform(width, height);
    const gridSizeSafe = gridSize || 50;

    const nodes = collectWallNodes({
      wallData,
      wallTypes: WALL_TYPES,
      gridSystem,
      gridType,
      elevationData
    });

    const visibleAreaSet = visibleArea
      ? (visibleArea instanceof Set ? visibleArea : new Set(visibleArea))
      : null;
    const dimByFov = fogOfWarEnabled && !isGMMode && viewingFromToken && visibleAreaSet;

    const wallItems = [];
    for (const [key, wall] of Object.entries(wallData)) {
      if (!wall) continue;
      const parsed = parseWallKey(key);
      if (!parsed) continue;
      const typeId = typeof wall === 'string' ? wall : wall.type;
      const typeData = WALL_TYPES[typeId] || WALL_TYPES.stone_wall || {};

      const ends = getWallWorldEndpoints(parsed, gridSystem, gridType, wall);
      if (!ends) continue;
      const startNode = nodes.get(nodeKeyForWorld(ends.start.x, ends.start.y));
      const endNode = nodes.get(nodeKeyForWorld(ends.end.x, ends.end.y));

      // Doors/windows borrow the texture of the solid wall they pierce so the
      // remaining masonry reads as the same wall, not a replaced panel. Their
      // masonry also wraps up to the host wall's top so runs stay level.
      const isFeature = !!(typeData.interactive || typeData.isWindow);
      const hostIncident = (startNode?.incident || []).find((incident) => incident.isSolid) ||
        (endNode?.incident || []).find((incident) => incident.isSolid);
      const patternType = isFeature ? (hostIncident?.typeId || 'stone_wall') : null;
      const hostColor = isFeature && hostIncident
        ? (WALL_TYPES[hostIncident.typeId]?.color || null)
        : null;
      const hostHeightWorld = isFeature && hostIncident
        ? getWallHeightWorld(
            wallData[hostIncident.key] || {},
            WALL_TYPES[hostIncident.typeId] || typeData,
            gridSizeSafe
          )
        : null;

      const item = buildWallRenderItem({
        key,
        wall,
        typeData,
        gridSystem,
        gridType,
        transform,
        elevationData,
        connectedStart: nodeConnectedSolidCount(startNode, key) > 0,
        connectedEnd: nodeConnectedSolidCount(endNode, key) > 0,
        startNode,
        endNode,
        patternType,
        hostHeightWorld,
        hostColor
      });
      if (!item) continue;

      item.nodeKeys = [
        nodeKeyForWorld(ends.start.x, ends.start.y),
        nodeKeyForWorld(ends.end.x, ends.end.y)
      ];

      if (dimByFov) {
        const midTile = gridSystem.worldToGrid(
          (item.worldStart.x + item.worldEnd.x) / 2,
          (item.worldStart.y + item.worldEnd.y) / 2
        );
        item.dimmed = !visibleAreaSet.has(`${midTile.x},${midTile.y}`);
      } else {
        item.dimmed = false;
      }
      item.selected = key === selectedWallKey;
      wallItems.push(item);
    }

    const elevatedTiles = [];
    for (const [elevKey, rawValue] of Object.entries(elevationData)) {
      const [tileX, tileY] = elevKey.split(',').map(Number);
      if (!Number.isFinite(tileX) || !Number.isFinite(tileY)) continue;
      const level = typeof rawValue === 'object' && rawValue !== null
        ? Number(rawValue.level || 0)
        : Number(rawValue);
      if (Number.isFinite(level) && level !== 0) {
        elevatedTiles.push({ x: tileX, y: tileY, level });
      }
    }

    const consolidated = wallItems.filter((item) => !item.isWindow && !item.isDoor && !item.isMagic);
    if (wallItems.length <= 250 && elevatedTiles.length > 0) {
      buildTerrainOccluders({
        items: consolidated,
        elevatedTiles,
        gridSystem,
        gridType,
        gridSize: gridSizeSafe,
        viewportWidth: width,
        viewportHeight: height
      });
    }

    const features = wallItems.filter((item) => item.isWindow || item.isDoor || item.isMagic);
    const patternsById = new Map();
    const { primitives, shadowPaths, gradients: faceGradients } = buildRuns({
      solidItems: consolidated,
      transform,
      fogOfWarEnabled,
      nodes,
      featureCuts: wallFeatureCutRects(features),
      gridSize: gridSizeSafe,
      patternsById
    });

    // Features sort in the same painter pass as the wall primitives, using the
    // same ground-space depth so a door/window sits at its wall's depth.
    const depthOfWorld = (x, y) =>
      -((x - transform.cameraX) * transform.sinYaw) +
      (y - transform.cameraY) * transform.cosYaw;
    for (const item of features) {
      const nearWorld = item.nearWorld || [item.worldStart, item.worldEnd];
      let sortKey = Math.max(
        depthOfWorld(nearWorld[0].x, nearWorld[0].y),
        depthOfWorld(nearWorld[1].x, nearWorld[1].y)
      );
      const leaf = item.door?.swing;
      if (leaf?.worldHinge && leaf?.worldEnd) {
        sortKey = Math.max(
          sortKey,
          depthOfWorld(leaf.worldHinge.x, leaf.worldHinge.y),
          depthOfWorld(leaf.worldEnd.x, leaf.worldEnd.y)
        );
      }
      let minY = Infinity;
      for (const p of item.faces.near) {
        if (p.y < minY) minY = p.y;
      }
      item.sortKey = sortKey;
      item.minY = minY;
      registerWallPattern(patternsById, item.pattern);
    }

    const items = [...primitives, ...features];
    items.sort((a, b) => (a.sortKey - b.sortKey) || (a.minY - b.minY));

    let selection = null;
    if (selectedWallKey) {
      const selected = wallItems.find((item) => item.key === selectedWallKey);
      if (selected) {
        selection = { near: selected.faces.near, top: selected.faces.top };
      }
    }

    return {
      items,
      patterns: Array.from(patternsById.values()),
      shadowPaths,
      gradients: faceGradients,
      selection,
      camera: sceneCamera
    };
    // commitTick forces a rebuild after imperative pan compensation, and the
    // zoom/orbit deps rebuild because the projection itself changed; none of
    // them are read directly inside the callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isProjected,
    showWallLayer,
    wallData,
    gridSize,
    gridType,
    zoomLevel,
    playerZoom,
    viewRotation,
    viewTilt,
    selectedWallKey,
    visibleArea,
    viewingFromToken,
    fogOfWarEnabled,
    isGMMode,
    elevationData,
    commitTick
  ]);

  if (!isProjected || scene.items.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="svg-wall-layer"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9,
        // Root SVG clips to its viewport by default; that would hide walls
        // that were off-screen when the scene was built, so pan compensation
        // could not slide them into view (they would pop in on rebuild).
        overflow: 'visible',
        willChange: 'transform'
      }}
    >
      <defs>
        <filter id="svgWallShadowBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <linearGradient id="svgWallSideShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="72%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.54)" />
        </linearGradient>
        <linearGradient id="svgWallTopShade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
        </linearGradient>
        <linearGradient id="svgWindowGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(212, 238, 252, 0.62)" />
          <stop offset="22%" stopColor="rgba(246, 253, 255, 0.48)" />
          <stop offset="50%" stopColor="rgba(128, 176, 206, 0.32)" />
          <stop offset="100%" stopColor="rgba(222, 242, 255, 0.52)" />
        </linearGradient>
        {scene.gradients.map((gradient) => (
          <linearGradient
            key={gradient.id}
            id={gradient.id}
            gradientUnits="userSpaceOnUse"
            x1={gradient.x1}
            y1={gradient.y1}
            x2={gradient.x2}
            y2={gradient.y2}
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="72%" stopColor="rgba(0,0,0,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </linearGradient>
        ))}
        {scene.patterns.map((pattern) => {
          // The texture images do not wrap, so a plain 1x1 tile leaves a visible
          // seam line at every grid cell. Mirror the image into a 2x2 tile so
          // opposite tile edges always match and the repeat is seamless.
          const unit = pattern.unit;
          const span = unit * 2;
          const href = `/assets/textures/walls/${pattern.type}.png`;
          return (
            <pattern
              key={pattern.id}
              id={pattern.id}
              width={span}
              height={span}
              patternUnits="userSpaceOnUse"
              patternTransform={`matrix(${pattern.matrix.a} ${pattern.matrix.b} ${pattern.matrix.c} ${pattern.matrix.d} ${pattern.matrix.e} ${pattern.matrix.f})`}
            >
              <rect
                width={span}
                height={span}
                fill={shade(WALL_TYPES[pattern.type]?.color || pattern.color, -12)}
              />
              <image href={href} width={unit} height={unit} opacity="0.22" preserveAspectRatio="xMidYMid slice" />
              <image
                href={href}
                width={unit}
                height={unit}
                opacity="0.22"
                preserveAspectRatio="xMidYMid slice"
                transform={`translate(${span},0) scale(-1,1)`}
              />
              <image
                href={href}
                width={unit}
                height={unit}
                opacity="0.22"
                preserveAspectRatio="xMidYMid slice"
                transform={`translate(0,${span}) scale(1,-1)`}
              />
              <image
                href={href}
                width={unit}
                height={unit}
                opacity="0.22"
                preserveAspectRatio="xMidYMid slice"
                transform={`translate(${span},${span}) scale(-1,-1)`}
              />
              <rect width={span} height={span} fill="rgba(0,0,0,0.05)" />
            </pattern>
          );
        })}
        {scene.items
          .filter((item) => item.kind === 'top')
          .map((item) => (
            <clipPath key={item.clipId} id={item.clipId}>
              <path d={item.topPath} clipRule="evenodd" />
            </clipPath>
          ))}
        {(() => {
          const seen = new Set();
          const masked = [];
          for (const item of scene.items) {
            if (!item.maskId || !item.occluders || item.occluders.length === 0) continue;
            if (seen.has(item.maskId)) continue;
            seen.add(item.maskId);
            masked.push(item);
          }
          return masked.map((item) => (
            <mask
              key={item.maskId}
              id={item.maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {item.occluders.map((points, idx) => (
                <polygon key={`${item.maskId}-occ-${idx}`} points={points} fill="black" />
              ))}
            </mask>
          ));
        })()}
      </defs>

      {/* Cast shadow pass under every wall, one merged polygon set per ground
          elevation: overlaps never double-darken and shadows can never paint
          over nearer wall geometry. */}
      {scene.shadowPaths.map((path, idx) => (
        <path
          key={`wall-shadow-${idx}`}
          d={path}
          fill="rgba(0,0,0,0.16)"
          filter="url(#svgWallShadowBlur)"
        />
      ))}

      {scene.items.map((item) => (
        <g
          key={item.key}
          data-wall-key={item.wallKeys ? item.wallKeys.join('+') : item.key}
          opacity={item.dimmed ? 0.4 : 1}
          mask={item.maskId ? `url(#${item.maskId})` : undefined}
        >
          {item.kind === 'side'
            ? renderSide(item)
            : item.kind === 'top'
              ? renderTop(item)
              : item.kind === 'topStrip'
                ? renderTopStrip(item)
                : renderFeature(item, updateWall)}
        </g>
      ))}

      {scene.selection && (
        <g>
          <polygon
            points={pointsAttr(scene.selection.near)}
            fill="none"
            stroke="#f0c75e"
            strokeWidth="2.5"
            opacity="0.9"
          />
          <polygon
            points={pointsAttr(scene.selection.top)}
            fill="none"
            stroke="#f0c75e"
            strokeWidth="2"
            opacity="0.9"
          />
        </g>
      )}
    </svg>
  );
};

export default SvgWallLayer;
