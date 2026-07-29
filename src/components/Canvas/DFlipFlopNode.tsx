import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { LogicNodeData } from '../../utils/logicEngine';
import { BooleanMath } from '../BooleanMath';
import {
  Cpu,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  Activity,
  Maximize2,
  X,
  Info,
} from 'lucide-react';

export const DFlipFlopNode: React.FC<NodeProps> = ({ id, data }) => {
  const nodeData = data as unknown as LogicNodeData;
  const isHighQ = nodeData.value === 1;
  const qPrimeVal = isHighQ ? 0 : 1;

  const [showInternalGates, setShowInternalGates] = useState(false);
  const [localClk, setLocalClk] = useState(0);

  // Compute internal gate logic values for NAND gate structure demonstration
  const dVal = (nodeData.dVal as number) ?? (nodeData.inputD ?? 0);
  const clkVal = localClk || ((nodeData.clkVal as number) ?? (nodeData.inputCLK ?? 1));
  const preVal = (nodeData.preVal as number) ?? 1;
  const clrVal = (nodeData.clrVal as number) ?? 1;

  // Intermediate signals
  const notD = dVal === 1 ? 0 : 1;
  const nand1_out = !(dVal === 1 && clkVal === 1) ? 1 : 0; // Steering NAND 1 (Set)
  const nand2_out = !(notD === 1 && clkVal === 1) ? 1 : 0; // Steering NAND 2 (Reset)
  const qVal = isHighQ ? 1 : 0;

  const handlePulseClock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalClk(1);
    setTimeout(() => {
      setLocalClk(0);
    }, 400);
  };

  return (
    <div className="bg-[#0F172A] border-2 border-indigo-500 rounded-xl p-3.5 min-w-[210px] shadow-xl text-white font-sans relative group">
      {/* Node Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="p-1 bg-indigo-600 rounded text-white shadow-xs">
            <Cpu className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-wider block">
              7474 D Flip-Flop
            </span>
            <span className="text-[9px] text-slate-400 font-mono">Sequential Memory</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${
              isHighQ
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Q = {isHighQ ? '1' : '0'}
          </span>
        </div>
      </div>

      {/* Input Pin Labels & Handles */}
      <div className="space-y-3.5 my-3 relative">
        {/* D Input */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pl-1">
          <span className="font-bold text-indigo-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> D (Data)
          </span>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          id="d"
          style={{ top: '48px' }}
          className="!w-3.5 !h-3.5 !bg-indigo-400 !border-2 !border-indigo-100"
        />

        {/* CLK Input */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pl-1">
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-400" /> CLK (Clock)
          </span>
          <button
            onClick={handlePulseClock}
            className="px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/40 rounded text-[9px] font-mono transition-all"
            title="Klik untuk memberi Pulsa Clock manual"
          >
            ⚡ Pulse
          </button>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          id="clk"
          style={{ top: '82px' }}
          className="!w-3.5 !h-3.5 !bg-amber-400 !border-2 !border-amber-100"
        />

        {/* PRE Input (Optional Active-Low Preset) */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pl-1">
          <span>PRE (Set)</span>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          id="pre"
          style={{ top: '116px' }}
          className="!w-3 !h-3 !bg-slate-500 !border-2 !border-slate-300"
        />

        {/* CLR Input (Optional Active-Low Clear) */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pl-1">
          <span>CLR (Reset)</span>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          id="clr"
          style={{ top: '144px' }}
          className="!w-3 !h-3 !bg-slate-500 !border-2 !border-slate-300"
        />
      </div>

      {/* Output Pins */}
      <div className="border-t border-slate-800 pt-2.5 mt-3 space-y-2">
        <div className="flex justify-end items-center gap-2 text-[11px] font-mono font-bold text-emerald-400">
          <span>Output Q</span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{ top: '180px' }}
          className={`!w-4 !h-4 !border-2 ${
            isHighQ ? '!bg-emerald-400 !border-emerald-200 shadow-md' : '!bg-slate-600 !border-slate-400'
          }`}
        />

        <div className="flex justify-end items-center gap-2 text-[11px] font-mono font-bold text-rose-400">
          <span>Output Q' (QN)</span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="out_qprime"
          style={{ top: '208px' }}
          className={`!w-4 !h-4 !border-2 ${
            qPrimeVal === 1 ? '!bg-rose-400 !border-rose-200 shadow-md' : '!bg-slate-600 !border-slate-400'
          }`}
        />
      </div>

      {/* Toggle Internal Gate Schematic Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowInternalGates(!showInternalGates);
        }}
        className="w-full mt-3 py-1.5 px-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 rounded-lg text-[10px] font-mono font-bold text-indigo-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Layers className="w-3 h-3 text-indigo-400" />
        <span>{showInternalGates ? 'Sembunyikan NAND Gate' : 'Struktur Internal NAND'}</span>
        {showInternalGates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Expandable Internal Gate Schematic View */}
      {showInternalGates && (
        <div className="mt-3 p-3 bg-slate-900 border border-indigo-500/40 rounded-lg text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[10px] font-mono text-indigo-300 font-bold">
            <span>Rangkaian Internal (4x NAND Gate)</span>
            <BooleanMath latex="Q_{next} = D \quad (\text{CLK } \uparrow)" className="text-amber-300 text-[10px]" />
          </div>

          {/* Gate Signals Status Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block">NOT Gate (D'):</span>
              <span className={notD === 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                D' = {notD}
              </span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block">NAND 1 (Set):</span>
              <span className={nand1_out === 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                Out = {nand1_out}
              </span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block">NAND 2 (Reset):</span>
              <span className={nand2_out === 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                Out = {nand2_out}
              </span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block">SR Latch (Q):</span>
              <span className={qVal === 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                Q = {qVal}
              </span>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 bg-indigo-950/40 p-2 rounded border border-indigo-900/50 flex items-start gap-1.5">
            <Info className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Saat CLK = 1, gerbang kemudi NAND1 & NAND2 mengalirkan status D dan D' ke SR-Latch untuk menyimpan bit data.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
