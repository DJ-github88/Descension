import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import polygonClipping from 'polygon-clipping';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import {
  SUN_WORLD,
  buildWallRenderItem,
  collectWallNodes,
  nodeConnectedSolidCount,
  nodeKeyForWorld,
  getWallWorldEndpoints,
  parseWallKey,
  polygonBBox,
  projectWorldPoint
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

const WINDOW_MASONRY = '#8f867c';

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

const ringFromItem = (item) => {
  const half = item.thickness / 2;
  const nx = item.nwx;
  const ny = item.nwy;
  const s = item.start;
  const e = item.end;
  return [
    [s.x + nx * half, s.y + ny * half],
    [e.x + nx * half, e.y + ny * half],
    [e.x - nx * half, e.y - ny * half],
    [s.x - nx * half, s.y - ny * half]
  ];
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

const renderRun = (run) => (
  <>
    {run.showShadow && (
      <path d={run.shadowPath} fill="rgba(0,0,0,0.16)" filter="url(#svgWallShadowBlur)" />
    )}
    {run.sides.map((side, idx) => (
      <React.Fragment key={`side-${idx}`}>
        <polygon points={side.points} fill={side.fill} />
        {side.near && run.patternId && (
          <polygon points={side.points} fill={`url(#${run.patternId})`} />
        )}
        {side.near && <polygon points={side.points} fill="url(#svgWallSideShade)" />}
        {side.topLine && (
          <line
            {...lineProps(side.topLine)}
            stroke={mulColor(run.color, 1.45)}
            strokeWidth={Math.max(1.1, run.thickness * 0.16)}
            opacity="0.3"
          />
        )}
        {side.baseLine && (
          <line
            {...lineProps(side.baseLine)}
            stroke="rgba(0,0,0,0.55)"
            strokeWidth={Math.max(1.4, run.thickness * 0.14)}
          />
        )}
      </React.Fragment>
    ))}
    <path d={run.topPath} fill={`url(#${run.patternId})`} fillRule="evenodd" />
    <path d={run.topPath} fill={run.topFill} fillRule="evenodd" opacity="0.35" />
    <path d={run.topPath} fill="url(#svgWallTopShade)" fillRule="evenodd" />
    <path d={run.topPath} fill="none" stroke="rgba(0,0,0,0.42)" strokeWidth="1" />
  </>
);

const renderWindow = (item) => {
  const w = item.window;
  const { color, light } = item;
  const masonry = mixColors(color, WINDOW_MASONRY, 0.78);
  const nearFill = shade(masonry, -30 + Math.max(0, light.near) * 54);
  const farFill = shade(masonry, -50 + Math.max(0, light.far) * 40);
  const sillFill = shade(masonry, 8 + Math.max(0, light.top) * 28);
  const frameFill = shade(masonry, -16);
  const frameEdge = shade(masonry, 14);

  return (
    <>
      <polygon points={pointsAttr(w.breastFar)} fill={farFill} />
      <polygon points={pointsAttr(w.lintelFar)} fill={farFill} />
      {item.showEndStart && <polygon points={pointsAttr(item.faces.endStart)} fill={shade(masonry, -46)} />}
      {item.showEndEnd && <polygon points={pointsAttr(item.faces.endEnd)} fill={shade(masonry, -46)} />}
      <polygon points={pointsAttr(w.jambStart)} fill={shade(masonry, -42)} />
      <polygon points={pointsAttr(w.jambEnd)} fill={shade(masonry, -42)} />

      <polygon points={pointsAttr(w.breastNear)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(w.breastNear)} fill={`url(#${item.patternId})`} />}
      <polygon points={pointsAttr(w.breastNear)} fill="url(#svgWallSideShade)" />
      <polygon points={pointsAttr(w.sillTop)} fill={sillFill} />
      <polygon points={pointsAttr(w.sillTop)} fill="url(#svgWallTopShade)" />
      <polygon points={pointsAttr(w.sillTop)} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1" />

      <polygon points={pointsAttr(w.lintelNear)} fill={nearFill} />
      {item.patternId && <polygon points={pointsAttr(w.lintelNear)} fill={`url(#${item.patternId})`} />}
      <polygon points={pointsAttr(w.lintelNear)} fill="url(#svgWallSideShade)" />

      {w.interior && (
        <polygon
          points={pointsAttr(w.interior)}
          fill={w.kind === 'slit' ? 'rgba(8, 8, 12, 0.88)' : 'rgba(18, 14, 10, 0.72)'}
        />
      )}

      {w.pane && (
        <>
          <polygon points={pointsAttr(w.pane)} fill="url(#svgWindowGlass)" />
          <polygon
            points={pointsAttr(w.pane)}
            fill="none"
            stroke="rgba(210, 235, 250, 0.75)"
            strokeWidth="1.2"
          />
        </>
      )}

      {w.bars.map((bar, idx) => (
        <line
          key={`bar-${idx}`}
          {...lineProps(bar)}
          stroke={shade(masonry, -66)}
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

      <line {...lineProps(w.sillEdge)} stroke={frameEdge} strokeWidth={Math.max(1.6, item.thickness * 0.14)} />
      <line {...lineProps(w.headEdge)} stroke={frameEdge} strokeWidth={Math.max(1.4, item.thickness * 0.12)} opacity="0.85" />

      <polygon points={pointsAttr(item.faces.top)} fill={shade(masonry, 4 + Math.max(0, light.top) * 30)} />
      <polygon points={pointsAttr(item.faces.top)} fill="url(#svgWallTopShade)" />
      <polygon points={pointsAttr(item.faces.top)} fill="none" stroke="rgba(0,0,0,0.48)" strokeWidth="1" />
    </>
  );
};

const renderDoor = (item, updateWall) => {
  const d = item.door;
  const { color, light } = item;
  const leafFill = shade(color, -6 + Math.max(0, light.near) * 26);
  const frameFill = shade(color, -18);
  const nearFill = shade(color, -30 + Math.max(0, light.near) * 50);

  const handleClick = (event) => {
    event.stopPropagation();
    const parts = item.key.split(',').map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return;
    if (item.state === 'locked') return;
    updateWall(parts[0], parts[1], parts[2], parts[3], {
      state: item.state === 'open' ? 'closed' : 'open'
    });
  };

  return (
    <>
      <polygon points={pointsAttr(d.lintelFar)} fill={shade(color, -48)} />
      {item.showEndStart && <polygon points={pointsAttr(item.faces.endStart)} fill={shade(color, -46)} />}
      {item.showEndEnd && <polygon points={pointsAttr(item.faces.endEnd)} fill={shade(color, -46)} />}
      <polygon points={pointsAttr(d.jambStart)} fill={frameFill} />
      <polygon points={pointsAttr(d.jambEnd)} fill={frameFill} />
      <polygon points={pointsAttr(d.lintelNear)} fill={nearFill} />
      <polygon points={pointsAttr(d.lintelNear)} fill="url(#svgWallSideShade)" />

      {d.leaf && (
        <>
          <polygon points={pointsAttr(d.leaf.face)} fill={leafFill} />
          <polygon points={pointsAttr(d.leaf.face)} fill="url(#svgWallSideShade)" opacity="0.55" />
          {d.leaf.planks.map((line, idx) => (
            <line key={`plank-${idx}`} {...lineProps(line)} stroke="rgba(30, 16, 8, 0.5)" strokeWidth="1.4" />
          ))}
          {d.leaf.bands.map((line, idx) => (
            <line
              key={`band-${idx}`}
              {...lineProps(line)}
              stroke="rgba(28, 28, 32, 0.85)"
              strokeWidth={Math.max(2, item.thickness * 0.26)}
            />
          ))}
          <circle
            cx={d.leaf.handle.x}
            cy={d.leaf.handle.y}
            r={Math.max(2.2, item.thickness * 0.2)}
            fill="#d9b96a"
            stroke="rgba(50, 34, 12, 0.85)"
            strokeWidth="1"
          />
          {item.state === 'locked' && (
            <circle
              cx={d.leaf.lock.x}
              cy={d.leaf.lock.y}
              r={Math.max(2.4, item.thickness * 0.22)}
              fill="#cfcfcf"
              stroke="rgba(30, 30, 30, 0.9)"
              strokeWidth="1"
            />
          )}
        </>
      )}

      {d.swing && (
        <>
          <polyline
            points={pointsAttr(d.swing.arc)}
            fill="none"
            stroke="rgba(255, 244, 214, 0.35)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
          />
          <polygon points={pointsAttr(d.swing.far)} fill={shade(color, -38)} />
          <polygon points={pointsAttr(d.swing.top)} fill={shade(color, 26)} />
          <polygon points={pointsAttr(d.swing.near)} fill={leafFill} />
          <polygon points={pointsAttr(d.swing.near)} fill="url(#svgWallSideShade)" opacity="0.5" />
          {d.swing.planks.map((line, idx) => (
            <line key={`swing-plank-${idx}`} {...lineProps(line)} stroke="rgba(30, 16, 8, 0.5)" strokeWidth="1.3" />
          ))}
          {d.swing.bands.map((line, idx) => (
            <line
              key={`swing-band-${idx}`}
              {...lineProps(line)}
              stroke="rgba(28, 28, 32, 0.8)"
              strokeWidth={Math.max(1.6, item.thickness * 0.2)}
            />
          ))}
          <polygon
            points={pointsAttr(d.swing.near)}
            fill="none"
            stroke="rgba(30, 16, 8, 0.55)"
            strokeWidth="1"
          />
        </>
      )}

      <line
        {...lineProps(d.threshold)}
        stroke="rgba(0, 0, 0, 0.5)"
        strokeWidth={Math.max(1.6, item.thickness * 0.16)}
      />

      <polygon points={pointsAttr(item.faces.top)} fill={shade(color, 4 + Math.max(0, light.top) * 30)} />
      <polygon points={pointsAttr(item.faces.top)} fill="url(#svgWallTopShade)" />
      <polygon points={pointsAttr(item.faces.top)} fill="none" stroke="rgba(0,0,0,0.48)" strokeWidth="1" />

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

const buildRuns = ({ solidItems, transform, fogOfWarEnabled }) => {
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
    if (item.topZ > group.topZ) group.topZ = item.topZ;
  }

  const viewX = -transform.sinYaw;
  const viewY = transform.cosYaw;
  const sunLength = Math.max(1e-6, Math.hypot(SUN_WORLD.x, SUN_WORLD.y));
  const sunUnit = { x: SUN_WORLD.x / sunLength, y: SUN_WORLD.y / sunLength };

  const depthOfWorld = (x, y) =>
    -((x - transform.cameraX) * transform.sinYaw) +
    (y - transform.cameraY) * transform.cosYaw;

  const runs = [];
  let runIndex = 0;

  for (const group of groups.values()) {
    const rects = group.items.map((item) => [ringFromItem(item)]);
    let unioned;
    try {
      unioned = polygonClipping.union(rects[0], ...rects.slice(1));
    } catch (error) {
      unioned = rects;
    }
    if (!unioned || unioned.length === 0) continue;

    const thickness = group.items[0].thickness;
    const heightWorld = Math.max(1, group.topZ - group.baseZ);
    const patternId = `svgWallPat-${group.typeId || 'stone_wall'}`;
    const topFill = mulColor(group.color, 1.02);
    const shadowLength = Math.min(heightWorld * 0.4, thickness * 3.2);
    const showShadow = !fogOfWarEnabled && !group.items.every((item) => item.dimmed);

    for (const polygon of unioned) {
      const worldRings = polygon;
      const screenTopRings = worldRings.map((ring) =>
        ring.map((p) => projectWorldPoint(transform, p[0], p[1], group.topZ))
      );
      const topPath = screenTopRings.map(ringToPath).join(' ');
      if (!topPath) continue;

      const sides = [];
      for (const ring of worldRings) {
        for (let i = 0; i < ring.length; i++) {
          const a = ring[i];
          const b = ring[(i + 1) % ring.length];
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const len = Math.max(1e-6, Math.hypot(dx, dy));
          let normal = { x: dy / len, y: -dx / len };
          const mid = { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 };
          const probe = { x: mid.x + normal.x * 0.5, y: mid.y + normal.y * 0.5 };
          if (pointInRings(probe.x, probe.y, worldRings)) {
            normal = { x: -normal.x, y: -normal.y };
          }
          const facing = normal.x * viewX + normal.y * viewY;
          const dot = normal.x * SUN_WORLD.x + normal.y * SUN_WORLD.y;
          const lightFactor = facing > 0
            ? 0.68 + 0.34 * Math.max(0, dot)
            : 0.42 + 0.26 * Math.max(0, dot);
          const fill = mulColor(group.color, lightFactor);

          const baseA = projectWorldPoint(transform, a[0], a[1], group.baseZ);
          const baseB = projectWorldPoint(transform, b[0], b[1], group.baseZ);
          const topA = projectWorldPoint(transform, a[0], a[1], group.topZ);
          const topB = projectWorldPoint(transform, b[0], b[1], group.topZ);

          sides.push({
            points: `${baseA.x},${baseA.y} ${baseB.x},${baseB.y} ${topB.x},${topB.y} ${topA.x},${topA.y}`,
            fill,
            depth: depthOfWorld(mid.x, mid.y),
            near: facing > 0,
            baseLine: facing > 0
              ? { x1: baseA.x, y1: baseA.y, x2: baseB.x, y2: baseB.y }
              : null,
            topLine: facing > 0
              ? { x1: topA.x, y1: topA.y, x2: topB.x, y2: topB.y }
              : null
          });
        }
      }
      sides.sort((a, b) => a.depth - b.depth);

      let sortDepth = -Infinity;
      for (const ring of worldRings) {
        for (const p of ring) {
          const d = depthOfWorld(p[0], p[1]);
          if (d > sortDepth) sortDepth = d;
        }
      }

      const shadowScreen = worldRings.map((ring) =>
        ring.map((p) => projectWorldPoint(
          transform,
          p[0] - sunUnit.x * shadowLength,
          p[1] - sunUnit.y * shadowLength,
          group.baseZ
        ))
      );
      const shadowPath = shadowScreen.map(ringToPath).join(' ');

      const silhouette = screenTopRings[0] || [];
      const bbox = polygonBBox(silhouette) || { minX: 0, minY: 0, maxX: 0, maxY: 0 };
      const centroid = polygonCentroid(silhouette);

      runs.push({
        kind: 'run',
        key: `run-${runIndex}-${group.key}`,
        typeId: group.typeId,
        color: group.color,
        thickness,
        baseZ: group.baseZ,
        topZ: group.topZ,
        patternId,
        topFill,
        topPath,
        sides,
        shadowPath,
        showShadow,
        bbox,
        centroid,
        silhouette,
        sortDepth,
        wallKeys: group.items.map((item) => item.key),
        dimmed: group.items.every((item) => item.dimmed),
        occluders: group.items.flatMap((item) => item.occluders || [])
      });
      runIndex += 1;
    }
  }

  for (const run of runs) {
    if (run.occluders.length > 0) {
      run.maskId = `runOccl-${run.key.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    }
  }

  return runs;
};

const SvgWallLayer = () => {
  const {
    gridSize,
    gridType,
    cameraX,
    cameraY,
    zoomLevel,
    playerZoom,
    viewMode,
    viewRotation,
    viewTilt,
    isGMMode
  } = useGameStore(useShallow((state) => ({
    gridSize: state.gridSize,
    gridType: state.gridType,
    cameraX: state.cameraX,
    cameraY: state.cameraY,
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

  const isProjected = viewMode === '2.5d' ||
    Math.abs(((viewRotation % 360) + 360) % 360) > 0.001;

  const scene = useMemo(() => {
    if (!isProjected || !showWallLayer || !wallData) {
      return { items: [], patterns: [], selection: null };
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

      const ends = getWallWorldEndpoints(parsed, gridSystem, gridType);
      if (!ends) continue;
      const startNode = nodes.get(nodeKeyForWorld(ends.start.x, ends.start.y));
      const endNode = nodes.get(nodeKeyForWorld(ends.end.x, ends.end.y));

      const item = buildWallRenderItem({
        key,
        wall,
        typeData,
        gridSystem,
        gridType,
        transform,
        elevationData,
        connectedStart: nodeConnectedSolidCount(startNode, key) > 0,
        connectedEnd: nodeConnectedSolidCount(endNode, key) > 0
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
    const runs = buildRuns({
      solidItems: consolidated,
      transform,
      fogOfWarEnabled
    });

    const depthOfWorld = (x, y) =>
      -((x - transform.cameraX) * transform.sinYaw) +
      (y - transform.cameraY) * transform.cosYaw;

    for (const item of features) {
      const nearWorld = item.nearWorld || [item.worldStart, item.worldEnd];
      item.sortDepth = Math.max(depthOfWorld(nearWorld[0].x, nearWorld[0].y), depthOfWorld(nearWorld[1].x, nearWorld[1].y));
    }

    const patterns = new Map();
    for (const run of runs) {
      patterns.set(run.patternId, {
        id: run.patternId,
        type: run.typeId,
        color: run.color,
        size: Math.max(48, Math.min(160, Math.round(gridSizeSafe * transform.effectiveZoom * 0.9)))
      });
    }
    for (const item of features) {
      if (item.pattern) patterns.set(item.pattern.id, item.pattern);
    }

    const items = [...runs, ...features];
    items.sort((a, b) => a.sortDepth - b.sortDepth);

    const partialCandidates = items
      .filter((item) => !item.dimmed)
      .map((item) => {
        const polygon = item.kind === 'run' ? item.silhouette : item.faces.near;
        return { item, polygon, bbox: item.bbox || polygonBBox(polygon), centroid: item.centroid || polygonCentroid(polygon) };
      });

    if (partialCandidates.length > 1 && partialCandidates.length <= 150) {
      for (const entry of partialCandidates) {
        for (const other of partialCandidates) {
          if (other.item === entry.item) continue;
          if (other.item.sortDepth <= entry.item.sortDepth) continue;
          if (!other.bbox || !other.polygon) continue;
          if (entry.centroid.x < other.bbox.minX || entry.centroid.x > other.bbox.maxX ||
              entry.centroid.y < other.bbox.minY || entry.centroid.y > other.bbox.maxY) {
            continue;
          }
          const cover = other.item.kind === 'run'
            ? pointInRings(entry.centroid.x, entry.centroid.y,
                [(other.item.silhouette || []).map((p) => [p.x, p.y])])
            : pointInPolygon(entry.centroid.x, entry.centroid.y, other.polygon);
          if (cover) {
            entry.item.partiallyHidden = true;
            break;
          }
        }
      }
    }

    let selection = null;
    if (selectedWallKey) {
      const selected = wallItems.find((item) => item.key === selectedWallKey);
      if (selected) {
        selection = { near: selected.faces.near, top: selected.faces.top };
      }
    }

    return { items, patterns: Array.from(patterns.values()), selection };
  }, [
    isProjected,
    showWallLayer,
    wallData,
    gridSize,
    gridType,
    cameraX,
    cameraY,
    zoomLevel,
    playerZoom,
    viewRotation,
    viewTilt,
    selectedWallKey,
    visibleArea,
    viewingFromToken,
    fogOfWarEnabled,
    isGMMode,
    elevationData
  ]);

  if (!isProjected || scene.items.length === 0) return null;

  return (
    <svg
      className="svg-wall-layer"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9
      }}
    >
      <defs>
        <filter id="svgWallShadowBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <linearGradient id="svgWallSideShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="36%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="78%" stopColor="rgba(0,0,0,0.24)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </linearGradient>
        <linearGradient id="svgWallTopShade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
        </linearGradient>
        <linearGradient id="svgWindowGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(198, 230, 248, 0.6)" />
          <stop offset="45%" stopColor="rgba(130, 178, 208, 0.34)" />
          <stop offset="100%" stopColor="rgba(222, 242, 255, 0.52)" />
        </linearGradient>
        {scene.patterns.map((pattern) => (
          <pattern
            key={pattern.id}
            id={pattern.id}
            width={pattern.size}
            height={pattern.size}
            patternUnits="userSpaceOnUse"
          >
            <rect width={pattern.size} height={pattern.size} fill={shade(pattern.color, -12)} />
            <image
              href={`/assets/textures/walls/${pattern.type}.png`}
              width={pattern.size}
              height={pattern.size}
              opacity="0.22"
              preserveAspectRatio="xMidYMid slice"
            />
            <rect width={pattern.size} height={pattern.size} fill="rgba(0,0,0,0.05)" />
          </pattern>
        ))}
        {scene.items
          .filter((item) => item.maskId && item.occluders && item.occluders.length > 0)
          .map((item) => (
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
          ))}
      </defs>

      {scene.items.map((item) => (
        <g
          key={item.key}
          data-wall-key={item.kind === 'run' ? item.wallKeys.join('+') : item.key}
          opacity={item.dimmed ? 0.4 : item.partiallyHidden ? 0.62 : 1}
          mask={item.maskId ? `url(#${item.maskId})` : undefined}
        >
          {item.kind === 'run' ? renderRun(item) : renderFeature(item, updateWall)}
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

const pointInPolygon = (x, y, poly) => {
  if (!poly || poly.length < 3) return false;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    if ((yi > y) !== (yj > y) &&
        x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

export default SvgWallLayer;
