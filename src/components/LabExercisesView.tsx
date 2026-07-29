import React, { useState } from 'react';
import { PracticumModule } from '../types';
import { BooleanMath } from './BooleanMath';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Upload,
  Play,
  Layers,
  Sparkles,
  Zap,
  Tag,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  ListOrdered,
} from 'lucide-react';

interface LabExercisesViewProps {
  modules: PracticumModule[];
  activeModule: PracticumModule;
  onSelectModule: (modId: string) => void;
  onLoadExerciseToSimulator: (mod: PracticumModule) => void;
  onImportCustomExercise?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LabExercisesView: React.FC<LabExercisesViewProps> = ({
  modules,
  activeModule,
  onSelectModule,
  onLoadExerciseToSimulator,
  onImportCustomExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTheoryId, setExpandedTheoryId] = useState<string | null>(null);

  const categories = ['ALL', 'Gerbang Dasar', 'Sirkuit Kombinasional', 'Sirkuit Sekuensial', 'Jembatan IoT'];

  const filteredModules = modules.filter((m) => {
    const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleTheory = (id: string) => {
    setExpandedTheoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#2563EB] text-white rounded-xl font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-[#1A1C1E]">
              File Latihan & Materi Praktikum Teknik Digital
            </h2>
          </div>
          <p className="text-xs text-[#64748B]">
            Setiap modul dilengkapi landasan teori, formulasi Boolean aljabar, spesifikasi I/O, serta skenario sirkuit yang siap disimulasikan secara instan.
          </p>
        </div>

        {/* Custom Exercise File Import */}
        {onImportCustomExercise && (
          <label className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-dashed border-[#2563EB] text-[#2563EB] rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs">
            <Upload className="w-4 h-4" />
            <span>Impor File Latihan (.json)</span>
            <input type="file" accept=".json" onChange={onImportCustomExercise} className="hidden" />
          </label>
        )}
      </div>

      {/* Category Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#D1D5DB] p-3 rounded-xl shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A1C1E]'
              }`}
            >
              {cat === 'ALL' ? 'Semua Latihan' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi / kata kunci..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#1A1C1E] focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Lab Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((mod) => {
          const isActive = mod.id === activeModule.id;
          const isTheoryExpanded = expandedTheoryId === mod.id;

          return (
            <div
              key={mod.id}
              className={`bg-white border-2 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                isActive ? 'border-[#2563EB] ring-2 ring-blue-100' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="space-y-4">
                {/* Badges & Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#2563EB] text-white text-xs font-mono font-extrabold rounded-lg">
                      {mod.code}
                    </span>
                    <span className="px-2.5 py-1 bg-[#F1F5F9] text-[#475569] text-xs font-bold rounded-lg border border-[#CBD5E1]">
                      {mod.category}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Siap Simulasi
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{mod.estimatedMinutes} Mnt</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1C1E] leading-snug">{mod.title}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{mod.subtitle}</p>
                </div>

                {/* Boolean Math Formula Box */}
                {mod.booleanFormula && (
                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-inner flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold">
                      Ekspresi Boolean:
                    </span>
                    <div className="font-mono text-sm text-amber-300 font-bold overflow-x-auto custom-scrollbar">
                      <BooleanMath latex={mod.booleanFormula} />
                    </div>
                  </div>
                )}

                {/* Problem Statement Box */}
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed space-y-1.5">
                  <span className="font-bold text-[#1A1C1E] block">Skenario Praktikum:</span>
                  <p>{mod.problemStatement}</p>
                </div>

                {/* Expandable Theory & Practical Procedure */}
                <div className="border border-[#CBD5E1] rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => toggleTheory(mod.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#1A1C1E] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <div className="flex items-center gap-2 text-[#2563EB]">
                      <FileText className="w-4 h-4" />
                      <span>Penjelasan Teori & Panduan Langkah Praktikum</span>
                    </div>
                    {isTheoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isTheoryExpanded && (
                    <div className="p-4 space-y-3.5 text-xs text-[#334155] bg-white border-t border-[#CBD5E1] leading-relaxed">
                      {/* Theoretical Background / Theory Summary */}
                      {(mod.theorySummary || mod.theoryExplanation) && (
                        <div className="space-y-1">
                          <span className="font-bold text-[#1A1C1E] text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Ringkasan Teori Digital:
                          </span>
                          <p className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-[#1E293B]">
                            {mod.theorySummary || mod.theoryExplanation}
                          </p>
                        </div>
                      )}

                      {/* Step by step practical simulation procedure / Practice Guide */}
                      {((mod.practiceGuide && mod.practiceGuide.length > 0) || (mod.practicalSteps && mod.practicalSteps.length > 0)) && (
                        <div className="space-y-1.5 pt-1">
                          <span className="font-bold text-[#1A1C1E] text-xs flex items-center gap-1.5">
                            <ListOrdered className="w-3.5 h-3.5 text-[#2563EB]" /> Panduan Langkah Perakitan & Simulasi:
                          </span>
                          <ul className="space-y-1 font-mono text-[11px] text-[#475569]">
                            {(mod.practiceGuide || mod.practicalSteps)?.map((step, idx) => (
                              <li key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Learning Objectives */}
                      {mod.learningObjectives && mod.learningObjectives.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="font-bold text-[#1A1C1E] text-xs block">Tujuan Pembelajaran:</span>
                          <div className="flex flex-wrap gap-1">
                            {mod.learningObjectives.map((obj, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-[#F1F5F9] text-[#334155] text-[10px] font-semibold rounded border border-[#CBD5E1]"
                              >
                                • {obj}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Specifications & ICs */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase font-mono block">Input Labels:</span>
                    <div className="flex flex-wrap gap-1">
                      {mod.inputLabels.map((lbl) => (
                        <span key={lbl} className="px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-mono font-bold rounded">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase font-mono block">Output Labels:</span>
                    <div className="flex flex-wrap gap-1">
                      {mod.outputLabels.map((lbl) => (
                        <span key={lbl} className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] text-[11px] font-mono font-bold rounded">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended ICs */}
                {mod.recommendedICs && mod.recommendedICs.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-[#475569] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <Cpu className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-semibold">Rekomendasi IC TTL:</span>
                    <div className="flex gap-1">
                      {mod.recommendedICs.map((ic) => (
                        <span key={ic} className="px-2 py-0.5 bg-white border border-slate-300 font-mono text-[11px] font-bold rounded">
                          IC {ic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Action Controls */}
              <div className="pt-6 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    onSelectModule(mod.id);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'text-[#2563EB] bg-blue-50 font-extrabold' : 'text-[#64748B] hover:text-[#1A1C1E]'
                  }`}
                >
                  {isActive ? '✓ Latihan Aktif' : 'Pilih Modul'}
                </button>

                <button
                  onClick={() => {
                    onSelectModule(mod.id);
                    onLoadExerciseToSimulator(mod);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Buka di Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
