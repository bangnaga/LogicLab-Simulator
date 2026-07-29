import React, { useState } from 'react';
import { PracticumModule, AutoGradeResult, TruthTableRow } from '../../types';
import {
  FileText,
  Printer,
  Download,
  Upload,
  Copy,
  Check,
  Share2,
  Send,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface CommunicatePhaseProps {
  module: PracticumModule;
  studentName: string;
  setStudentName: (val: string) => void;
  studentNIM: string;
  setStudentNIM: (val: string) => void;
  studentClass: string;
  setStudentClass: (val: string) => void;
  defineNotes: string;
  draftedTruthTable: TruthTableRow[];
  icAnalysisNotes: string;
  gradeResult: AutoGradeResult | undefined;
  conclusionNotes: string;
  setConclusionNotes: (val: string) => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CommunicatePhase: React.FC<CommunicatePhaseProps> = ({
  module,
  studentName,
  setStudentName,
  studentNIM,
  setStudentNIM,
  studentClass,
  setStudentClass,
  defineNotes,
  draftedTruthTable,
  icAnalysisNotes,
  gradeResult,
  conclusionNotes,
  setConclusionNotes,
  onExportJSON,
  onImportJSON,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrintReport = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `=== LAPORAN PRAKTIKUM LOGICLAB (DR-UCOK) ===
Nama: ${studentName || 'Mahasiswa'}
NIM: ${studentNIM || '-'}
Kelas: ${studentClass || '-'}
Modul: ${module.code} - ${module.title}
Skor Evaluasi: ${gradeResult?.percentage || 0}%

D - DEFINISIKAN:
${defineNotes || module.problemStatement}

R - RUMUSKAN:
Truth Table Verified (${draftedTruthTable.length} Rows)

K - KESIMPULAN:
${conclusionNotes || 'Pengujian sirkuit berhasil memvalidasi fungsionalitas logika.'}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
            <FileText className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">
            Dokumentasi & Ekspor Laporan Praktikum
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#1A1C1E]">Laporan Resmi Praktikum Teknik Digital</h2>
        <p className="text-[#64748B] text-sm mt-1">
          Lengkapi identitas mahasiswa, unduh file konfigurasi sirkuit (*.json), atau cetak/ekspor laporan praktikum dalam format PDF.
        </p>
      </div>

      {/* Top Action Toolbar */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2563EB]" />
          <span className="text-sm font-bold text-[#1A1C1E]">Laporan Praktikum Siap Cetak/PDF</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" /> Cetak / Export PDF
          </button>

          <button
            onClick={onExportJSON}
            className="px-4 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1A1C1E] border border-[#CBD5E1] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" /> Unduh Workspace JSON
          </button>

          <label className="px-4 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1A1C1E] border border-[#CBD5E1] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all">
            <Upload className="w-4 h-4" /> Muat JSON
            <input type="file" accept=".json" onChange={onImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1A1C1E] border border-[#CBD5E1] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin!' : 'Salin Ringkasan'}
          </button>
        </div>
      </div>

      {/* Formal Academic Lab Report Paper View */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-8 space-y-8 shadow-sm print:shadow-none print:border-none print:p-0">
        {/* Header Metadata Block */}
        <div className="border-b border-[#E2E8F0] pb-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="text-xl font-black text-[#1A1C1E] font-mono uppercase tracking-wider">
                LOGICLAB - LAPORAN PRAKTIKUM
              </div>
              <div className="text-xs text-[#2563EB] font-bold font-mono">{module.code}: {module.title}</div>
            </div>
            <div className="text-right text-xs font-mono text-[#64748B]">
              Tanggal: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>

          {/* Student Credentials Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#64748B]">Nama Mahasiswa:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan Nama Lengkap..."
                className="w-full bg-white border border-[#CBD5E1] rounded p-2 text-xs text-[#1A1C1E] focus:outline-none focus:border-[#2563EB] font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#64748B]">NIM / Nomor Induk:</label>
              <input
                type="text"
                value={studentNIM}
                onChange={(e) => setStudentNIM(e.target.value)}
                placeholder="Contoh: 21081010023..."
                className="w-full bg-white border border-[#CBD5E1] rounded p-2 text-xs text-[#1A1C1E] focus:outline-none focus:border-[#2563EB] font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#64748B]">Kelas / Kelompok Lab:</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Contoh: IF-A / Lab Elektro..."
                className="w-full bg-white border border-[#CBD5E1] rounded p-2 text-xs text-[#1A1C1E] focus:outline-none focus:border-[#2563EB] font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Phase Breakdown Summary Sections */}
        <div className="space-y-6">
          {/* D - Definisikan */}
          <div className="bg-[#F8FAFC] p-5 rounded-lg border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider font-mono">
              D – DEFINISIKAN (Problem Statement & I/O Requirements)
            </h4>
            <p className="text-xs text-[#1A1C1E] leading-relaxed">
              {defineNotes || module.problemStatement}
            </p>
          </div>

          {/* R - Rumuskan */}
          <div className="bg-[#F8FAFC] p-5 rounded-lg border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#4338CA] uppercase tracking-wider font-mono">
              R – RUMUSKAN (Tabel Kebenaran Teoritis Verified)
            </h4>
            <p className="text-xs text-[#1A1C1E]">
              Tabel kebenaran telah disusun untuk {draftedTruthTable.length} kombinasi input ({module.inputLabels.join(', ')}).
            </p>
          </div>

          {/* U - Uraikan */}
          <div className="bg-[#F8FAFC] p-5 rounded-lg border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#D97706] uppercase tracking-wider font-mono">
              U – URAIKAN (Analisis Komponen IC TTL Seri 74xx)
            </h4>
            <p className="text-xs text-[#1A1C1E]">
              {icAnalysisNotes || `Menggunakan IC ${module.recommendedICs.join(', ')} dengan alokasi pin VCC (Pin 14) dan GND (Pin 7).`}
            </p>
          </div>

          {/* O - Operasikan & Grade */}
          <div className="bg-[#F8FAFC] p-5 rounded-lg border border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#DC2626] uppercase tracking-wider font-mono flex items-center justify-between">
              <span>O – OPERASIKAN (Hasil Auto-Grading Simulator)</span>
              <span className="font-bold text-emerald-600">{gradeResult?.percentage || 0}% PASS</span>
            </h4>
            <p className="text-xs text-[#1A1C1E]">
              Sirkuit diuji secara otomatis dan memperoleh skor {gradeResult?.percentage || 0}%.
            </p>
          </div>

          {/* K - Kesimpulan Student Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2563EB] uppercase tracking-wider font-mono">
              K – KOMUNIKASIKAN (Kesimpulan & Refleksi Mahasiswa)
            </label>
            <textarea
              value={conclusionNotes}
              onChange={(e) => setConclusionNotes(e.target.value)}
              placeholder="Tuliskan kesimpulan praktikum, kendala perakitan, dan refleksi pemahaman gerbang logika..."
              rows={4}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-3 text-xs text-[#1A1C1E] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-all resize-none font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
