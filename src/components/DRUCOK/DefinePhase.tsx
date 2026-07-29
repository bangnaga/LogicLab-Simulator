import React from 'react';
import { PracticumModule } from '../../types';
import { Target, Cpu, Lightbulb, ArrowRight, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

interface DefinePhaseProps {
  module: PracticumModule;
  onSelectModule: (modId: string) => void;
  allModules: PracticumModule[];
  defineNotes: string;
  setDefineNotes: (notes: string) => void;
  onNextPhase: () => void;
}

export const DefinePhase: React.FC<DefinePhaseProps> = ({
  module,
  onSelectModule,
  allModules,
  defineNotes,
  setDefineNotes,
  onNextPhase,
}) => {
  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-6xl mx-auto pb-12">
      {/* Banner Title */}
      <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
            D
          </span>
          <span className="text-xs font-bold text-[#4338CA] uppercase tracking-widest font-mono">
            Tahap 1 dari 6: Definisikan (Define)
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1A1C1E]">{module.title}</h2>
        <p className="text-[#475569] text-sm mt-1">{module.subtitle}</p>
      </div>

      {/* Module Selector & Specs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Practicum Module Selection */}
        <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2563EB]" /> Pilih Modul Praktikum
          </h3>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {allModules.map((m) => {
              const isSelected = m.id === module.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1E3A8A] shadow-sm ring-1 ring-[#2563EB]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8]">
                      {m.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E0E7FF] text-[#4338CA] border border-[#C7D2FE]">
                      {m.category}
                    </span>
                  </div>
                  <div className="text-xs font-bold line-clamp-1 text-[#1A1C1E]">{m.title}</div>
                  <div className="text-[11px] text-[#64748B] mt-1 line-clamp-2">{m.problemStatement}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Problem Statement & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement Card */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#2563EB]" /> Rumusan Masalah Kebutuhan Sirkuit
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-sm leading-relaxed text-[#1A1C1E]">
              {module.problemStatement}
            </div>

            {/* Learning Objectives List */}
            <div>
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Tujuan Instruksional Praktikum:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {module.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0] text-xs text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* I/O Hardware Specification Table */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#4338CA]" /> Spesifikasi Pin Input & Output
            </h3>

            <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-mono">
                    <th className="py-2.5 px-3">Pin Label</th>
                    <th className="py-2.5 px-3">Nama Perangkat</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Ekspektasi Perilaku Logika</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                  {module.ioSpecs.map((spec) => (
                    <tr key={spec.id} className="hover:bg-[#F8FAFC] font-sans">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#D97706]">{spec.pinLabel}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#1A1C1E]">{spec.name}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          spec.type === 'Input' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          spec.type === 'Sensor' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {spec.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#64748B]">{spec.expectedBehavior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* IoT Bridge Context Card */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#92400E] text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#D97706]" /> Jembatan Konsep IoT & Otomasi Industri
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-[#FDE68A]">
                <span className="text-[#B45309] font-bold block mb-1">Peran Sensor fisik:</span>
                <span className="text-[#78350F]">{module.iotBridgeContext.sensorRole}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#FDE68A]">
                <span className="text-[#B45309] font-bold block mb-1">Peran Aktuator:</span>
                <span className="text-[#78350F]">{module.iotBridgeContext.actuatorRole}</span>
              </div>
            </div>
            <div className="text-xs bg-[#FEF3C7] p-3 rounded-lg border border-[#FDE68A] text-[#92400E]">
              <span className="font-bold">Aplikasi Dunia Nyata:</span> {module.iotBridgeContext.realWorldApplication}
            </div>
          </div>

          {/* Student Definition Notes Input */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-3 shadow-sm">
            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Catatan Definisikan Mahasiswa (Definisikan Spesifikasi & Batasan):
            </label>
            <textarea
              value={defineNotes}
              onChange={(e) => setDefineNotes(e.target.value)}
              placeholder="Tuliskan pemahaman Anda mengenai kebutuhan input/output, batasan gerbang, dan aplikasi sirkuit ini..."
              rows={4}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-3 text-xs text-[#1A1C1E] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Navigation Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onNextPhase}
              className="px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              Lanjut ke Tahap R: Rumuskan (Truth Table) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
