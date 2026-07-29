import React from 'react';
import { AppTabMode, PracticumModule } from '../types';
import { Cpu, CircuitBoard, BookOpen, CheckCircle2, FileText, Cpu as ChipIcon, Download, Upload, GraduationCap, Box } from 'lucide-react';

interface HeaderProps {
  currentTab: AppTabMode;
  setCurrentTab: (tab: AppTabMode) => void;
  activeModule: PracticumModule;
  onSelectModule: (modId: string) => void;
  allModules: PracticumModule[];
  onExportJSON?: () => void;
  onImportJSON?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeModule,
  onSelectModule,
  allModules,
  onExportJSON,
  onImportJSON,
}) => {
  const tabs: { id: AppTabMode; label: string; icon: React.ReactNode }[] = [
    { id: 'SIMULATOR', label: 'Simulator Workbench', icon: <CircuitBoard className="w-4 h-4" /> },
    { id: 'SIMULATOR_3D', label: 'Simulasi 3D Lab', icon: <Box className="w-4 h-4 text-emerald-600" /> },
    { id: 'THEORY', label: 'Bank Teori (8 Bab)', icon: <BookOpen className="w-4 h-4 text-blue-600" /> },
    { id: 'LAB_EXERCISES', label: 'File Latihan & Modul', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'VALIDATOR', label: 'Uji Tabel Kebenaran', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'REPORT', label: 'Laporan & Export', icon: <FileText className="w-4 h-4" /> },
    { id: 'DATASHEETS', label: 'Datasheet IC 74xx', icon: <ChipIcon className="w-4 h-4" /> },
    { id: 'CURRICULUM', label: 'RPS & Kurikulum PjBL', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D1D5DB] text-[#1A1C1E] shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-[#1A1C1E]">
                LogicLab <span className="text-[#2563EB]">Simulator</span>
              </h1>
              <span className="px-2 py-0.5 bg-[#E0E7FF] text-[#4338CA] text-[10px] font-bold uppercase rounded font-mono">
                Teknik Digital
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#1D4ED8] hidden sm:block">
              Dikembangkan Oleh Tim Peneliti Dosen Teknik Informatika Universitas Indonesia Timur
            </p>
          </div>
        </div>

        {/* Active Exercise Picker Dropdown */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
          <span className="text-[11px] font-bold text-[#64748B] uppercase font-mono hidden md:inline">
            File Latihan:
          </span>
          <select
            value={activeModule.id}
            onChange={(e) => onSelectModule(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#1A1C1E] focus:outline-none cursor-pointer max-w-[240px] truncate"
          >
            {allModules.map((m) => (
              <option key={m.id} value={m.id} className="bg-white text-[#1A1C1E]">
                {m.code}: {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigation Controls */}
        <nav className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#CBD5E1] overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20 font-extrabold'
                    : 'text-[#64748B] hover:text-[#1A1C1E] hover:bg-white/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Import / Save Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          {onExportJSON && (
            <button
              onClick={onExportJSON}
              title="Simpan File Rangkaian (.json)"
              className="px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#334155] flex items-center gap-1 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Simpan</span>
            </button>
          )}

          {onImportJSON && (
            <label
              title="Buka File Rangkaian (.json)"
              className="px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#334155] flex items-center gap-1 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#059669]" />
              <span>Buka</span>
              <input type="file" accept=".json" onChange={onImportJSON} className="hidden" />
            </label>
          )}
        </div>
      </div>
    </header>
  );
};

