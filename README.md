# Aplikasi Laboratorium Virtual Sistem Digital & Mikrokontroler (DRUCOK Framework)

> **Kredit Pengembangan Resmi:**
> Aplikasi ini dikembangkan oleh **Tim Peneliti Dosen Teknik Informatika Universitas Indonesia Timur (UIT)** untuk mendukung pembelajaran interaktif Project-Based Learning (PjBL) 16 Minggu pada mata kuliah Sistem Digital, Arsitektur Komputer, dan Mikrokontroler.

---

## 📌 Gambaran Umum (Overview)

Aplikasi Virtual Lab Sistem Digital ini merupakan platform edukasi interaktif berbasis web yang memadukan **Landasan Teori Komprehensif**, **Simulasi Rangkaian Logika Real-Time**, dan **Kerangka Kerja Pembelajaran PjBL DRUCOK** (Demonstrating, Researching, Understanding, Creating, Operating, Knowledge Sharing).

Platform ini dirancang untuk memberikan pengalaman praktikum hands-on tanpa perangkat fisik, memungkinkan mahasiswa mendesain, menguji, dan memverifikasi fungsi gerbang logika, rangkaian kombinasional/sekuensial, hingga register GPIO mikrokontroler.

---

## 🚀 Fitur-Fitur Utama Aplikasi

### 1. Modul Pembelajaran DRUCOK (6 Fase Pembelajaran)
Setiap modul praktikum disusun secara terstruktur mengikuti siklus 6 fase DRUCOK:
* **Demonstrating Phase**: Demonstrasi visual konsep dasar & video/tampilan pengenalan modul.
* **Researching Phase**: Studi literatur, pengamatan spesifikasi praktikum, dan analisis masalah.
* **Understanding Phase**: Penyusunan tabel kebenaran interaktif, penyederhanaan fungsi Boolean, dan verifikasi ekspresi matematika.
* **Creating Phase (Interactive Logic Canvas)**:
  * Workspace interaktif berbasis **ReactFlow** dengan pilihan background (Breadboard Grid, Dots, Blank).
  * Dukungan *Snap to Grid* (20px) untuk kerapian penataan komponen.
  * Pustaka Komponen Lengkap:
    * **Input**: Switch Logika (HIGH/LOW), Clock Pulse Generator, Constant VCC / GND.
    * **Gerbang Logika Utama**: AND, OR, NOT, NAND, NOR, XOR, XNOR (2-Input & Multi-Input).
    * **Rangkaian Kombinasional**: MUX (Multiplexer), DEMUX, Decoder 2-to-4, Encoder 4-to-2, Half/Full Adder, Subtractor.
    * **Rangkaian Sekuensial**: D Flip-Flop, JK Flip-Flop, SR Latch, T Flip-Flop, 4-Bit Counter, Shift Register.
    * **Output & Visualizer**: Lampu LED, Display 7-Segment (Hex/Biner Decoder), Logic Probe Indicator.
    * **Integrated Circuits (IC)**: IC 7400, IC 7402, IC 7404, IC 7408, IC 7432, IC 7486 dengan diagram pinout lengkap.
  * **Fitur Manajemen & Penghapusan Garis Penghubung (Wires / Edges)**:
    * **Hapus Garis Individu**: Tombol interaktif `X / Hapus` pada setiap garis kabel dengan indikator tegangan sinyal real-time (5V HIGH / 0V LOW).
    * **Fitur Klik-Kanan (Context Menu)**: Menu navigasi cepat saat klik kanan pada garis kabel untuk menghapus garis tunggal atau seluruh garis.
    * **Pembersihan Massal**: Tombol **"Bersihkan Kabel"** di toolbar atas untuk menghapus semua koneksi kabel dalam sekali klik.
    * **Panel Floating Terpilih**: Widget melayang saat garis dipilih dengan statistik garis aktif.
    * **Dukungan Pintasan Keyboard**: Penghapusan garis cepat menggunakan tombol `Delete` atau `Backspace`.
* **Operating Phase**: Pengujian simulasi sinyal waktu nyata (real-time propagation) untuk mengamati respons output berdasarkan kombinasi saklar input.
* **Knowledge Sharing Phase**:
  * Generator Kode Ekspor Otomatis (**Vibe Code**): Menghasilkan skrip VHDL, Verilog, Arduino C/C++, dan Logisim format dari rangkaian yang dirancang.
  * Fitur Tangkapan Layar (Screenshot) & Ekspor Laporan Praktikum PDF/Gambar.

---

### 2. Bank Teori Digital Kompleks (Digital Theory Bank - 8 Bab)
Materi teori komprehensif yang mengacu pada kurikulum akademik dan literatur riset (*Eko Martanto, 2020* & *Ahmed Jamili Rangkuti, 2013*):

1. **Bab 01 — Pengantar Sistem Digital & Sistem Bilangan**:
   * Konsep sinyal analog vs diskrit digital.
   * **Kalkulator Konversi Bilangan Real-Time**: Konversi otomatis antar basis Desimal (Base 10), Biner (Base 2 / 8-bit), Heksadesimal (Base 16 / 0x), dan Oktal (Base 8).
2. **Bab 02 — Aljabar Boolean & Hukum-Hukum Kompleks**:
   * Penjelasan 12 Hukum Aljabar Boolean: *Identitas, Idempoten, Komplement, Dominansi, Involusi, Komutatif, Asosiatif, Distributif, Absorpsi, De Morgan, Konsensus, dan Prinsip Dualitas*.
   * **Penguji Bukti Real-Time (Proof Tester)**: Uji kebenaran matematis Ruas Kiri (LHS) vs Ruas Kanan (RHS) secara dinamis.
   * **Simulator 7 Gerbang Logika Utama** (AND, OR, NOT, NAND, NOR, XOR, XNOR) dengan tabel kebenaran interaktif.
3. **Bab 03 — Penyederhanaan Fungsi Boolean**:
   * **Metode Aljabar**: Studi kasus penyelesaian langkah demi langkah (*step-by-step walkthrough*).
   * **Bentuk Kanonik**: Perbandingan Sum of Products (SOP / Minterm) & Product of Sums (POS / Maxterm).
   * **Peta Karnaugh (K-Map)**: Simulator K-Map 2-variabel dan 3-variabel interaktif dengan penentuan SOP otomatis.
   * **Metode Tabulasi Quine-McCluskey**: Algoritma minimasi untuk fungsi berdimensi tinggi (N ≥ 5 variabel).
4. **Bab 04 — Rangkaian Kombinasional 1**:
   * Prinsip kerja Multiplexer (MUX 2:1 / 4:1), Demultiplexer (DEMUX), Encoder, dan Decoder dengan simulator sinyal selektor.
5. **Bab 05 — Rangkaian Kombinasional 2**:
   * Pemrosesan Aritmatika Biner: Half Adder, Full Adder (dengan perhitungan Carry-In & Carry-Out), Half/Full Subtractor, serta pengenalan Arithmetic Logic Unit (ALU).
6. **Bab 06 — Rangkaian Sekuensial 1**:
   * Konsep elemen penyimpan data: Latch SR, Flip-Flop D (Data), Flip-Flop JK (dengan toggle state), dan Flip-Flop T.
7. **Bab 07 — Rangkaian Sekuensial 2**:
   * Register Geser (Shift Register) dan Counter 4-Bit Sinkron dengan visualisasi transisi pulsa detak (Clock Transition) hingga hirarki CPU.
8. **Bab 08 — Pengantar Mikrokontroler & Registrasi GPIO**:
   * Pemrograman siber-fisik rendah level: Register DDR (Data Direction Register: Input/Output) dan PORT (Data Register: HIGH/LOW) untuk pin GPIO mikrokontroler.

---

### 3. Modul Modul Praktikum Terstruktur (Lab Exercises)
Daftar modul praktikum siap pakai sesuai kurikulum:
1. **Praktikum 1**: Gerbang Logika Dasar & Hukum De Morgan.
2. **Praktikum 2**: Rangkaian Penjumlahan Aritmatika (Full Adder & Subtractor).
3. **Praktikum 3**: Rangkaian Multiplexer 4-ke-1 & Demultiplexer.
4. **Praktikum 4**: Desain Counter Biner 4-Bit Menggunakan JK Flip-Flop.
5. **Praktikum 5**: Pemrograman Register GPIO Mikrokontroler & Interface LED.

---

## 🛠️ Teknologi & Arsitektur Perangkat Lunak

* **Frontend Framework**: React 18 dengan TypeScript.
* **Build Tool & Bundler**: Vite.
* **Styling**: Tailwind CSS (Utility-First Design) dengan estetika UI modern & tinggi aksesibilitas.
* **Canvas Rangkaian**: `@xyflow/react` (ReactFlow v12) untuk rendering node digital & penanganan kabel terarah.
* **Rendering Formula Matematika**: KaTeX & `react-katex` untuk visualisasi notasi Aljabar Boolean LaTeX.
* **Ikonografi**: `lucide-react`.
* **Mesin Evaluasi Sinyal (`logicEngine.ts`)**: Evaluator graf terarah (*Directed Acyclic & Cyclic Graph Evaluator*) kustom untuk kalkulasi sinyal biner real-time.

---

## 💻 Panduan Menjalankan Aplikasi Secara Lokal

### Prasyarat
* Node.js (versi 18.0 atau yang lebih baru)
* npm atau yarn

### Langkah-Langkah Instalasi & Pengoperasian

1. **Clone Repositori**:
   ```bash
   git clone <URL_REPOSITORI>
   cd <NAMA_DIREKTORI>
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Akses Aplikasi**:
   Buka peramban (browser) dan akses alamat `http://localhost:3000`.

5. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 📄 Lisensi & Hak Cipta

© 2026 **Tim Peneliti Dosen Teknik Informatika - Universitas Indonesia Timur (UIT)**. Hak Cipta Dilindungi Undang-Undang. Diterbitkan untuk tujuan pendidikan dan riset akademik.
