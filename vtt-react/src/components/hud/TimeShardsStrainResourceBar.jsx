import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles/resourceBars/time-shards-strain.css';

const TimeShardsStrainResourceBar = ({
  chronarchState = {},
  setChronarchState,
  finalClassResource = {},
  finalConfig = {},
  character,
  isOwner = true,
  onClassResourceUpdate,
  size = 'normal',
  context = 'hud',
  timeShardsBarRef,
  temporalStrainBarRef,
  setShowTooltip,
  setTooltipPosition,
  renderStatusFlavor,
  logClassResourceChange,
}) => {
  const [hoveredShard, setHoveredShard] = useState(null);
  const [hoveredStrain, setHoveredStrain] = useState(null);
  const [showConsoleMenu, setShowConsoleMenu] = useState(false);

  const containerRef = useRef(null);
  const consoleMenuRef = useRef(null);

  const setChronarchHoverSection = (value) => setChronarchState && setChronarchState(prev => ({ ...prev, chronarchHoverSection: value }));

  const chronarchTimeShards = finalClassResource?.timeShards?.current ?? 0;
  const chronarchTimeShardsMax = finalClassResource?.timeShards?.max ?? 10;
  const chronarchTemporalStrain = finalClassResource?.temporalStrain?.current ?? 0;
  const chronarchTemporalStrainMax = finalClassResource?.temporalStrain?.max ?? 10;

  const shardsMax = chronarchTimeShardsMax;
  const strainMax = chronarchTemporalStrainMax;
  const shardsValue = chronarchTimeShards;
  const strainValue = chronarchTemporalStrain;

  // Strain color based on danger level
  const getStrainColor = (strain) => {
      const colors = finalConfig.visual?.temporalStrain?.strainColors || {};
      if (strain >= 10) return colors.backlash || '#dc2626';
      if (strain >= 9) return colors.critical || '#ef4444';
      if (strain >= 7) return colors.danger || '#f87171';
      if (strain >= 5) return colors.warning || '#f97316';
      if (strain >= 3) return colors.caution || '#eab308';
      return colors.safe || '#22c55e';
  };

  const getStrainState = (strain) => {
      if (strain >= 10) return 'BACKLASH!';
      if (strain >= 9) return 'Critical';
      if (strain >= 7) return 'Danger';
      if (strain >= 5) return 'Warning';
      if (strain >= 3) return 'Caution';
      return 'Safe';
  };

  const strainColor = getStrainColor(strainValue);

  // Close console menu on click outside
  useEffect(() => {
      const handleClickOutside = (e) => {
          if (showConsoleMenu && consoleMenuRef.current && !consoleMenuRef.current.contains(e.target) && !containerRef.current?.contains(e.target)) {
              setShowConsoleMenu(false);
          }
      };

      if (showConsoleMenu) {
          const timer = setTimeout(() => {
              document.addEventListener('mousedown', handleClickOutside);
          }, 0);
          return () => {
              clearTimeout(timer);
              document.removeEventListener('mousedown', handleClickOutside);
          };
      }
  }, [showConsoleMenu]);

  // Safe popover positioning relative to container and party HUD frame
  const getConsolePosition = () => {
      if (!containerRef.current) return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '310px', zIndex: 100000 };
      const frame = containerRef.current.closest('.party-member-frame') || containerRef.current.closest('.party-hud');
      const frameRect = frame ? frame.getBoundingClientRect() : containerRef.current.getBoundingClientRect();
      const panelWidth = Math.min(310, Math.round(frameRect.width) || 310);

      let left = frame ? frameRect.left : (frameRect.left + (frameRect.width - panelWidth) / 2);
      if (left < 10) left = 10;
      if (left + panelWidth > window.innerWidth - 10) left = window.innerWidth - panelWidth - 10;

      const viewportHeight = window.innerHeight;
      const menuHeight = 220;
      const fitsBelow = frameRect.bottom + menuHeight + 10 < viewportHeight;

      return {
          position: 'fixed',
          left: `${left}px`,
          top: fitsBelow ? `${frameRect.bottom + 4}px` : `${Math.max(10, frameRect.top - menuHeight - 4)}px`,
          width: `${panelWidth}px`,
          zIndex: 100000,
      };
  };

  // Shard interaction handlers
  const handleSetShards = (newVal) => {
      if (!isOwner || !onClassResourceUpdate) return;
      const clamped = Math.max(0, Math.min(shardsMax, newVal));
      const delta = clamped - shardsValue;
      if (delta !== 0) {
          if (logClassResourceChange) {
              logClassResourceChange('Time Shards', Math.abs(delta), delta > 0, 'timeShards');
          }
          onClassResourceUpdate('timeShards', clamped);
      }
  };

  // Strain interaction handlers
  const handleSetStrain = (newVal) => {
      if (!isOwner || !onClassResourceUpdate) return;
      const clamped = Math.max(0, Math.min(strainMax, newVal));
      const delta = clamped - strainValue;
      if (delta !== 0) {
          if (logClassResourceChange) {
              logClassResourceChange('Temporal Strain', Math.abs(delta), delta > 0, 'temporalStrain');
          }
          onClassResourceUpdate('temporalStrain', clamped);
      }
  };

  return (
      <div className={`class-resource-bar time-shards-strain ${size}`}>
          <div className="chronarch-apparatus-container" ref={containerRef}>
              <svg
                  className="chronarch-master-svg"
                  viewBox="0 0 292 76"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label={`Time Shards ${shardsValue} of ${shardsMax}, Temporal Strain ${strainValue} of ${strainMax}`}
              >
                  <defs>
                      {/* Deep Antiqued Bronze / Mahogany Inlay Bed */}
                      <linearGradient id="chronoBed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2c1f15" />
                          <stop offset="35%" stopColor="#20160e" />
                          <stop offset="70%" stopColor="#18110a" />
                          <stop offset="100%" stopColor="#100b06" />
                      </linearGradient>

                      {/* Ornate Stepped Antique Brass Rim */}
                      <linearGradient id="chronoBrassBorder" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#633b0e" />
                          <stop offset="20%" stopColor="#b45309" />
                          <stop offset="50%" stopColor="#fef08a" />
                          <stop offset="80%" stopColor="#b45309" />
                          <stop offset="100%" stopColor="#633b0e" />
                      </linearGradient>

                      {/* Polished Gear Brass Gradient */}
                      <linearGradient id="chronoGearBrass" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#fde047" />
                          <stop offset="40%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>

                      {/* Radiant Celestial Sapphire Crystal Body */}
                      <linearGradient id="chronoCrystalBody" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f0fdfa" />
                          <stop offset="25%" stopColor="#bae6fd" />
                          <stop offset="60%" stopColor="#38bdf8" />
                          <stop offset="85%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#075985" />
                      </linearGradient>

                      {/* Specular White Facet Reflection */}
                      <linearGradient id="chronoFacetLight" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                          <stop offset="65%" stopColor="#bae6fd" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </linearGradient>

                      {/* Glow Filters */}
                      <filter id="chronoGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                          </feMerge>
                      </filter>

                      <filter id="chronoGlowStrain" x="-40%" y="-40%" width="180%" height="180%">
                          <feGaussianBlur stdDeviation="1.8" result="blur" />
                          <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                          </feMerge>
                      </filter>
                  </defs>

                  {/* Chassis Base Plate with Soft Outer Drop Shadow */}
                  <rect
                      x="1.5"
                      y="1.5"
                      width="289"
                      height="73"
                      rx="6"
                      fill="url(#chronoBed)"
                      stroke="url(#chronoBrassBorder)"
                      strokeWidth="1.2"
                      className={`chrono-chassis-base${strainValue >= 9 ? ' critical' : ''}`}
                  />

                  {/* Inner Etched Bevel Inset */}
                  <rect
                      x="3.5"
                      y="3.5"
                      width="285"
                      height="69"
                      rx="4.5"
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.22)"
                      strokeWidth="0.75"
                      pointerEvents="none"
                  />

                  {/* Corner Rivet Studs */}
                  <circle cx="6" cy="6" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <line x1="4.9" y1="6" x2="7.1" y2="6" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <circle cx="286" cy="6" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <line x1="284.9" y1="6" x2="287.1" y2="6" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <circle cx="6" cy="70" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <line x1="4.9" y1="70" x2="7.1" y2="70" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <circle cx="286" cy="70" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                  <line x1="284.9" y1="70" x2="287.1" y2="70" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />

                  {/* Filigree Corner Flourishes */}
                  <path d="M 5 14 L 14 5 M 5 62 L 14 71 M 287 14 L 278 5 M 287 62 L 278 71" stroke="rgba(251,191,36,0.35)" strokeWidth="0.9" fill="none" pointerEvents="none" />

                  {/* ========================================================= */}
                  {/* LEFT WING: 10 TIME SHARDS (CELESTIAL CRYSTALS)            */}
                  {/* ========================================================= */}
                  <g
                      className="chrono-shards-wing"
                      onMouseEnter={(e) => {
                          setChronarchHoverSection('shards');
                          if (setTooltipPosition && setShowTooltip) {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                              setTooltipPosition({ x: rect.left + rect.width * 0.22, y: rect.top });
                              setShowTooltip(true);
                          }
                      }}
                      onMouseLeave={() => {
                          setChronarchHoverSection(null);
                          if (setShowTooltip) setShowTooltip(false);
                          setHoveredShard(null);
                      }}
                  >
                      {/* 10 Facet-Cut Diamond Crystal Sockets across 2 rows (With plenty of clearance from clock) */}
                      {Array.from({ length: shardsMax }, (_, i) => {
                          const row = i < 5 ? 0 : 1;
                          const col = i % 5;
                          const cx = 18 + col * 21.5;
                          const cy = row === 0 ? 23 : 53;

                          const isFilled = shardsValue > i;
                          const isProspectiveFill = hoveredShard !== null && !isFilled && i <= hoveredShard;
                          const isProspectiveDrop = hoveredShard !== null && isFilled && i > hoveredShard;

                          return (
                              <g
                                  key={`shard-${i}`}
                                  className={`chrono-shard-slot ${isFilled ? 'filled' : 'empty'} ${isProspectiveFill ? 'prospective' : ''} ${isProspectiveDrop ? 'prospective-drop' : ''}`}
                                  onMouseEnter={() => setHoveredShard(i)}
                                  onMouseLeave={() => setHoveredShard(null)}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isOwner) return;
                                      if (shardsValue === i + 1) {
                                          handleSetShards(i);
                                      } else {
                                          handleSetShards(i + 1);
                                      }
                                  }}
                                  onContextMenu={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!isOwner) return;
                                      handleSetShards(Math.max(0, shardsValue - 1));
                                  }}
                                  title={isOwner ? `Time Shard ${i + 1}/${shardsMax}: Click to toggle, Right-click to -1` : `Time Shard ${i + 1}/${shardsMax}`}
                              >
                                  {/* Stable Transparent Hitbox */}
                                  <rect x={cx - 10} y={cy - 12} width="20" height="24" fill="transparent" pointerEvents="all" />

                                  {/* Empty Brass Beveled Socket */}
                                  <polygon
                                      points={`${cx},${cy - 10} ${cx + 7.5},${cy} ${cx},${cy + 10} ${cx - 7.5},${cy}`}
                                      fill="#140e09"
                                      stroke={isFilled ? 'rgba(251,191,36,0.5)' : 'rgba(217,119,6,0.35)'}
                                      strokeWidth="0.9"
                                      className="chrono-shard-socket"
                                      pointerEvents="none"
                                  />

                                  {/* Socket Etched Internal Guideline Ticks */}
                                  <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="rgba(251,191,36,0.18)" strokeWidth="0.5" pointerEvents="none" />
                                  <line x1={cx} y1={cy - 7} x2={cx} y2={cy + 7} stroke="rgba(251,191,36,0.18)" strokeWidth="0.5" pointerEvents="none" />

                                  {/* Prospective Ghost Crystal on Hover */}
                                  {isProspectiveFill && (
                                      <polygon
                                          points={`${cx},${cy - 9.5} ${cx + 7},${cy} ${cx},${cy + 9.5} ${cx - 7},${cy}`}
                                          fill="rgba(56, 189, 248, 0.28)"
                                          stroke="#7dd3fc"
                                          strokeWidth="1.1"
                                          strokeDasharray="2.5 1.2"
                                          pointerEvents="none"
                                      />
                                  )}

                                  {/* Filled Glowing 3D Facet Crystal */}
                                  {isFilled && (
                                      <g className="chrono-shard-crystal-wrapper" opacity={isProspectiveDrop ? 0.38 : 1} pointerEvents="none">
                                          {/* Main Faceted Crystal Body */}
                                          <polygon
                                              points={`${cx},${cy - 9.5} ${cx + 7},${cy} ${cx},${cy + 9.5} ${cx - 7},${cy}`}
                                              fill="url(#chronoCrystalBody)"
                                              stroke="#e0f2fe"
                                              strokeWidth="0.8"
                                              className="chrono-shard-crystal-body"
                                              filter="url(#chronoGlowCyan)"
                                              pointerEvents="none"
                                          />
                                          {/* Left Upper Specular Sheen */}
                                          <polygon
                                              points={`${cx},${cy - 9.5} ${cx - 7},${cy} ${cx},${cy}`}
                                              fill="url(#chronoFacetLight)"
                                              pointerEvents="none"
                                          />
                                          {/* Right Upper Sheen */}
                                          <polygon
                                              points={`${cx},${cy - 9.5} ${cx + 7},${cy} ${cx},${cy}`}
                                              fill="rgba(255, 255, 255, 0.45)"
                                              pointerEvents="none"
                                          />
                                          {/* Bottom Shaded Facets for 3D Depth */}
                                          <polygon
                                              points={`${cx},${cy} ${cx - 7},${cy} ${cx},${cy + 9.5}`}
                                              fill="rgba(2, 44, 75, 0.55)"
                                              pointerEvents="none"
                                          />
                                          <polygon
                                              points={`${cx},${cy} ${cx + 7},${cy} ${cx},${cy + 9.5}`}
                                              fill="rgba(12, 74, 110, 0.35)"
                                              pointerEvents="none"
                                          />
                                          {/* Apex Specular Glint */}
                                          <circle cx={cx} cy={cy - 2.5} r="1.2" fill="#ffffff" filter="url(#chronoGlowCyan)" pointerEvents="none" />
                                      </g>
                                  )}
                              </g>
                          );
                      })}
                  </g>

                  {/* ========================================================= */}
                  {/* CENTERPIECE: SUNDRIFT ASTROLABE & GYRO-HOURGLASS          */}
                  {/* ========================================================= */}
                  <g
                      className="chrono-center-core"
                      onClick={(e) => {
                          e.stopPropagation();
                          if (isOwner) {
                              setShowConsoleMenu(prev => !prev);
                          }
                      }}
                      title={isOwner ? "Click to open Temporal Flux Console" : undefined}
                  >
                      {/* Rotating Astrolabe Gear Wheel */}
                      <g className="chrono-astrolabe-gear-ring">
                          <circle cx="146" cy="38" r="25" fill="none" stroke="url(#chronoGearBrass)" strokeWidth="1.2" strokeDasharray="3 3" />
                          {Array.from({ length: 16 }, (_, i) => {
                              const angle = (i * 22.5 * Math.PI) / 180;
                              const x1 = 146 + 23.2 * Math.cos(angle);
                              const y1 = 38 + 23.2 * Math.sin(angle);
                              const x2 = 146 + 25.8 * Math.cos(angle);
                              const y2 = 38 + 25.8 * Math.sin(angle);
                              return (
                                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(254,240,138,0.7)" strokeWidth="0.9" />
                              );
                          })}
                      </g>

                      {/* Inner Brass Gimbal Ring with Roman Degree Marks */}
                      <circle cx="146" cy="38" r="19.5" fill="#18110b" stroke="url(#chronoBrassBorder)" strokeWidth="1.2" className="chrono-gimbal-ring" />
                      {/* Degree Ticks */}
                      {Array.from({ length: 12 }, (_, i) => {
                          const angle = (i * 30 * Math.PI) / 180;
                          const x1 = 146 + 16.5 * Math.cos(angle);
                          const y1 = 38 + 16.5 * Math.sin(angle);
                          const x2 = 146 + 18.8 * Math.cos(angle);
                          const y2 = 38 + 18.8 * Math.sin(angle);
                          return (
                              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(251,191,36,0.45)" strokeWidth="0.6" pointerEvents="none" />
                          );
                      })}

                      {/* Mini Cardinal Roman Numerals */}
                      <text x="146" y="24.5" textAnchor="middle" fill="#fde047" fontSize="4.2" fontFamily="'Cinzel', serif" fontWeight="700" pointerEvents="none">XII</text>
                      <text x="161" y="39.2" textAnchor="middle" fill="#fde047" fontSize="4.2" fontFamily="'Cinzel', serif" fontWeight="700" pointerEvents="none">III</text>
                      <text x="146" y="53.5" textAnchor="middle" fill="#fde047" fontSize="4.2" fontFamily="'Cinzel', serif" fontWeight="700" pointerEvents="none">VI</text>
                      <text x="131" y="39.2" textAnchor="middle" fill="#fde047" fontSize="4.2" fontFamily="'Cinzel', serif" fontWeight="700" pointerEvents="none">IX</text>

                      {/* Sundrift Glass Hourglass Bulbs */}
                      {/* Upper Bulb */}
                      <polygon points="138,24 154,24 150,35 142,35" fill="rgba(30,55,85,0.45)" stroke="url(#chronoBrassBorder)" strokeWidth="0.75" />
                      {/* Lower Bulb */}
                      <polygon points="142,41 150,41 154,52 138,52" fill="rgba(30,55,85,0.45)" stroke="url(#chronoBrassBorder)" strokeWidth="0.75" />

                      {/* Flowing Azure Chronal Sand Beam */}
                      <line x1="146" y1="34" x2="146" y2="47" stroke="#38bdf8" strokeWidth="1.2" className="chrono-sand-beam" pointerEvents="none" />

                      {/* Settled Chronal Sand Dune in Lower Bulb */}
                      <polygon points="140,51.5 152,51.5 148,45 144,45" fill="url(#chronoCrystalBody)" filter="url(#chronoGlowCyan)" pointerEvents="none" />

                      {/* Central Brass Gyro-Jewel Pivot */}
                      <circle cx="146" cy="38" r="3.4" fill="#d97706" stroke="#fef08a" strokeWidth="0.8" className="chrono-center-jewel" />
                      <circle cx="146" cy="38" r="1.3" fill="#ffffff" pointerEvents="none" />
                  </g>

                  {/* ========================================================= */}
                  {/* RIGHT WING: 10 TEMPORAL STRAIN MERCURY PHIALS             */}
                  {/* ========================================================= */}
                  <g
                      className="chrono-strain-wing"
                      onMouseEnter={(e) => {
                          setChronarchHoverSection('strain');
                          if (setTooltipPosition && setShowTooltip) {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                              setTooltipPosition({ x: rect.left + rect.width * 0.78, y: rect.top });
                              setShowTooltip(true);
                          }
                      }}
                      onMouseLeave={() => {
                          setChronarchHoverSection(null);
                          if (setShowTooltip) setShowTooltip(false);
                          setHoveredStrain(null);
                      }}
                  >
                      {/* 10 Vacuum Tachometer Mercury Phials (Clear of clock, Height 50px) */}
                      {Array.from({ length: strainMax }, (_, i) => {
                          const w = 7.6;
                          const h = 50;
                          const x = 180 + i * 10;
                          const y = 13;

                          const isFilled = strainValue > i;
                          const isProspectiveFill = hoveredStrain !== null && !isFilled && i <= hoveredStrain;
                          const isProspectiveDrop = hoveredStrain !== null && isFilled && i > hoveredStrain;

                          return (
                              <g
                                  key={`strain-${i}`}
                                  className={`chrono-strain-slot ${isFilled ? 'filled' : 'empty'} ${isProspectiveFill ? 'prospective' : ''} ${isProspectiveDrop ? 'prospective-drop' : ''}`}
                                  onMouseEnter={() => setHoveredStrain(i)}
                                  onMouseLeave={() => setHoveredStrain(null)}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isOwner) return;
                                      if (strainValue === i + 1) {
                                          handleSetStrain(i);
                                      } else {
                                          handleSetStrain(i + 1);
                                      }
                                  }}
                                  onContextMenu={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!isOwner) return;
                                      handleSetStrain(Math.max(0, strainValue - 1));
                                  }}
                                  title={isOwner ? `Temporal Strain ${i + 1}/${strainMax} (${getStrainState(strainValue)}): Click to set, Right-click to -1` : `Temporal Strain ${i + 1}/${strainMax}`}
                              >
                                  {/* Stable Transparent Hitbox */}
                                  <rect x={x - 1.2} y={y - 3} width={w + 2.4} height={h + 6} fill="transparent" pointerEvents="all" />

                                  {/* Top Brass Collar */}
                                  <rect x={x - 0.4} y={y - 2.5} width={w + 0.8} height="3" rx="0.8" fill="url(#chronoBrassBorder)" stroke="#5e340a" strokeWidth="0.4" pointerEvents="none" />

                                  {/* Bottom Brass Collar */}
                                  <rect x={x - 0.4} y={y + h - 0.5} width={w + 0.8} height="3" rx="0.8" fill="url(#chronoBrassBorder)" stroke="#5e340a" strokeWidth="0.4" pointerEvents="none" />

                                  {/* Vacuum Glass Phial Bed */}
                                  <rect
                                      x={x}
                                      y={y}
                                      width={w}
                                      height={h}
                                      rx="3.5"
                                      fill="#140e0a"
                                      stroke={isFilled ? strainColor : 'rgba(217, 119, 6, 0.35)'}
                                      strokeWidth="0.9"
                                      className="chrono-strain-glass-tube"
                                      pointerEvents="none"
                                  />

                                  {/* Tube Calibration Tick Marks */}
                                  <line x1={x + 1} y1={y + 12} x2={x + 3} y2={y + 12} stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" pointerEvents="none" />
                                  <line x1={x + 1} y1={y + 25} x2={x + 3.8} y2={y + 25} stroke="rgba(255,255,255,0.32)" strokeWidth="0.5" pointerEvents="none" />
                                  <line x1={x + 1} y1={y + 38} x2={x + 3} y2={y + 38} stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" pointerEvents="none" />

                                  {/* Prospective Ghost Fill on Hover */}
                                  {isProspectiveFill && (
                                      <rect
                                          x={x + 0.8}
                                          y={y + 0.8}
                                          width={w - 1.6}
                                          height={h - 1.6}
                                          rx="2.6"
                                          fill={strainColor}
                                          opacity="0.3"
                                          pointerEvents="none"
                                      />
                                  )}

                                  {/* Filled Luminous Mercury Plasma Tube */}
                                  {isFilled && (
                                      <g className="chrono-strain-active" opacity={isProspectiveDrop ? 0.38 : 1} pointerEvents="none">
                                          <rect
                                              x={x + 0.8}
                                              y={y + 0.8}
                                              width={w - 1.6}
                                              height={h - 1.6}
                                              rx="2.6"
                                              fill={strainColor}
                                              filter={strainValue >= 7 ? 'url(#chronoGlowStrain)' : undefined}
                                              className="chrono-strain-liquid-fill"
                                              pointerEvents="none"
                                          />
                                          {/* Glowing Meniscus at top of liquid */}
                                          <ellipse cx={x + w / 2} cy={y + 2.5} rx={(w - 2.4) / 2} ry="1.1" fill="#ffffff" opacity="0.65" pointerEvents="none" />
                                          {/* Specular Glare Stripe down the glass */}
                                          <line x1={x + 1.8} y1={y + 3} x2={x + 1.8} y2={y + h - 3} stroke="rgba(255,255,255,0.45)" strokeWidth="0.75" pointerEvents="none" />
                                      </g>
                                  )}
                              </g>
                          );
                      })}

                      {/* Paradox Backlash Crackling Arc (Strain 9+) */}
                      {strainValue >= 9 && (
                          <path
                              d="M 178 10 L 190 8 L 202 12 L 214 8 L 226 12 L 238 8 L 250 12 L 262 8 L 278 11"
                              className="chrono-paradox-fracture"
                              pointerEvents="none"
                          />
                      )}
                  </g>

                  {/* Strain 10 Backlash Warning Ribbon */}
                  {strainValue >= 10 && (
                      <g className="chrono-backlash-ribbon" pointerEvents="none">
                          <rect x="184" y="62.5" width="88" height="9" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="0.8" />
                          <text x="228" y="69" textAnchor="middle" fill="#ffffff" fontSize="5.2" fontWeight="800" fontFamily="'Cinzel', serif" letterSpacing="0.4">
                              ⚡ PARADOX BACKLASH!
                          </text>
                      </g>
                  )}
              </svg>

              {/* Astrolabe Temporal Flux Console Popover */}
              {showConsoleMenu && ReactDOM.createPortal(
                  <div
                      ref={consoleMenuRef}
                      className="chronarch-console-popover"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      style={getConsolePosition()}
                  >
                      <div className="chronarch-console-header">
                          <div className="chronarch-console-title">
                              <i className="fas fa-hourglass-half" style={{ color: '#fbbf24', marginRight: '6px' }}></i>
                              <span>TEMPORAL FLUX CONSOLE</span>
                          </div>
                          <button
                              className="chronarch-console-close"
                              onClick={() => setShowConsoleMenu(false)}
                              title="Close Console"
                          >
                              <i className="fas fa-times"></i>
                          </button>
                      </div>

                      {renderStatusFlavor && renderStatusFlavor()}

                      {/* Time Shards Control Section */}
                      <div className="chronarch-console-section">
                          <div className="chronarch-section-title time-shards">
                              <span>◆ TIME SHARDS: {shardsValue}/{shardsMax}</span>
                          </div>
                          <div className="chronarch-btn-grid">
                              <button
                                  className="console-btn shard-add"
                                  onClick={() => handleSetShards(shardsValue + 1)}
                                  disabled={shardsValue >= shardsMax}
                                  title="Bank +1 Time Shard (Spell Cast)"
                              >
                                  <i className="fas fa-plus"></i> +1 Cast
                              </button>
                              <button
                                  className="console-btn shard-add"
                                  onClick={() => handleSetShards(shardsValue + 3)}
                                  disabled={shardsValue >= shardsMax}
                                  title="Bank +3 Time Shards (Surge)"
                              >
                                  <i className="fas fa-angle-double-up"></i> +3 Surge
                              </button>
                              <button
                                  className="console-btn shard-spend"
                                  onClick={() => handleSetShards(shardsValue - 2)}
                                  disabled={shardsValue < 2}
                                  title="Minor Flux (-2 Shards)"
                              >
                                  <i className="fas fa-bolt"></i> −2 Flux
                              </button>
                              <button
                                  className="console-btn shard-spend"
                                  onClick={() => handleSetShards(shardsValue - 5)}
                                  disabled={shardsValue < 5}
                                  title="Major Flux (-5 Shards)"
                              >
                                  <i className="fas fa-fire"></i> −5 Major
                              </button>
                              <button
                                  className="console-btn shard-reset"
                                  onClick={() => handleSetShards(0)}
                                  disabled={shardsValue === 0}
                                  title="Clear All Shards"
                              >
                                  <i className="fas fa-undo"></i> Clear
                              </button>
                          </div>
                      </div>

                      {/* Temporal Strain Control Section */}
                      <div className="chronarch-console-section">
                          <div className="chronarch-section-title temporal-strain">
                              <span>⏳ TEMPORAL STRAIN: {strainValue}/{strainMax}</span>
                              <span className="strain-badge" style={{ color: strainColor, fontWeight: '800' }}>
                                  ({getStrainState(strainValue)})
                              </span>
                          </div>
                          <div className="chronarch-btn-grid">
                              <button
                                  className="console-btn strain-add"
                                  onClick={() => handleSetStrain(strainValue + 1)}
                                  disabled={strainValue >= strainMax}
                                  title="+1 Temporal Strain (Minor Flux)"
                              >
                                  <i className="fas fa-plus"></i> +1 Flux
                              </button>
                              <button
                                  className="console-btn strain-add"
                                  onClick={() => handleSetStrain(strainValue + 3)}
                                  disabled={strainValue >= strainMax}
                                  title="+3 Temporal Strain (Major Flux)"
                              >
                                  <i className="fas fa-angle-double-up"></i> +3 Surge
                              </button>
                              <button
                                  className="console-btn strain-decay"
                                  onClick={() => handleSetStrain(strainValue - 1)}
                                  disabled={strainValue <= 0}
                                  title="Turn Decay (-1 Strain)"
                              >
                                  <i className="fas fa-leaf"></i> −1 Decay
                              </button>
                              <button
                                  className="console-btn strain-decay"
                                  onClick={() => handleSetStrain(0)}
                                  disabled={strainValue === 0}
                                  title="Mend Strain (Reset to 0)"
                              >
                                  <i className="fas fa-hand-holding-water"></i> Mend (0)
                              </button>
                              <button
                                  className="console-btn strain-backlash"
                                  onClick={() => handleSetStrain(10)}
                                  title="Trigger Paradox Backlash (Set to 10)"
                              >
                                  <i className="fas fa-bolt"></i> Backlash (10)
                              </button>
                          </div>
                      </div>
                  </div>,
                  document.body
              )}
          </div>
      </div>
  );
};

export default TimeShardsStrainResourceBar;
