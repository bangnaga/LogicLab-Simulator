import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Power, Flame, Radio, Sun, Zap, Fan, Volume2, Lightbulb, Cpu } from 'lucide-react';
import { LogicNodeData } from '../../utils/logicEngine';
import { BooleanMath, BOOLEAN_IC_DATA } from '../BooleanMath';
import { ICPackageDiagram } from '../ICPackageDiagram';
import { DFlipFlopNode } from './DFlipFlopNode';

// Common badge for HIGH / LOW state
export const SignalBadge: React.FC<{ value?: number }> = ({ value }) => {
  const isHigh = value === 1;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold transition-all shadow-sm ${
        isHigh
          ? 'bg-[#DC2626] text-white ring-2 ring-red-200'
          : 'bg-[#E2E8F0] text-[#475569] ring-1 ring-[#CBD5E1]'
      }`}
    >
      {isHigh ? '1 (HIGH +5V)' : '0 (LOW 0V)'}
    </span>
  );
};

// 1. Input Switch Node (Logic.ly Style Toggle Switch)
export const InputSwitchNode: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const isHigh = nodeData.value === 1;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeData.onToggle) {
      (nodeData.onToggle as (id: string, newVal: number) => void)(id, isHigh ? 0 : 1);
    }
  };

  return (
    <div className="bg-white border-2 border-[#334155] rounded-xl p-3 min-w-[170px] shadow-md text-[#1A1C1E] hover:border-[#2563EB] transition-all select-none">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E2E8F0]">
        <span className="text-[11px] font-bold text-[#64748B] font-mono uppercase tracking-wider">
          {nodeData.pinLabel || 'SWITCH'}
        </span>
        <SignalBadge value={nodeData.value} />
      </div>

      <div className="text-xs font-bold mb-2 text-[#1A1C1E]">{nodeData.label || 'Saklar Toggle'}</div>

      {/* Logic.ly Mechanical Lever Toggle Button */}
      <button
        onClick={handleToggle}
        className={`w-full py-2 px-3 rounded-lg flex items-center justify-between font-bold text-xs transition-all duration-200 border-2 active:scale-95 ${
          isHigh
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
            : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] border-[#CBD5E1]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Power className={`w-4 h-4 ${isHigh ? 'text-white animate-pulse' : 'text-[#64748B]'}`} />
          <span>{isHigh ? 'TOGGLE ON' : 'TOGGLE OFF'}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${isHigh ? 'bg-emerald-700 text-white' : 'bg-[#CBD5E1] text-[#334155]'}`}>
          {isHigh ? '1' : '0'}
        </span>
      </button>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-4 !h-4 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-200' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 1b. Logic.ly Push Button Node (Momentary Switch)
export const PushButtonNode: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const isHigh = nodeData.value === 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeData.onToggle) {
      (nodeData.onToggle as (id: string, newVal: number) => void)(id, 1);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeData.onToggle) {
      (nodeData.onToggle as (id: string, newVal: number) => void)(id, 0);
    }
  };

  return (
    <div className="bg-white border-2 border-[#334155] rounded-xl p-3 min-w-[170px] shadow-md text-[#1A1C1E] select-none">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E2E8F0]">
        <span className="text-[11px] font-bold text-[#64748B] font-mono uppercase tracking-wider">
          {nodeData.pinLabel || 'PUSH_BTN'}
        </span>
        <SignalBadge value={nodeData.value} />
      </div>

      <div className="text-xs font-bold mb-2 text-[#1A1C1E]">{nodeData.label || 'Push Button'}</div>

      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
          isHigh
            ? 'bg-[#2563EB] text-white border-blue-700 shadow-md shadow-blue-500/30'
            : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]'
        }`}
      >
        <span className={`w-3 h-3 rounded-full ${isHigh ? 'bg-white animate-ping' : 'bg-[#94A3B8]'}`} />
        <span>{isHigh ? 'TEKAN (HIGH 1)' : 'LEPAS (LOW 0)'}</span>
      </button>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-4 !h-4 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-200' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 1c. Logic.ly Constant High (1) / Low (0) Nodes
export const ConstantValueNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const isHigh = nodeData.type === 'input_high';

  return (
    <div className={`border-2 rounded-xl p-2.5 min-w-[110px] shadow-md text-center text-white font-mono select-none ${
      isHigh ? 'bg-[#DC2626] border-red-700' : 'bg-[#475569] border-[#1E293B]'
    }`}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
        {isHigh ? 'HIGH (+5V)' : 'LOW (0V)'}
      </div>
      <div className="text-xl font-black my-0.5">{isHigh ? '1' : '0'}</div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-4 !h-4 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-200' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 2. Pulse Clock Node
export const InputClockNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const isHigh = nodeData.value === 1;

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 min-w-[170px] shadow-sm text-[#1A1C1E]">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E2E8F0]">
        <span className="text-xs font-bold text-[#4338CA] uppercase tracking-wider">
          {nodeData.pinLabel || 'CLOCK_1HZ'}
        </span>
        <SignalBadge value={nodeData.value} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${isHigh ? 'bg-[#4338CA] animate-ping' : 'bg-[#CBD5E1]'}`} />
        <span className="text-sm font-bold text-[#1A1C1E]">Generator Pulsa</span>
      </div>

      <div className="text-[11px] text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded font-mono border border-[#E2E8F0]">
        Frekuensi: 1 Hz (1 Sec)
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3.5 !h-3.5 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-300' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 3. Sensor Suhu Node (IoT)
export const SensorTempNode: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const temp = nodeData.tempValue ?? 25;
  const isHigh = temp >= 30;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    if (nodeData.onChangeTemp) {
      (nodeData.onChangeTemp as (id: string, val: number) => void)(id, val);
    }
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 min-w-[200px] shadow-sm text-[#1A1C1E]">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#E2E8F0]">
        <span className="text-xs font-bold text-[#D97706] flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> {nodeData.pinLabel || 'TEMP_SENS'}
        </span>
        <SignalBadge value={isHigh ? 1 : 0} />
      </div>

      <div className="text-sm font-bold mb-2 text-[#1A1C1E]">Sensor Suhu Ruang</div>

      <div className="bg-[#F8FAFC] p-2 rounded-lg mb-2 border border-[#E2E8F0]">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-[#64748B]">Pembacaan:</span>
          <span className={`font-mono font-bold ${isHigh ? 'text-[#D97706]' : 'text-emerald-600'}`}>
            {temp}°C
          </span>
        </div>
        <input
          type="range"
          min="15"
          max="50"
          step="1"
          value={temp}
          onChange={handleChange}
          className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#D97706]"
        />
        <div className="text-[10px] text-[#64748B] mt-1">Threshold High: &ge; 30°C</div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3.5 !h-3.5 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-300' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 4. Sensor PIR Motion Node
export const SensorPIRNode: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const isMotion = !!nodeData.motionValue;

  const handleMotion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeData.onToggleMotion) {
      (nodeData.onToggleMotion as (id: string, val: boolean) => void)(id, !isMotion);
    }
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 min-w-[180px] shadow-sm text-[#1A1C1E]">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#E2E8F0]">
        <span className="text-xs font-bold text-cyan-700 flex items-center gap-1">
          <Radio className="w-3.5 h-3.5" /> {nodeData.pinLabel || 'PIR_SENS'}
        </span>
        <SignalBadge value={isMotion ? 1 : 0} />
      </div>

      <div className="text-sm font-bold mb-2 text-[#1A1C1E]">Sensor Gerak PIR</div>

      <button
        onClick={handleMotion}
        className={`w-full py-2 px-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
          isMotion
            ? 'bg-cyan-600 text-white animate-pulse hover:bg-cyan-700'
            : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] border border-[#CBD5E1]'
        }`}
      >
        {isMotion ? '⚠️ GERAKAN DETEKSI (1)' : 'STANDBY (0)'}
      </button>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3.5 !h-3.5 !border-2 ${
          isMotion ? '!bg-[#DC2626] !border-red-300' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 4b. Sensor Cahaya LDR Node
export const SensorLightNode: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const lux = nodeData.tempValue ?? 20; // <50 = Gelap (0), >=50 = Terang (1)
  const isBright = lux >= 50;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    if (nodeData.onChangeTemp) {
      (nodeData.onChangeTemp as (id: string, val: number) => void)(id, val);
    }
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 min-w-[200px] shadow-sm text-[#1A1C1E]">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#E2E8F0]">
        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
          <Sun className="w-3.5 h-3.5" /> {nodeData.pinLabel || 'LGT_SENS'}
        </span>
        <SignalBadge value={isBright ? 1 : 0} />
      </div>

      <div className="text-sm font-bold mb-2 text-[#1A1C1E]">Sensor Cahaya LDR</div>

      <div className="bg-[#F8FAFC] p-2 rounded-lg mb-2 border border-[#E2E8F0]">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-[#64748B]">Cahaya:</span>
          <span className={`font-mono font-bold ${isBright ? 'text-amber-600' : 'text-[#475569]'}`}>
            {lux} Lux ({isBright ? 'Terang / Day' : 'Gelap / Night'})
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={lux}
          onChange={handleChange}
          className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="text-[10px] text-[#64748B] mt-1">Threshold Terang: &ge; 50 Lux</div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3.5 !h-3.5 !border-2 ${
          isBright ? '!bg-[#DC2626] !border-red-300' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 5. Standard Gate Node (AND, OR, NOT, NAND, NOR, XOR, XNOR) with Logic.ly SVG Symbols
export const LogicGateNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const type = nodeData.type || 'gate_and';
  const isHigh = nodeData.value === 1;

  const isSingleInput = type === 'gate_not';

  const renderGateSVG = () => {
    switch (type) {
      case 'gate_and':
        return (
          <svg className="w-12 h-10" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 10,5 L 30,5 C 45,5 45,35 30,35 L 10,35 Z" fill={isHigh ? '#FEF2F2' : '#F8FAFC'} stroke={isHigh ? '#DC2626' : '#334155'} />
            <line x1="0" y1="12" x2="10" y2="12" stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="28" x2="10" y2="28" stroke="#64748B" strokeWidth="2" />
            <line x1="42" y1="20" x2="58" y2="20" stroke={isHigh ? '#DC2626' : '#64748B'} strokeWidth="2.5" />
          </svg>
        );
      case 'gate_or':
        return (
          <svg className="w-12 h-10" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 10,5 Q 25,20 10,35 Q 35,35 50,20 Q 35,5 10,5 Z" fill={isHigh ? '#FEF2F2' : '#F8FAFC'} stroke={isHigh ? '#DC2626' : '#334155'} />
            <line x1="0" y1="12" x2="12" y2="12" stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="28" x2="12" y2="28" stroke="#64748B" strokeWidth="2" />
            <line x1="50" y1="20" x2="60" y2="20" stroke={isHigh ? '#DC2626' : '#64748B'} strokeWidth="2.5" />
          </svg>
        );
      case 'gate_not':
        return (
          <svg className="w-12 h-10" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="10,5 40,20 10,35" fill={isHigh ? '#FEF2F2' : '#F8FAFC'} stroke={isHigh ? '#DC2626' : '#334155'} />
            <circle cx="44" cy="20" r="3" fill="white" stroke={isHigh ? '#DC2626' : '#334155'} strokeWidth="2" />
            <line x1="0" y1="20" x2="10" y2="20" stroke="#64748B" strokeWidth="2" />
            <line x1="47" y1="20" x2="58" y2="20" stroke={isHigh ? '#DC2626' : '#64748B'} strokeWidth="2.5" />
          </svg>
        );
      case 'gate_nand':
        return (
          <svg className="w-12 h-10" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 10,5 L 28,5 C 40,5 40,35 28,35 L 10,35 Z" fill={isHigh ? '#FEF2F2' : '#F8FAFC'} stroke={isHigh ? '#DC2626' : '#334155'} />
            <circle cx="41" cy="20" r="3" fill="white" stroke={isHigh ? '#DC2626' : '#334155'} strokeWidth="2" />
            <line x1="0" y1="12" x2="10" y2="12" stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="28" x2="10" y2="28" stroke="#64748B" strokeWidth="2" />
            <line x1="44" y1="20" x2="58" y2="20" stroke={isHigh ? '#DC2626' : '#64748B'} strokeWidth="2.5" />
          </svg>
        );
      case 'gate_nor':
        return (
          <svg className="w-12 h-10" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 10,5 Q 25,20 10,35 Q 32,35 44,20 Q 32,5 10,5 Z" fill={isHigh ? '#FEF2F2' : '#F8FAFC'} stroke={isHigh ? '#DC2626' : '#334155'} />
            <circle cx="47" cy="20" r="3" fill="white" stroke={isHigh ? '#DC2626' : '#334155'} strokeWidth="2" />
            <line x1="0" y1="12" x2="12" y2="12" stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="28" x2="12" y2="28" stroke="#64748B" strokeWidth="2" />
            <line x1="50" y1="20" x2="60" y2="20" stroke={isHigh ? '#DC2626' : '#64748B'} strokeWidth="2.5" />
          </svg>
        );
      case 'gate_xor':
        return (
          <svg className="w-12 h-10" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 6,5 Q 20,20 6,35" stroke={isHigh ? '#DC2626' : '#334155'} strokeWidth="2" fill="none" />
            <path d="M 12,5 Q 26,20 12,35 Q 36,35 50,20 Q 36,5 12,5 Z" fill={isHigh ? '#FEF2F2' : '#F8FAFC'} stroke={isHigh ? '#DC2626' : '#334155'} />
            <line x1="0" y1="12" x2="8" y2="12" stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="28" x2="8" y2="28" stroke="#64748B" strokeWidth="2" />
            <line x1="50" y1="20" x2="60" y2="20" stroke={isHigh ? '#DC2626' : '#64748B'} strokeWidth="2.5" />
          </svg>
        );
      default:
        return <Cpu className={`w-6 h-6 ${isHigh ? 'text-[#DC2626]' : 'text-[#64748B]'}`} />;
    }
  };

  const getGateLabel = () => {
    return type.replace('gate_', '').toUpperCase();
  };

  const getGateLatex = () => {
    switch (type) {
      case 'gate_and':
        return 'Y = A \\cdot B';
      case 'gate_or':
        return 'Y = A + B';
      case 'gate_not':
        return 'Y = \\overline{A}';
      case 'gate_nand':
        return 'Y = \\overline{A \\cdot B}';
      case 'gate_nor':
        return 'Y = \\overline{A + B}';
      case 'gate_xor':
        return 'Y = A \\oplus B';
      case 'gate_xnor':
        return 'Y = \\overline{A \\oplus B}';
      default:
        return 'Y = f(A,B)';
    }
  };

  return (
    <div className={`bg-white border-2 hover:border-[#2563EB] rounded-xl p-3 min-w-[155px] shadow-md text-[#1A1C1E] flex flex-col items-center justify-center relative select-none ${
      isHigh ? 'border-[#DC2626] ring-1 ring-red-200' : 'border-[#334155]'
    }`}>
      {/* Handles on Left for Inputs */}
      {isSingleInput ? (
        <Handle
          type="target"
          position={Position.Left}
          id="in1"
          className="!w-3.5 !h-3.5 !bg-[#94A3B8] !border-2 !border-[#334155] hover:!bg-[#2563EB]"
        />
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="in1"
            style={{ top: '35%' }}
            className="!w-3.5 !h-3.5 !bg-[#94A3B8] !border-2 !border-[#334155] hover:!bg-[#2563EB]"
          />
          <Handle
            type="target"
            position={Position.Left}
            id="in2"
            style={{ top: '65%' }}
            className="!w-3.5 !h-3.5 !bg-[#94A3B8] !border-2 !border-[#334155] hover:!bg-[#2563EB]"
          />
        </>
      )}

      {/* Gate Title & SVG Icon */}
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1 font-mono">
        GERBANG {getGateLabel()}
      </div>

      <div className="my-1">
        {renderGateSVG()}
      </div>

      {/* LaTeX Boolean Formula Rendering */}
      <div className="mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-center">
        <BooleanMath latex={getGateLatex()} className="text-[11px] font-bold text-[#1D4ED8]" />
      </div>

      <div className="text-[11px] font-mono mt-1 text-[#475569]">
        Out = <span className={isHigh ? 'text-[#DC2626] font-bold' : 'text-[#64748B]'}>{isHigh ? '1' : '0'}</span>
      </div>

      {/* Output Handle Right */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-4 !h-4 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-200' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 6. TTL IC Chip Node (7408 / 7432 / 7404)
export const TTLICNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const chipNumber = (nodeData.type || 'ic_7408').replace('ic_', '').toUpperCase();
  const isHigh = nodeData.value === 1;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-3 min-w-[210px] shadow-lg text-white">
      <div className="flex items-center justify-between border-b border-[#334155] pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-extrabold text-amber-400 font-mono">IC TTL {chipNumber}</span>
        </div>
        <SignalBadge value={nodeData.value} />
      </div>

      {/* Compact IC Diagram with Internal Logic Gates & LaTeX Formula */}
      <ICPackageDiagram icNumber={chipNumber} compact={true} />

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
        <span>VCC: Pin 14 | GND: Pin 7</span>
        <span className={isHigh ? 'text-red-400 font-extrabold' : 'text-slate-400 font-bold'}>
          Signal Out: {isHigh ? '1 (HIGH)' : '0 (LOW)'}
        </span>
      </div>

      {/* Left Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="in1"
        style={{ top: '35%' }}
        className="!w-3.5 !h-3.5 !bg-amber-500 !border-2 !border-amber-300 hover:!bg-amber-400"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in2"
        style={{ top: '65%' }}
        className="!w-3.5 !h-3.5 !bg-amber-500 !border-2 !border-amber-300 hover:!bg-amber-400"
      />

      {/* Right Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-4 !h-4 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-300' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />
    </div>
  );
};

// 7. Output Actuator Nodes (LED, Relay, Motor, Buzzer)
export const OutputActuatorNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const type = nodeData.type || 'output_led';
  const isHigh = nodeData.value === 1;

  const renderIcon = () => {
    switch (type) {
      case 'output_relay':
        return <Zap className={`w-6 h-6 ${isHigh ? 'text-[#D97706] animate-bounce' : 'text-[#64748B]'}`} />;
      case 'output_motor':
        return <Fan className={`w-6 h-6 ${isHigh ? 'text-cyan-600 animate-spin' : 'text-[#64748B]'}`} />;
      case 'output_buzzer':
        return <Volume2 className={`w-6 h-6 ${isHigh ? 'text-[#DC2626] animate-ping' : 'text-[#64748B]'}`} />;
      case 'output_bulb':
        return <Lightbulb className={`w-6 h-6 ${isHigh ? 'text-amber-500 animate-pulse' : 'text-[#64748B]'}`} />;
      default:
        return <Zap className={`w-6 h-6 ${isHigh ? 'text-[#DC2626] animate-pulse' : 'text-[#64748B]'}`} />;
    }
  };

  return (
    <div
      className={`border rounded-xl p-3 min-w-[170px] shadow-sm transition-all duration-300 ${
        isHigh
          ? 'bg-white border-[#DC2626] ring-2 ring-red-100 text-[#1A1C1E]'
          : 'bg-white border-[#CBD5E1] text-[#1A1C1E]'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className={`!w-3.5 !h-3.5 !border-2 ${
          isHigh ? '!bg-[#DC2626] !border-red-300' : '!bg-[#94A3B8] !border-[#64748B]'
        }`}
      />

      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#E2E8F0]">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
          {nodeData.pinLabel || 'ACTUATOR'}
        </span>
        <SignalBadge value={nodeData.value} />
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className={`p-2.5 rounded-lg border ${isHigh ? 'bg-red-50 border-red-200' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
          {renderIcon()}
        </div>
        <div>
          <div className="text-sm font-bold text-[#1A1C1E]">{nodeData.label || 'Output Indicator'}</div>
          <div className="text-[11px] font-mono text-[#475569]">
            {isHigh ? '⚡ STATUS: ACTIVE (1)' : '💤 STATUS: IDLE (0)'}
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Flip-Flop / Latch Sequential Logic Nodes (D-FF, JK-FF, SR-Latch, T-FF)
export const FlipFlopNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const type = nodeData.type || 'ff_d';
  const isHigh = nodeData.value === 1;

  let title = 'D Flip-Flop';
  let chipName = '7474 D-FF';
  let inputs = [
    { id: 'd', label: 'D (Data)' },
    { id: 'clk', label: 'CLK (Clock)' },
  ];

  if (type === 'ff_jk' || type === 'ic_7476') {
    title = 'JK Flip-Flop';
    chipName = '7476 JK-FF';
    inputs = [
      { id: 'j', label: 'J (Set)' },
      { id: 'k', label: 'K (Reset)' },
      { id: 'clk', label: 'CLK (Clock)' },
    ];
  } else if (type === 'ff_sr') {
    title = 'SR Latch';
    chipName = 'SR-Latch';
    inputs = [
      { id: 's', label: 'S (Set)' },
      { id: 'r', label: 'R (Reset)' },
    ];
  } else if (type === 'ff_t') {
    title = 'T Flip-Flop';
    chipName = 'T-FF';
    inputs = [
      { id: 't', label: 'T (Toggle)' },
      { id: 'clk', label: 'CLK (Clock)' },
    ];
  }

  return (
    <div className="bg-[#0F172A] border-2 border-indigo-500 rounded-xl p-3.5 min-w-[190px] shadow-lg text-white font-sans relative">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
        <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider uppercase">
          {chipName}
        </span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${isHigh ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
          Q = {isHigh ? '1' : '0'}
        </span>
      </div>

      <div className="text-xs font-extrabold text-slate-100 mb-2 flex items-center gap-1.5">
        <Cpu className="w-4 h-4 text-indigo-400" />
        {title}
      </div>

      <div className="space-y-3 my-2">
        {inputs.map((inp) => (
          <div key={inp.id} className="flex items-center text-[10px] font-mono text-slate-300 relative pl-1">
            <span className="font-bold text-indigo-300">{inp.label}</span>
          </div>
        ))}
      </div>

      {/* Input Target Handles */}
      {inputs.map((inp, idx) => (
        <Handle
          key={inp.id}
          type="target"
          position={Position.Left}
          id={inp.id}
          style={{ top: `${42 + idx * 22}px` }}
          className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-indigo-200"
        />
      ))}

      <div className="flex justify-end text-[10px] font-mono font-bold text-emerald-400 border-t border-slate-800 pt-1.5 mt-2">
        Output Q
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-4 !h-4 !border-2 ${isHigh ? '!bg-emerald-400 !border-emerald-200' : '!bg-slate-600 !border-slate-400'}`}
      />
    </div>
  );
};

export const nodeTypes = {
  input_switch: InputSwitchNode,
  input_button: PushButtonNode,
  input_high: ConstantValueNode,
  input_low: ConstantValueNode,
  input_clock: InputClockNode,
  input_sensor_temp: SensorTempNode,
  input_sensor_pir: SensorPIRNode,
  input_sensor_light: SensorLightNode,
  gate_and: LogicGateNode,
  gate_or: LogicGateNode,
  gate_not: LogicGateNode,
  gate_nand: LogicGateNode,
  gate_nor: LogicGateNode,
  gate_xor: LogicGateNode,
  gate_xnor: LogicGateNode,
  ic_7408: TTLICNode,
  ic_7432: TTLICNode,
  ic_7404: TTLICNode,
  ic_7400: TTLICNode,
  ic_7474: DFlipFlopNode,
  ic_7476: FlipFlopNode,
  ff_d: DFlipFlopNode,
  ff_jk: FlipFlopNode,
  ff_sr: FlipFlopNode,
  ff_t: FlipFlopNode,
  output_led: OutputActuatorNode,
  output_relay: OutputActuatorNode,
  output_motor: OutputActuatorNode,
  output_buzzer: OutputActuatorNode,
  output_bulb: OutputActuatorNode,
};
