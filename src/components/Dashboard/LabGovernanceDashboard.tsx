import React, { useState } from 'react';
import { CBAMetrics } from '../../types';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Users,
  BarChart3,
  CheckCircle2,
  Cpu,
  Sparkles,
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  Layers,
  FileText,
  Search,
  ChevronRight,
  Target,
  Rocket,
  CheckSquare,
} from 'lucide-react';

export const LabGovernanceDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'RPS' | 'CPMK' | 'DRUCOK' | 'CBA'>('RPS');
  const [weekFilter, setWeekFilter] = useState<string>('ALL');

  const metrics: CBAMetrics = {
    totalVirtualICsUsed: 5480,
    totalLabSessions: 342,
    physicalICCostPerUnit: 8500,
    breadboardCostPerUnit: 25000,
    multimeterCostPerUnit: 150000,
    preventedDamageRate: 99.2,
    totalSavedIDR: 48560000,
    co2SavedKg: 124.5,
  };

  const cpmkList = [
    {
      id: 'CPMK-1',
      title: 'Analisis Logika & Sistem Bilangan',
      description: 'Mahasiswa mampu menganalisis sistem bilangan (biner, heksadesimal, oktal), aljabar Boolean, dan gerbang logika dasar.',
      weight: '25%',
      color: 'bg-blue-500',
    },
    {
      id: 'CPMK-2',
      title: 'Rancangan Kombinasional & Sekuensial',
      description: 'Mahasiswa mampu merancang dan menyederhanakan rangkaian kombinasional (Adder, MUX, Decoder) dan sekuensial (Latch, Flip-Flop, Register, Counter).',
      weight: '30%',
      color: 'bg-indigo-500',
    },
    {
      id: 'CPMK-3',
      title: 'Arsitektur Digital Mikrokontroler',
      description: 'Mahasiswa mampu memahami arsitektur dasar mikrokontroler sebagai kumpulan komponen digital terintegrasi (Register, ALU, Memori, GPIO).',
      weight: '20%',
      color: 'bg-emerald-500',
    },
    {
      id: 'CPMK-4',
      title: 'Implementasi Otomasi & IoT Real-World',
      description: 'Mahasiswa mampu merancang, memprogram, dan mengoperasikan sistem mikrokontroler dasar untuk menyelesaikan masalah nyata (IoT / Otomasi).',
      weight: '25%',
      color: 'bg-amber-500',
    },
  ];

  const drucokPhases = [
    {
      phase: 'Data',
      label: 'Fase [Data]',
      title: 'Eksplorasi Masalah Nyata',
      desc: 'Menggali permasalahan nyata di lapangan yang membutuhkan solusi digital/otomasi cerdas.',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      phase: 'Research',
      label: 'Fase [Research]',
      title: 'Studi Literatur & Hardware',
      desc: 'Melakukan studi literatur terkait komponen elektronika, sensor, dan spesifikasi mikrokontroler yang dibutuhkan.',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      phase: 'Understand',
      label: 'Fase [Understand]',
      title: 'Analisis Arsitektur Digital',
      desc: 'Menganalisis bagaimana logika digital (AND, OR, NOT, Flip-Flop) bekerja di dalam arsitektur mikrokontroler yang dipilih.',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    },
    {
      phase: 'Create',
      label: 'Fase [Create]',
      title: 'Perakitan & Programming',
      desc: 'Merakit perangkat keras dan menulis kode program dengan Computational Thinking.',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      phase: 'Operate',
      label: 'Fase [Operate]',
      title: 'Pengujian & Kalibrasi',
      desc: 'Menguji coba purwarupa, melakukan debugging, serta kalibrasi sistem di lingkungan simulasi maupun nyata.',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      phase: 'Knowledge Sharing',
      label: 'Fase [Knowledge Sharing]',
      title: 'Presentasi & Dokumentasi',
      desc: 'Mempresentasikan hasil karya, mendemonstrasikan alat, dan menyusun dokumentasi teknis serta portofolio.',
      badgeBg: 'bg-[#2563EB] text-white border-blue-600',
    },
  ];

  const scheduleWeekly = [
    {
      week: 1,
      topic: 'Pengantar Sistem Digital: Analog vs Digital, Sistem Bilangan (Biner, Hex, Oktal).',
      activity: 'Pemaparan teori dasar. Mahasiswa mulai diarahkan membentuk kelompok proyek PjBL.',
      output: 'Pemahaman konsep dasar konversi bilangan.',
      phase: 'Persiapan',
      isExam: false,
    },
    {
      week: 2,
      topic: 'Aljabar Boolean & Gerbang Logika Dasar (AND, OR, NOT, NAND, NOR, XOR, XNOR).',
      activity: 'Latihan studi kasus penyederhanaan logika matematis.',
      output: 'Tabel kebenaran & persamaan logika.',
      phase: 'Persiapan',
      isExam: false,
    },
    {
      week: 3,
      topic: 'Penyederhanaan Rangkaian: Peta Karnaugh (K-Map) 2-4 Variabel.',
      activity: 'Praktikum: Simulasi gerbang logika dengan software LogicLab.',
      output: 'Rangkaian logika optimal & penyederhanaan K-Map.',
      phase: 'Persiapan',
      isExam: false,
    },
    {
      week: 4,
      topic: 'Rangkaian Kombinasional 1: Multiplexer (MUX), Demultiplexer, Encoder, Decoder.',
      activity: 'Fase [Data]: Kelompok mulai mengidentifikasi masalah nyata untuk proyek akhir.',
      output: 'Dokumen usulan masalah & identifikasi kebutuhan.',
      phase: 'Data',
      isExam: false,
    },
    {
      week: 5,
      topic: 'Rangkaian Kombinasional 2: Half/Full Adder, Subtractor, ALU Basic.',
      activity: 'Fase [Research]: Eksplorasi komponen untuk solusi masalah.',
      output: 'Daftar kebutuhan komponen (Bill of Materials / BOM).',
      phase: 'Research',
      isExam: false,
    },
    {
      week: 6,
      topic: 'Rangkaian Sekuensial 1: Latch dan Flip-Flop (SR, D, JK, T).',
      activity: 'Praktikum: Merangkai memori 1-bit dari gerbang logika.',
      output: 'Rangkaian simulasi Flip-flop & alur clock.',
      phase: 'Research',
      isExam: false,
    },
    {
      week: 7,
      topic: 'Rangkaian Sekuensial 2: Register & Counter (Jembatan menuju Arsitektur CPU).',
      activity: 'Fase [Understand]: Diskusi bagaimana register menyimpan data sensor/aktuator.',
      output: 'Blok diagram arsitektur rancangan proyek.',
      phase: 'Understand',
      isExam: false,
    },
    {
      week: 8,
      topic: 'Ujian Tengah Semester (UTS)',
      activity: 'Evaluasi Teori dan Konsep Dasar Digital.',
      output: 'Lembar Jawaban UTS & Evaluasi Pembelajaran.',
      phase: 'Evaluasi',
      isExam: true,
    },
    {
      week: 9,
      topic: 'Pengantar Mikrokontroler: Arsitektur MCU, CPU, RAM, ROM, GPIO (Kaitan Register).',
      activity: 'Mahasiswa mulai memegang perangkat hardware (ESP32/Arduino).',
      output: 'Rangkaian Blinking LED & Kontrol GPIO.',
      phase: 'Understand',
      isExam: false,
    },
    {
      week: 10,
      topic: 'Input/Output Digital pada MCU: Saklar, Push Button, dan LED Matrix.',
      activity: 'Fase [Create] Tahap 1: Perakitan hardware dasar untuk proyek kelompok.',
      output: 'Rangkaian I/O dasar beroperasi.',
      phase: 'Create',
      isExam: false,
    },
    {
      week: 11,
      topic: 'Interfacing Sensor Digital & Analog: ADC, Sensor Suhu/Jarak.',
      activity: 'Praktikum: Membaca data lingkungan (Data Acquisition).',
      output: 'Kode program pembacaan sensor.',
      phase: 'Create',
      isExam: false,
    },
    {
      week: 12,
      topic: 'Interfacing Aktuator & Kontrol: Motor DC, Servo, Relay Beban AC.',
      activity: 'Fase [Create] Tahap 2: Menghubungkan logika kontrol (If-Then/Boolean) dengan aktuator.',
      output: 'Aktuator merespon input sensor secara otomatis.',
      phase: 'Create',
      isExam: false,
    },
    {
      week: 13,
      topic: 'Komunikasi Data Dasar (Opsional IoT): Serial (UART, I2C, SPI) & Transmisi Data.',
      activity: 'Fase [Operate] Tahap 1: Integrasi hardware & software. Mulai debugging sistem.',
      output: 'Purwarupa berfungsi > 70%.',
      phase: 'Operate',
      isExam: false,
    },
    {
      week: 14,
      topic: 'Finalisasi Proyek PjBL: Troubleshooting, Optimalisasi Kode, & Perapian Hardware.',
      activity: 'Fase [Operate] Tahap 2: Pengujian purwarupa di lingkungan simulasi/nyata.',
      output: 'Purwarupa siap uji fungsionalitas komprehensif.',
      phase: 'Operate',
      isExam: false,
    },
    {
      week: 15,
      topic: 'Penyusunan Laporan Proyek & Dokumentasi: Format Portofolio & Rubrik Problem-Solving.',
      activity: 'Evaluasi sejawat (Peer Assessment) dan bimbingan penyelesaian laporan.',
      output: 'Draft Laporan Akhir & Slide Presentasi.',
      phase: 'Knowledge Sharing',
      isExam: false,
    },
    {
      week: 16,
      topic: 'Ujian Akhir Semester (UAS) & Showcase Proyek',
      activity: 'Fase [Knowledge Sharing]: Pameran Karya (Showcase) dan Presentasi Proyek Akhir.',
      output: 'Produk nyata, Laporan Akhir, & Nilai UAS.',
      phase: 'Knowledge Sharing',
      isExam: true,
    },
  ];

  const filteredSchedule = scheduleWeekly.filter((s) => {
    if (weekFilter === 'ALL') return true;
    if (weekFilter === 'UTS_UAS') return s.isExam;
    return s.phase === weekFilter;
  });

  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#2563EB] text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider font-mono">
                  Rencana Pembelajaran Semester (RPS) & Kurikulum PjBL
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  16 Pertemuan Full
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#1A1C1E] mt-0.5">
                Teknik Digital & Mikrokontroler berbasis Project-Based Learning
              </h2>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#CBD5E1]">
            <button
              onClick={() => setActiveSubTab('RPS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'RPS'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1A1C1E]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule 16 Minggu
            </button>
            <button
              onClick={() => setActiveSubTab('CPMK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'CPMK'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1A1C1E]'
              }`}
            >
              <Target className="w-3.5 h-3.5" /> CPMK 1-4
            </button>
            <button
              onClick={() => setActiveSubTab('DRUCOK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'DRUCOK'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1A1C1E]'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" /> Sintaks DRUCOK
            </button>
            <button
              onClick={() => setActiveSubTab('CBA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'CBA'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#1A1C1E]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Tata Kelola & CBA
            </button>
          </div>
        </div>

        {/* Quick Highlights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Total Pertemuan:</span>
            <span className="text-base font-extrabold text-[#1A1C1E]">16 Minggu Operasional</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Metode Pembelajaran:</span>
            <span className="text-base font-extrabold text-blue-900">Project-Based Learning (PjBL)</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-purple-700 block">Kerangka Sintaks Proyek:</span>
            <span className="text-base font-extrabold text-purple-900">Siklus 6-Fase DRUCOK</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Bobot Evaluasi Proyek:</span>
            <span className="text-base font-extrabold text-emerald-900">45% Purwarupa Otomasi/IoT</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab 1: 16-Week Schedule (RPS) */}
      {activeSubTab === 'RPS' && (
        <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2563EB]" />
                Rencana Kegiatan Pembelajaran Mingguan (16 Pertemuan)
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Alur distribusi materi pokok, sintaks proyek PjBL, dan tagihan luaran mahasiswa per minggu.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#CBD5E1] text-xs">
              <span className="text-[10px] font-bold text-[#64748B] uppercase px-2 font-mono">Filter Fase:</span>
              <button
                onClick={() => setWeekFilter('ALL')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  weekFilter === 'ALL' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                }`}
              >
                Semua (16)
              </button>
              <button
                onClick={() => setWeekFilter('Data')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  weekFilter === 'Data' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setWeekFilter('Create')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  weekFilter === 'Create' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                }`}
              >
                Create
              </button>
              <button
                onClick={() => setWeekFilter('UTS_UAS')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  weekFilter === 'UTS_UAS' ? 'bg-amber-600 text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                }`}
              >
                UTS & UAS
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#CBD5E1]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F1F5F9] text-[#475569] font-mono border-b border-[#CBD5E1]">
                  <th className="py-3 px-3 w-16 text-center">Minggu</th>
                  <th className="py-3 px-4 w-1/3">Materi Pokok / Topik</th>
                  <th className="py-3 px-4 w-1/3">Aktivitas Pembelajaran & Sintaks Proyek</th>
                  <th className="py-3 px-4">Output / Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] font-sans">
                {filteredSchedule.map((item) => (
                  <tr
                    key={item.week}
                    className={`transition-colors ${
                      item.isExam ? 'bg-amber-50/80 hover:bg-amber-100/80 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center font-mono font-bold">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs ${
                          item.isExam
                            ? 'bg-amber-600 text-white font-extrabold'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        W{item.week}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1A1C1E]">
                      {item.topic}
                      <span className="block mt-1 font-mono text-[10px] text-[#64748B] font-normal">
                        Fase: <strong className="text-[#2563EB]">{item.phase}</strong>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#334155] leading-relaxed">{item.activity}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          item.isExam
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        {item.output}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: CPMK 1-4 */}
      {activeSubTab === 'CPMK' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <Target className="w-5 h-5 text-[#2563EB]" /> Capaian Pembelajaran Mata Kuliah (CPMK)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cpmkList.map((cpmk) => (
                <div
                  key={cpmk.id}
                  className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-sm space-y-2 hover:border-[#2563EB] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#2563EB] text-white text-xs font-mono font-extrabold rounded">
                      {cpmk.id}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#64748B]">Bobot: {cpmk.weight}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1C1E]">{cpmk.title}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{cpmk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Penilaian & Bobot Evaluasi */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <Award className="w-5 h-5 text-amber-600" /> Penilaian & Bobot Evaluasi (PjBL)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-1">
                <span className="text-2xl font-black text-blue-800 font-mono">45%</span>
                <h4 className="font-bold text-blue-900">Proyek Purwarupa Otomasi / IoT</h4>
                <p className="text-[#475569] text-[11px]">Hasil fisik/simulasi, ketersambungan logika, dan unjuk kerja sistem.</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1">
                <span className="text-2xl font-black text-amber-800 font-mono">25%</span>
                <h4 className="font-bold text-amber-900">Evaluasi Teori (UTS & UAS)</h4>
                <p className="text-[#475569] text-[11px]">Ujian tertulis konsep logika digital, K-Map, dan arsitektur MCU.</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1">
                <span className="text-2xl font-black text-emerald-800 font-mono">20%</span>
                <h4 className="font-bold text-emerald-900">Praktikum Lab & Laporan</h4>
                <p className="text-[#475569] text-[11px]">Kelengkapan validasi tabel kebenaran & laporan teknis mingguan.</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-1">
                <span className="text-2xl font-black text-purple-800 font-mono">10%</span>
                <h4 className="font-bold text-purple-900">Keaktifan & Peer Assessment</h4>
                <p className="text-[#475569] text-[11px]">Partisipasi kelompok, kerjasama tim, dan penilaian antar teman.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Sintaks Proyek DRUCOK */}
      {activeSubTab === 'DRUCOK' && (
        <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#2563EB]" />
              Sintaks Proyek Pembelajaran (Siklus 6-Fase DRUCOK)
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Proyek akhir menuntut mahasiswa membuat purwarupa sistem otomasi cerdas melalui 6 siklus bertahap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {drucokPhases.map((phaseItem, index) => (
              <div
                key={phaseItem.phase}
                className="bg-slate-50 border border-[#CBD5E1] rounded-xl p-5 space-y-3 relative hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded border ${phaseItem.badgeBg}`}>
                    {phaseItem.label}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#64748B]">Langkah 0{index + 1}</span>
                </div>

                <h4 className="text-sm font-bold text-[#1A1C1E]">{phaseItem.title}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">{phaseItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Tata Kelola & Cost Benefit Analysis (CBA) */}
      {activeSubTab === 'CBA' && (
        <div className="space-y-6">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase">
                <span>Estimasi Penghematan Anggaran</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                Rp {metrics.totalSavedIDR.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded font-mono font-bold border border-emerald-200">
                ↑ 70% Hemat vs Pengadaan Komponen Fisik
              </div>
            </div>

            <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase">
                <span>Komponen IC Virtual Digunakan</span>
                <Cpu className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-2xl font-black text-[#1A1C1E] font-mono">
                {metrics.totalVirtualICsUsed.toLocaleString('id-ID')} Unit IC
              </div>
              <div className="text-[11px] text-[#64748B] font-mono">
                Dari {metrics.totalLabSessions} Sesi Praktikum
              </div>
            </div>

            <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase">
                <span>Proteksi Kerusakan IC (Short)</span>
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-2xl font-black text-[#2563EB] font-mono">
                {metrics.preventedDamageRate}%
              </div>
              <div className="text-[11px] text-blue-900 bg-blue-50 p-1.5 rounded font-mono font-bold border border-blue-200">
                0 IC Terbakar karena Salah Polaritas
              </div>
            </div>

            <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase">
                <span>Reduksi Sampah Elektronik</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {metrics.co2SavedKg} kg CO₂
              </div>
              <div className="text-[11px] text-[#64748B] font-mono">
                Dampak Ramah Lingkungan (Green Lab)
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1C1E] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Rincian Kalkulasi Cost-Benefit Analysis (CBA)
            </h3>

            <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F1F5F9] text-[#64748B] font-mono border-b border-[#CBD5E1]">
                    <th className="py-3 px-4">Kategori Aset Fisik</th>
                    <th className="py-3 px-4">Harga Satuan Fisik</th>
                    <th className="py-3 px-4">Penggunaan Virtual</th>
                    <th className="py-3 px-4 text-emerald-700">Total Nilai Hemat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] font-sans">
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-bold text-[#1A1C1E]">IC Seri 74xx (7408, 7432, 7404)</td>
                    <td className="py-3 px-4 font-mono text-[#64748B]">Rp 8.500 / pcs</td>
                    <td className="py-3 px-4 font-mono">5.480 unit</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">Rp 46.580.000</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-bold text-[#1A1C1E]">Breadboard Protoboard 830 Point</td>
                    <td className="py-3 px-4 font-mono text-[#64748B]">Rp 25.000 / pcs</td>
                    <td className="py-3 px-4 font-mono">342 unit</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">Rp 8.550.000</td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-bold text-[#1A1C1E]">Multimeter & Kabel Jumper</td>
                    <td className="py-3 px-4 font-mono text-[#64748B]">Rp 150.000 / set</td>
                    <td className="py-3 px-4 font-mono">120 set</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">Rp 18.000.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-xs text-emerald-900 leading-relaxed font-medium">
              <span className="font-bold">Rekomendasi Manajerial:</span> Implementasi simulator LogicLab terbukti memangkas pemborosan komponen terbakar akibat kesalahan polaritas VCC/GND mahasiswa hingga 99%, serta menghemat anggaran pengadaan laboratorium sebesar 70%.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

