import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './PortraitLightbox.css';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

/**
 * PortraitLightbox
 * Enlarged portrait popup shared by PartyHUD + TargetHUD.
 * Click a HUD portrait to open; zoom with buttons / slider / wheel,
 * drag to pan while zoomed; closes on backdrop click, Esc, or X.
 */
const PortraitLightbox = ({ isOpen, imageUrl, backgroundImage = '', backgroundColor = '', title = '', subtitle = '', onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(null);
  const frameRef = useRef(null);

  // Reset zoom/pan each time a new portrait opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (onClose) onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
      } else if (e.key === '-' || e.key === '_') {
        setZoom((z) => {
          const next = Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2));
          if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [isOpen, onClose]);

  const clampOffset = useCallback((next) => {
    const frame = frameRef.current;
    if (!frame) return next;
    // Pan range grows with zoom so the enlarged portrait stays explorable
    const maxX = ((zoom - 1) * frame.clientWidth) / 2 + 40;
    const maxY = ((zoom - 1) * frame.clientHeight) / 2 + 40;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y))
    };
  }, [zoom]);

  const handleWheel = useCallback((e) => {
    // Wheel over the image zooms; never scrolls the page behind
    e.preventDefault();
    e.stopPropagation();
    const dir = e.deltaY < 0 ? 1 : -1;
    setZoom((z) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + dir * ZOOM_STEP).toFixed(2)));
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Non-passive wheel listener so preventDefault actually blocks page scroll
  useEffect(() => {
    const frame = frameRef.current;
    if (!isOpen || !frame) return;
    frame.addEventListener('wheel', handleWheel, { passive: false });
    return () => frame.removeEventListener('wheel', handleWheel);
  }, [isOpen, handleWheel, imageUrl]);

  const handlePointerDown = (e) => {
    if (zoom <= MIN_ZOOM) return;
    draggingRef.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const drag = draggingRef.current;
    if (!drag) return;
    setOffset(clampOffset({
      x: drag.baseX + (e.clientX - drag.startX),
      y: drag.baseY + (e.clientY - drag.startY)
    }));
  };

  const endDrag = () => {
    draggingRef.current = null;
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  const zoomReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return createPortal(
    <div
      className="portrait-lightbox-overlay"
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Enlarged portrait of ${title}` : 'Enlarged portrait'}
    >
      <div
        className="portrait-lightbox-card"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          ref={frameRef}
          className={`portrait-lightbox-frame ${zoom > MIN_ZOOM ? 'is-zoomed' : ''}`}
          data-zoom={zoom}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={zoomReset}
          title={zoom > MIN_ZOOM ? 'Drag to move • double-click to reset' : 'Scroll to zoom in'}
        >
          {/* Background + portrait move as one scene so zooming keeps the
              composition the HUD shows */}
          <div
            className="portrait-lightbox-scene"
            style={{
              ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
              ...(backgroundColor ? { backgroundColor } : {}),
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title ? `${title} portrait enlarged` : 'Portrait enlarged'}
                draggable={false}
              />
            ) : (
              <div className="portrait-lightbox-fallback">No portrait</div>
            )}
          </div>

          <button
            type="button"
            className="portrait-lightbox-close"
            onClick={onClose}
            aria-label="Close portrait"
            title="Close (Esc)"
          >
            <i className="fas fa-times" />
          </button>

          <div className="portrait-lightbox-zoom-hint">Scroll to zoom • drag to move • double-click to reset</div>
        </div>

        {(title || subtitle) && (
          <div className="portrait-lightbox-caption">
            {title && <div className="portrait-lightbox-title">{title}</div>}
            {subtitle && <div className="portrait-lightbox-subtitle">{subtitle}</div>}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

PortraitLightbox.propTypes = {
  isOpen: PropTypes.bool,
  imageUrl: PropTypes.string,
  backgroundImage: PropTypes.string,
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onClose: PropTypes.func
};

export default PortraitLightbox;
