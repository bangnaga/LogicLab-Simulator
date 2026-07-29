import React, { useState } from 'react';
import { BooleanMath } from './BooleanMath';
import {
  BookOpen,
  Binary,
  Cpu,
  Calculator,
  Grid,
  Layers,
  Zap,
  Repeat,
  Radio,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Info,
  HelpCircle,
  FileCode,
  ArrowRight,
  HardDrive,
  RefreshCw,
  Award,
  ListOrdered,
  Scale,
  Check,
} from 'lucide-react';

export const DigitalTheoryBank: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<number>(1);

  // Topic 1 State: Number Converter
  const [decValue, setDecValue] = useState<number>(25);

  // Topic 2 State: Gate & Boolean Laws Simulator
  const [gateA, setGateA] = useState<number>(1);
  const [gateB, setGateB] = useState<number>(0);
  const [selectedGate, setSelectedGate] = useState<string>('AND');

  // Boolean Laws Interactive Proof Tester State
  const [selectedLawIdx, setSelectedLawIdx] = useState<number>(8); // Default: Absorption Law
  const [lawA, setLawA] = useState<number>(1);
  const [lawB, setLawB] = useState<number>(0);
  const [lawC, setLawC] = useState<number>(1);

  // Topic 3 State: Simplification Methods & K-Map Simulators
  const [simplificationMethod, setSimplificationMethod] = useState<'ALGEBRA' | 'CANONICAL' | 'KMAP' | 'QUINE'>('ALGEBRA');
  const [activeAlgebraExample, setActiveAlgebraExample] = useState<number>(0);
  const [kmapGrid2Var, setKmapGrid2Var] = useState<number[]>([1, 0, 1, 1]); // m0, m1, m2, m3
  const [kmapGrid3Var, setKmapGrid3Var] = useState<number[]>([1, 1, 0, 0, 1, 1, 0, 0]); // m0..m7

  // Topic 4 State: MUX 2:1 Simulator
  const [muxD0, setMuxD0] = useState<number>(1);
  const [muxD1, setMuxD1] = useState<number>(0);
  const [muxSel, setMuxSel] = useState<number>(0);

  // Topic 5 State: Full Adder Simulator
  const [faA, setFaA] = useState<number>(1);
  const [faB, setFaB] = useState<number>(1);
  const [faCin, setFaCin] = useState<number>(0);

  // Topic 6 State: JK Flip Flop Simulator
  const [jkJ, setJkJ] = useState<number>(1);
  const [jkK, setJkK] = useState<number>(1);
  const [ffQ, setFfQ] = useState<number>(0);

  // Topic 7 State: 4-Bit Counter Simulator
  const [counterVal, setCounterVal] = useState<number>(0);

  // Topic 8 State: GPIO Register Simulator
  const [ddrVal, setDdrVal] = useState<number>(1); // 1 = Output, 0 = Input
  const [portVal, setPortVal] = useState<number>(1); // 1 = High, 0 = Low

  const topicsList = [
    { id: 1, title: 'Pengantar Sistem Digital & Sistem Bilangan', badge: 'Bab 01' },
    { id: 2, title: 'Aljabar Boolean & Hukum-Hukum Kompleks', badge: 'Bab 02' },
    { id: 3, title: 'Penyederhanaan Fungsi Boolean (Aljabar, K-Map, Quine-McCluskey)', badge: 'Bab 03' },
    { id: 4, title: 'Rangkaian Kombinasional 1 (MUX, DEMUX, Encoder, Decoder)', badge: 'Bab 04' },
    { id: 5, title: 'Rangkaian Kombinasional 2 (Adder, Subtractor, ALU)', badge: 'Bab 05' },
    { id: 6, title: 'Rangkaian Sekuensial 1 (Latch & Flip-Flop)', badge: 'Bab 06' },
    { id: 7, title: 'Rangkaian Sekuensial 2 (Register & Counter ke CPU)', badge: 'Bab 07' },
    { id: 8, title: 'Pengantar Mikrokontroler & Registrasi GPIO', badge: 'Bab 08' },
  ];

  // 12 Hukum-Hukum Aljabar Boolean Lengkap (Berdasarkan Referensi Eko Martanto & Ahmed Jamili Rangkuti)
  const booleanLawsData = [
    {
      id: 1,
      name: 'Hukum Identitas (Identity Law)',
      formulaLhs: 'A \\cdot 1 = A, \\quad A + 0 = A',
      duality: 'Perkalian dengan 1 atau Penjumlahan dengan 0 tidak mengubah nilai masukan A.',
      desc: 'Nilai variabel A yang di-AND-kan dengan 1 akan menghasilkan A itu sendiri. Begitu pula nilai A yang di-OR-kan dengan 0 akan menghasilkan A.',
      evalLhs: (a: number) => a & 1,
      evalRhs: (a: number) => a,
    },
    {
      id: 2,
      name: 'Hukum Idempoten (Idempotent Law)',
      formulaLhs: 'A \\cdot A = A, \\quad A + A = A',
      duality: 'Pengulangan operasi logika pada variabel yang sama menghasilkan variabel itu sendiri.',
      desc: 'Penggabungan dua atau lebih masukan yang identik pada gerbang AND atau OR tidak mengubah nilai keluaran sinyal.',
      evalLhs: (a: number) => a & a,
      evalRhs: (a: number) => a,
    },
    {
      id: 3,
      name: 'Hukum Komplement / Inversi (Complement Law)',
      formulaLhs: 'A \\cdot \\overline{A} = 0, \\quad A + \\overline{A} = 1',
      duality: 'A · A\' adalah kontradiksi (0), sedangkan A + A\' adalah tautologi (1).',
      desc: 'Operasi AND antara variabel dengan inversinya selalu bernilai 0. Operasi OR antara variabel dengan inversinya selalu bernilai 1.',
      evalLhs: (a: number) => a & (a === 1 ? 0 : 1),
      evalRhs: () => 0,
    },
    {
      id: 4,
      name: 'Hukum Dominansi / Bound (Dominance Law)',
      formulaLhs: 'A \\cdot 0 = 0, \\quad A + 1 = 1',
      duality: 'Sinyal 0 mendominasi gerbang AND, sinyal 1 mendominasi gerbang OR.',
      desc: 'Apapun nilai masukan A, jika di-AND-kan dengan 0 maka hasilnya pasti 0. Jika di-OR-kan dengan 1 maka hasilnya pasti 1.',
      evalLhs: (a: number) => a & 0,
      evalRhs: () => 0,
    },
    {
      id: 5,
      name: 'Hukum Involusi / Dwi-Negasi (Double Negation Law)',
      formulaLhs: '\\overline{\\overline{A}} = A',
      duality: 'Inversi ganda membatalkan pembalikan sinyal.',
      desc: 'Membalikkan sinyal logika sebanyak dua kali berturut-turut akan mengembalikan sinyal ke kondisi aslinya.',
      evalLhs: (a: number) => ((a === 1 ? 0 : 1) === 1 ? 0 : 1),
      evalRhs: (a: number) => a,
    },
    {
      id: 6,
      name: 'Hukum Komutatif (Commutative Law)',
      formulaLhs: 'A \\cdot B = B \\cdot A, \\quad A + B = B + A',
      duality: 'Urutan posisi masukan tidak mempengaruhi hasil operasi AND/OR.',
      desc: 'Posisi saklar atau pin masukan A dan B dapat dipertukarkan tanpa mengubah keluaran fungsi logika.',
      evalLhs: (a: number, b: number) => a & b,
      evalRhs: (a: number, b: number) => b & a,
    },
    {
      id: 7,
      name: 'Hukum Asosiatif (Associative Law)',
      formulaLhs: '(A \\cdot B) \\cdot C = A \\cdot (B \\cdot C), \\quad (A + B) + C = A + (B + C)',
      duality: 'Pengelompokan urutan eksekusi pada operasi sejenis memberikan hasil identik.',
      desc: 'Dalam penggabungan tiga variabel atau lebih pada gerbang berjenis sama, urutan pengelompokan tidak mempengaruhi hasil.',
      evalLhs: (a: number, b: number, c: number) => (a & b) & c,
      evalRhs: (a: number, b: number, c: number) => a & (b & c),
    },
    {
      id: 8,
      name: 'Hukum Distributif (Distributive Law)',
      formulaLhs: 'A \\cdot (B + C) = A B + A C, \\quad A + (B \\cdot C) = (A + B)(A + C)',
      duality: 'Operasi perkalian Boolean mendistribusikan penjumlahan, dan sebaliknya (keunikan Aljabar Boolean).',
      desc: 'Hukum distributif kedua [A + (B·C) = (A+B)(A+C)] merupakan sifat unik Aljabar Boolean yang tidak ada pada aljabar biasa.',
      evalLhs: (a: number, b: number, c: number) => a | (b & c),
      evalRhs: (a: number, b: number, c: number) => (a | b) & (a | c),
    },
    {
      id: 9,
      name: 'Hukum Absorpsi / Penyerapan (Absorption Law)',
      formulaLhs: 'A + A \\cdot B = A, \\quad A \\cdot (A + B) = A, \\quad A + \\overline{A} B = A + B',
      duality: 'Suku redundan diserap oleh variabel dominan.',
      desc: 'Suku A + A·B menyederhanakan rangkaian karena saat A = 1, nilai B menjadi tidak berpengaruh (diserap oleh A).',
      evalLhs: (a: number, b: number) => a | (a & b),
      evalRhs: (a: number) => a,
    },
    {
      id: 10,
      name: 'Hukum De Morgan (De Morgan Theorem)',
      formulaLhs: '\\overline{A \\cdot B} = \\overline{A} + \\overline{B}, \\quad \\overline{A + B} = \\overline{A} \\cdot \\overline{B}',
      duality: 'Komplemen dari perkalian adalah penjumlahan komplemen, dan sebaliknya.',
      desc: 'Fondasi utama transformasi gerbang universal NAND dan NOR. Mengubah perkalian logika menjadi penjumlahan sinyal terinversi.',
      evalLhs: (a: number, b: number) => ((a & b) === 1 ? 0 : 1),
      evalRhs: (a: number, b: number) => (a === 1 ? 0 : 1) | (b === 1 ? 0 : 1),
    },
    {
      id: 11,
      name: 'Hukum Konsensus / Redudansi (Consensus Theorem)',
      formulaLhs: 'A B + \\overline{A} C + B C = A B + \\overline{A} C',
      duality: 'Suku ketiga BC redundan dan dapat dihilangkan.',
      desc: 'Suku BC merupakan suku konsensus antara AB dan A\'C. Suku BC dapat dihapus untuk menghemat penggunaan gerbang logika.',
      evalLhs: (a: number, b: number, c: number) => (a & b) | ((a === 1 ? 0 : 1) & c) | (b & c),
      evalRhs: (a: number, b: number, c: number) => (a & b) | ((a === 1 ? 0 : 1) & c),
    },
    {
      id: 12,
      name: 'Prinsip Dualitas (Duality Principle)',
      formulaLhs: '\\text{Tukar } + \\leftrightarrow \\cdot, \\quad 0 \\leftrightarrow 1',
      duality: 'Kebenaran kesamaan Boolean tetap terjaga saat dualnya dibentuk.',
      desc: 'Setiap kesamaan Boolean tetap bernilai benar jika operator OR (+) diganti AND (·), operator AND diganti OR, dan konstanta 0 diganti 1 serta 1 diganti 0.',
      evalLhs: (a: number, b: number) => a | b,
      evalRhs: (a: number, b: number) => a | b,
    },
  ];

  // Contoh Soal Penyederhanaan Aljabar (Langkah Demi Langkah)
  const algebraicCases = [
    {
      title: 'Studi Kasus 1: Penyederhanaan Suku Berpasangan',
      problem: 'F(A, B) = A \\cdot B + A \\cdot \\overline{B}',
      steps: [
        '1. Faktorkan variabel A menggunakan Hukum Distributif: F = A · (B + B\')',
        '2. Terapkan Hukum Komplement pada (B + B\') = 1: F = A · (1)',
        '3. Terapkan Hukum Identitas pada A · 1 = A: F = A',
        'Hasil Akhir Ter-minimasi: F = A (Hanya membutuhkan 0 gerbang logika, cukup sambungkan garis sinyal A!).',
      ],
      finalEq: 'F = A',
    },
    {
      title: 'Studi Kasus 2: Penyederhanaan 3 Variabel Multiple Terms',
      problem: 'F(A, B, C) = \\overline{A}\\overline{B}C + \\overline{A}BC + A\\overline{B}C + ABC',
      steps: [
        '1. Kelompokkan suku bertetangga yang mengandung C: F = \\overline{A}C(\\overline{B} + B) + AC(\\overline{B} + B)',
        '2. Terapkan Hukum Komplement (\\overline{B} + B = 1): F = \\overline{A}C(1) + AC(1) = \\overline{A}C + AC',
        '3. Faktorkan C menggunakan Hukum Distributif: F = C(\\overline{A} + A)',
        '4. Terapkan Hukum Komplement (\\overline{A} + A = 1) & Identitas: F = C(1) = C',
        'Hasil Akhir Ter-minimasi: F = C (Menghemat 4 gerbang AND 3-input dan 1 gerbang OR 4-input menjadi sinyal langsung C!).',
      ],
      finalEq: 'F = C',
    },
    {
      title: 'Studi Kasus 3: Penyederhanaan Menggunakan Hukum Absorpsi',
      problem: 'F(A, B) = A + \\overline{A}\\cdot B',
      steps: [
        '1. Gunakan Hukum Distributif kedua: [X + Y·Z = (X+Y)(X+Z)]',
        '2. Jabarkan persamaan menjadi: F = (A + \\overline{A}) \\cdot (A + B)',
        '3. Substitusi Hukum Komplement (A + \\overline{A} = 1): F = 1 \\cdot (A + B)',
        '4. Substitusi Hukum Identitas (1 · X = X): F = A + B',
        'Hasil Akhir Ter-minimasi: F = A + B (Cukup menggunakan 1 gerbang OR 2-input).',
      ],
      finalEq: 'F = A + B',
    },
    {
      title: 'Studi Kasus 4: Perkalian Bentuk Suku Penjumlahan',
      problem: 'F(A, B) = (A + B) \\cdot (A + \\overline{B})',
      steps: [
        '1. Terapkan Hukum Distributif ekspansi: F = A·A + A·\\overline{B} + B·A + B·\\overline{B}',
        '2. Substitusi Hukum Idempoten (A·A = A) dan Komplement (B·\\overline{B} = 0): F = A + A\\overline{B} + AB + 0',
        '3. Faktorkan A dari suku-suku sisanya: F = A · (1 + \\overline{B} + B)',
        '4. Terapkan Hukum Dominansi (1 + apapun = 1): F = A · (1) = A',
        'Hasil Akhir Ter-minimasi: F = A',
      ],
      finalEq: 'F = A',
    },
  ];

  // Logic Gate Calculation Helper
  const calcGateOutput = (type: string, a: number, b: number): number => {
    switch (type) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'NOT': return a === 1 ? 0 : 1;
      case 'NAND': return (a & b) === 1 ? 0 : 1;
      case 'NOR': return (a | b) === 1 ? 0 : 1;
      case 'XOR': return a ^ b;
      case 'XNOR': return (a ^ b) === 1 ? 0 : 1;
      default: return 0;
    }
  };

  // Full Adder Calculation
  const faSum = faA ^ faB ^ faCin;
  const faCout = (faA & faB) | (faCin & (faA ^ faB));

  // Current selected law
  const currentLaw = booleanLawsData[selectedLawIdx];
  const lawLhsResult = currentLaw.evalLhs(lawA, lawB, lawC);
  const lawRhsResult = currentLaw.evalRhs(lawA, lawB, lawC);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Research Team Credit Alert Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#2563EB] text-white rounded-lg shadow-sm">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-[#1E293B] block sm:inline">
              Kredit Pengembangan Resmi:
            </span>{' '}
            <span className="font-bold text-[#1D4ED8]">
              Aplikasi ini dikembangkan Oleh Tim Peneliti Dosen Teknik Informatika Universitas Indonesia Timur.
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white text-[#2563EB] font-mono font-bold text-[10px] rounded-md border border-blue-200 uppercase tracking-wider">
          Fakultas Ilmu Komputer UIT
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-[#2563EB] text-white">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest font-mono">
                Modul Teori & Bank Pembelajaran Digital Kompleks
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1A1C1E]">
              Landasan Teori Sistem Digital, Aljabar Boolean & Mikrokontroler
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Materi komprehensif mengacu pada kajian riset Aljabar Boolean, metode penyederhanaan fungsi (Aljabar, K-Map, Quine-McCluskey), serta implementasi siber-fisik.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono font-bold text-blue-900">
            Terintegrasi Curriculum PjBL 16 Minggu
          </div>
        </div>
      </div>

      {/* Main Container: Topic Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Topic Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2 bg-white border border-[#D1D5DB] rounded-xl p-3 shadow-sm h-fit">
          <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-2 py-1 font-mono border-b border-[#E2E8F0] mb-2 flex items-center justify-between">
            <span>Daftar Topik Teori</span>
            <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded">8 Bab</span>
          </div>

          {topicsList.map((t) => {
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#1A1C1E]'
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-extrabold shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {t.badge}
                </span>
                <span className="leading-snug">{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Topic Content Viewer Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TOPIC 1: Pengantar Sistem Digital & Sistem Bilangan */}
          {activeTopic === 1 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 01 — TEORI & KONVERSI
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Pengantar Sistem Digital & Sistem Bilangan
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Perbedaan sinyal analog vs digital dan representasi data biner (basis 2), oktal (basis 8), serta heksadesimal (basis 16).
                </p>
              </div>

              {/* Theoretical Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#334155]">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#1A1C1E] flex items-center gap-1.5 text-sm">
                    <Radio className="w-4 h-4 text-[#2563EB]" /> Sinyal Analog vs Digital
                  </h4>
                  <p className="leading-relaxed">
                    <strong>Sinyal Analog:</strong> Memiliki nilai kontinu terhadap waktu (misal: tegangan 0 Volt hingga 5 Volt bertahap mulus). Rentan terhadap gangguan desah (noise).
                  </p>
                  <p className="leading-relaxed">
                    <strong>Sinyal Digital:</strong> Memiliki nilai diskrit dua tingkat diskrit biner: Logika LOW (0V / False) dan Logika HIGH (5V atau 3.3V / True). Sangat tahan terhadap desah dan mudah diproses oleh komputer/MCU.
                  </p>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
                  <h4 className="font-bold text-[#1A1C1E] flex items-center gap-1.5 text-sm">
                    <Binary className="w-4 h-4 text-[#2563EB]" /> Sistem Bilangan Biner, Oktal, Hex
                  </h4>
                  <ul className="space-y-1.5 leading-relaxed font-mono text-[11px]">
                    <li>• <strong>Biner (Base 2):</strong> Menggunakan digit 0 dan 1. (Contoh: 11001₂)</li>
                    <li>• <strong>Oktal (Base 8):</strong> Menggunakan digit 0-7. Mengelompokkan 3 bit biner.</li>
                    <li>• <strong>Heksadesimal (Base 16):</strong> Menggunakan 0-9 dan A-F. Mengelompokkan 4 bit biner (1 Nibble). Digunakan untuk pengalamatan memori CPU/RAM.</li>
                  </ul>
                </div>
              </div>

              {/* Interactive Widget: Number Converter */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> Interaktif: Kalkulator Konversi Sistem Bilangan Real-Time
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Input Desimal (0-255)</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="text-xs font-bold text-slate-300">Nilai Desimal (Base 10):</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={decValue}
                    onChange={(e) => setDecValue(Math.max(0, Math.min(255, Number(e.target.value))))}
                    className="bg-slate-800 border border-slate-700 text-amber-300 font-mono font-extrabold text-sm rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={decValue}
                    onChange={(e) => setDecValue(Number(e.target.value))}
                    className="flex-1 accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Biner (Base 2 - 8-Bit)</span>
                    <span className="text-base font-mono font-black text-emerald-400 tracking-wider">
                      {decValue.toString(2).padStart(8, '0')}₂
                    </span>
                  </div>
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Heksadesimal (Base 16)</span>
                    <span className="text-base font-mono font-black text-amber-300 tracking-wider">
                      0x{decValue.toString(16).toUpperCase().padStart(2, '0')}₁₆
                    </span>
                  </div>
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Oktal (Base 8)</span>
                    <span className="text-base font-mono font-black text-blue-300 tracking-wider">
                      {decValue.toString(8).padStart(3, '0')}₈
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 2: Aljabar Boolean & Gerbang Logika Dasar */}
          {activeTopic === 2 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    BAB 02 — HUKUM BOOLEAN & GERBANG LOGIKA
                  </span>
                  <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                    Aljabar Boolean, 12 Hukum Kompleks & 7 Gerbang Logika
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Kajian lengkap hukum-hukum Aljabar Boolean (Eko Martanto, 2020) dan verifikasi bukti kesamaan matematis real-time.
                  </p>
                </div>
              </div>

              {/* 12 Hukum-Hukum Aljabar Boolean Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1A1C1E] text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#2563EB]" /> 12 Hukum-Hukum Utama Aljabar Boolean:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-xs">
                  {booleanLawsData.map((law, idx) => {
                    const isSelected = selectedLawIdx === idx;
                    return (
                      <div
                        key={law.id}
                        onClick={() => setSelectedLawIdx(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-blue-50/90 border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-[#1A1C1E]">
                            {law.id}. {law.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                        </div>
                        <div className="font-mono text-xs text-blue-700 bg-white p-2 rounded border border-blue-100">
                          <BooleanMath latex={law.formulaLhs} />
                        </div>
                        <p className="text-[11px] text-[#475569] leading-snug line-clamp-2">
                          {law.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Boolean Law Proof Tester Widget */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Interaktif: Pembuktian Real-Time Hukum #{currentLaw.id} ({currentLaw.name})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                    STATUS BUKTI: {lawLhsResult === lawRhsResult ? 'TERBUKTI SAMA (100% VALID)' : 'INVALID'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700 text-xs font-mono">
                  {/* Input Toggles */}
                  <div className="space-y-2.5">
                    <span className="text-slate-400 font-bold block text-[11px]">Set Nilai Variabel Input:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 w-12">Var A:</span>
                      <button
                        onClick={() => setLawA(lawA === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded font-bold ${lawA === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {lawA}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 w-12">Var B:</span>
                      <button
                        onClick={() => setLawB(lawB === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded font-bold ${lawB === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {lawB}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 w-12">Var C:</span>
                      <button
                        onClick={() => setLawC(lawC === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded font-bold ${lawC === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {lawC}
                      </button>
                    </div>
                  </div>

                  {/* Formula Evaluation LHS vs RHS */}
                  <div className="space-y-2 border-x border-slate-700 px-4">
                    <span className="text-slate-400 font-bold block text-[11px]">Evaluasi Ruas Kiri vs Kanan:</span>
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-700 space-y-1">
                      <span className="text-slate-400 block text-[10px]">Ruas Kiri (LHS):</span>
                      <span className="text-amber-300 font-bold text-sm block">{lawLhsResult}</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-700 space-y-1">
                      <span className="text-slate-400 block text-[10px]">Ruas Kanan (RHS):</span>
                      <span className="text-blue-400 font-bold text-sm block">{lawRhsResult}</span>
                    </div>
                  </div>

                  {/* Duality & Law Explanation */}
                  <div className="space-y-1.5 text-slate-300 font-sans text-[11px] leading-relaxed">
                    <span className="text-amber-400 font-bold block font-mono text-[11px]">Penjelasan Hukum:</span>
                    <p>{currentLaw.desc}</p>
                    <p className="text-slate-400 italic pt-1 border-t border-slate-700">
                      <strong>Prinsip Dualitas:</strong> {currentLaw.duality}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Widget: 7 Gate Tester */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-blue-400">
                    Interaktif: Uji Fungsionalitas Gerbang Logika & Tabel Kebenaran
                  </span>
                  <div className="flex gap-1">
                    {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGate(g)}
                        className={`px-2 py-1 text-[11px] font-mono font-bold rounded ${
                          selectedGate === g ? 'bg-[#2563EB] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gate Demo Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Input A</span>
                      <button
                        onClick={() => setGateA(gateA === 1 ? 0 : 1)}
                        className={`w-10 h-10 rounded-lg font-mono font-black text-sm border ${
                          gateA === 1 ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-400'
                        }`}
                      >
                        {gateA}
                      </button>
                    </div>

                    {selectedGate !== 'NOT' && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-slate-400">Input B</span>
                        <button
                          onClick={() => setGateB(gateB === 1 ? 0 : 1)}
                          className={`w-10 h-10 rounded-lg font-mono font-black text-sm border ${
                            gateB === 1 ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-400'
                          }`}
                        >
                          {gateB}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Operasi Gerbang</span>
                    <span className="text-lg font-mono font-extrabold text-amber-300">
                      {selectedGate} Gate
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400">Output Y</span>
                    <div
                      className={`w-12 h-10 rounded-lg font-mono font-black text-base flex items-center justify-center border shadow-lg ${
                        calcGateOutput(selectedGate, gateA, gateB) === 1
                          ? 'bg-amber-400 text-slate-900 border-amber-300 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {calcGateOutput(selectedGate, gateA, gateB)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 3: Penyederhanaan Rangkaian (Aljabar, K-Map, Quine-McCluskey) */}
          {activeTopic === 3 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 03 — MINIMASI LOGIKA LENGKAP
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Penyederhanaan Fungsi Boolean (Ahmed Jamili Rangkuti, 2013)
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Kajian komprehensif 4 metode penyederhanaan: Metode Aljabar, Bentuk Kanonik (SOP/POS), Peta Karnaugh (K-Map 2-4 Variabel), dan Metode Tabulasi Quine-McCluskey.
                </p>
              </div>

              {/* Sub-Tab Method Switcher */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs font-bold">
                <button
                  onClick={() => setSimplificationMethod('ALGEBRA')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    simplificationMethod === 'ALGEBRA' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  1. Metode Aljabar
                </button>
                <button
                  onClick={() => setSimplificationMethod('CANONICAL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    simplificationMethod === 'CANONICAL' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  2. Bentuk Kanonik (SOP & POS)
                </button>
                <button
                  onClick={() => setSimplificationMethod('KMAP')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    simplificationMethod === 'KMAP' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  3. Peta Karnaugh (K-Map 2-3 Var)
                </button>
                <button
                  onClick={() => setSimplificationMethod('QUINE')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    simplificationMethod === 'QUINE' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  4. Quine-McCluskey (Tabular)
                </button>
              </div>

              {/* METHOD 1: ALGEBRAIC SIMPLIFICATION */}
              {simplificationMethod === 'ALGEBRA' && (
                <div className="space-y-4 text-xs text-[#334155]">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-[#1A1C1E] text-sm flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-[#2563EB]" /> Prinsip Penyederhanaan Metode Aljabar:
                    </h4>
                    <p className="leading-relaxed">
                      Metode Aljabar dilakukan dengan menerapkan hukum-hukum Aljabar Boolean secara bertahap untuk meminimalkan suku (terms) dan literal. Tujuannya adalah mengurangi jumlah gerbang logika, menghemat biaya IC, dan menurunkan delay propagasi sinyal.
                    </p>
                  </div>

                  {/* Interactive Case Study Walkthrough */}
                  <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        Pilih Studi Kasus Soal Penyederhanaan Aljabar:
                      </span>
                      <div className="flex gap-1.5 font-mono text-[11px]">
                        {algebraicCases.map((c, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveAlgebraExample(idx)}
                            className={`px-2.5 py-1 rounded font-bold ${
                              activeAlgebraExample === idx ? 'bg-[#2563EB] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            Soal {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 font-mono">
                      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <span className="text-slate-400 text-[10px] block font-sans font-bold">Persamaan Awal:</span>
                        <div className="text-sm font-bold text-emerald-300 mt-1">
                          <BooleanMath latex={algebraicCases[activeAlgebraExample].problem} />
                        </div>
                      </div>

                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-2 text-[11px]">
                        <span className="text-amber-300 font-bold font-sans block text-xs">Langkah Penyelesaian Bertahap:</span>
                        {algebraicCases[activeAlgebraExample].steps.map((st, i) => (
                          <div key={i} className="bg-slate-900/90 p-2 rounded border border-slate-800 text-slate-200 leading-relaxed">
                            {st}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: CANONICAL FORMS (SOP & POS) */}
              {simplificationMethod === 'CANONICAL' && (
                <div className="space-y-4 text-xs text-[#334155]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
                      <h4 className="font-bold text-[#1A1C1E] text-sm">Sum of Products (SOP) / Minterm (m_i)</h4>
                      <p className="leading-relaxed">
                        Kombinasi masukan yang menghasilkan nilai keluaran <strong>1</strong> dihubungkan dengan operasi OR (+).
                      </p>
                      <ul className="space-y-1 font-mono text-[11px] text-[#1E293B]">
                        <li>• Variabel bernilai 1 → disimbolkan A</li>
                        <li>• Variabel bernilai 0 → disimbolkan A' (NOT A)</li>
                        <li>• Notasi: F(A,B,C) = ∑ m(0, 1, 4, 5)</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                      <h4 className="font-bold text-[#1A1C1E] text-sm">Product of Sums (POS) / Maxterm (M_i)</h4>
                      <p className="leading-relaxed">
                        Kombinasi masukan yang menghasilkan nilai keluaran <strong>0</strong> dihubungkan dengan operasi AND (·).
                      </p>
                      <ul className="space-y-1 font-mono text-[11px] text-[#1E293B]">
                        <li>• Variabel bernilai 0 → disimbolkan A</li>
                        <li>• Variabel bernilai 1 → disimbolkan A' (NOT A)</li>
                        <li>• Notasi: F(A,B,C) = ∏ M(2, 3, 6, 7)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 font-mono space-y-2">
                    <span className="text-amber-300 font-bold text-xs block">Hubungan Minterm & Maxterm (Dualitas Dwi-Negasi):</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Setiap minterm m_i merupakan komplemen dari maxterm M_i (m_i' = M_i). Jika sebuah fungsi dinyatakan dalam SOP sebagai ∑ m(0, 1), maka bentuk POS darinya adalah ∏ M(2, 3) mencakup seluruh sisa indeks minterm yang tidak aktif.
                    </p>
                  </div>
                </div>
              )}

              {/* METHOD 3: KARNAUGH MAP (K-MAP) */}
              {simplificationMethod === 'KMAP' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <h4 className="font-bold text-[#1A1C1E] text-sm">Aturan Pengelompokan K-Map (Pair, Quad, Octet):</h4>
                    <ul className="space-y-1 text-[#334155] leading-relaxed font-mono text-[11px]">
                      <li>• <strong>Pair (2 Sel):</strong> Mengeliminasi 1 variabel.</li>
                      <li>• <strong>Quad (4 Sel):</strong> Mengeliminasi 2 variabel.</li>
                      <li>• <strong>Octet (8 Sel):</strong> Mengeliminasi 3 variabel.</li>
                      <li>• <strong>Sifat Gulung (Wrap-Around):</strong> Sel di tepi paling kiri bertetangga langsung dengan tepi paling kanan.</li>
                      <li>• <strong>Don't Care Condition (X / d):</strong> Kombinasi masukan yang tidak pernah terjadi dapat dimanfaatkan sebagai 1 untuk memperbesar kelompok K-Map.</li>
                    </ul>
                  </div>

                  {/* Interactive Widget: 3-Variable K-Map Simulator */}
                  <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Interaktif: Peta Karnaugh 3-Variabel (A, B, C) — Klik Sel untuk Mengubah 0/1
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Susunan Kode Gray: 00, 01, 11, 10</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-around gap-6">
                      {/* 3-Var K-Map Table Grid */}
                      <div className="font-mono text-xs">
                        <table className="border-collapse border border-slate-700 text-center">
                          <thead>
                            <tr>
                              <th className="p-2 border border-slate-700 bg-slate-800 text-slate-400">A \ BC</th>
                              <th className="p-2 border border-slate-700 bg-slate-800 text-blue-400">BC = 00</th>
                              <th className="p-2 border border-slate-700 bg-slate-800 text-blue-400">BC = 01</th>
                              <th className="p-2 border border-slate-700 bg-slate-800 text-blue-400">BC = 11</th>
                              <th className="p-2 border border-slate-700 bg-slate-800 text-blue-400">BC = 10</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 border border-slate-700 bg-slate-800 text-amber-400 font-bold">A = 0</td>
                              {[0, 1, 3, 2].map((mIdx) => (
                                <td
                                  key={mIdx}
                                  onClick={() => {
                                    const next = [...kmapGrid3Var];
                                    next[mIdx] = next[mIdx] === 1 ? 0 : 1;
                                    setKmapGrid3Var(next);
                                  }}
                                  className={`p-3 border border-slate-700 font-extrabold text-sm cursor-pointer transition-colors ${
                                    kmapGrid3Var[mIdx] === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  m{mIdx} = {kmapGrid3Var[mIdx]}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-2 border border-slate-700 bg-slate-800 text-amber-400 font-bold">A = 1</td>
                              {[4, 5, 7, 6].map((mIdx) => (
                                <td
                                  key={mIdx}
                                  onClick={() => {
                                    const next = [...kmapGrid3Var];
                                    next[mIdx] = next[mIdx] === 1 ? 0 : 1;
                                    setKmapGrid3Var(next);
                                  }}
                                  className={`p-3 border border-slate-700 font-extrabold text-sm cursor-pointer transition-colors ${
                                    kmapGrid3Var[mIdx] === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  m{mIdx} = {kmapGrid3Var[mIdx]}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* KMap Results */}
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
                        <span className="text-[10px] text-slate-400 font-mono block">Minterm Aktif & Persamaan SOP:</span>
                        <div className="font-mono text-sm text-emerald-300 font-bold">
                          {kmapGrid3Var.every((v) => v === 1) && 'F = 1 (Selalu High)'}
                          {kmapGrid3Var.every((v) => v === 0) && 'F = 0 (Selalu Low)'}
                          {!kmapGrid3Var.every((v) => v === 1) && !kmapGrid3Var.every((v) => v === 0) && (
                            <span>
                              <BooleanMath latex="F = \sum m(" />
                              {kmapGrid3Var
                                .map((v, i) => (v === 1 ? i : -1))
                                .filter((i) => i !== -1)
                                .join(', ')}
                              )
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 4: QUINE-MCCLUSKEY METHOD */}
              {simplificationMethod === 'QUINE' && (
                <div className="space-y-4 text-xs text-[#334155]">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-[#1A1C1E] text-sm">Metode Tabulasi Quine-McCluskey (Untuk N ≥ 5 Variabel)</h4>
                    <p className="leading-relaxed">
                      Metode Quine-McCluskey adalah pendekatan algoritmik sistematis yang sangat cocok untuk diprogram dalam komputer ketika variabel fungsi Boolean melebihi kapasitas visual Peta Karnaugh (N ≥ 5).
                    </p>
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 font-mono space-y-3">
                    <span className="text-amber-300 font-bold text-xs block">Tahapan Algoritma Quine-McCluskey:</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                      <div className="bg-slate-800 p-3 rounded border border-slate-700 space-y-1">
                        <strong className="text-blue-400 block">Tahap 1: Pengelompokan Bit 1</strong>
                        <p className="text-slate-300 font-sans text-[11px]">
                          Minterm dikelompokkan berdasarkan jumlah digit 1 (Index Grouping: Group 0, Group 1, Group 2, dst).
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded border border-slate-700 space-y-1">
                        <strong className="text-blue-400 block">Tahap 2: Penggabungan Bit Beda 1</strong>
                        <p className="text-slate-300 font-sans text-[11px]">
                          Bandingkan minterm antar kelompok berdampingan. Jika berbeda tepat 1 bit, gabungkan dan ganti bit beda dengan tanda (-). Hasilnya adalah Prime Implicants (PI).
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded border border-slate-700 space-y-1">
                        <strong className="text-blue-400 block">Tahap 3: Tabel Implicant</strong>
                        <p className="text-slate-300 font-sans text-[11px]">
                          Susun Tabel Prime Implicants untuk memilih Essential Prime Implicants (EPI) guna membentuk fungsi penyederhanaan minimal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOPIC 4: Rangkaian Kombinasional 1 */}
          {activeTopic === 4 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 04 — KOMBINASIONAL 1
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Multiplexer (MUX), Demultiplexer, Encoder, Decoder
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Komponen pemilih jalur data (Multiplexer/Demultiplexer) dan pengkonversi alamat bit (Encoder/Decoder).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#1A1C1E] text-sm">Multiplexer 2:1 & 4:1 (74151)</h4>
                  <p className="text-[#334155] leading-relaxed">
                    Multiplexer bertindak sebagai saklar data digital. Pin bit selektor (SEL) menentukan sinyal masukan mana yang diloloskan menuju pin keluaran tunggal Y.
                  </p>
                  <div className="font-mono text-[11px] text-[#2563EB]">
                    <BooleanMath latex="Y = (D_0 \cdot \overline{SEL}) + (D_1 \cdot SEL)" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#1A1C1E] text-sm">Decoder 2-to-4 (74138)</h4>
                  <p className="text-[#334155] leading-relaxed">
                    Decoder mengkonversi kombinasi N-bit alamat input menjadi satu saluran aktif High dari 2ⁿ saluran output. Digunakan untuk Chip Select memori RAM/ROM.
                  </p>
                </div>
              </div>

              {/* Interactive Widget: MUX 2:1 Simulator */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 block border-b border-slate-800 pb-2">
                  Interaktif: Simulasi Multiplexer 2-ke-1 (2:1 MUX)
                </span>

                <div className="flex flex-wrap items-center justify-around gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-300">Input D0:</span>
                      <button
                        onClick={() => setMuxD0(muxD0 === 1 ? 0 : 1)}
                        className={`w-8 h-8 rounded font-mono font-bold ${muxD0 === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {muxD0}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-300">Input D1:</span>
                      <button
                        onClick={() => setMuxD1(muxD1 === 1 ? 0 : 1)}
                        className={`w-8 h-8 rounded font-mono font-bold ${muxD1 === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {muxD1}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 border-x border-slate-700 px-6">
                    <span className="text-[10px] font-mono text-amber-400">Selektor SEL</span>
                    <button
                      onClick={() => setMuxSel(muxSel === 1 ? 0 : 1)}
                      className={`w-12 h-10 rounded font-mono font-extrabold text-sm ${
                        muxSel === 1 ? 'bg-[#2563EB] text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {muxSel}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {muxSel === 0 ? 'Meloloskan D0' : 'Meloloskan D1'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-300">Output Y</span>
                    <div
                      className={`w-12 h-10 rounded-lg font-mono font-black text-base flex items-center justify-center border ${
                        (muxSel === 0 ? muxD0 : muxD1) === 1
                          ? 'bg-amber-400 text-slate-900 border-amber-300 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {muxSel === 0 ? muxD0 : muxD1}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 5: Rangkaian Kombinasional 2 */}
          {activeTopic === 5 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 05 — KOMBINASIONAL 2 (ARITMATIKA)
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Half/Full Adder, Subtractor & Basic ALU Architecture
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Sirkuit penjumlah biner dasar, penjelas Carry-In / Carry-Out, serta arsitektur Arithmetic Logic Unit (ALU) pada prosesor.
                </p>
              </div>

              {/* Interactive Widget: Full Adder Simulator */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 block border-b border-slate-800 pb-2">
                  Interaktif: Simulator Full Adder (Penjumlah Lengkap Biner)
                </span>

                <div className="flex flex-wrap items-center justify-around gap-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Input A</span>
                      <button
                        onClick={() => setFaA(faA === 1 ? 0 : 1)}
                        className={`w-10 h-10 rounded font-mono font-bold ${faA === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {faA}
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Input B</span>
                      <button
                        onClick={() => setFaB(faB === 1 ? 0 : 1)}
                        className={`w-10 h-10 rounded font-mono font-bold ${faB === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {faB}
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Carry In (CIN)</span>
                      <button
                        onClick={() => setFaCin(faCin === 1 ? 0 : 1)}
                        className={`w-10 h-10 rounded font-mono font-bold ${faCin === 1 ? 'bg-[#2563EB] text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {faCin}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">SUM (A ⊕ B ⊕ CIN)</span>
                      <div className={`w-12 h-10 rounded font-mono font-black text-base flex items-center justify-center border ${faSum === 1 ? 'bg-amber-400 text-slate-900 border-amber-300' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {faSum}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">CARRY OUT (COUT)</span>
                      <div className={`w-12 h-10 rounded font-mono font-black text-base flex items-center justify-center border ${faCout === 1 ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {faCout}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 6: Rangkaian Sekuensial 1 (Latch & Flip-Flop) */}
          {activeTopic === 6 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 06 — RANGKAIAN SEKUANSIAL 1
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Latch dan Flip-Flop (SR, D, JK, T)
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Elemen penyimpan memori 1-bit sekuensial yang bergantung pada status pulsa clock (Edge-Triggered).
                </p>
              </div>

              {/* Interactive Widget: JK Flip-Flop Simulator */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 block border-b border-slate-800 pb-2">
                  Interaktif: Edge-Triggered JK Flip-Flop Simulator
                </span>

                <div className="flex flex-wrap items-center justify-around gap-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Pin J</span>
                      <button
                        onClick={() => setJkJ(jkJ === 1 ? 0 : 1)}
                        className={`w-10 h-10 rounded font-mono font-bold ${jkJ === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {jkJ}
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Pin K</span>
                      <button
                        onClick={() => setJkK(jkK === 1 ? 0 : 1)}
                        className={`w-10 h-10 rounded font-mono font-bold ${jkK === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {jkK}
                      </button>
                    </div>
                  </div>

                  {/* Clock Trigger Pulse Button */}
                  <button
                    onClick={() => {
                      if (jkJ === 0 && jkK === 0) return; // No change
                      if (jkJ === 1 && jkK === 0) setFfQ(1); // Set
                      if (jkJ === 0 && jkK === 1) setFfQ(0); // Reset
                      if (jkJ === 1 && jkK === 1) setFfQ(ffQ === 1 ? 0 : 1); // Toggle
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-lg shadow border border-blue-400 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-300" /> Picu Clock Pulse (↑)
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Output Q</span>
                      <div className={`w-12 h-10 rounded font-mono font-black text-base flex items-center justify-center border ${ffQ === 1 ? 'bg-amber-400 text-slate-900 border-amber-300' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {ffQ}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">Output Q̄</span>
                      <div className={`w-12 h-10 rounded font-mono font-black text-base flex items-center justify-center border ${ffQ === 0 ? 'bg-amber-400 text-slate-900 border-amber-300' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {ffQ === 1 ? 0 : 1}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 7: Register & Counter */}
          {activeTopic === 7 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 07 — MEMORI & PENCACAH CPU
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Register & Counter: Jembatan Menuju Arsitektur CPU
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Penggabungan multiple Flip-Flop membentuk register penyimpan multi-bit data dan pencacah biner (Ripple Counter).
                </p>
              </div>

              {/* Interactive Widget: 4-Bit Synchronous Counter Simulator */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 block border-b border-slate-800 pb-2">
                  Interaktif: Simulator Pencacah Biner 4-Bit (0-15 Counter)
                </span>

                <div className="flex flex-wrap items-center justify-around gap-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setCounterVal((counterVal + 1) % 16)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-lg shadow border border-emerald-400 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-300" /> Pulsa Clock (Increment +1)
                  </button>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Nilai Desimal</span>
                    <span className="text-2xl font-mono font-black text-amber-300">{counterVal}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Biner 4-Bit (Q3 Q2 Q1 Q0)</span>
                    <span className="text-xl font-mono font-black text-emerald-400 tracking-widest">
                      {counterVal.toString(2).padStart(4, '0')}₂
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 8: Pengantar Mikrokontroler & GPIO */}
          {activeTopic === 8 && (
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  BAB 08 — ARSITEKTUR MIKROKONTROLER & GPIO
                </span>
                <h3 className="text-xl font-extrabold text-[#1A1C1E] mt-2">
                  Pengantar Mikrokontroler, Memory Mapping & GPIO Register
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Kaitan antara instruksi perangkat lunak (C/C++) dengan register fisik (DDRx, PORTx, PINx) di dalam hardware mikrokontroler.
                </p>
              </div>

              {/* Interactive Widget: Hardware GPIO Register Visualizer */}
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 block border-b border-slate-800 pb-2">
                  Interaktif: Simulasi Register GPIO (DDRx & PORTx Latch)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
                    <span className="text-blue-400 font-bold block">1. Set Data Direction Register (DDRB)</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">DDRB Pin 0 Status:</span>
                      <button
                        onClick={() => setDdrVal(ddrVal === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded font-bold ${
                          ddrVal === 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {ddrVal === 1 ? 'OUTPUT (1)' : 'INPUT (0)'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
                    <span className="text-blue-400 font-bold block">2. Set Output Latch Register (PORTB)</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">PORTB Pin 0 Latch:</span>
                      <button
                        onClick={() => setPortVal(portVal === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded font-bold ${
                          portVal === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {portVal === 1 ? 'HIGH (1 / VCC)' : 'LOW (0 / GND)'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block">Status Fisik Pin GPIO Terukur:</span>
                  <div className="mt-1 flex items-center justify-center gap-3">
                    <span className="text-xs text-slate-300">Pin PB0:</span>
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-extrabold ${
                        ddrVal === 1 && portVal === 1
                          ? 'bg-amber-400 text-slate-900 animate-pulse'
                          : 'bg-slate-700 text-slate-500'
                      }`}
                    >
                      {ddrVal === 1 && portVal === 1 ? '5.0V HIGH (LED ON)' : '0.0V LOW (LED OFF)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
