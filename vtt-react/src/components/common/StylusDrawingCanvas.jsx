import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import './StylusDrawingCanvas.css';

export const INK_PALETTE = [
  { id: 'iron-black', name: 'Iron Gall Black', color: '#1f140e' },
  { id: 'sepia', name: 'Vintage Sepia', color: '#6e4726' },
  { id: 'blood-crimson', name: 'Dragon Blood', color: '#991b1b' },
  { id: 'arcane-azure', name: 'Arcane Azure', color: '#0284c7' },
  { id: 'verdant', name: 'Verdant Jade', color: '#15803d' },
  { id: 'gold-leaf', name: 'Imperial Gold', color: '#c29d46' },
  { id: 'royal-purple', name: 'Amethyst Violet', color: '#7e22ce' },
  { id: 'chalk-white', name: 'Bone White', color: '#ffffff' }
];

export const TOOL_PRESETS = [
  { id: 'quill', name: 'Fine Quill Pen', icon: 'fa-feather-pointed', defaultSize: 2.5, minSize: 1, maxSize: 8, opacity: 1 },
  { id: 'nib', name: 'Calligraphy Nib', icon: 'fa-pen-nib', defaultSize: 5, minSize: 2, maxSize: 14, opacity: 1 },
  { id: 'brush', name: 'Charcoal Brush', icon: 'fa-paintbrush', defaultSize: 9, minSize: 4, maxSize: 30, opacity: 0.85 },
  { id: 'highlighter', name: 'Arcane Highlighter', icon: 'fa-highlighter', defaultSize: 20, minSize: 8, maxSize: 45, opacity: 0.35 },
  { id: 'line', name: 'Ruler / Straight Wall', icon: 'fa-slash', defaultSize: 3, minSize: 1, maxSize: 16, opacity: 1 },
  { id: 'rect', name: 'Chamber / Room Box', icon: 'fa-vector-square', defaultSize: 3, minSize: 1, maxSize: 16, opacity: 1 },
  { id: 'circle', name: 'Tower / Summoning Circle', icon: 'fa-circle-notch', defaultSize: 3, minSize: 1, maxSize: 16, opacity: 1 },
  { id: 'eraser', name: 'Gomme Eraser', icon: 'fa-eraser', defaultSize: 16, minSize: 4, maxSize: 50, opacity: 1 }
];

export const BACKGROUND_THEMES = [
  { id: 'parchment', name: 'Aged Parchment', bg: '#f4ebd0', pattern: 'none' },
  { id: 'dotgrid', name: 'Dot Grid', bg: '#f7f2e7', pattern: 'dots' },
  { id: 'graph', name: 'Tactical Grid (1-inch)', bg: '#f3efe6', pattern: 'grid' },
  { id: 'dark-grimoire', name: 'Dark Grimoire', bg: '#221c16', pattern: 'none' },
  { id: 'blueprint', name: 'Architect Blueprint', bg: '#1c2e42', pattern: 'blueprint-grid' },
  { id: 'transparent', name: 'Transparent Overlay', bg: 'transparent', pattern: 'none' }
];

const isShapeTool = (tool) => tool === 'line' || tool === 'rect' || tool === 'circle';

const StylusDrawingCanvas = forwardRef(({
  initialStrokes = [],
  readOnly = false,
  onChange = () => {},
  onExport = () => {},
  aspectRatio = '16/9',
  minHeight = 320,
  maxHeight = 650,
  defaultTool = 'quill',
  defaultColor = '#1f140e',
  defaultBg = 'parchment',
  allowFullscreen = true,
  title = '',
  className = ''
}, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const shapeStartRef = useRef(null);

  // Drawing state
  const [strokes, setStrokes] = useState(() => Array.isArray(initialStrokes) ? initialStrokes : []);
  const [historyIndex, setHistoryIndex] = useState(() => Array.isArray(initialStrokes) ? initialStrokes.length : 0);
  const [history, setHistory] = useState(() => [Array.isArray(initialStrokes) ? initialStrokes : []]);
  
  const [activeTool, setActiveTool] = useState(defaultTool);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [strokeSize, setStrokeSize] = useState(TOOL_PRESETS.find(t => t.id === defaultTool)?.defaultSize || 3);
  const [backgroundTheme, setBackgroundTheme] = useState(defaultBg);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStylusActive, setIsStylusActive] = useState(false);

  // Sync stroke size when switching tool
  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);
    const preset = TOOL_PRESETS.find(t => t.id === toolId);
    if (preset) {
      setStrokeSize(preset.defaultSize);
    }
  };

  // Render a single stroke
  const drawSingleStroke = useCallback((ctx, stroke, width, height, dpr) => {
    ctx.save();
    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = (stroke.size || 16) * dpr;
    } else {
      ctx.globalCompositeOperation = stroke.tool === 'highlighter' ? 'multiply' : 'source-over';
      ctx.strokeStyle = stroke.color || '#1f140e';
      ctx.fillStyle = stroke.color || '#1f140e';
      ctx.globalAlpha = stroke.opacity !== undefined ? stroke.opacity : 1;
      ctx.lineWidth = (stroke.size || 3) * dpr;
    }

    ctx.lineCap = stroke.tool === 'nib' ? 'square' : 'round';
    ctx.lineJoin = 'round';

    // Shape Drawing
    if (stroke.tool === 'line' && stroke.start && stroke.end) {
      ctx.beginPath();
      ctx.moveTo(stroke.start.x * width, stroke.start.y * height);
      ctx.lineTo(stroke.end.x * width, stroke.end.y * height);
      ctx.stroke();
    } else if (stroke.tool === 'rect' && stroke.start && stroke.end) {
      const x = Math.min(stroke.start.x, stroke.end.x) * width;
      const y = Math.min(stroke.start.y, stroke.end.y) * height;
      const w = Math.abs(stroke.end.x - stroke.start.x) * width;
      const h = Math.abs(stroke.end.y - stroke.start.y) * height;
      ctx.strokeRect(x, y, w, h);
    } else if (stroke.tool === 'circle' && stroke.start && stroke.end) {
      const cx = stroke.start.x * width;
      const cy = stroke.start.y * height;
      const ex = stroke.end.x * width;
      const ey = stroke.end.y * height;
      const rad = Math.hypot(ex - cx, ey - cy);
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    } else if (stroke.points && stroke.points.length > 0) {
      // Freehand Path
      const points = stroke.points;
      if (points.length === 1) {
        const p = points[0];
        const rad = Math.max(1, (stroke.size / 2) * (p.pressure || 0.5) * dpr);
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, rad, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(points[0].x * width, points[0].y * height);

        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];

          if (stroke.tool !== 'highlighter' && p1.pressure && stroke.tool !== 'eraser') {
            const pressureMultiplier = Math.max(0.35, Math.min(1.9, p1.pressure * 1.5));
            ctx.lineWidth = stroke.size * pressureMultiplier * dpr;
          }

          const midX = (p0.x + p1.x) / 2 * width;
          const midY = (p0.y + p1.y) / 2 * height;
          ctx.quadraticCurveTo(p0.x * width, p0.y * height, midX, midY);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x * width, last.y * height);
        ctx.stroke();
      }
    }
    ctx.restore();
  }, []);

  // Redraw all strokes on canvas
  const redrawCanvas = useCallback((strokeList) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, width, height);

    (strokeList || []).forEach((stroke) => {
      drawSingleStroke(ctx, stroke, width, height, dpr);
    });
  }, [drawSingleStroke]);

  // Update canvas sizing & re-render on resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    redrawCanvas(strokes);
  }, [strokes, redrawCanvas]);

  useEffect(() => {
    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  useEffect(() => {
    redrawCanvas(strokes);
  }, [strokes, redrawCanvas]);

  // Convert client coordinates to normalized 0..1 bounding box
  const getNormalizedPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    const rect = canvas.getBoundingClientRect();

    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : (e.pointerType === 'pen' ? 0.6 : 0.5);
    return { x, y, pressure };
  }, []);

  // Pointer Down
  const handlePointerDown = useCallback((e) => {
    if (readOnly) return;

    if (e.pointerType === 'pen') {
      setIsStylusActive(true);
    }

    e.target.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const p = getNormalizedPoint(e);
    const preset = TOOL_PRESETS.find(t => t.id === activeTool);

    if (isShapeTool(activeTool)) {
      shapeStartRef.current = p;
    } else {
      const newStroke = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        tool: activeTool,
        color: activeTool === 'eraser' ? '#000000' : selectedColor,
        size: strokeSize,
        opacity: preset?.opacity !== undefined ? preset.opacity : 1,
        points: [p]
      };

      currentStrokeRef.current = newStroke;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        ctx.save();
        if (activeTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
        } else {
          ctx.globalCompositeOperation = activeTool === 'highlighter' ? 'multiply' : 'source-over';
          ctx.fillStyle = selectedColor;
          ctx.globalAlpha = newStroke.opacity;
        }
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, (strokeSize / 2) * (p.pressure || 0.5) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }, [readOnly, activeTool, selectedColor, strokeSize, getNormalizedPoint]);

  // Pointer Move
  const handlePointerMove = useCallback((e) => {
    if (!isDrawingRef.current) return;

    const p = getNormalizedPoint(e);

    // Shapes: live redraw preview
    if (isShapeTool(activeTool) && shapeStartRef.current) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      redrawCanvas(strokes);

      const previewStroke = {
        tool: activeTool,
        color: selectedColor,
        size: strokeSize,
        opacity: 1,
        start: shapeStartRef.current,
        end: p
      };
      drawSingleStroke(ctx, previewStroke, canvas.width, canvas.height, dpr);
      return;
    }

    if (!currentStrokeRef.current) return;

    const currentPoints = currentStrokeRef.current.points;
    const lastPoint = currentPoints[currentPoints.length - 1];

    const distSq = Math.pow(p.x - lastPoint.x, 2) + Math.pow(p.y - lastPoint.y, 2);
    if (distSq < 0.000002) return;

    currentPoints.push(p);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.save();
      if (currentStrokeRef.current.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = strokeSize * dpr;
      } else {
        ctx.globalCompositeOperation = currentStrokeRef.current.tool === 'highlighter' ? 'multiply' : 'source-over';
        ctx.strokeStyle = selectedColor;
        ctx.globalAlpha = currentStrokeRef.current.opacity;
        const mult = currentStrokeRef.current.tool !== 'highlighter' && p.pressure ? Math.max(0.35, Math.min(1.9, p.pressure * 1.5)) : 1;
        ctx.lineWidth = strokeSize * mult * dpr;
      }
      ctx.lineCap = currentStrokeRef.current.tool === 'nib' ? 'square' : 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastPoint.x * width, lastPoint.y * height);
      ctx.lineTo(p.x * width, p.y * height);
      ctx.stroke();
      ctx.restore();
    }
  }, [getNormalizedPoint, strokeSize, selectedColor, activeTool, redrawCanvas, strokes, drawSingleStroke]);

  // Pointer Up
  const handlePointerUp = useCallback((e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (_) {}

    let finalizedStroke = null;

    if (isShapeTool(activeTool) && shapeStartRef.current) {
      const p = getNormalizedPoint(e);
      const start = shapeStartRef.current;
      shapeStartRef.current = null;

      const dist = Math.hypot(p.x - start.x, p.y - start.y);
      if (dist > 0.005) {
        finalizedStroke = {
          id: `shape-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          tool: activeTool,
          color: selectedColor,
          size: strokeSize,
          opacity: 1,
          start,
          end: p,
          points: [start, p]
        };
      }
    } else if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      finalizedStroke = currentStrokeRef.current;
      currentStrokeRef.current = null;
    }

    if (finalizedStroke) {
      const updatedStrokes = [...strokes, finalizedStroke];
      setStrokes(updatedStrokes);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(updatedStrokes);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      onChange({ strokes: updatedStrokes, bgTheme: backgroundTheme });
    }
  }, [strokes, history, historyIndex, onChange, backgroundTheme, activeTool, selectedColor, strokeSize, getNormalizedPoint]);

  // Undo / Redo / Clear
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const prevStrokes = history[nextIndex];
      setHistoryIndex(nextIndex);
      setStrokes(prevStrokes);
      onChange({ strokes: prevStrokes, bgTheme: backgroundTheme });
    }
  }, [historyIndex, history, onChange, backgroundTheme]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextStrokes = history[nextIndex];
      setHistoryIndex(nextIndex);
      setStrokes(nextStrokes);
      onChange({ strokes: nextStrokes, bgTheme: backgroundTheme });
    }
  }, [historyIndex, history, onChange, backgroundTheme]);

  const handleClearAll = useCallback(() => {
    if (strokes.length === 0) return;
    const emptyStrokes = [];
    setStrokes(emptyStrokes);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(emptyStrokes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onChange({ strokes: emptyStrokes, bgTheme: backgroundTheme });
  }, [strokes, history, historyIndex, onChange, backgroundTheme]);

  // Export raster PNG image
  const handleExportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');

    const theme = BACKGROUND_THEMES.find(t => t.id === backgroundTheme);
    if (theme && theme.bg !== 'transparent') {
      expCtx.fillStyle = theme.bg;
      expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    expCtx.drawImage(canvas, 0, 0);
    const dataUrl = exportCanvas.toDataURL('image/png');
    onExport(dataUrl);

    const link = document.createElement('a');
    link.download = `${title || 'cartographic-sketch'}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [backgroundTheme, onExport, title]);

  // Imperative handle for parent refs
  useImperativeHandle(ref, () => ({
    getStrokes: () => strokes,
    getExportDataURL: () => {
      const canvas = canvasRef.current;
      if (!canvas) return '';
      const expCanvas = document.createElement('canvas');
      expCanvas.width = canvas.width;
      expCanvas.height = canvas.height;
      const ctx = expCanvas.getContext('2d');
      const theme = BACKGROUND_THEMES.find(t => t.id === backgroundTheme);
      if (theme && theme.bg !== 'transparent') {
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, expCanvas.width, expCanvas.height);
      }
      ctx.drawImage(canvas, 0, 0);
      return expCanvas.toDataURL('image/png');
    },
    clear: handleClearAll,
    setStrokes: (newStrokes) => {
      setStrokes(newStrokes || []);
      redrawCanvas(newStrokes || []);
    }
  }), [strokes, backgroundTheme, handleClearAll, redrawCanvas]);

  const activeTheme = BACKGROUND_THEMES.find(t => t.id === backgroundTheme) || BACKGROUND_THEMES[0];

  return (
    <div className={`stylus-canvas-container pathfinder-theme ${isFullscreen ? 'stylus-fullscreen-mode' : ''} ${className}`}>
      {/* Canvas Header */}
      <div className="stylus-canvas-header">
        <div className="stylus-header-left">
          <i className="fas fa-feather-pointed header-icon"></i>
          <span className="stylus-header-title">{title || 'Cartographic Sketch'}</span>
          {isStylusActive && (
            <span className="stylus-active-badge" title="Apple Pencil / Stylus Connected">
              <i className="fas fa-pen"></i> Stylus
            </span>
          )}
        </div>

        <div className="stylus-header-right">
          {!readOnly && (
            <>
              <button
                type="button"
                className="stylus-header-btn"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
              >
                <i className="fas fa-rotate-left"></i>
              </button>
              <button
                type="button"
                className="stylus-header-btn"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
              >
                <i className="fas fa-rotate-right"></i>
              </button>
              <button
                type="button"
                className="stylus-header-btn btn-danger"
                onClick={handleClearAll}
                disabled={strokes.length === 0}
                title="Clear All Strokes"
              >
                <i className="fas fa-trash-can"></i>
              </button>
            </>
          )}

          <button
            type="button"
            className="stylus-header-btn"
            onClick={handleExportPNG}
            title="Download PNG Illustration"
          >
            <i className="fas fa-download"></i>
          </button>

          {allowFullscreen && (
            <button
              type="button"
              className={`stylus-header-btn ${isFullscreen ? 'active' : ''}`}
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                setTimeout(resizeCanvas, 50);
              }}
              title={isFullscreen ? "Exit Studio View" : "Full Screen Studio View"}
            >
              <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
          )}
        </div>
      </div>

      {/* Floating Stylus Toolbar (Icon-Only, Clean Layout) */}
      {!readOnly && (
        <div className="stylus-toolbar">
          {/* Tool Types (Icon-Only) */}
          <div className="stylus-tool-group">
            {TOOL_PRESETS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`stylus-tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => handleSelectTool(tool.id)}
                title={tool.name}
              >
                <i className={`fas ${tool.icon}`}></i>
              </button>
            ))}
          </div>

          <div className="stylus-toolbar-divider"></div>

          {/* Color Palette */}
          {activeTool !== 'eraser' && (
            <div className="stylus-color-group">
              {INK_PALETTE.map((ink) => (
                <button
                  key={ink.id}
                  type="button"
                  className={`stylus-swatch-btn ${selectedColor === ink.color ? 'selected' : ''}`}
                  style={{ backgroundColor: ink.color }}
                  onClick={() => setSelectedColor(ink.color)}
                  title={ink.name}
                />
              ))}
            </div>
          )}

          <div className="stylus-toolbar-divider"></div>

          {/* Stroke Width Slider */}
          <div className="stylus-size-group" title={`Stroke Width: ${strokeSize}px`}>
            <span className="size-indicator-label">{strokeSize}px</span>
            <input
              type="range"
              className="stylus-size-slider"
              min={TOOL_PRESETS.find(t => t.id === activeTool)?.minSize || 1}
              max={TOOL_PRESETS.find(t => t.id === activeTool)?.maxSize || 40}
              value={strokeSize}
              onChange={(e) => setStrokeSize(parseFloat(e.target.value))}
            />
          </div>

          <div className="stylus-toolbar-divider"></div>

          {/* Background Canvas Paper Theme */}
          <div className="stylus-bg-group">
            <select
              className="stylus-bg-select"
              value={backgroundTheme}
              onChange={(e) => {
                setBackgroundTheme(e.target.value);
                onChange({ strokes, bgTheme: e.target.value });
              }}
              title="Paper Grid Texture"
            >
              {BACKGROUND_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Drawing Viewport */}
      <div
        ref={containerRef}
        className={`stylus-drawing-viewport pattern-${activeTheme.pattern}`}
        style={{
          backgroundColor: activeTheme.bg,
          minHeight: isFullscreen ? 'calc(100vh - 120px)' : `${minHeight}px`,
          maxHeight: isFullscreen ? 'calc(100vh - 120px)' : `${maxHeight}px`,
          aspectRatio: isFullscreen ? 'auto' : aspectRatio
        }}
      >
        <canvas
          ref={canvasRef}
          className="stylus-render-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'none' }}
        />

        {strokes.length === 0 && !readOnly && (
          <div className="stylus-empty-hint">
            <i className="fas fa-feather-pointed"></i>
            <p>Ready for Apple Pencil or Stylus</p>
            <span>Sketch dungeon walls, regional borders, or arcane crests directly on parchment.</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default StylusDrawingCanvas;
