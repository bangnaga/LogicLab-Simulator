import React, { useState, useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import { LogicNodeData, evaluateLogicGraph } from '../utils/logicEngine';
import { generateBooleanExpressions, GeneratedExpression } from '../utils/booleanFormula';
import { BooleanMath } from './BooleanMath';
import { KarnaughMap } from './KarnaughMap';
import {
  Sigma,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Info,
  HelpCircle,
  FileCode,
  Grid,
} from 'lucide-react';

interface BooleanLaTeXSidebarProps {
  nodes: Node<LogicNodeData>[];
  edges: Edge[];
  nodeOutputs?: Record<string, number>;
}

export const BooleanLaTeXSidebar: React.FC<BooleanLaTeXSidebarProps> = ({
  nodes,
  edges,
  nodeOutputs = {},
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'latex' | 'kmap'>('latex');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute live expressions
  const expressions: GeneratedExpression[] = generateBooleanExpressions(
    nodes,
    edges,
    nodeOutputs
  );

  // Extract input and output nodes
  const inputNodes = nodes.filter((n) => n.type?.startsWith('input_'));
  const outputNodes = nodes.filter(
    (n) => n.type?.startsWith('output_') || n.type === 'output_led' || n.type === 'output_buzzer'
  );
  const primaryOutputNode = outputNodes[0];

  // Dynamic calculation of K-Map truth values from the current live logic graph
  const numInputs = Math.min(Math.max(inputNodes.length, 2), 4) as 2 | 3 | 4;
  const totalMinterms = 1 << numInputs;

  const liveKmapGridValues = useMemo(() => {
    if (!primaryOutputNode || inputNodes.length === 0) return undefined;

    const results: number[] = [];
    for (let m = 0; m < totalMinterms; m++) {
      // Build virtual node set with binary minterm bit combination for input nodes
      const testNodes = nodes.map((node) => {
        const inputIdx = inputNodes.findIndex((inNode) => inNode.id === node.id);
        if (inputIdx !== -1 && inputIdx < numInputs) {
          const bitVal = (m >> (numInputs - 1 - inputIdx)) & 1;
          return {
            ...node,
            data: {
              ...node.data,
              value: bitVal as 0 | 1,
            },
          };
        }
        return node;
      });

      const { nodeOutputs: evaluatedOuts } = evaluateLogicGraph(testNodes, edges);
      results.push(evaluatedOuts[primaryOutputNode.id] ?? 0);
    }
    return results;
  }, [nodes, edges, inputNodes, primaryOutputNode, numInputs, totalMinterms]);

  const handleCopy = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed lg:absolute right-4 top-24 z-30 bg-[#2563EB] hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-lg border border-blue-400 flex items-center gap-2 text-xs transition-all active:scale-95 animate-bounce"
        title="Buka Utility Panel Real-Time LaTeX"
      >
        <Sigma className="w-5 h-5" />
        <span className="hidden sm:inline">Utility Panel LaTeX Boolean</span>
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="w-full lg:w-84 bg-white border border-[#D1D5DB] rounded-xl p-3.5 space-y-3 shadow-sm flex flex-col justify-between font-sans">
      {/* Sidebar Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#2563EB] text-white rounded-lg shadow-xs">
              <Sigma className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-extrabold text-[#1A1C1E] uppercase tracking-wider font-mono">
                Analisis Aljabar Boolean
              </h3>
              <p className="text-[10px] text-[#64748B]">Ekspresi LaTeX & Karnaugh Map</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-[#F1F5F9] text-[#64748B] transition-all"
            title="Sembunyikan Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: LaTeX vs K-Map */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#CBD5E1] mb-3">
          <button
            onClick={() => setActiveTab('latex')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'latex'
                ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                : 'text-[#64748B] hover:text-[#1A1C1E]'
            }`}
          >
            <Sigma className="w-3.5 h-3.5" /> Formulasi LaTeX
          </button>
          <button
            onClick={() => setActiveTab('kmap')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'kmap'
                ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                : 'text-[#64748B] hover:text-[#1A1C1E]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Karnaugh Map
          </button>
        </div>

        {activeTab === 'latex' ? (
          <>
            {/* Real-time Input Signal Overview Chips */}
            <div className="mb-3 bg-[#F8FAFC] p-2 rounded-lg border border-[#CBD5E1]">
              <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider block mb-1 font-mono">
                Sinyal Input Aktif ({inputNodes.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {inputNodes.length === 0 ? (
                  <span className="text-[10px] text-[#94A3B8]">Belum ada input</span>
                ) : (
                  inputNodes.map((n) => {
                    const label = n.data?.pinLabel || n.data?.label || n.id;
                    const val = (n.data?.value as number) ?? nodeOutputs[n.id] ?? 0;

                    return (
                      <span
                        key={n.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          val === 1
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {label} = {val}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Live LaTeX Expressions List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {expressions.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-xl p-3">
                  <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-[#CBD5E1]" />
                  <p className="font-semibold text-[#64748B]">Belum ada Gerbang / Output</p>
                  <p className="text-[10px] mt-1 text-[#94A3B8]">
                    Tambahkan gerbang logika & hubungkan kabel untuk menghasilkan ekspresi LaTeX otomatis.
                  </p>
                </div>
              ) : (
                expressions.map((exp) => (
                  <div
                    key={exp.nodeId}
                    className="bg-[#0F172A] text-white p-2.5 rounded-xl border border-[#334155] shadow-sm space-y-1.5 relative group hover:border-blue-500 transition-all"
                  >
                    {/* Expression Header & Output State */}
                    <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-800 pb-1">
                      <span className="font-bold text-amber-400 truncate max-w-[150px]">
                        {exp.label}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          exp.currentValue === 1
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        Signal: {exp.currentValue}
                      </span>
                    </div>

                    {/* Rendered KaTeX Formula */}
                    <div className="bg-[#1E293B] p-2 rounded-lg border border-slate-700 text-center overflow-x-auto my-1">
                      <BooleanMath latex={exp.latex} className="text-amber-300 text-xs font-extrabold" />
                    </div>

                    {/* LaTeX Code String & Copy Button */}
                    <div className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded text-[9px] font-mono text-slate-400 border border-slate-800">
                      <span className="truncate max-w-[160px] text-slate-300">{exp.latex}</span>
                      <button
                        onClick={() => handleCopy(exp.nodeId, exp.latex)}
                        className="p-1 hover:bg-slate-800 rounded text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1 shrink-0"
                        title="Salin Kode LaTeX"
                      >
                        {copiedId === exp.nodeId ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[9px] text-emerald-400 font-bold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[9px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Karnaugh Map View in Sidebar */
          <div className="max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            <KarnaughMap
              initialVariableCount={inputNodes.length >= 4 ? 4 : inputNodes.length >= 3 ? 3 : 2}
              inputNames={
                inputNodes.length > 0
                  ? inputNodes.map((n, i) => n.data?.pinLabel || n.data?.label || `In${i + 1}`)
                  : ['A', 'B', 'C', 'D']
              }
              outputName={primaryOutputNode?.data?.pinLabel || primaryOutputNode?.data?.label || 'Y'}
              externalGridValues={liveKmapGridValues}
            />
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[10px] text-blue-900 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Integrasi Laporan Praktikum:</span>
          <span>Hasil K-Map & LaTeX disinkronkan otomatis untuk disalin ke dokumen laporan Overleaf / MS Word.</span>
        </div>
      </div>
    </div>
  );
};

