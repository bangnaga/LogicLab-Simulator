import React from 'react';
import { BOOLEAN_IC_DATA, BooleanMath } from './BooleanMath';
import { Cpu, Info, CheckCircle2, Zap } from 'lucide-react';

interface ICPackageDiagramProps {
  icNumber: string; // e.g. '7408', '7432', '7404', '7400', '7402', '7486', '7474', '7476'
  activePinStates?: Record<number, number>; // pinNumber -> 0 or 1
  compact?: boolean;
  showDetails?: boolean;
}

export const ICPackageDiagram: React.FC<ICPackageDiagramProps> = ({
  icNumber,
  activePinStates = {},
  compact = false,
  showDetails = true,
}) => {
  const icKey = icNumber.replace('IC', '').replace('74', '').trim();
  const fullICKey = icKey.length <= 2 ? `74${icKey.padStart(2, '0')}` : icNumber;
  const icInfo = BOOLEAN_IC_DATA[fullICKey] || BOOLEAN_IC_DATA['7408'];

  // Pin state evaluator
  const getPinVal = (pin: number) => activePinStates[pin];

  // Helper to render standalone Logic Gate Symbol for the Left Panel
  const renderStandaloneGateSymbol = (type: string) => {
    switch (type) {
      case 'NOT':
        return (
          <svg className="w-48 h-28 mx-auto" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Input Line A */}
            <line x1="20" y1="50" x2="60" y2="50" stroke="#1E293B" />
            <text x="15" y="45" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>
            <text x="35" y="65" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            {/* Inverter Triangle */}
            <path d="M 60 20 L 130 50 L 60 80 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3" />
            <circle cx="138" cy="50" r="7" fill="#2563EB" stroke="#2563EB" />

            {/* Output Line Y */}
            <line x1="145" y1="50" x2="185" y2="50" stroke="#1E293B" />
            <text x="150" y="42" fill="#1D4ED8" fontSize="14" fontWeight="bold" fontFamily="monospace">A'</text>
            <text x="150" y="68" fill="#64748B" fontSize="10" fontFamily="sans-serif">OUT</text>
          </svg>
        );

      case 'OR':
        return (
          <svg className="w-56 h-28 mx-auto" viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Inputs A and B */}
            <line x1="20" y1="30" x2="70" y2="30" stroke="#1E293B" />
            <text x="10" y="34" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>
            <text x="35" y="24" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            <line x1="20" y1="70" x2="70" y2="70" stroke="#1E293B" />
            <text x="10" y="74" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">B</text>
            <text x="35" y="88" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            {/* OR Gate Body */}
            <path d="M 60 15 Q 100 50 60 85 Q 130 85 160 50 Q 130 15 60 15 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="3" />

            {/* Output Line Y */}
            <line x1="160" y1="50" x2="200" y2="50" stroke="#1E293B" />
            <text x="165" y="42" fill="#B45309" fontSize="14" fontWeight="bold" fontFamily="monospace">A + B</text>
            <text x="165" y="68" fill="#64748B" fontSize="10" fontFamily="sans-serif">OUT</text>
          </svg>
        );

      case 'NAND':
        return (
          <svg className="w-56 h-28 mx-auto" viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="20" y1="30" x2="60" y2="30" stroke="#1E293B" />
            <text x="10" y="34" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>
            <text x="35" y="24" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            <line x1="20" y1="70" x2="60" y2="70" stroke="#1E293B" />
            <text x="10" y="74" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">B</text>
            <text x="35" y="88" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            <path d="M 60 15 L 110 15 C 145 15 145 85 110 85 L 60 85 Z" fill="#ECFDF5" stroke="#059669" strokeWidth="3" />
            <circle cx="152" cy="50" r="6" fill="#059669" stroke="#059669" />

            <line x1="158" y1="50" x2="200" y2="50" stroke="#1E293B" />
            <text x="160" y="42" fill="#047857" fontSize="14" fontWeight="bold" fontFamily="monospace">(A.B)'</text>
            <text x="160" y="68" fill="#64748B" fontSize="10" fontFamily="sans-serif">OUT</text>
          </svg>
        );

      case 'NOR':
        return (
          <svg className="w-56 h-28 mx-auto" viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="20" y1="30" x2="70" y2="30" stroke="#1E293B" />
            <text x="10" y="34" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>

            <line x1="20" y1="70" x2="70" y2="70" stroke="#1E293B" />
            <text x="10" y="74" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">B</text>

            <path d="M 60 15 Q 100 50 60 85 Q 125 85 150 50 Q 125 15 60 15 Z" fill="#F3E8FF" stroke="#9333EA" strokeWidth="3" />
            <circle cx="156" cy="50" r="6" fill="#9333EA" stroke="#9333EA" />

            <line x1="162" y1="50" x2="200" y2="50" stroke="#1E293B" />
            <text x="165" y="42" fill="#7E22CE" fontSize="14" fontWeight="bold" fontFamily="monospace">(A+B)'</text>
          </svg>
        );

      case 'XOR':
        return (
          <svg className="w-56 h-28 mx-auto" viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="10" y1="30" x2="60" y2="30" stroke="#1E293B" />
            <text x="0" y="34" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>

            <line x1="10" y1="70" x2="60" y2="70" stroke="#1E293B" />
            <text x="0" y="74" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">B</text>

            <path d="M 50 15 Q 90 50 50 85" fill="none" stroke="#2563EB" strokeWidth="3" />
            <path d="M 62 15 Q 102 50 62 85 Q 132 85 162 50 Q 132 15 62 15 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3" />

            <line x1="162" y1="50" x2="200" y2="50" stroke="#1E293B" />
            <text x="165" y="42" fill="#1D4ED8" fontSize="14" fontWeight="bold" fontFamily="monospace">A ⊕ B</text>
          </svg>
        );

      case 'AND':
      default:
        return (
          <svg className="w-56 h-28 mx-auto" viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="20" y1="30" x2="60" y2="30" stroke="#1E293B" />
            <text x="10" y="34" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>
            <text x="35" y="24" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            <line x1="20" y1="70" x2="60" y2="70" stroke="#1E293B" />
            <text x="10" y="74" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="monospace">B</text>
            <text x="35" y="88" fill="#64748B" fontSize="10" fontFamily="sans-serif">IN</text>

            <path d="M 60 15 L 115 15 C 150 15 150 85 115 85 L 60 85 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3" />

            <line x1="150" y1="50" x2="195" y2="50" stroke="#1E293B" />
            <text x="155" y="42" fill="#1D4ED8" fontSize="14" fontWeight="bold" fontFamily="monospace">A . B</text>
            <text x="155" y="68" fill="#64748B" fontSize="10" fontFamily="sans-serif">OUT</text>
          </svg>
        );
    }
  };

  // Render Internal Gate Pinout Schematics inside the DIP IC Rectangle
  const renderInternalGateSchematic = () => {
    const is04 = fullICKey === '7404';
    const is02 = fullICKey === '7402';
    const is74 = fullICKey === '7474';
    const is76 = fullICKey === '7476';

    return (
      <svg className="w-full h-auto max-w-lg mx-auto select-none" viewBox="0 0 540 270" fill="none">
        {/* Main IC DIP-14 Package Rectangle Body */}
        <rect x="50" y="40" width="440" height="190" rx="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />

        {/* Left Orientation Notch (Semicircle) */}
        <path d="M 50 115 A 20 20 0 0 1 50 155 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />

        {/* VCC (+) and GND (-) Pin Indicators */}
        <g id="vcc-gnd-labels">
          <text x="80" y="75" fill="#DC2626" fontSize="13" fontWeight="900" fontFamily="monospace">Vcc</text>
          <text x="430" y="205" fill="#334155" fontSize="13" fontWeight="900" fontFamily="monospace">Gnd</text>

          {/* (+) Plus circle on VCC, (-) Minus circle on GND */}
          <circle cx="30" cy="40" r="14" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
          <text x="24" y="45" fill="#FFFFFF" fontSize="18" fontWeight="bold">+</text>

          <circle cx="510" cy="230" r="14" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
          <text x="505" y="234" fill="#FFFFFF" fontSize="18" fontWeight="bold">-</text>
        </g>

        {/* Top Pins (14 down to 8) */}
        {[14, 13, 12, 11, 10, 9, 8].map((pin, i) => {
          const x = 80 + i * 58;
          const val = getPinVal(pin);
          const isVcc = pin === 14;
          return (
            <g key={pin}>
              <rect
                x={x - 14}
                y="12"
                width="28"
                height="28"
                rx="4"
                fill={isVcc ? '#FEE2E2' : val === 1 ? '#D1FAE5' : '#F1F5F9'}
                stroke={isVcc ? '#DC2626' : val === 1 ? '#10B981' : '#0F172A'}
                strokeWidth="2.5"
              />
              <text x={x} y="31" fill="#0F172A" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {pin}
              </text>
              <line x1={x} y1="40" x2={x} y2="55" stroke="#0F172A" strokeWidth="3" />
            </g>
          );
        })}

        {/* Bottom Pins (1 to 7) */}
        {[1, 2, 3, 4, 5, 6, 7].map((pin, i) => {
          const x = 80 + i * 58;
          const val = getPinVal(pin);
          const isGnd = pin === 7;
          return (
            <g key={pin}>
              <line x1={x} y1="215" x2={x} y2="230" stroke="#0F172A" strokeWidth="3" />
              <rect
                x={x - 14}
                y="230"
                width="28"
                height="28"
                rx="4"
                fill={isGnd ? '#E2E8F0' : val === 1 ? '#D1FAE5' : '#F1F5F9'}
                stroke={isGnd ? '#475569' : val === 1 ? '#10B981' : '#0F172A'}
                strokeWidth="2.5"
              />
              <text x={x} y="249" fill="#0F172A" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {pin}
              </text>
            </g>
          );
        })}

        {/* Draw Internal Gate Symbols inside the IC Outline */}
        {is04 ? (
          // IC 7404 Hex Inverter Gates
          <g stroke="#0F172A" strokeWidth="2" fill="none">
            {/* Gate 1: Pin 1 -> 2 */}
            <path d="M 80 215 L 80 180 L 92 180" />
            <polygon points="92,165 120,180 92,195" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="125" cy="180" r="4" fill="#2563EB" stroke="#2563EB" />
            <path d="M 129 180 L 138 180 L 138 215" />

            {/* Gate 2: Pin 3 -> 4 */}
            <path d="M 196 215 L 196 180 L 208 180" />
            <polygon points="208,165 236,180 208,195" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="240" cy="180" r="4" fill="#2563EB" stroke="#2563EB" />
            <path d="M 244 180 L 254 180 L 254 215" />

            {/* Gate 3: Pin 5 -> 6 */}
            <path d="M 312 215 L 312 180 L 324 180" />
            <polygon points="324,165 352,180 324,195" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="356" cy="180" r="4" fill="#2563EB" stroke="#2563EB" />
            <path d="M 360 180 L 370 180 L 370 215" />

            {/* Gate 4: Pin 13 -> 12 */}
            <path d="M 138 55 L 138 90 L 150 90" />
            <polygon points="150,75 178,90 150,105" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="182" cy="90" r="4" fill="#2563EB" stroke="#2563EB" />
            <path d="M 186 90 L 196 90 L 196 55" />

            {/* Gate 5: Pin 11 -> 10 */}
            <path d="M 254 55 L 254 90 L 266 90" />
            <polygon points="266,75 294,90 266,105" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="298" cy="90" r="4" fill="#2563EB" stroke="#2563EB" />
            <path d="M 302 90 L 312 90 L 312 55" />

            {/* Gate 6: Pin 9 -> 8 */}
            <path d="M 370 55 L 370 90 L 382 90" />
            <polygon points="382,75 410,90 382,105" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <circle cx="414" cy="90" r="4" fill="#2563EB" stroke="#2563EB" />
            <path d="M 418 90 L 428 90 L 428 55" />
          </g>
        ) : is02 ? (
          // IC 7402 Quad 2-Input NOR Gates
          <g stroke="#0F172A" strokeWidth="2" fill="none">
            {/* Gate 1: (Pin 2 & 3) -> Pin 1 */}
            <path d="M 138 215 L 138 185 L 150 185" />
            <path d="M 196 215 L 196 165 L 150 165" />
            <path d="M 140 155 Q 160 175 140 195 Q 170 195 180 175 Q 170 155 140 155 Z" fill="#F3E8FF" stroke="#9333EA" />
            <circle cx="185" cy="175" r="4" fill="#9333EA" />
            <path d="M 189 175 L 205 175 L 205 140 L 80 140 L 80 215" />

            {/* Gate 2: (Pin 5 & 6) -> Pin 4 */}
            <path d="M 312 215 L 312 185 L 324 185" />
            <path d="M 370 215 L 370 165 L 324 165" />
            <path d="M 315 155 Q 335 175 315 195 Q 345 195 355 175 Q 345 155 315 155 Z" fill="#F3E8FF" stroke="#9333EA" />
            <circle cx="360" cy="175" r="4" fill="#9333EA" />
            <path d="M 364 175 L 380 175 L 380 140 L 254 140 L 254 215" />

            {/* Gate 3 & 4 on Top */}
            <path d="M 428 55 L 428 85 L 416 85" />
            <path d="M 370 55 L 370 105 L 416 105" />
            <path d="M 400 75 Q 420 95 400 115 Q 430 115 440 95 Q 430 75 400 75 Z" fill="#F3E8FF" stroke="#9333EA" />
            <circle cx="444" cy="95" r="4" fill="#9333EA" />
            <path d="M 448 95 L 460 95 L 460 125 L 312 125 L 312 55" />

            <path d="M 254 55 L 254 85 L 242 85" />
            <path d="M 196 55 L 196 105 L 242 105" />
            <path d="M 225 75 Q 245 95 225 115 Q 255 115 265 95 Q 255 75 225 75 Z" fill="#F3E8FF" stroke="#9333EA" />
            <circle cx="269" cy="95" r="4" fill="#9333EA" />
            <path d="M 273 95 L 285 95 L 285 125 L 138 125 L 138 55" />
          </g>
        ) : is74 || is76 ? (
          // Sequential Flip-Flops (7474 / 7476)
          <g stroke="#0F172A" strokeWidth="2">
            {/* Flip Flop Block 1 */}
            <rect x="90" y="80" width="130" height="110" rx="6" fill="#F8FAFC" stroke="#2563EB" strokeWidth="3" />
            <text x="155" y="105" fill="#1D4ED8" fontSize="13" fontWeight="bold" textAnchor="middle">
              {is74 ? 'D Flip-Flop 1' : 'JK Flip-Flop 1'}
            </text>

            {/* Flip Flop Block 2 */}
            <rect x="290" y="80" width="130" height="110" rx="6" fill="#F8FAFC" stroke="#2563EB" strokeWidth="3" />
            <text x="355" y="105" fill="#1D4ED8" fontSize="13" fontWeight="bold" textAnchor="middle">
              {is74 ? 'D Flip-Flop 2' : 'JK Flip-Flop 2'}
            </text>
          </g>
        ) : (
          // Standard Quad 2-Input Gates (7408 AND, 7432 OR, 7400 NAND, 7486 XOR)
          <g stroke="#0F172A" strokeWidth="2" fill="none">
            {/* Gate 1: (Pin 1 & 2) -> Pin 3 */}
            <path d="M 80 215 L 80 165 L 105 165" />
            <path d="M 138 215 L 138 185 L 105 185" />
            <path d="M 105 155 L 125 155 C 145 155 145 195 125 195 L 105 195 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            {fullICKey === '7400' && <circle cx="147" cy="175" r="4" fill="#059669" stroke="#059669" />}
            <path d={`M ${fullICKey === '7400' ? 151 : 142} 175 L 196 175 L 196 215`} />

            {/* Gate 2: (Pin 4 & 5) -> Pin 6 */}
            <path d="M 254 215 L 254 165 L 279 165" />
            <path d="M 312 215 L 312 185 L 279 185" />
            <path d="M 279 155 L 299 155 C 319 155 319 195 299 195 L 279 195 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            {fullICKey === '7400' && <circle cx="321" cy="175" r="4" fill="#059669" stroke="#059669" />}
            <path d={`M ${fullICKey === '7400' ? 325 : 316} 175 L 370 175 L 370 215`} />

            {/* Gate 3: (Pin 13 & 12) -> Pin 11 */}
            <path d="M 138 55 L 138 105 L 163 105" />
            <path d="M 196 55 L 196 85 L 163 85" />
            <path d="M 163 75 L 183 75 C 203 75 203 115 183 115 L 163 115 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            {fullICKey === '7400' && <circle cx="205" cy="95" r="4" fill="#059669" stroke="#059669" />}
            <path d={`M ${fullICKey === '7400' ? 209 : 200} 95 L 254 95 L 254 55`} />

            {/* Gate 4: (Pin 10 & 9) -> Pin 8 */}
            <path d="M 312 55 L 312 105 L 337 105" />
            <path d="M 370 55 L 370 85 L 337 85" />
            <path d="M 337 75 L 357 75 C 377 75 377 115 357 115 L 337 115 Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            {fullICKey === '7400' && <circle cx="379" cy="95" r="4" fill="#059669" stroke="#059669" />}
            <path d={`M ${fullICKey === '7400' ? 383 : 374} 95 L 428 95 L 428 55`} />
          </g>
        )}
      </svg>
    );
  };

  if (compact) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 shadow-md text-white font-mono">
        <div className="flex items-center justify-between border-b border-[#334155] pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold text-amber-400">IC {icInfo.icNumber}</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            DIP-14
          </span>
        </div>

        <div className="bg-[#0F172A] p-2 rounded-lg border border-[#334155] text-center my-2">
          <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">Persamaan Aljabar:</span>
          <BooleanMath latex={icInfo.latexFormula} className="text-amber-300 text-sm font-bold" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#CBD5E1] rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Main Dual Panel Grid (Matching Textbook Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT PANEL: Simbol gerbang, Tabel Kebenaran & Notasi Output Aljabar */}
        <div className="space-y-5 bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          {/* Header Title */}
          <div className="border-b border-[#CBD5E1] pb-2">
            <h3 className="text-base font-extrabold text-[#1A1C1E]">
              Simbol gerbang {icInfo.gateType}:
            </h3>
          </div>

          {/* Standalone Logic Gate Vector Diagram */}
          <div className="py-2 bg-white rounded-xl border border-[#CBD5E1] shadow-2xs">
            {renderStandaloneGateSymbol(icInfo.gateType)}
          </div>

          {/* Truth Table */}
          <div className="space-y-2">
            <table className="w-full text-xs font-mono border-collapse border border-[#CBD5E1] bg-white rounded-lg overflow-hidden shadow-2xs">
              <thead>
                <tr className="bg-[#E2E8F0] text-[#1A1C1E]">
                  <th colSpan={icInfo.gateType === 'NOT' ? 1 : 2} className="p-2 border border-[#CBD5E1] text-center font-bold">
                    IN
                  </th>
                  <th className="p-2 border border-[#CBD5E1] text-center font-bold bg-[#E0F2FE] text-[#0369A1]">
                    OUT
                  </th>
                </tr>
                <tr className="bg-[#F1F5F9] text-[#475569]">
                  {icInfo.gateType === 'NOT' ? (
                    <th className="p-1.5 border border-[#CBD5E1] text-center">A</th>
                  ) : (
                    <>
                      <th className="p-1.5 border border-[#CBD5E1] text-center">A</th>
                      <th className="p-1.5 border border-[#CBD5E1] text-center">B</th>
                    </>
                  )}
                  <th className="p-1.5 border border-[#CBD5E1] text-center">Y</th>
                </tr>
              </thead>
              <tbody>
                {icInfo.truthTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50">
                    {row.inputs.map((inVal, i) => (
                      <td key={i} className="p-1.5 border border-[#CBD5E1] text-center font-bold">
                        {inVal}
                      </td>
                    ))}
                    <td
                      className={`p-1.5 border border-[#CBD5E1] text-center font-bold ${
                        row.output === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {row.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Explanatory Text & Output Notation */}
          <div className="space-y-2 text-xs text-[#334155] leading-relaxed border-t border-[#CBD5E1] pt-3">
            <p className="font-medium">{icInfo.description}</p>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-900 font-medium">
              <span className="font-bold block text-blue-950 mb-1">Notasi Output Aljabar:</span>
              <span>
                Notasi output {icInfo.gateType} adalah{' '}
                <strong className="font-mono text-blue-900">{icInfo.logicDiagram || 'Y = A . B'}</strong>
              </span>
              <div className="mt-1 text-sm font-bold text-blue-950">
                <BooleanMath latex={icInfo.latexFormula} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Contoh IC Fisik TTL (3D Chip Photo + Internal Gate Schematic Diagram) */}
        <div className="space-y-5 bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          {/* Header Title */}
          <div className="border-b border-[#CBD5E1] pb-2 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1A1C1E]">
              Contoh IC {icInfo.gateType} / TTL Series:
            </h3>
            <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              SN74HC{icInfo.icNumber}N
            </span>
          </div>

          {/* 3D Realistic Physical IC Chip Visualizer */}
          <div className="bg-[#1E293B] p-4 rounded-xl border-2 border-[#334155] text-white font-mono flex items-center justify-between shadow-md">
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-extrabold block uppercase tracking-wider">
                Model Fisik IC Dual-In-Line (DIP-14)
              </span>
              <div className="text-sm font-extrabold text-white">SN74HC{icInfo.icNumber}N</div>
              <p className="text-[11px] text-slate-300">
                {icInfo.gateType === 'NOT'
                  ? '6 gerbang NOT (Hex Inverter)'
                  : icInfo.gateType === 'D-FF' || icInfo.gateType === 'JK-FF'
                  ? '2 Flip-Flop Industri'
                  : `4 gerbang ${icInfo.gateType} (Quad 2-Input)`}
              </p>
            </div>

            {/* 3D Rendered DIP Chip Graphic Representation */}
            <div className="w-28 h-16 bg-gradient-to-b from-[#334155] to-[#0F172A] rounded-md border-2 border-slate-600 shadow-xl relative flex flex-col justify-center items-center">
              <div className="absolute top-0 left-2 w-2 h-4 bg-slate-900 rounded-b-full border border-slate-700" />
              <span className="text-[9px] font-mono text-slate-300 font-bold tracking-tighter">SN74LS{icInfo.icNumber}N</span>
              <span className="text-[7px] font-mono text-slate-500">MALAYSIA 2604</span>

              {/* Pins sticking out top & bottom */}
              <div className="absolute -top-2 left-0 right-0 flex justify-between px-2">
                {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                  <span key={p} className="w-1.5 h-2 bg-slate-300 rounded-t-xs border-x stroke-slate-500" />
                ))}
              </div>
              <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-2">
                {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                  <span key={p} className="w-1.5 h-2 bg-slate-300 rounded-b-xs border-x stroke-slate-500" />
                ))}
              </div>
            </div>
          </div>

          {/* Internal Pinout Gate Diagram (Schematic Drawn INSIDE the IC Body) */}
          <div className="bg-white p-3 rounded-xl border border-[#CBD5E1] shadow-2xs">
            <span className="text-[11px] font-mono font-bold text-[#64748B] block mb-2 text-center uppercase tracking-wider">
              Diagram Pinout Internal & Tata Letak Gerbang (Internal Gate Schematic)
            </span>
            {renderInternalGateSchematic()}
          </div>
        </div>
      </div>
    </div>
  );
};
