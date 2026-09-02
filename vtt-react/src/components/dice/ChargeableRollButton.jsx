import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ChargeableRollButton.css';

/**
 * ChargeableRollButton
 * Press and hold to build up throwing tension and rumble.
 * Directing the pointer in any direction aims the throw vector.
 * Releasing launches the dice with velocity proportional to charge duration & fling vector.
 */
const ChargeableRollButton = ({
  onRoll,
  className = '',
  style = {},
  disabled = false,
  children,
  title = 'Click or hold & release to charge throw power'
}) => {
  const [chargeProgress, setChargeProgress] = useState(0); // 0.0 to 1.0
  const [isCharging, setIsCharging] = useState(false);
  const [shakeTransform, setShakeTransform] = useState('');
  const [dragVector, setDragVector] = useState({ dx: 0, dy: 0, dist: 0, angle: 0 });
  // Screen-space anchor of the button for the portaled charge UI.
  const [anchor, setAnchor] = useState(null);

  const isChargingRef = useRef(false);
  const startTimeRef = useRef(0);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);
  const hasFiredRef = useRef(false);
  const flingDirRef = useRef({ x: 0, z: 0 });
  const wrapperRef = useRef(null);

  // Mario Party-style OSCILLATING meter: while held, power sweeps 0→1→0 in
  // a triangle wave. Release timing decides the throw — nail the peak for a
  // max-power fling, release early for a gentle toss.
  const OSCILLATE_PERIOD = 1300; // ms for a full 0→1→0 sweep
  const QUICK_TAP_MS = 160;      // below this, treat as a plain click roll

  // Triangle-wave charge value 0..1 at a given hold time.
  const chargeAt = (elapsed) => {
    const ph = (elapsed % OSCILLATE_PERIOD) / OSCILLATE_PERIOD;
    return ph < 0.5 ? ph * 2 : (1 - ph) * 2;
  };

  const updateCharge = useCallback(() => {
    if (!isChargingRef.current) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const progress = chargeAt(elapsed);
    setChargeProgress(progress);

    // Track the button's screen anchor so the portaled indicator/arrow can
    // follow it (portals live on <body>, outside the clipped dropdown).
    if (wrapperRef.current) {
      const r = wrapperRef.current.getBoundingClientRect();
      setAnchor({ x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top });
    }

    // Calculate dynamic rumble jitter based on progress
    const amp = progress * 6.5; // up to 6.5px shake
    const rot = (Math.random() - 0.5) * (progress * 5); // degrees
    const shakeX = (Math.random() - 0.5) * amp;
    const shakeY = (Math.random() - 0.5) * amp;
    setShakeTransform(`translate3d(${shakeX.toFixed(1)}px, ${shakeY.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`);

    // Calculate fling vector from drag displacement
    const dx = currentPointerRef.current.x - startPointerRef.current.x;
    const dy = currentPointerRef.current.y - startPointerRef.current.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    setDragVector({ dx, dy, dist, angle });

    if (dist > 12) {
      // In 3D: X is screen X (left-right), Z is screen -Y (up is forward towards back of table)
      flingDirRef.current = {
        x: dx / dist,
        z: -dy / dist
      };
    } else {
      flingDirRef.current = { x: 0, z: 0 };
    }

    // Intermittent haptic rumble on supported mobile devices
    if (window.navigator?.vibrate && elapsed > 100 && Math.random() < 0.35 + progress * 0.4) {
      window.navigator.vibrate(10 + Math.floor(progress * 25));
    }

    animFrameRef.current = requestAnimationFrame(updateCharge);
  }, []);

  const handlePointerDown = (e) => {
    if (disabled) return;
    if (e.button !== undefined && e.button !== 0) return;

    hasFiredRef.current = false;
    isChargingRef.current = true;
    setIsCharging(true);
    setChargeProgress(0);

    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    startPointerRef.current = { x: clientX, y: clientY };
    currentPointerRef.current = { x: clientX, y: clientY };
    flingDirRef.current = { x: 0, z: 0 };
    setDragVector({ dx: 0, dy: 0, dist: 0, angle: 0 });
    startTimeRef.current = performance.now();
    // NOTE: the charge rAF loop is scheduled by the isCharging effect below,
    // NOT here. Scheduling here gets cancelled by the effect cleanup that
    // runs when isCharging flips true (same commit) — that killed the loop
    // on the first frame and the meter never appeared.
  };

  const handleGlobalPointerMove = useCallback((e) => {
    if (!isChargingRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    currentPointerRef.current = { x: clientX, y: clientY };
  }, []);

  const handleRelease = useCallback(() => {
    if (!isChargingRef.current || hasFiredRef.current) return;
    hasFiredRef.current = true;
    isChargingRef.current = false;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const elapsed = performance.now() - startTimeRef.current;

    // Quick tap = plain roll at default power. Held = the oscillating meter
    // decides — and a held release is NEVER weaker than a tap: the floor is
    // the tap power (0.9) and a peak release hits 2.8x.
    let throwPower = 0.9;
    if (elapsed >= QUICK_TAP_MS) {
      throwPower = 0.9 + chargeAt(elapsed) * 1.9;
    }
    const finalFlingDir = { ...flingDirRef.current };

    setIsCharging(false);
    setChargeProgress(0);
    setShakeTransform('');
    setAnchor(null);
    setDragVector({ dx: 0, dy: 0, dist: 0, angle: 0 });

    if (onRoll) {
      onRoll(throwPower, finalFlingDir);
    }
  }, [onRoll]);

  useEffect(() => {
    if (isCharging) {
      window.addEventListener('mousemove', handleGlobalPointerMove);
      window.addEventListener('mouseup', handleRelease);
      window.addEventListener('touchmove', handleGlobalPointerMove, { passive: true });
      window.addEventListener('touchend', handleRelease);
      window.addEventListener('touchcancel', handleRelease);
      // (Re)start the charge rAF loop HERE. The cleanup below cancels any
      // loop whenever deps change (e.g. onRoll identity on parent renders),
      // so this effect must also be the one to revive it.
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(updateCharge);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalPointerMove);
      window.removeEventListener('mouseup', handleRelease);
      window.removeEventListener('touchmove', handleGlobalPointerMove);
      window.removeEventListener('touchend', handleRelease);
      window.removeEventListener('touchcancel', handleRelease);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isCharging, handleGlobalPointerMove, handleRelease, updateCharge]);

  const powerPercent = Math.round(chargeProgress * 100);
  const isAiming = isCharging && dragVector.dist > 15;
  const arrowLength = Math.min(85, Math.max(28, dragVector.dist));

  // Charge UI renders through a portal on <body>: the dice dropdown panel
  // has overflow:hidden, which would clip a floating bar/arrow anchored to
  // the button. Fixed positioning from the tracked anchor escapes all
  // ancestor clipping.
  const chargeOverlay = (typeof document !== 'undefined' && anchor) ? (
    <>
      {isAiming && (
        <div
          className="roll-aim-arrow-container"
          style={{
            position: 'fixed',
            left: `${anchor.x}px`,
            top: `${anchor.y}px`,
            zIndex: 906,
            transform: `rotate(${dragVector.angle}deg)`,
            width: `${arrowLength}px`,
          }}
        >
          <div className="roll-aim-line" />
          <div className="roll-aim-head">
            <i className="fas fa-chevron-right"></i>
          </div>
          <div className="roll-aim-reticle" />
        </div>
      )}

      {chargeProgress > 0.05 && (
        <div
          className="roll-charge-indicator"
          style={{
            position: 'fixed',
            left: `${anchor.x}px`,
            top: `${anchor.top - 8}px`,
            // The stylesheet's `bottom: calc(100% + 8px)` was written for the
            // old in-dropdown absolute placement. With fixed positioning +
            // inline `top`, a lingering `bottom` makes the browser stretch
            // the box to a negative height — neutralize it.
            bottom: 'auto',
            zIndex: 906,
            transform: 'translate(-50%, -100%)',
            opacity: Math.min(1, chargeProgress * 1.5),
          }}
        >
          <div className="roll-charge-text">
            {chargeProgress >= 0.95 ? (
              <span className="roll-charge-max">
                <i className="fas fa-bolt"></i> MAX POWER!
              </span>
            ) : (
              <span>
                <i className="fas fa-fire"></i> {powerPercent}% Velocity
              </span>
            )}
            {isAiming && (
              <span className="roll-aim-tag">
                <i className="fas fa-location-arrow"></i> Aimed
              </span>
            )}
          </div>
          <div className="roll-charge-bar-bg">
            <div
              className="roll-charge-bar-fill"
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>
      )}
    </>
  ) : null;

  return (
    <div className="chargeable-roll-button-wrapper" ref={wrapperRef} style={{ display: 'inline-block', position: 'relative' }}>
      {createPortal(chargeOverlay, document.body)}

      <button
        type="button"
        className={`chargeable-roll-btn ${className} ${isCharging ? 'is-rumbling' : ''} ${isAiming ? 'is-aiming' : ''}`}
        style={{
          ...style,
          transform: isCharging ? shakeTransform : style.transform,
          '--charge-fill': `${powerPercent}%`
        }}
        disabled={disabled}
        title={title}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={() => {
          // Keyboard trigger or quick click fallback — same power as the
          // held-release floor so tap vs low-charge hold feel identical.
          if (!hasFiredRef.current) {
            onRoll && onRoll(0.9, { x: 0, z: 0 });
          }
        }}
      >
        <span className="chargeable-btn-content">{children}</span>
        {isCharging && (
          <span
            className="chargeable-rumble-glow"
            style={{ opacity: 0.3 + chargeProgress * 0.7 }}
          />
        )}
      </button>
    </div>
  );
};

export default ChargeableRollButton;
