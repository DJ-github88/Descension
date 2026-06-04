import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import useFactionStore, { RELATIONSHIP_TYPES } from '../../store/factionStore';

const FactionWebGraph = ({ onFactionClick, selectedFactionId }) => {
  const { factions, getFullRelationshipGraph, getRelationshipTypes } = useFactionStore();
  const graph = useMemo(() => getFullRelationshipGraph(), [getFullRelationshipGraph]);
  const [showSecrets, setShowSecrets] = useState(false);
  const [hoveredFaction, setHoveredFaction] = useState(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({ width: Math.max(600, width), height: 500 });
    }
  }, []);

  const visibleFactions = useMemo(() => {
    if (showSecrets) return factions;
    return factions.filter((f) => f.type !== 'secret_society' || f.publicGoal);
  }, [factions, showSecrets]);

  const visibleEdges = useMemo(() => {
    if (showSecrets) return graph;
    return graph.filter((e) => !['secret_ally', 'secret_rival'].includes(e.type));
  }, [graph, showSecrets]);

  const nodePositions = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(visibleFactions.length));
    const gapX = (dimensions.width - 120) / (cols - 1 || 1);
    const gapY = 130;
    return visibleFactions.reduce((acc, f, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      acc[f.id] = {
        x: 60 + col * gapX,
        y: 50 + row * gapY
      };
      return acc;
    }, {});
  }, [visibleFactions, dimensions]);

  const relTypes = getRelationshipTypes();

  return (
    <div className="world-faction-graph-container" ref={containerRef}>
      <div className="world-faction-graph-controls">
        <label className="world-toggle">
          <input
            type="checkbox"
            checked={showSecrets}
            onChange={(e) => setShowSecrets(e.target.checked)}
          />
          <span>Show secret relationships</span>
        </label>
        <div className="world-legend">
          {Object.entries(relTypes).slice(0, 6).map(([key, val]) => (
            <span key={key} className="world-legend-item">
              <svg width="20" height="12"><line x1="0" y1="6" x2="20" y2="6" stroke={val.color} strokeWidth="2" strokeDasharray={val.lineStyle === 'dashed' ? '5,3' : val.lineStyle === 'dotted' ? '2,2' : 'none'} /></svg>
              {val.label}
            </span>
          ))}
        </div>
      </div>

      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="world-faction-graph"
      >
        {visibleEdges.map((edge) => {
          const from = nodePositions[edge.source];
          const to = nodePositions[edge.target];
          if (!from || !to) return null;

          const isHighlighted =
            hoveredFaction === edge.source || hoveredFaction === edge.target ||
            selectedFactionId === edge.source || selectedFactionId === edge.target;

          const rel = relTypes[edge.type] || relTypes.neutral;
          return (
            <line
              key={`${edge.source}--${edge.target}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={rel.color}
              strokeWidth={isHighlighted ? 3 : 1.5}
              strokeDasharray={rel.lineStyle === 'dashed' ? '5,3' : rel.lineStyle === 'dotted' ? '2,2' : 'none'}
              opacity={isHighlighted ? 1 : 0.5}
            />
          );
        })}

        {visibleFactions.map((faction) => {
          const pos = nodePositions[faction.id];
          if (!pos) return null;

          const isSelected = selectedFactionId === faction.id;
          const isHovered = hoveredFaction === faction.id;
          const isRelated =
            hoveredFaction && visibleEdges.some(
              (e) =>
                (e.source === faction.id && e.target === hoveredFaction) ||
                (e.target === faction.id && e.source === hoveredFaction)
            );

          return (
            <g
              key={faction.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredFaction(faction.id)}
              onMouseLeave={() => setHoveredFaction(null)}
              onClick={() => onFactionClick && onFactionClick(faction.id)}
              style={{ cursor: 'pointer' }}
              opacity={
                hoveredFaction && !isRelated && !isHovered ? 0.3 : 1
              }
            >
              <rect
                x={-50} y={-22}
                width={100} height={44}
                rx={8}
                fill={isSelected ? faction.colors?.primary || '#333' : '#1a1a2e'}
                stroke={isSelected ? '#fff' : faction.colors?.primary || '#555'}
                strokeWidth={isSelected ? 2 : 1}
              />
              <text
                textAnchor="middle"
                dy="0.35em"
                fill="#e8e0d5"
                fontSize="10"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {faction.name.length > 14 ? faction.name.slice(0, 13) + '…' : faction.name}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredFaction && (
        <div className="world-graph-tooltip">
          {visibleFactions.find((f) => f.id === hoveredFaction)?.name}
        </div>
      )}
    </div>
  );
};

export default FactionWebGraph;
