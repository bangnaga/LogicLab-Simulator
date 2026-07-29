import React, { useState } from 'react';
import {
  Search,
  Power,
  Sun,
  Radio,
  Clock,
  Cpu,
  Lightbulb,
  Zap,
  Fan,
  Volume2,
  Thermometer,
  Layers,
  CircuitBoard,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export interface ComponentItem {
  type: string;
  label: string;
  pinLabel?: string;
  category: 'gate' | 'ic' | 'input' | 'output';
  description: string;
  icNumber?: string;
  badge?: string;
  color: string;
  icon: React.ReactNode;
}

interface ComponentLibraryProps {
  onAddComponent: (type: string, label: string, defaultPinLabel?: string) => void;
}

export const COMPONENT_CATALOG: ComponentItem[] = [
  // --- 1. CONTROLS & SENSORS (INPUTS) ---
  {
    type: 'input_switch',
    label: 'Saklar Toggle',
    pinLabel: 'SW_IN',
    category: 'input',
    description: 'Saklar masukan logika manual (0 / 1)',
    badge: 'Input',
    color: 'emerald',
    icon: <Power className="w-4 h-4 text-emerald-600" />,
  },
  {
    type: 'input_push',
    label: 'Push Button',
    pinLabel: 'BTN_IN',
    category: 'input',
    description: 'Tombol tekan sesaat (Momentary HIGH)',
    badge: 'Input',
    color: 'blue',
    icon: <Power className="w-4 h-4 text-blue-600" />,
  },
  {
    type: 'input_high',
    label: 'Konstan HIGH (+5V)',
    pinLabel: 'VCC',
    category: 'input',
    description: 'Tegangan logika tetap HIGH (1)',
    badge: '+5V',
    color: 'red',
    icon: <Zap className="w-4 h-4 text-red-600" />,
  },
  {
    type: 'input_low',
    label: 'Konstan LOW (GND)',
    pinLabel: 'GND',
    category: 'input',
    description: 'Ground logika tetap LOW (0)',
    badge: 'GND',
    color: 'slate',
    icon: <Zap className="w-4 h-4 text-slate-500" />,
  },
  {
    type: 'input_sensor_light',
    label: 'Sensor LDR Cahaya',
    pinLabel: 'LGT_SENS',
    category: 'input',
    description: 'Sensor intensitas cahaya (Lux / Gelap)',
    badge: 'Sensor',
    color: 'amber',
    icon: <Sun className="w-4 h-4 text-amber-600" />,
  },
  {
    type: 'input_sensor_pir',
    label: 'Sensor PIR Gerak',
    pinLabel: 'PIR_SENS',
    category: 'input',
    description: 'Sensor deteksi gerakan inframerah',
    badge: 'Sensor',
    color: 'cyan',
    icon: <Radio className="w-4 h-4 text-cyan-600" />,
  },
  {
    type: 'input_sensor_temp',
    label: 'Sensor Suhu (LM35)',
    pinLabel: 'TEMP_SENS',
    category: 'input',
    description: 'Sensor ambang batas temperatur (°C)',
    badge: 'Sensor',
    color: 'rose',
    icon: <Thermometer className="w-4 h-4 text-rose-600" />,
  },
  {
    type: 'input_clock',
    label: 'Clock Generator 1Hz',
    pinLabel: 'CLK_1HZ',
    category: 'input',
    description: 'Pembangkit pulsa pewaktu sekuensial',
    badge: 'Pulse',
    color: 'purple',
    icon: <Clock className="w-4 h-4 text-purple-600" />,
  },

  // --- 2. BASIC LOGIC GATES ---
  {
    type: 'gate_and',
    label: 'Gerbang AND',
    pinLabel: 'AND',
    category: 'gate',
    description: 'HIGH jika SEMUA input bernilai 1 (Y = A · B)',
    badge: 'Logic Gate',
    color: 'blue',
    icon: <CircuitBoard className="w-4 h-4 text-blue-600" />,
  },
  {
    type: 'gate_or',
    label: 'Gerbang OR',
    pinLabel: 'OR',
    category: 'gate',
    description: 'HIGH jika MINIMAL SALAH SATU input bernilai 1 (Y = A + B)',
    badge: 'Logic Gate',
    color: 'indigo',
    icon: <CircuitBoard className="w-4 h-4 text-indigo-600" />,
  },
  {
    type: 'gate_not',
    label: 'Gerbang NOT (Inverter)',
    pinLabel: 'NOT',
    category: 'gate',
    description: 'Pembalik sinyal logika (Y = A\')',
    badge: 'Logic Gate',
    color: 'violet',
    icon: <CircuitBoard className="w-4 h-4 text-violet-600" />,
  },
  {
    type: 'gate_nand',
    label: 'Gerbang NAND',
    pinLabel: 'NAND',
    category: 'gate',
    description: 'Kombinasi AND diikuti Inverter NOT (Y = (A · B)\')',
    badge: 'Universal',
    color: 'pink',
    icon: <CircuitBoard className="w-4 h-4 text-pink-600" />,
  },
  {
    type: 'gate_nor',
    label: 'Gerbang NOR',
    pinLabel: 'NOR',
    category: 'gate',
    description: 'Kombinasi OR diikuti Inverter NOT (Y = (A + B)\')',
    badge: 'Universal',
    color: 'fuchsia',
    icon: <CircuitBoard className="w-4 h-4 text-fuchsia-600" />,
  },
  {
    type: 'gate_xor',
    label: 'Gerbang XOR',
    pinLabel: 'XOR',
    category: 'gate',
    description: 'Exclusive-OR, HIGH jika input BERBEDA (Y = A ⊕ B)',
    badge: 'Arithmetic',
    color: 'sky',
    icon: <CircuitBoard className="w-4 h-4 text-sky-600" />,
  },
  {
    type: 'gate_xnor',
    label: 'Gerbang XNOR',
    pinLabel: 'XNOR',
    category: 'gate',
    description: 'Exclusive-NOR, HIGH jika input SAMA (Y = (A ⊕ B)\')',
    badge: 'Equality',
    color: 'teal',
    icon: <CircuitBoard className="w-4 h-4 text-teal-600" />,
  },

  // --- 3. DIGITAL TTL INTEGRATED CIRCUITS (DIP ICs & FLIP-FLOPS) ---
  {
    type: 'ic_7408',
    label: 'IC 7408 (Quad 2-Input AND)',
    pinLabel: 'IC7408',
    category: 'ic',
    description: 'Chip 14-pin DIP berisi 4 gerbang AND independen',
    icNumber: '7408',
    badge: 'IC DIP-14',
    color: 'amber',
    icon: <Cpu className="w-4 h-4 text-amber-600" />,
  },
  {
    type: 'ic_7432',
    label: 'IC 7432 (Quad 2-Input OR)',
    pinLabel: 'IC7432',
    category: 'ic',
    description: 'Chip 14-pin DIP berisi 4 gerbang OR independen',
    icNumber: '7432',
    badge: 'IC DIP-14',
    color: 'amber',
    icon: <Cpu className="w-4 h-4 text-amber-600" />,
  },
  {
    type: 'ic_7404',
    label: 'IC 7404 (Hex Inverter NOT)',
    pinLabel: 'IC7404',
    category: 'ic',
    description: 'Chip 14-pin DIP berisi 6 pembalik sinyal NOT',
    icNumber: '7404',
    badge: 'IC DIP-14',
    color: 'amber',
    icon: <Cpu className="w-4 h-4 text-amber-600" />,
  },
  {
    type: 'ic_7400',
    label: 'IC 7400 (Quad 2-Input NAND)',
    pinLabel: 'IC7400',
    category: 'ic',
    description: 'Chip 14-pin DIP berisi 4 gerbang Universal NAND',
    icNumber: '7400',
    badge: 'IC DIP-14',
    color: 'amber',
    icon: <Cpu className="w-4 h-4 text-amber-600" />,
  },
  {
    type: 'ic_7486',
    label: 'IC 7486 (Quad 2-Input XOR)',
    pinLabel: 'IC7486',
    category: 'ic',
    description: 'Chip 14-pin DIP berisi 4 gerbang XOR',
    icNumber: '7486',
    badge: 'IC DIP-14',
    color: 'amber',
    icon: <Cpu className="w-4 h-4 text-amber-600" />,
  },
  {
    type: 'ff_d',
    label: 'IC 7474 (Dual D Flip-Flop)',
    pinLabel: 'IC7474',
    category: 'ic',
    description: 'Memori sekuensial D Flip-Flop dipicu tepi clock positif',
    icNumber: '7474',
    badge: 'Flip-Flop',
    color: 'purple',
    icon: <Cpu className="w-4 h-4 text-purple-600" />,
  },
  {
    type: 'ff_jk',
    label: 'IC 7476 (Dual JK Flip-Flop)',
    pinLabel: 'IC7476',
    category: 'ic',
    description: 'Memori sekuensial JK dengan fitur Toggle & Reset',
    icNumber: '7476',
    badge: 'Flip-Flop',
    color: 'purple',
    icon: <Cpu className="w-4 h-4 text-purple-600" />,
  },
  {
    type: 'ff_sr',
    label: 'SR Latch Memori',
    pinLabel: 'SR_LATCH',
    category: 'ic',
    description: 'Set-Reset Bistable Latch dasar',
    badge: 'Sequential',
    color: 'indigo',
    icon: <Cpu className="w-4 h-4 text-indigo-600" />,
  },

  // --- 4. OUTPUTS & ACTUATORS ---
  {
    type: 'output_bulb',
    label: 'Bohlam Lampu Utama',
    pinLabel: 'LIGHT_OUT',
    category: 'output',
    description: 'Indikator penerangan daya tinggi 220V',
    badge: 'Load',
    color: 'amber',
    icon: <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-300" />,
  },
  {
    type: 'output_led',
    label: 'Lampu LED Indikator',
    pinLabel: 'LED_OUT',
    category: 'output',
    description: 'Diode pemancar cahaya status logika (0/1)',
    badge: 'Display',
    color: 'red',
    icon: <Zap className="w-4 h-4 text-red-600" />,
  },
  {
    type: 'output_relay',
    label: 'Relay & Kipas Pendingin',
    pinLabel: 'RELAY_FAN',
    category: 'output',
    description: 'Saklar elektromagnetik drive kipas exhaust',
    badge: 'Actuator',
    color: 'orange',
    icon: <Fan className="w-4 h-4 text-orange-600" />,
  },
  {
    type: 'output_motor',
    label: 'Pompa Air / Motor DC',
    pinLabel: 'PUMP_OUT',
    category: 'output',
    description: 'Driver elektromotor sistem pengairan',
    badge: 'Motor',
    color: 'blue',
    icon: <CircuitBoard className="w-4 h-4 text-blue-600" />,
  },
  {
    type: 'output_buzzer',
    label: 'Buzzer Sirine Alarm',
    pinLabel: 'BUZZER_OUT',
    category: 'output',
    description: 'Indikator suara peringatan frekuensi tinggi',
    badge: 'Audio',
    color: 'rose',
    icon: <Volume2 className="w-4 h-4 text-rose-600" />,
  },
];

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'gate' | 'ic' | 'input' | 'output'>('all');

  const filteredComponents = COMPONENT_CATALOG.filter((comp) => {
    const matchesCategory = activeCategory === 'all' || comp.category === activeCategory;
    const matchesQuery =
      comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.icNumber && comp.icNumber.includes(searchQuery));
    return matchesCategory && matchesQuery;
  });

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    comp: ComponentItem
  ) => {
    event.dataTransfer.setData('application/reactflow/type', comp.type);
    event.dataTransfer.setData('application/reactflow/label', comp.label);
    event.dataTransfer.setData('application/reactflow/pin', comp.pinLabel || '');
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-xl p-3.5 space-y-3.5 shadow-sm text-[#1A1C1E]">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#2563EB] text-white rounded-lg shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1C1E]">
              Pustaka Komponen
            </h3>
            <span className="text-[10px] text-[#64748B] font-medium block">
              Drag ke canvas atau klik untuk menambah
            </span>
          </div>
        </div>
        <span className="text-[10px] font-extrabold bg-[#F1F5F9] text-[#2563EB] px-2 py-0.5 rounded-full border border-[#CBD5E1]">
          {filteredComponents.length} Item
        </span>
      </div>

      {/* Instant Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari IC (7408), Gerbang, Sensor..."
          className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:bg-white focus:outline-none rounded-lg text-xs transition-all placeholder:text-[#94A3B8]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#64748B] hover:text-[#1A1C1E] bg-[#E2E8F0] px-1 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A1C1E]'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveCategory('gate')}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeCategory === 'gate'
              ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A1C1E]'
          }`}
        >
          Gerbang
        </button>
        <button
          onClick={() => setActiveCategory('ic')}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeCategory === 'ic'
              ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A1C1E]'
          }`}
        >
          IC TTL
        </button>
        <button
          onClick={() => setActiveCategory('input')}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeCategory === 'input'
              ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A1C1E]'
          }`}
        >
          Input/Sensor
        </button>
        <button
          onClick={() => setActiveCategory('output')}
          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
            activeCategory === 'output'
              ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A1C1E]'
          }`}
        >
          Output
        </button>
      </div>

      {/* Component Cards Scrollable List */}
      <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredComponents.length === 0 ? (
          <div className="p-6 text-center text-[#64748B] bg-[#F8FAFC] rounded-lg border border-dashed border-[#CBD5E1]">
            <Info className="w-6 h-6 mx-auto mb-1 text-[#94A3B8]" />
            <span className="text-xs font-semibold block">Komponen tidak ditemukan</span>
            <span className="text-[10px] text-[#94A3B8]">Coba ubah kata kunci pencarian.</span>
          </div>
        ) : (
          filteredComponents.map((comp) => (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => onDragStart(e, comp)}
              onClick={() => onAddComponent(comp.type, comp.label, comp.pinLabel)}
              className="group cursor-grab active:cursor-grabbing p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] transition-all shadow-xs hover:shadow-sm flex items-start gap-2.5 relative select-none"
            >
              {/* Component Icon / Avatar */}
              <div className="p-1.5 rounded-md bg-white border border-[#CBD5E1] shadow-2xs group-hover:border-[#2563EB] transition-colors shrink-0 mt-0.5">
                {comp.icon}
              </div>

              {/* Main Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-[#1A1C1E] truncate group-hover:text-[#2563EB] transition-colors">
                    {comp.label}
                  </h4>
                  {comp.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#475569] shrink-0">
                      {comp.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#64748B] leading-tight line-clamp-2">
                  {comp.description}
                </p>
              </div>

              {/* Hover Cue */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bottom-1.5 text-[9px] font-bold text-[#2563EB] flex items-center gap-0.5 bg-white/80 px-1 rounded">
                <Sparkles className="w-2.5 h-2.5" /> +Tambah
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-[#E2E8F0] text-[10px] text-[#64748B] flex items-center justify-between">
        <span>💡 Tips: Drag komponen langsung ke atas papan Breadboard!</span>
      </div>
    </div>
  );
};
