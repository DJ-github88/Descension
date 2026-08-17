import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  const isChargingRef = useRef(false);
  const startTimeRef = useRef(0);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);
  const hasFiredRef = useRef(false);
  const flingDirRef = useRef({ x: 0, z: 0 });

  // Maximum hold time for 100% full charge (1.1s)
  const MAX_CHARGE_TIME = 1100;

  const updateCharge = useCallback(() => {
    if (!isChargingRef.current) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const progress = Math.min(1, elapsed / MAX_CHARGE_TIME);
    setChargeProgress(progress);

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

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(updateCharge);
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
    const finalProgress = Math.min(1, elapsed / MAX_CHARGE_TIME);

    // Scaling: 0% charge = 0.75x velocity (gentle drop), 100% = 2.4x velocity (powerful fling)
    const throwPower = 0.75 + finalProgress * 1.65;
    const finalFlingDir = { ...flingDirRef.current };

    setIsCharging(false);
    setChargeProgress(0);
    setShakeTransform('');
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
  }, [isCharging, handleGlobalPointerMove, handleRelease]);

  const powerPercent = Math.round(chargeProgress * 100);
  const isAiming = isCharging && dragVector.dist > 15;
  const arrowLength = Math.min(85, Math.max(28, dragVector.dist));

  return (
    <div className="chargeable-roll-button-wrapper" style={{ display: 'inline-block', position: 'relative' }}>
      {/* Floating Aim Trajectory Arrow & Indicator */}
      {isAiming && (
        <div
          className="roll-aim-arrow-container"
          style={{
            transform: `translate(-50%, -50%) rotate(${dragVector.angle}deg)`,
            width: `${arrowLength}px`
          }}
        >
          <div className="roll-aim-line" />
          <div className="roll-aim-head">
            <i className="fas fa-chevron-right"></i>
          </div>
          <div className="roll-aim-reticle" />
        </div>
      )}

      {/* Floating Charge Power Indicator */}
      {isCharging && chargeProgress > 0.05 && (
        <div className="roll-charge-indicator" style={{ opacity: Math.min(1, chargeProgress * 1.5) }}>
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
          // Keyboard trigger or quick click fallback
          if (!hasFiredRef.current) {
            onRoll && onRoll(1.0, { x: 0, z: 0 });
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
