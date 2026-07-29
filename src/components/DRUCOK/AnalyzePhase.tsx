import React, { useState } from 'react';
import { IC_DATASHEETS } from '../../data/icDatasheets';
import { ICPackageDiagram } from '../ICPackageDiagram';
import { BooleanMath } from '../BooleanMath';
import { Cpu, Activity, ArrowRight, Info, Zap, BookOpen } from 'lucide-react';

interface AnalyzePhaseProps {
  icAnalysisNotes: string;
  setIcAnalysisNotes: (notes: string) => void;
  onNextPhase: () => void;
}

export const AnalyzePhase: React.FC<AnalyzePhaseProps> = ({
  icAnalysisNotes,
  setIcAnalysisNotes,
  onNextPhase,
}) => {
  const [selectedChipNumber, setSelectedChipNumber] = useState<string>('7408');
  const [activePinNumber, setActivePinNumber] = useState<number | null>(1);

  const activeIC = IC_DATASHEETS.find((ic) => ic.chipNumber === selectedChipNumber) || IC_DATASHEETS[0];
  const activePin = activeIC.pins.find((p) => p.pinNumber === activePinNumber);

  const booleanLaws = [
    { title: 'De Morgan I', latex: '\\overline{A \\cdot B} = \\overline{A} + \\overline{B}' },
    { title: 'De Morgan II', latex: '\\overline{A + B} = \\overline{A} \\cdot \\overline{B}' },
    { title: 'Hukum Distribusi', latex: 'A \\cdot (B + C) = (A \\cdot B) + (A \\cdot C)' },
    { title: 'Hukum Absorpsi', latex: 'A + (A \\cdot B) = A' },
    { title: 'Hukum Komplementer', latex: 'A \\cdot \\overline{A} = 0, \\quad A + \\overline{A} = 1' },
    { title: 'Hukum Idempoten', latex: 'A \\cdot A = A, \\quad A + A = A' },
  ];

  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
            <Cpu className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">
            Katalog IC TTL Seri 74xx & Waveform Inspector
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#1A1C1E]">Datasheet Interaktif & Analisis Gelombang Logika</h2>
        <p className="text-[#64748B] text-sm mt-1">
          Pelajari tata letak fisik pin IC TTL 14-pin DIP, saluran VCC (+5V), GND (0V), dan siklus waktu gelombang sinyal (timing diagram).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Interactive IC Pinout & Gate Diagram */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-[#2563EB]" /> Datasheet IC TTL 14-Pin DIP & Simbol Gerbang Logika
              </div>

              {/* IC Selector Chips */}
              <div className="flex flex-wrap gap-1.5">
                {['7408', '7432', '7404', '7400', '7402', '7486', '7474', '7476'].map((chipNum) => (
                  <button
                    key={chipNum}
                    onClick={() => setSelectedChipNumber(chipNum)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedChipNumber === chipNum
                        ? 'bg-[#2563EB] text-white shadow-sm font-extrabold'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    IC {chipNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive IC Package Component with Gate Symbols and LaTeX Formula */}
            <ICPackageDiagram icNumber={selectedChipNumber} showDetails={true} />
          </div>

          {/* Logic Waveform / Logic Analyzer Display */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div className="flex items-center gap-2 text-[#4338CA] font-bold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4 text-[#4338CA]" /> Waveform Logic Analyzer Simulation
              </div>
              <span className="text-xs font-mono text-[#64748B]">Clock Step: t0 &rarr; t3</span>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] space-y-3 font-mono text-xs">
              {/* Waveform Trace 1: Input A */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-[#D97706] font-bold">Input A:</span>
                <div className="flex-1 flex items-center gap-1 bg-white p-2 rounded border border-[#CBD5E1]">
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t0)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t1)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded">1 (t2)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded">1 (t3)</span>
                </div>
              </div>

              {/* Waveform Trace 2: Input B */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-[#D97706] font-bold">Input B:</span>
                <div className="flex-1 flex items-center gap-1 bg-white p-2 rounded border border-[#CBD5E1]">
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t0)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded">1 (t1)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t2)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded">1 (t3)</span>
                </div>
              </div>

              {/* Waveform Trace 3: Output Y */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-emerald-700 font-bold">Out ({activeIC.chipNumber}):</span>
                <div className="flex-1 flex items-center gap-1 bg-white p-2 rounded border border-[#CBD5E1]">
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t0)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t1)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-[#F1F5F9] rounded text-[#64748B]">0 (t2)</span>
                  <span className="text-[#94A3B8]">&rarr;</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded">1 (t3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Student Notes & LaTeX Boolean Cheatsheet */}
        <div className="space-y-6">
          {/* Boolean Algebra Reference Box */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2 font-mono">
              <BookOpen className="w-4 h-4 text-[#2563EB]" /> Teorema & Hukum Aljabar Boolean (LaTeX)
            </h3>

            <div className="space-y-2">
              {booleanLaws.map((law, idx) => (
                <div key={idx} className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#CBD5E1] text-xs">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">{law.title}</span>
                  <BooleanMath latex={law.latex} className="text-[#1D4ED8] font-extrabold text-xs" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D97706]" /> Catatan Analisis Mahasiswa
            </h3>
            <textarea
              value={icAnalysisNotes}
              onChange={(e) => setIcAnalysisNotes(e.target.value)}
              placeholder="Tuliskan hasil penguraian tata letak pin VCC, GND, dan pemetaan gerbang IC 74xx..."
              rows={6}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-3 text-xs text-[#1A1C1E] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            onClick={onNextPhase}
            className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            Lanjut ke Tahap C: Ciptakan (Interactive Canvas) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
