import React, { useState } from 'react';
import { PracticumModule, TruthTableRow, LogicValue } from '../../types';
import { Table, BookOpen, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Cpu, Grid } from 'lucide-react';
import { KarnaughMap } from '../KarnaughMap';

interface FormulatePhaseProps {
  module: PracticumModule;
  draftedTruthTable: TruthTableRow[];
  setDraftedTruthTable: React.Dispatch<React.SetStateAction<TruthTableRow[]>>;
  onNextPhase: () => void;
}

export const FormulatePhase: React.FC<FormulatePhaseProps> = ({
  module,
  draftedTruthTable,
  setDraftedTruthTable,
  onNextPhase,
}) => {
  const [activeTab, setActiveTab] = useState<'truth-table' | 'k-map'>('truth-table');
  const [verificationResult, setVerificationResult] = useState<{
    checked: boolean;
    allCorrect: boolean;
    correctCount: number;
    total: number;
  }>({ checked: false, allCorrect: false, correctCount: 0, total: 0 });

  const handleCellToggle = (rowId: string, outputLabel: string) => {
    setDraftedTruthTable((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const currentOutputs = row.userOutputs || { ...row.expectedOutputs };
          const currentVal = currentOutputs[outputLabel] ?? 0;
          const newVal = (currentVal === 1 ? 0 : 1) as LogicValue;

          return {
            ...row,
            userOutputs: {
              ...currentOutputs,
              [outputLabel]: newVal,
            },
          };
        }
        return row;
      })
    );
    setVerificationResult({ checked: false, allCorrect: false, correctCount: 0, total: 0 });
  };

  const handleVerifyTable = () => {
    let correct = 0;
    const total = draftedTruthTable.length;

    draftedTruthTable.forEach((row) => {
      const userOut = row.userOutputs || row.expectedOutputs;
      let rowMatch = true;

      Object.entries(row.expectedOutputs).forEach(([key, expVal]) => {
        if ((userOut[key] ?? 0) !== expVal) {
          rowMatch = false;
        }
      });

      if (rowMatch) correct++;
    });

    setVerificationResult({
      checked: true,
      allCorrect: correct === total,
      correctCount: correct,
      total,
    });
  };

  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
            R
          </span>
          <span className="text-xs font-bold text-[#4338CA] uppercase tracking-widest font-mono">
            Tahap 2 dari 6: Rumuskan (Formulate Truth Table)
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1A1C1E]">Perumusan Tabel Kebenaran Teoritis</h2>
        <p className="text-[#475569] text-sm mt-1">
          Susun dan isi nilai keluaran logika teoritis berdasarkan perumusan aljabar Boolean sebelum merakit sirkuit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Truth Table & Karnaugh Map Drafter */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              {/* Tab Selector Buttons */}
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg border border-[#CBD5E1]">
                <button
                  onClick={() => setActiveTab('truth-table')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'truth-table'
                      ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                      : 'text-[#64748B] hover:text-[#1A1C1E]'
                  }`}
                >
                  <Table className="w-4 h-4" /> Tabel Kebenaran
                </button>
                <button
                  onClick={() => setActiveTab('k-map')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'k-map'
                      ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                      : 'text-[#64748B] hover:text-[#1A1C1E]'
                  }`}
                >
                  <Grid className="w-4 h-4" /> Karnaugh Map (K-Map)
                </button>
              </div>

              {activeTab === 'truth-table' && (
                <button
                  onClick={handleVerifyTable}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> Validasi Perumusan
                </button>
              )}
            </div>

            {/* Content for Truth Table Tab */}
            {activeTab === 'truth-table' ? (
              <>
                {/* Verification Alert Banner */}
                {verificationResult.checked && (
                  <div
                    className={`p-4 rounded-lg border flex items-center justify-between text-xs ${
                      verificationResult.allCorrect
                        ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                        : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {verificationResult.allCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold">
                          {verificationResult.allCorrect
                            ? 'Validasi Sempurna! '
                            : 'Ditemukan Ketidaksesuaian: '}
                        </span>
                        <span>
                          {verificationResult.correctCount} dari {verificationResult.total} kombinasi baris sesuai dengan rumus aljabar Boolean.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Truth Table Grid */}
                <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
                  <table className="w-full text-center text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-[#64748B] font-mono border-b border-[#E2E8F0]">
                        <th className="py-3 px-4 text-left">No. Baris</th>
                        {module.inputLabels.map((lbl) => (
                          <th key={lbl} className="py-3 px-4 text-[#D97706]">
                            Input ({lbl})
                          </th>
                        ))}
                        {module.outputLabels.map((lbl) => (
                          <th key={lbl} className="py-3 px-4 text-[#4338CA]">
                            Draft Output ({lbl})
                          </th>
                        ))}
                        <th className="py-3 px-4 text-[#64748B]">Status Teori</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] font-mono">
                      {draftedTruthTable.map((row, idx) => {
                        const userOuts = row.userOutputs || row.expectedOutputs;

                        return (
                          <tr key={row.id} className="hover:bg-[#F8FAFC]">
                            <td className="py-2.5 px-4 text-left text-[#94A3B8] font-bold">#{idx + 1}</td>
                            {module.inputLabels.map((lbl) => (
                              <td key={lbl} className="py-2.5 px-4 font-bold text-[#1A1C1E]">
                                <span className={`px-2 py-1 rounded ${row.inputs[lbl] === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                                  {row.inputs[lbl]}
                                </span>
                              </td>
                            ))}

                            {module.outputLabels.map((lbl) => {
                              const val = userOuts[lbl] ?? 0;
                              return (
                                <td key={lbl} className="py-2.5 px-4">
                                  <button
                                    onClick={() => handleCellToggle(row.id, lbl)}
                                    className={`px-3 py-1 rounded-md font-bold transition-all border ${
                                      val === 1
                                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                                        : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#475569] hover:bg-[#E2E8F0]'
                                    }`}
                                  >
                                    {val} (Klik Toggle)
                                  </button>
                                </td>
                              );
                            })}

                            <td className="py-2.5 px-4 text-[#64748B] text-[11px]">
                              {verificationResult.checked ? (
                                Object.entries(row.expectedOutputs).every(
                                  ([k, v]) => (userOuts[k] ?? 0) === v
                                ) ? (
                                  <span className="text-emerald-600 font-bold">✓ Sesuai</span>
                                ) : (
                                  <span className="text-rose-600 font-bold">✕ Mismatch</span>
                                )
                              ) : (
                                'Belum divalidasi'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Content for K-Map Tab */
              <KarnaughMap
                initialVariableCount={module.inputLabels.length >= 4 ? 4 : module.inputLabels.length >= 3 ? 3 : 2}
                inputNames={module.inputLabels}
                outputName={module.outputLabels[0] || 'Y'}
                externalGridValues={draftedTruthTable.map((r) => {
                  const outVal = r.userOutputs?.[module.outputLabels[0]] ?? r.expectedOutputs?.[module.outputLabels[0]] ?? 0;
                  return outVal;
                })}
                onGridChange={(newVals) => {
                  setDraftedTruthTable((prev) =>
                    prev.map((row, i) => ({
                      ...row,
                      userOutputs: {
                        ...(row.userOutputs || row.expectedOutputs),
                        [module.outputLabels[0]]: (newVals[i] ?? 0) as LogicValue,
                      },
                    }))
                  );
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column: Literature Module & Boolean Rules */}
        <div className="space-y-6">
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <BookOpen className="w-4 h-4 text-[#D97706]" /> Ringkasan Aljabar Boolean
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#D97706] block">Hukum De Morgan:</span>
                <p className="text-[#334155] font-mono">(A · B)' = A' + B'</p>
                <p className="text-[#334155] font-mono">(A + B)' = A' · B'</p>
              </div>

              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#4338CA] block">Identitas Gerbang Dasar:</span>
                <p className="text-[#334155] font-mono">A · 1 = A | A · 0 = 0</p>
                <p className="text-[#334155] font-mono">A + 0 = A | A + 1 = 1</p>
                <p className="text-[#334155] font-mono">A + A' = 1 | A · A' = 0</p>
              </div>

              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#2563EB] block">IC Rekomendasi Modul Ini:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {module.recommendedICs.map((ic) => (
                    <span key={ic} className="px-2 py-1 rounded bg-[#DBEAFE] font-mono font-bold text-[#1D4ED8] text-[11px]">
                      TTL 74{ic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNextPhase}
              className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              Lanjut ke Tahap U: Uraikan Pin IC <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
