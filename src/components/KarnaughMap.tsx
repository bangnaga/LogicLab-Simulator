import React, { useState, useMemo } from 'react';
import { BooleanMath } from './BooleanMath';
import {
  Grid,
  Sparkles,
  Zap,
  Info,
  Layers,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface KarnaughMapProps {
  initialVariableCount?: 2 | 3 | 4;
  inputNames?: string[];
  outputName?: string;
  externalGridValues?: number[]; // Values array in minterm index order (0 to 2^numVars - 1)
  onGridChange?: (newValues: number[]) => void;
}

// Gray Code mapping helpers
const GRAY_CODE_2 = ['0', '1'];
const GRAY_CODE_4 = ['00', '01', '11', '10'];

// Minterm index calculation from row and col binary representations
const getMintermIndex3Var = (rowIdx: number, colIdx: number): number => {
  // Row: A (0 or 1)
  // Col: BC (00=0, 01=1, 11=3, 10=2)
  const colVal = [0, 1, 3, 2][colIdx];
  return (rowIdx << 2) | colVal;
};

const getMintermIndex4Var = (rowIdx: number, colIdx: number): number => {
  // Row: AB (00=0, 01=1, 11=3, 10=2)
  // Col: CD (00=0, 01=1, 11=3, 10=2)
  const rowVal = [0, 1, 3, 2][rowIdx];
  const colVal = [0, 1, 3, 2][colIdx];
  return (rowVal << 2) | colVal;
};

const getMintermIndex2Var = (rowIdx: number, colIdx: number): number => {
  // Row: A (0 or 1)
  // Col: B (0 or 1)
  return (rowIdx << 1) | colIdx;
};

// Color palettes for K-map cell grouping visualization
const GROUP_COLORS = [
  { bg: 'bg-blue-500/20', border: 'border-blue-500 text-blue-700', badge: 'bg-blue-600 text-white' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500 text-emerald-700', badge: 'bg-emerald-600 text-white' },
  { bg: 'bg-amber-500/20', border: 'border-amber-500 text-amber-700', badge: 'bg-amber-600 text-white' },
  { bg: 'bg-rose-500/20', border: 'border-rose-500 text-rose-700', badge: 'bg-rose-600 text-white' },
  { bg: 'bg-purple-500/20', border: 'border-purple-500 text-purple-700', badge: 'bg-purple-600 text-white' },
  { bg: 'bg-cyan-500/20', border: 'border-cyan-500 text-cyan-700', badge: 'bg-cyan-600 text-white' },
];

export const KarnaughMap: React.FC<KarnaughMapProps> = ({
  initialVariableCount = 3,
  inputNames = ['A', 'B', 'C', 'D'],
  outputName = 'Y',
  externalGridValues,
  onGridChange,
}) => {
  const [numVars, setNumVars] = useState<2 | 3 | 4>(initialVariableCount);

  // Internal cell values state (0, 1, or -1 for X/don't care)
  const totalCells = 1 << numVars;
  const [internalValues, setInternalValues] = useState<number[]>(() => {
    if (externalGridValues && externalGridValues.length === totalCells) {
      return [...externalGridValues];
    }
    // Default example: 3-var majority gate (1 when at least two inputs are 1)
    if (numVars === 3) return [0, 0, 0, 1, 0, 1, 1, 1];
    if (numVars === 2) return [0, 1, 1, 1]; // OR gate
    return [0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]; // 4-var
  });

  // Effective values array
  const values = externalGridValues && externalGridValues.length === totalCells ? externalGridValues : internalValues;

  const handleCellClick = (mintermIndex: number) => {
    const nextVal = values[mintermIndex] === 1 ? 0 : 1;
    const newArr = [...values];
    newArr[mintermIndex] = nextVal;
    setInternalValues(newArr);
    if (onGridChange) onGridChange(newArr);
  };

  const handleReset = (val: number) => {
    const newArr = new Array(1 << numVars).fill(val);
    setInternalValues(newArr);
    if (onGridChange) onGridChange(newArr);
  };

  // Variable Labeling
  const varA = inputNames[0] || 'A';
  const varB = inputNames[1] || 'B';
  const varC = inputNames[2] || 'C';
  const varD = inputNames[3] || 'D';

  // Compute active minterms list (m0, m1, ...)
  const activeMinterms = useMemo(() => {
    const list: number[] = [];
    values.forEach((v, idx) => {
      if (v === 1) list.push(idx);
    });
    return list;
  }, [values]);

  // Simplify Boolean SOP Expression from K-Map Values
  const { simplifiedSOP, groupTerms } = useMemo(() => {
    if (activeMinterms.length === 0) {
      return { simplifiedSOP: '0', groupTerms: [] };
    }
    if (activeMinterms.length === (1 << numVars)) {
      return { simplifiedSOP: '1', groupTerms: [{ term: '1', minterms: activeMinterms }] };
    }

    // Heuristic Grouping / Quine-McCluskey Reduction for K-Map Display
    const terms: { term: string; latexTerm: string; minterms: number[] }[] = [];

    // Helper to format a product term for 2, 3, or 4 variables
    const getTermForMask = (maskVal: number, dontCareMask: number): { text: string; latex: string } => {
      let text = '';
      let latex = '';

      const vars = numVars === 2 ? [varA, varB] : numVars === 3 ? [varA, varB, varC] : [varA, varB, varC, varD];

      for (let i = 0; i < numVars; i++) {
        const bitPos = numVars - 1 - i;
        const isCare = !((dontCareMask >> bitPos) & 1);

        if (isCare) {
          const bitVal = (maskVal >> bitPos) & 1;
          const vName = vars[i];
          if (bitVal === 1) {
            text += vName;
            latex += vName;
          } else {
            text += vName + "'";
            latex += `\\overline{${vName}}`;
          }
        }
      }

      return { text: text || '1', latex: latex || '1' };
    };

    // Find prime implicants
    const primeImplicants: { maskVal: number; dontCareMask: number; minterms: number[] }[] = [];

    // Check sizes 16, 8, 4, 2, 1
    const totalCount = 1 << numVars;
    for (let dcMask = totalCount - 1; dcMask >= 0; dcMask--) {
      // Number of don't care bits in group = size of group (2^popcount)
      const groupSize = 1 << dcMask.toString(2).replace(/0/g, '').length;

      for (let maskVal = 0; maskVal < totalCount; maskVal++) {
        // If maskVal overlaps with dcMask, skip duplicates
        if ((maskVal & dcMask) !== 0) continue;

        // Check if all minterms in this hypercube are 1
        let valid = true;
        const coveredMinterms: number[] = [];

        for (let sub = 0; sub < totalCount; sub++) {
          if ((sub & ~dcMask) === maskVal) {
            coveredMinterms.push(sub);
            if (values[sub] !== 1) {
              valid = false;
              break;
            }
          }
        }

        if (valid && coveredMinterms.length > 0) {
          // Check if already covered by an existing larger prime implicant
          const isRedundant = primeImplicants.some((pi) =>
            coveredMinterms.every((m) => pi.minterms.includes(m))
          );

          if (!isRedundant) {
            primeImplicants.push({
              maskVal,
              dontCareMask: dcMask,
              minterms: coveredMinterms,
            });
          }
        }
      }
    }

    // Filter essential prime implicants covering all ones
    const uncovered = new Set(activeMinterms);
    const selectedPIs: typeof primeImplicants = [];

    // Sort by largest group size first
    primeImplicants.sort((a, b) => b.minterms.length - a.minterms.length);

    for (const pi of primeImplicants) {
      if (pi.minterms.some((m) => uncovered.has(m))) {
        selectedPIs.push(pi);
        pi.minterms.forEach((m) => uncovered.delete(m));
      }
    }

    const latexTerms = selectedPIs.map((pi) => {
      const { latex } = getTermForMask(pi.maskVal, pi.dontCareMask);
      return {
        term: latex,
        minterms: pi.minterms,
      };
    });

    const finalLatex = latexTerms.map((t) => t.term).join(' + ') || '0';

    return {
      simplifiedSOP: finalLatex,
      groupTerms: latexTerms,
    };
  }, [values, numVars, activeMinterms, varA, varB, varC, varD]);

  // Presets selector
  const loadPreset = (presetType: string) => {
    if (presetType === 'majority') {
      setNumVars(3);
      setInternalValues([0, 0, 0, 1, 0, 1, 1, 1]);
    } else if (presetType === 'xor3') {
      setNumVars(3);
      setInternalValues([0, 1, 1, 0, 1, 0, 0, 1]);
    } else if (presetType === 'fulladder_carry') {
      setNumVars(3);
      setInternalValues([0, 0, 0, 1, 0, 1, 1, 1]);
    } else if (presetType === 'fulladder_sum') {
      setNumVars(3);
      setInternalValues([0, 1, 1, 0, 1, 0, 0, 1]);
    } else if (presetType === 'parity4') {
      setNumVars(4);
      const arr = new Array(16).fill(0).map((_, i) => (i.toString(2).split('1').length - 1) % 2);
      setInternalValues(arr);
    }
  };

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-xl p-4 space-y-4 shadow-sm text-[#1A1C1E]">
      {/* K-Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[#2563EB] text-white rounded-lg shadow-xs">
            <Grid className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1C1E] font-mono">
              Interaktif Karnaugh Map ({numVars}-Variabel)
            </h3>
            <span className="text-[10px] text-[#64748B]">
              Penyederhanaan Otomatis Aljabar Boolean SOP & Minterm
            </span>
          </div>
        </div>

        {/* Variable Count Switcher */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#CBD5E1]">
          {[2, 3, 4].map((v) => (
            <button
              key={v}
              onClick={() => {
                setNumVars(v as 2 | 3 | 4);
                setInternalValues(new Array(1 << v).fill(0));
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                numVars === v
                  ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                  : 'text-[#64748B] hover:text-[#1A1C1E]'
              }`}
            >
              {v} Var
            </button>
          ))}
        </div>
      </div>

      {/* Preset Fast Actions */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-[#64748B]">
        <span className="font-bold text-[#1A1C1E] flex items-center gap-1">
          <Sliders className="w-3 h-3 text-[#2563EB]" /> Contoh Preset:
        </span>
        <button
          onClick={() => loadPreset('majority')}
          className="px-2 py-0.5 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1D4ED8] font-bold border border-[#CBD5E1]"
        >
          Majority Gate
        </button>
        <button
          onClick={() => loadPreset('fulladder_sum')}
          className="px-2 py-0.5 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1D4ED8] font-bold border border-[#CBD5E1]"
        >
          Adder Sum
        </button>
        <button
          onClick={() => loadPreset('parity4')}
          className="px-2 py-0.5 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1D4ED8] font-bold border border-[#CBD5E1]"
        >
          4-Var Parity
        </button>
        <button
          onClick={() => handleReset(0)}
          className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 ml-auto"
        >
          Reset 0
        </button>
        <button
          onClick={() => handleReset(1)}
          className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200"
        >
          Set 1
        </button>
      </div>

      {/* Interactive K-Map Grid */}
      <div className="overflow-x-auto p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl flex flex-col items-center justify-center min-h-[220px]">
        {/* 2-VARIABLE K-MAP GRID */}
        {numVars === 2 && (
          <table className="border-collapse text-center font-mono text-xs select-none shadow-sm">
            <thead>
              <tr>
                <th className="p-2 border border-[#CBD5E1] bg-[#E2E8F0] text-[#475569] font-bold italic">
                  {varA} \ {varB}
                </th>
                <th className="p-2.5 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                  {varB}=0
                </th>
                <th className="p-2.5 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                  {varB}=1
                </th>
              </tr>
            </thead>
            <tbody>
              {[0, 1].map((rIdx) => (
                <tr key={rIdx}>
                  <td className="p-2.5 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                    {varA}={rIdx}
                  </td>
                  {[0, 1].map((cIdx) => {
                    const mIdx = getMintermIndex2Var(rIdx, cIdx);
                    const val = values[mIdx] ?? 0;
                    return (
                      <td key={cIdx} className="p-1 border border-[#CBD5E1] bg-white relative">
                        <button
                          onClick={() => handleCellClick(mIdx)}
                          className={`w-14 h-12 rounded-lg font-black text-sm flex flex-col items-center justify-center transition-all shadow-2xs ${
                            val === 1
                              ? 'bg-[#2563EB] text-white ring-2 ring-blue-400 scale-102'
                              : 'bg-white hover:bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          <span>{val}</span>
                          <span className="text-[9px] font-normal opacity-70">m{mIdx}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 3-VARIABLE K-MAP GRID */}
        {numVars === 3 && (
          <table className="border-collapse text-center font-mono text-xs select-none shadow-sm">
            <thead>
              <tr>
                <th className="p-2.5 border border-[#CBD5E1] bg-[#E2E8F0] text-[#475569] font-bold italic">
                  {varA} \ {varB}{varC}
                </th>
                {GRAY_CODE_4.map((code) => (
                  <th key={code} className="p-2.5 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1].map((rIdx) => (
                <tr key={rIdx}>
                  <td className="p-2.5 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                    {varA}={rIdx}
                  </td>
                  {[0, 1, 2, 3].map((cIdx) => {
                    const mIdx = getMintermIndex3Var(rIdx, cIdx);
                    const val = values[mIdx] ?? 0;

                    // Group highlight matching
                    const matchingGroupIdx = groupTerms.findIndex((gt) => gt.minterms.includes(mIdx));
                    const groupColor = matchingGroupIdx !== -1 ? GROUP_COLORS[matchingGroupIdx % GROUP_COLORS.length] : null;

                    return (
                      <td
                        key={cIdx}
                        className={`p-1 border border-[#CBD5E1] relative transition-all ${
                          groupColor ? groupColor.bg : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={() => handleCellClick(mIdx)}
                          className={`w-14 h-12 rounded-lg font-black text-sm flex flex-col items-center justify-center transition-all shadow-2xs relative ${
                            val === 1
                              ? 'bg-[#2563EB] text-white ring-2 ring-blue-400'
                              : 'bg-white hover:bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          <span>{val}</span>
                          <span className="text-[9px] font-normal opacity-70">m{mIdx}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 4-VARIABLE K-MAP GRID */}
        {numVars === 4 && (
          <table className="border-collapse text-center font-mono text-xs select-none shadow-sm">
            <thead>
              <tr>
                <th className="p-2 border border-[#CBD5E1] bg-[#E2E8F0] text-[#475569] font-bold italic">
                  {varA}{varB} \ {varC}{varD}
                </th>
                {GRAY_CODE_4.map((code) => (
                  <th key={code} className="p-2 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3].map((rIdx) => (
                <tr key={rIdx}>
                  <td className="p-2 border border-[#CBD5E1] bg-[#F1F5F9] text-[#1A1C1E] font-bold">
                    {GRAY_CODE_4[rIdx]}
                  </td>
                  {[0, 1, 2, 3].map((cIdx) => {
                    const mIdx = getMintermIndex4Var(rIdx, cIdx);
                    const val = values[mIdx] ?? 0;

                    const matchingGroupIdx = groupTerms.findIndex((gt) => gt.minterms.includes(mIdx));
                    const groupColor = matchingGroupIdx !== -1 ? GROUP_COLORS[matchingGroupIdx % GROUP_COLORS.length] : null;

                    return (
                      <td
                        key={cIdx}
                        className={`p-1 border border-[#CBD5E1] relative transition-all ${
                          groupColor ? groupColor.bg : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={() => handleCellClick(mIdx)}
                          className={`w-12 h-10 rounded-lg font-black text-xs flex flex-col items-center justify-center transition-all shadow-2xs ${
                            val === 1
                              ? 'bg-[#2563EB] text-white ring-2 ring-blue-400'
                              : 'bg-white hover:bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          <span>{val}</span>
                          <span className="text-[8px] font-normal opacity-70">m{mIdx}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resulting Reduced SOP Boolean Expression */}
      <div className="bg-[#0F172A] text-white p-3.5 rounded-xl border border-[#334155] space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Hasil Penyederhanaan Minimal (SOP):
          </span>
          <span className="text-slate-400 text-[10px]">
            Minterm: &sum; m({activeMinterms.join(', ') || 'kosong'})
          </span>
        </div>

        <div className="bg-[#1E293B] p-3 rounded-lg border border-slate-700 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-300">
            <span>{outputName} =</span>
            <BooleanMath latex={simplifiedSOP} className="text-amber-300 font-extrabold text-base" />
          </div>
        </div>

        {/* Group Breakdown Tags */}
        {groupTerms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-mono">Kelompok Minterm:</span>
            {groupTerms.map((gt, i) => {
              const color = GROUP_COLORS[i % GROUP_COLORS.length];
              return (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${color.badge}`}
                >
                  <BooleanMath latex={gt.term} />
                  <span className="text-[9px] opacity-85">(m{gt.minterms.join(',')})</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
