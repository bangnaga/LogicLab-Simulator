import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { PracticumModule, AutoGradeResult } from '../../types';
import { LogicNodeData, runAutoGrade } from '../../utils/logicEngine';
import confetti from 'canvas-confetti';
import { Play, CheckCircle2, XCircle, Award, ArrowRight, Activity, Zap, RefreshCw } from 'lucide-react';

interface OperatePhaseProps {
  module: PracticumModule;
  nodes: Node<LogicNodeData>[];
  edges: Edge[];
  gradeResult: AutoGradeResult | undefined;
  setGradeResult: (res: AutoGradeResult) => void;
  onNextPhase: () => void;
}

export const OperatePhase: React.FC<OperatePhaseProps> = ({
  module,
  nodes,
  edges,
  gradeResult,
  setGradeResult,
  onNextPhase,
}) => {
  const [isGrading, setIsGrading] = useState(false);

  const handleRunAutoGrading = () => {
    setIsGrading(true);
    setTimeout(() => {
      const res = runAutoGrade(module, nodes, edges);
      setGradeResult(res);
      setIsGrading(false);

      if (res.passed) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">
            Modul Aktif: {module.code} - {module.title}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#1A1C1E]">Penguji Tabel Kebenaran & Validasi Otomatis</h2>
        <p className="text-[#64748B] text-sm mt-1">
          Uji fungsionalitas sinyal sirkuit pada canvas secara *real-time* terhadap seluruh $2^n$ kombinasi tabel kebenaran untuk modul {module.code}.
        </p>
      </div>

      {/* Auto-Grading Action & Summary Header */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-[#1A1C1E] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2563EB]" /> Penilaian Otomatis (Auto-Grading Engine)
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Evaluasi otomatis akan mensimulasikan seluruh sinyal masukan untuk memvalidasi presisi output sirkuit.
          </p>
        </div>

        <button
          onClick={handleRunAutoGrading}
          disabled={isGrading}
          className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          {isGrading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Mengevaluasi Sinyal...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Jalankan Pengujian Otomatis
            </>
          )}
        </button>
      </div>

      {/* Grade Result Dashboard Card */}
      {gradeResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div
              className={`p-6 rounded-xl border text-center space-y-2 flex flex-col items-center justify-center shadow-sm ${
                gradeResult.passed
                  ? 'bg-emerald-50 border-emerald-300 text-[#1A1C1E]'
                  : 'bg-red-50 border-red-300 text-[#1A1C1E]'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Skor Pengujian Simulator</div>
              <div
                className={`text-5xl font-black font-mono ${
                  gradeResult.passed ? 'text-emerald-700' : 'text-[#DC2626]'
                }`}
              >
                {gradeResult.percentage}%
              </div>
              <div
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  gradeResult.passed
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-[#DC2626] text-white font-bold'
                }`}
              >
                {gradeResult.passed ? 'LULUS (100% PRESI)' : 'PERLU REVISI SIRKUIT'}
              </div>
            </div>

            {/* Diagnostics Feedback */}
            <div className="md:col-span-2 bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2563EB]" /> Catatan Evaluasi Simulator
              </h4>
              <ul className="space-y-2 text-xs text-[#1A1C1E]">
                {gradeResult.feedback.map((msg, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    <Zap className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Test Matrix Log Table */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Log Matriks Pengujian Input/Output ($2^n$ Combinations)
            </h4>

            <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="bg-[#F1F5F9] text-[#64748B] font-mono border-b border-[#CBD5E1]">
                    <th className="py-3 px-4 text-left">No. Uji</th>
                    <th className="py-3 px-4 text-[#D97706]">Keadaan Input</th>
                    <th className="py-3 px-4 text-[#4338CA]">Ekspektasi Output</th>
                    <th className="py-3 px-4 text-[#DC2626]">Output Aktual Sirkuit</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] font-mono">
                  {gradeResult.logs.map((log) => (
                    <tr key={log.testIndex} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-4 text-left font-bold text-[#64748B]">#{log.testIndex}</td>
                      <td className="py-2.5 px-4 text-[#1A1C1E]">
                        {Object.entries(log.inputState)
                          .map(([k, v]) => `${k}=${v}`)
                          .join(', ')}
                      </td>
                      <td className="py-2.5 px-4 text-[#4338CA] font-bold">
                        {Object.entries(log.expectedOutput)
                          .map(([k, v]) => `${k}=${v}`)
                          .join(', ')}
                      </td>
                      <td className="py-2.5 px-4 text-[#DC2626] font-bold">
                        {Object.entries(log.actualOutput)
                          .map(([k, v]) => `${k}=${v}`)
                          .join(', ')}
                      </td>
                      <td className="py-2.5 px-4">
                        {log.passed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#DC2626] font-bold">
                            <XCircle className="w-4 h-4 text-[#DC2626]" /> FAIL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Navigation to Phase K (Komunikasikan) */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNextPhase}
          className="px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          Lanjut ke Tahap K: Komunikasikan (Lab Report) <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
