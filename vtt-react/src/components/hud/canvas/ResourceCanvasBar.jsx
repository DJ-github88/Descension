import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { createRenderer } from './renderers';
import '../styles/ResourceCanvasBar.css';

const ResourceCanvasBar = forwardRef(({
  rendererType,
  size = 'normal',
  layoutMode = 'grid',
  className = '',
  spheres = [],
  elements = [],
  current = 0,
  max = 10,
  current2 = 0,
  max2 = 10,
  isOwner = true,
  onElementClick,
  onElementRightClick,
  onElementHover,
  config = {},
  style = {},
  overlay = false,
}, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);
  const isVisibleRef = useRef(true);
  const prevDimsRef = useRef('');
  const spheresRef = useRef(spheres);
  const elementsRef = useRef(elements);
  const configRef = useRef(config);
  const callbacksRef = useRef({});

  const [canvasSize, setCanvasSize] = useState({ width: 100, height: 60 });

  spheresRef.current = spheres;
  elementsRef.current = elements;
  configRef.current = config;
  callbacksRef.current = { onElementClick, onElementRightClick, onElementHover };

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getHitTest: (mouseX, mouseY) => {
      if (rendererRef.current) {
        return rendererRef.current.hitTest(
          mouseX, mouseY, elementsRef.current, spheresRef.current, size,
          canvasSize.width, canvasSize.height
        );
      }
      return null;
    }
  }));

  useEffect(() => {
    const renderer = createRenderer(rendererType);
    if (!renderer) return;
    rendererRef.current = renderer;
    return () => { rendererRef.current = null; };
  }, [rendererType]);

  const computeDimensions = useCallback(() => {
    if (layoutMode === 'bar' || layoutMode === 'multi-zone') {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const w = Math.max(10, Math.floor(rect.width));
        const h = Math.max(5, Math.floor(rect.height));
        const key = layoutMode + '|' + w + '|' + h;
        if (prevDimsRef.current !== key) {
          prevDimsRef.current = key;
          setCanvasSize({ width: w, height: h });
        }
      }
    } else {
      const isLarge = size === 'large';
      const isSmall = size === 'small';
      const orbDiameter = isLarge ? 42 : (isSmall ? 22 : 32);
      const gap = isLarge ? 7 : (isSmall ? 4 : 7);
      const cols = isLarge ? 8 : 4;
      const rows = isLarge ? 1 : 2;
      const pad = isSmall ? 4 : 8;
      const w = cols * orbDiameter + (cols - 1) * gap + pad;
      const h = rows * orbDiameter + (rows - 1) * gap + pad;
      const key = w + '|' + h;
      if (prevDimsRef.current !== key) {
        prevDimsRef.current = key;
        setCanvasSize({ width: w, height: h });
      }
    }
  }, [size, layoutMode]);

  useEffect(() => { computeDimensions(); }, [computeDimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvasSize;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctxRef.current = canvas.getContext('2d');
  }, [canvasSize]);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    if (containerRef.current) io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (layoutMode !== 'bar' && layoutMode !== 'multi-zone') return;
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.max(10, Math.floor(entry.contentRect.width));
        const h = Math.max(5, Math.floor(entry.contentRect.height));
        if (h < 5) continue;
        const key = layoutMode + '|' + w + '|' + h;
        if (prevDimsRef.current !== key) {
          prevDimsRef.current = key;
          setCanvasSize({ width: w, height: h });
        }
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [layoutMode]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      if (isVisibleRef.current && rendererRef.current && ctxRef.current) {
        rendererRef.current.render(
          ctxRef.current,
          canvasSize.width,
          canvasSize.height,
          spheresRef.current,
          elementsRef.current,
          size,
          configRef.current
        );
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size, canvasSize]);

  const getHitFromEvent = useCallback((e) => {
    if (!rendererRef.current || !canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    return rendererRef.current.hitTest(
      mx, my, elementsRef.current, spheresRef.current, size,
      canvasSize.width, canvasSize.height
    );
  }, [size, canvasSize]);

  const handleClick = useCallback((e) => {
    if (!isOwner) return;
    const hit = getHitFromEvent(e);
    if (hit && callbacksRef.current.onElementClick) {
      callbacksRef.current.onElementClick(hit, e);
    }
  }, [isOwner, getHitFromEvent]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOwner) return;
    const hit = getHitFromEvent(e);
    if (hit && callbacksRef.current.onElementRightClick) {
      callbacksRef.current.onElementRightClick(hit, e);
    }
  }, [isOwner, getHitFromEvent]);

  const handleMouseMove = useCallback((e) => {
    const hit = getHitFromEvent(e);
    if (layoutMode === 'bar') {
      if (rendererRef.current) {
        const mx = hit ? hit.barX : -1;
        rendererRef.current.setHovered(mx);
      }
    } else if (layoutMode === 'multi-zone') {
      if (rendererRef.current) {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasSize.width / rect.width;
        const scaleY = canvasSize.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        rendererRef.current.setHovered({ x: mx, y: my });
      }
    } else {
      const newIdx = hit ? hit.elementIndex : -1;
      if (rendererRef.current && rendererRef.current.hoveredIdx !== newIdx) {
        rendererRef.current.setHovered(newIdx);
      }
    }
    if (callbacksRef.current.onElementHover) {
      callbacksRef.current.onElementHover(hit, e);
    }
  }, [getHitFromEvent, layoutMode, canvasSize]);

  const handleMouseLeave = useCallback(() => {
    if (rendererRef.current) rendererRef.current.setHovered(-1);
    if (callbacksRef.current.onElementHover) {
      callbacksRef.current.onElementHover(null, null);
    }
  }, []);

  const sizeClass = 'resource-canvas-' + size;
  const isBarLike = layoutMode === 'bar' || layoutMode === 'multi-zone';
  const containerClass = 'resource-canvas-container resource-canvas-embedded ' + sizeClass
    + (isBarLike ? ' resource-canvas-bar' : '')
    + (className ? ' ' + className : '');

  return (
    <div
      ref={containerRef}
      className={containerClass}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="resource-canvas"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isOwner ? 'pointer' : 'default' }}
      />
    </div>
  );
});

ResourceCanvasBar.displayName = 'ResourceCanvasBar';

export default ResourceCanvasBar;
