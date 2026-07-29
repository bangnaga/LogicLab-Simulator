import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
} from '@xyflow/react';
import { Trash2, X, Zap } from 'lucide-react';

export const DeletableEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const signalVal = data?.signalVal ?? data?.value ?? 0;
  const isHigh = signalVal === 1;

  const cssStyle = (style || {}) as React.CSSProperties;

  // Custom stroke color based on state
  let strokeColor = cssStyle.stroke || '#2563EB';
  if (selected) {
    strokeColor = '#DC2626'; // Highlight red when selected
  } else if (isHovered) {
    strokeColor = '#EF4444'; // Red hover hint
  } else if (isHigh) {
    strokeColor = '#DC2626'; // Red for HIGH 5V
  }

  const strokeWidth = selected || isHovered ? 3.5 : (cssStyle.strokeWidth as number) || 2.5;

  const handleDelete = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    if (data?.onDeleteEdge && typeof data.onDeleteEdge === 'function') {
      (data.onDeleteEdge as (id: string) => void)(id);
    }
  };

  return (
    <>
      {/* Invisible wider hit region for easy hover and clicking on wire */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          if (data?.onSelectEdge && typeof data.onSelectEdge === 'function') {
            (data.onSelectEdge as (id: string) => void)(id);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (data?.onEdgeContextMenu && typeof data.onEdgeContextMenu === 'function') {
            (data.onEdgeContextMenu as (e: React.MouseEvent, id: string) => void)(e, id);
          }
        }}
      />

      {/* Main Base Wire Edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          transition: 'stroke 0.2s, stroke-width 0.2s',
          filter: selected ? 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.6))' : isHovered ? 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.5))' : undefined,
        }}
      />

      {/* Interactive Delete Button Badge on Wire Center */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan z-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="group relative flex items-center justify-center">
            <button
              onClick={handleDelete}
              className={`flex items-center gap-1 rounded-full text-white font-bold transition-all duration-200 shadow-md border ${
                selected || isHovered
                  ? 'px-2 py-1 bg-red-600 hover:bg-red-700 border-red-300 scale-110'
                  : 'w-6 h-6 bg-slate-800 hover:bg-red-600 border-slate-600 hover:border-red-400 opacity-90 hover:opacity-100'
              }`}
              title="Hapus Garis Penghubung (Klik untuk menghapus)"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              {(selected || isHovered) && (
                <span className="text-[10px] font-mono whitespace-nowrap pr-0.5">Hapus</span>
              )}
            </button>

            {/* Signal Badge Pill when hovered */}
            {isHovered && (
              <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow border border-slate-700 pointer-events-none whitespace-nowrap flex items-center gap-1">
                <Zap className={`w-3 h-3 ${isHigh ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{isHigh ? 'HIGH (1)' : 'LOW (0)'}</span>
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
