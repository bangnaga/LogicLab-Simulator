import React from 'react';
import { useViewport } from '@xyflow/react';

export type CanvasBackgroundType = 'dots' | 'breadboard-400' | 'breadboard-170' | 'none';

interface BreadboardBackgroundProps {
  type: CanvasBackgroundType;
  showPowerLeds?: boolean;
}

export const BreadboardBackground: React.FC<BreadboardBackgroundProps> = ({
  type,
  showPowerLeds = true,
}) => {
  const { x, y, zoom } = useViewport();

  if (type === 'none' || type === 'dots') {
    return null;
  }

  const renderBreadboard400 = () => {
    const cols = 30;
    const colSpacing = 28;
    const startX = 60;
    const rowLabelsTop = ['a', 'b', 'c', 'd', 'e'];
    const rowLabelsBottom = ['f', 'g', 'h', 'i', 'j'];
    const rowYTop = [130, 158, 186, 214, 242];
    const rowYBottom = [298, 326, 354, 382, 410];

    const width = 960;
    const height = 540;

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="drop-shadow-lg select-none"
      >
        <defs>
          {/* Subtle Metallic Hole Gradient */}
          <radialGradient id="socketHole" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#64748B" />
          </radialGradient>
          {/* Breadboard Base Plastic Gradient */}
          <linearGradient id="bbBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAFAFA" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          {/* Center Trench Shadow */}
          <linearGradient id="trenchShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Outer Breadboard Plastic Body */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="16"
          fill="url(#bbBase)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* Side Interlocking Tabs & Notches */}
        <rect x="-6" y="120" width="8" height="30" rx="3" fill="#CBD5E1" />
        <rect x="-6" y="380" width="8" height="30" rx="3" fill="#CBD5E1" />
        <rect x={width - 2} y="120" width="8" height="30" rx="3" fill="#CBD5E1" />
        <rect x={width - 2} y="380" width="8" height="30" rx="3" fill="#CBD5E1" />

        {/* Top Header Label */}
        <text
          x={width / 2}
          y="22"
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
          fontWeight="800"
          letterSpacing="1.5"
          className="font-mono uppercase"
        >
          MB-102 BREADBOARD (400 TIE-POINTS REALISTIC GRID)
        </text>

        {/* ================= TOP POWER RAIL ================= */}
        {/* Red (+) Stripe */}
        <line x1="45" y1="40" x2={width - 45} y2="40" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="130 15 130 15 130" />
        <text x="30" y="44" fill="#DC2626" fontSize="13" fontWeight="900" textAnchor="middle font-mono">+</text>
        <text x={width - 30} y="44" fill="#DC2626" fontSize="13" fontWeight="900" textAnchor="middle font-mono">+</text>

        {/* Blue (-) Stripe */}
        <line x1="45" y1="85" x2={width - 45} y2="85" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="130 15 130 15 130" />
        <text x="30" y="89" fill="#2563EB" fontSize="13" fontWeight="900" textAnchor="middle font-mono">-</text>
        <text x={width - 30} y="89" fill="#2563EB" fontSize="13" fontWeight="900" textAnchor="middle font-mono">-</text>

        {/* Top Power Rail Tie-Point Holes */}
        {Array.from({ length: cols }).map((_, i) => {
          const cx = startX + i * colSpacing;
          return (
            <g key={`top-power-${i}`}>
              {/* Positive Power Hole */}
              <rect
                x={cx - 4}
                y={48}
                width="8"
                height="8"
                rx="1.5"
                fill="url(#socketHole)"
                stroke="#B91C1C"
                strokeWidth="0.8"
              />
              {/* Negative Ground Hole */}
              <rect
                x={cx - 4}
                y={73}
                width="8"
                height="8"
                rx="1.5"
                fill="url(#socketHole)"
                stroke="#1D4ED8"
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* ================= TERMINAL STRIP (TOP: A - E) ================= */}
        {/* Column Numbers Above Row A */}
        {Array.from({ length: cols }).map((_, i) => {
          const cx = startX + i * colSpacing;
          const colNum = i + 1;
          const isMarked = colNum === 1 || colNum % 5 === 0;
          return (
            <text
              key={`col-label-top-${i}`}
              x={cx}
              y="114"
              textAnchor="middle"
              fill={isMarked ? '#1E293B' : '#94A3B8'}
              fontSize={isMarked ? '10' : '8'}
              fontWeight={isMarked ? '800' : '500'}
              className="font-mono"
            >
              {colNum}
            </text>
          );
        })}

        {/* Row Labels (a, b, c, d, e) Left & Right */}
        {rowLabelsTop.map((lbl, rIdx) => {
          const ry = rowYTop[rIdx];
          return (
            <g key={`row-lbl-top-${lbl}`}>
              <text x="35" y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
              <text x={width - 35} y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
            </g>
          );
        })}

        {/* Grid Holes Top Terminal (a - e) */}
        {rowYTop.map((ry, rIdx) => (
          <g key={`row-holes-top-${rIdx}`}>
            {Array.from({ length: cols }).map((_, cIdx) => {
              const cx = startX + cIdx * colSpacing;
              return (
                <rect
                  key={`hole-top-${rIdx}-${cIdx}`}
                  x={cx - 4.5}
                  y={ry - 4.5}
                  width="9"
                  height="9"
                  rx="1.5"
                  fill="url(#socketHole)"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        ))}

        {/* ================= CENTER DIVIDER TRENCH ================= */}
        <rect
          x="30"
          y="262"
          width={width - 60}
          height="18"
          rx="3"
          fill="url(#trenchShadow)"
          stroke="#94A3B8"
          strokeWidth="1"
        />
        <line x1="35" y1="271" x2={width - 35} y2="271" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" />
        <text
          x={width / 2}
          y="275"
          textAnchor="middle"
          fill="#475569"
          fontSize="8"
          fontWeight="800"
          letterSpacing="1"
          className="font-mono uppercase"
        >
          IC DIP SOCKET TRENCH
        </text>

        {/* ================= TERMINAL STRIP (BOTTOM: F - J) ================= */}
        {/* Row Labels (f, g, h, i, j) Left & Right */}
        {rowLabelsBottom.map((lbl, rIdx) => {
          const ry = rowYBottom[rIdx];
          return (
            <g key={`row-lbl-bot-${lbl}`}>
              <text x="35" y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
              <text x={width - 35} y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
            </g>
          );
        })}

        {/* Grid Holes Bottom Terminal (f - j) */}
        {rowYBottom.map((ry, rIdx) => (
          <g key={`row-holes-bot-${rIdx}`}>
            {Array.from({ length: cols }).map((_, cIdx) => {
              const cx = startX + cIdx * colSpacing;
              return (
                <rect
                  key={`hole-bot-${rIdx}-${cIdx}`}
                  x={cx - 4.5}
                  y={ry - 4.5}
                  width="9"
                  height="9"
                  rx="1.5"
                  fill="url(#socketHole)"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        ))}

        {/* Column Numbers Below Row J */}
        {Array.from({ length: cols }).map((_, i) => {
          const cx = startX + i * colSpacing;
          const colNum = i + 1;
          const isMarked = colNum === 1 || colNum % 5 === 0;
          return (
            <text
              key={`col-label-bot-${i}`}
              x={cx}
              y="432"
              textAnchor="middle"
              fill={isMarked ? '#1E293B' : '#94A3B8'}
              fontSize={isMarked ? '10' : '8'}
              fontWeight={isMarked ? '800' : '500'}
              className="font-mono"
            >
              {colNum}
            </text>
          );
        })}

        {/* ================= BOTTOM POWER RAIL ================= */}
        {/* Red (+) Stripe */}
        <line x1="45" y1="460" x2={width - 45} y2="460" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="130 15 130 15 130" />
        <text x="30" y="464" fill="#DC2626" fontSize="13" fontWeight="900" textAnchor="middle font-mono">+</text>
        <text x={width - 30} y="464" fill="#DC2626" fontSize="13" fontWeight="900" textAnchor="middle font-mono">+</text>

        {/* Blue (-) Stripe */}
        <line x1="45" y1="505" x2={width - 45} y2="505" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="130 15 130 15 130" />
        <text x="30" y="509" fill="#2563EB" fontSize="13" fontWeight="900" textAnchor="middle font-mono">-</text>
        <text x={width - 30} y="509" fill="#2563EB" fontSize="13" fontWeight="900" textAnchor="middle font-mono">-</text>

        {/* Bottom Power Rail Tie-Point Holes */}
        {Array.from({ length: cols }).map((_, i) => {
          const cx = startX + i * colSpacing;
          return (
            <g key={`bot-power-${i}`}>
              {/* Positive Power Hole */}
              <rect
                x={cx - 4}
                y={468}
                width="8"
                height="8"
                rx="1.5"
                fill="url(#socketHole)"
                stroke="#B91C1C"
                strokeWidth="0.8"
              />
              {/* Negative Ground Hole */}
              <rect
                x={cx - 4}
                y={493}
                width="8"
                height="8"
                rx="1.5"
                fill="url(#socketHole)"
                stroke="#1D4ED8"
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* Power Status LED Indicators (Optional Visual Craft) */}
        {showPowerLeds && (
          <g>
            <circle cx="20" cy="20" r="4" fill="#10B981" className="animate-pulse" />
            <circle cx="20" cy="20" r="7" stroke="#059669" strokeWidth="1" fill="none" />
            <text x="30" y="23" fill="#059669" fontSize="8" fontWeight="800" className="font-mono">
              +5V VCC ACTIVE
            </text>
          </g>
        )}
      </svg>
    );
  };

  const renderBreadboard170 = () => {
    const cols = 17;
    const colSpacing = 28;
    const startX = 50;
    const rowLabelsTop = ['a', 'b', 'c', 'd', 'e'];
    const rowLabelsBottom = ['f', 'g', 'h', 'i', 'j'];
    const rowYTop = [80, 108, 136, 164, 192];
    const rowYBottom = [248, 276, 304, 332, 360];

    const width = 560;
    const height = 420;

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="drop-shadow-lg select-none"
      >
        <defs>
          <radialGradient id="socketHole170" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#64748B" />
          </radialGradient>
          <linearGradient id="bbBase170" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Outer Plastic Body */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="14"
          fill="url(#bbBase170)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* Title Header */}
        <text
          x={width / 2}
          y="22"
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
          fontWeight="800"
          letterSpacing="1.5"
          className="font-mono uppercase"
        >
          MINI 170 TIE-POINTS BREADBOARD
        </text>

        {/* Column Numbers Top */}
        {Array.from({ length: cols }).map((_, i) => {
          const cx = startX + i * colSpacing;
          const colNum = i + 1;
          const isMarked = colNum === 1 || colNum % 5 === 0;
          return (
            <text
              key={`col-170-top-${i}`}
              x={cx}
              y="60"
              textAnchor="middle"
              fill={isMarked ? '#1E293B' : '#94A3B8'}
              fontSize={isMarked ? '10' : '8'}
              fontWeight={isMarked ? '800' : '500'}
              className="font-mono"
            >
              {colNum}
            </text>
          );
        })}

        {/* Row Labels (a - e) */}
        {rowLabelsTop.map((lbl, rIdx) => {
          const ry = rowYTop[rIdx];
          return (
            <g key={`row-lbl-170-top-${lbl}`}>
              <text x="25" y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
              <text x={width - 25} y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
            </g>
          );
        })}

        {/* Grid Holes Top Terminal (a - e) */}
        {rowYTop.map((ry, rIdx) => (
          <g key={`holes-170-top-${rIdx}`}>
            {Array.from({ length: cols }).map((_, cIdx) => {
              const cx = startX + cIdx * colSpacing;
              return (
                <rect
                  key={`hole-170-top-${rIdx}-${cIdx}`}
                  x={cx - 4.5}
                  y={ry - 4.5}
                  width="9"
                  height="9"
                  rx="1.5"
                  fill="url(#socketHole170)"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        ))}

        {/* Center Trench */}
        <rect
          x="20"
          y="212"
          width={width - 40}
          height="16"
          rx="3"
          fill="#CBD5E1"
          stroke="#94A3B8"
          strokeWidth="1"
        />

        {/* Row Labels (f - j) */}
        {rowLabelsBottom.map((lbl, rIdx) => {
          const ry = rowYBottom[rIdx];
          return (
            <g key={`row-lbl-170-bot-${lbl}`}>
              <text x="25" y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
              <text x={width - 25} y={ry + 3} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" className="font-mono">
                {lbl}
              </text>
            </g>
          );
        })}

        {/* Grid Holes Bottom Terminal (f - j) */}
        {rowYBottom.map((ry, rIdx) => (
          <g key={`holes-170-bot-${rIdx}`}>
            {Array.from({ length: cols }).map((_, cIdx) => {
              const cx = startX + cIdx * colSpacing;
              return (
                <rect
                  key={`hole-170-bot-${rIdx}-${cIdx}`}
                  x={cx - 4.5}
                  y={ry - 4.5}
                  width="9"
                  height="9"
                  rx="1.5"
                  fill="url(#socketHole170)"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        ))}

        {/* Column Numbers Bottom */}
        {Array.from({ length: cols }).map((_, i) => {
          const cx = startX + i * colSpacing;
          const colNum = i + 1;
          const isMarked = colNum === 1 || colNum % 5 === 0;
          return (
            <text
              key={`col-170-bot-${i}`}
              x={cx}
              y="388"
              textAnchor="middle"
              fill={isMarked ? '#1E293B' : '#94A3B8'}
              fontSize={isMarked ? '10' : '8'}
              fontWeight={isMarked ? '800' : '500'}
              className="font-mono"
            >
              {colNum}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
        transformOrigin: '0 0',
      }}
    >
      <div className="absolute top-8 left-8">
        {type === 'breadboard-400' && renderBreadboard400()}
        {type === 'breadboard-170' && renderBreadboard170()}
      </div>
    </div>
  );
};
