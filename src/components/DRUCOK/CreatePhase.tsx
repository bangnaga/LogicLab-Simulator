import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import { nodeTypes } from '../Canvas/CustomNodes';
import { BreadboardBackground, CanvasBackgroundType } from '../Canvas/BreadboardBackground';
import { ComponentLibrary } from './ComponentLibrary';
import { LogicNodeData, evaluateLogicGraph } from '../../utils/logicEngine';
import { generateVibeCode } from '../../utils/codeGenerator';
import { PracticumModule, ViewMode } from '../../types';
import { BooleanLaTeXSidebar } from '../BooleanLaTeXSidebar';
import {
  Layers,
  CircuitBoard,
  Plus,
  Trash2,
  Code2,
  ArrowRight,
  Flame,
  Radio,
  Power,
  Zap,
  Fan,
  Volume2,
  Lightbulb,
  Copy,
  Check,
  X,
  RotateCcw,
  Sun,
  Clock,
  Magnet,
  PanelLeft,
  PanelRight,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sigma,
} from 'lucide-react';

interface CreatePhaseProps {
  module: PracticumModule;
  nodes: Node<LogicNodeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<LogicNodeData>[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onNextPhase: () => void;
}

export const CreatePhase: React.FC<CreatePhaseProps> = ({
  module,
  nodes,
  setNodes,
  edges,
  setEdges,
  viewMode,
  setViewMode,
  onNextPhase,
}) => {
  const [showVibeCodeModal, setShowVibeCodeModal] = useState(false);
  const [codeTab, setCodeTab] = useState<'cpp' | 'python' | 'verilog'>('cpp');
  const [copied, setCopied] = useState(false);
  const [bgType, setBgType] = useState<CanvasBackgroundType>('dots');
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  // Slidable Sidebar State
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);
  const [isFullscreenCanvas, setIsFullscreenCanvas] = useState<boolean>(false);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Toggle Switch state helper
  const handleToggleSwitch = useCallback(
    (id: string, newVal: number) => {
      setNodes((nds) => {
        const updated = nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, value: newVal } } : n));
        const evalRes = evaluateLogicGraph(updated, edges);
        setEdges(evalRes.evaluatedEdges);
        return evalRes.evaluatedNodes;
      });
    },
    [edges, setEdges, setNodes]
  );

  // Temperature Slider handler helper
  const handleChangeTemp = useCallback(
    (id: string, val: number) => {
      setNodes((nds) => {
        const updated = nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, tempValue: val } } : n));
        const evalRes = evaluateLogicGraph(updated, edges);
        setEdges(evalRes.evaluatedEdges);
        return evalRes.evaluatedNodes;
      });
    },
    [edges, setEdges, setNodes]
  );

  // Motion Sensor handler helper
  const handleToggleMotion = useCallback(
    (id: string, val: boolean) => {
      setNodes((nds) => {
        const updated = nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, motionValue: val } } : n));
        const evalRes = evaluateLogicGraph(updated, edges);
        setEdges(evalRes.evaluatedEdges);
        return evalRes.evaluatedNodes;
      });
    },
    [edges, setEdges, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      const pinLabel = event.dataTransfer.getData('application/reactflow/pin');

      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();

      let position = { x: 200, y: 150 };
      if (reactFlowInstance && reactFlowBounds) {
        position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
      } else if (reactFlowBounds) {
        position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };
      }

      const id = `${type}_${Date.now()}`;
      const newNode: Node<LogicNodeData> = {
        id,
        type,
        position,
        data: {
          label: label || 'Komponen',
          pinLabel: pinLabel || label?.substring(0, 8) || 'PIN',
          value: 0,
          tempValue: 25,
          motionValue: false,
          onToggle: handleToggleSwitch,
          onChangeTemp: handleChangeTemp,
          onToggleMotion: handleToggleMotion,
        },
      };

      setNodes((prev) => {
        const updated = [...prev, newNode];
        const evalRes = evaluateLogicGraph(updated, edges);
        return evalRes.evaluatedNodes;
      });
    },
    [reactFlowInstance, edges, handleToggleSwitch, handleChangeTemp, handleToggleMotion, setNodes]
  );

  // Real-time signal propagation evaluation & Clock ticker
  useEffect(() => {
    // Initial evaluation on mount or module change
    const evalRes = evaluateLogicGraph(nodes, edges);
    setNodes(evalRes.evaluatedNodes);
    setEdges(evalRes.evaluatedEdges);

    const hasClockNode = nodes.some((n) => n.type === 'input_clock');
    if (!hasClockNode) return;

    const interval = setInterval(() => {
      setNodes((prevNodes) => {
        const nextNodes = prevNodes.map((node) => {
          if (node.type === 'input_clock') {
            const nextVal = node.data.value === 1 ? 0 : 1;
            return { ...node, data: { ...node.data, value: nextVal } };
          }
          return node;
        });
        const clockEval = evaluateLogicGraph(nextNodes, edges);
        setEdges(clockEval.evaluatedEdges);
        return clockEval.evaluatedNodes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [module.id]);

  // Handle node movement and deletion
  const onNodesChange = useCallback(
    (changes: NodeChange<Node<LogicNodeData>>[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        return evaluateLogicGraph(updated, edges).evaluatedNodes;
      });
    },
    [edges, setNodes]
  );

  // Handle edge connections and deletion
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        const evalRes = evaluateLogicGraph(nodes, updated);
        return evalRes.evaluatedEdges;
      });
    },
    [nodes, setEdges]
  );

  // Add new edge connection
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const edgeParams: Edge = {
          id: `e_${connection.source}_${connection.target}_${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          animated: true,
          style: { stroke: '#2563EB', strokeWidth: 2.5 },
        };
        const newEdges = addEdge(edgeParams, eds);
        const evalRes = evaluateLogicGraph(nodes, newEdges);
        return evalRes.evaluatedEdges;
      });
    },
    [nodes, setEdges]
  );

  // Add node dynamically to canvas
  const addNodeToCanvas = (type: string, label: string, defaultPinLabel?: string) => {
    const id = `${type}_${Date.now()}`;
    const xPos = 120 + Math.random() * 200;
    const yPos = 120 + Math.random() * 200;

    const newNode: Node<LogicNodeData> = {
      id,
      type,
      position: { x: xPos, y: yPos },
      data: {
        label,
        pinLabel: defaultPinLabel || label.substring(0, 8),
        value: 0,
        tempValue: 25,
        motionValue: false,
        onToggle: handleToggleSwitch,
        onChangeTemp: handleChangeTemp,
        onToggleMotion: handleToggleMotion,
      },
    };

    setNodes((prev) => {
      const updated = [...prev, newNode];
      const evalRes = evaluateLogicGraph(updated, edges);
      return evalRes.evaluatedNodes;
    });
  };

  // Attach event callbacks to existing nodes
  const preparedNodes = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onToggle: handleToggleSwitch,
      onChangeTemp: handleChangeTemp,
      onToggleMotion: handleToggleMotion,
    },
  }));

  const vibeCodes = generateVibeCode(nodes, edges, module.title);

  const handleCopyCode = () => {
    const code = vibeCodes[codeTab];
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset to default preset
  const handleResetCanvas = () => {
    const initialInputs = module.inputLabels.map((lbl, idx) => ({
      id: `in_${lbl}_${idx}`,
      type: lbl.includes('TEMP') ? 'input_sensor_temp' : lbl.includes('PIR') || lbl.includes('SENS') ? 'input_sensor_pir' : 'input_switch',
      position: { x: 80, y: 100 + idx * 130 },
      data: {
        label: `Input (${lbl})`,
        pinLabel: lbl,
        value: 0,
        tempValue: 25,
        motionValue: false,
      },
    }));

    const gateNode: Node<LogicNodeData> = {
      id: `gate_1`,
      type: 'gate_and',
      position: { x: 380, y: 160 },
      data: { label: 'Gerbang AND', value: 0 },
    };

    const initialOutputs = module.outputLabels.map((lbl, idx) => ({
      id: `out_${lbl}_${idx}`,
      type: lbl.includes('RELAY') || lbl.includes('FAN') ? 'output_relay' : lbl.includes('PUMP') ? 'output_motor' : 'output_led',
      position: { x: 680, y: 120 + idx * 140 },
      data: { label: `Output (${lbl})`, pinLabel: lbl, value: 0 },
    }));

    const newNodes = [...initialInputs, gateNode, ...initialOutputs];
    const newEdges: Edge[] = [
      { id: 'e1', source: initialInputs[0]?.id || '', target: 'gate_1', targetHandle: 'in1', animated: true, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
      { id: 'e2', source: initialInputs[1]?.id || initialInputs[0]?.id || '', target: 'gate_1', targetHandle: 'in2', animated: true, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
      { id: 'e3', source: 'gate_1', target: initialOutputs[0]?.id || '', animated: true, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div className="space-y-6 text-[#1A1C1E] max-w-7xl mx-auto pb-12">
      {/* Top Banner & View Switcher Bar */}
      <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-sm">
              <CircuitBoard className="w-5 h-5 text-white" />
            </span>
            <h2 className="text-xl font-extrabold text-[#1A1C1E]">
              Simulator Logika Interactive <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">Standard Digital Workbench</span>
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Latihan: <strong className="text-[#1A1C1E]">{module.code} - {module.title}</strong> • Tambahkan saklar, sensor, gerbang logika, dan ukur propagasi sinyal secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Vibe Coding Modal Trigger Button */}
          <button
            onClick={() => setShowVibeCodeModal(true)}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Code2 className="w-4 h-4" /> Vibe Coding Generator
          </button>

          <button
            onClick={handleResetCanvas}
            title="Reset Canvas Preset"
            className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] border border-[#CBD5E1] transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Mode View Container */}
      <div className="w-full relative">
          {/* Main Full-Width Interactive React Flow Canvas Stage with Drag & Drop */}
          <div
            ref={reactFlowWrapper}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`w-full bg-white border border-[#D1D5DB] rounded-xl relative overflow-hidden shadow-sm bg-canvas-dots transition-all ${
              isFullscreenCanvas ? 'h-[820px]' : 'h-[680px]'
            }`}
          >
            {/* Top Toolbar Control Overlay Bar */}
            <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              {/* Left Group: Slidable Sidebar Toggles & Canvas Options */}
              <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-[#CBD5E1] shadow-md text-xs font-semibold text-[#1A1C1E] pointer-events-auto">
                {/* Toggle Left Component Library Sidebar */}
                <button
                  onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                    isLeftSidebarOpen
                      ? 'bg-[#2563EB] text-white border-blue-600 shadow-xs'
                      : 'bg-[#F1F5F9] text-[#1A1C1E] border-[#CBD5E1] hover:bg-[#E2E8F0]'
                  }`}
                  title="Toggle Slide Sidebar Pustaka Komponen"
                >
                  <PanelLeft className="w-4 h-4" />
                  <span>Pustaka Komponen</span>
                  {isLeftSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <div className="h-4 w-px bg-[#E2E8F0] mx-0.5" />

                {/* Canvas Background Grid Toggle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBgType('dots')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                      bgType === 'dots'
                        ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1A1C1E]'
                    }`}
                    title="Grid Titik (Dots)"
                  >
                    Grid Titik
                  </button>
                  <button
                    onClick={() => setBgType('none')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                      bgType === 'none'
                        ? 'bg-[#2563EB] text-white shadow-xs font-extrabold'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1A1C1E]'
                    }`}
                    title="Polos / Tanpa Grid"
                  >
                    Polos
                  </button>
                </div>

                <div className="h-4 w-px bg-[#E2E8F0] mx-0.5" />

                {/* Snap to Grid Magnet Toggle */}
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                    snapToGrid
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold'
                      : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]'
                  }`}
                  title="Presisi Alignment Snap Ke Grid Hole (20px)"
                >
                  <Magnet className={`w-3.5 h-3.5 ${snapToGrid ? 'text-emerald-600' : 'text-[#64748B]'}`} />
                  <span>Snap 20px: {snapToGrid ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Right Group: Boolean Analysis Toggle & Expand Canvas */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-[#CBD5E1] shadow-md text-xs font-semibold text-[#1A1C1E] pointer-events-auto">
                <button
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                    isRightSidebarOpen
                      ? 'bg-[#2563EB] text-white border-blue-600 shadow-xs'
                      : 'bg-[#F1F5F9] text-[#1A1C1E] border-[#CBD5E1] hover:bg-[#E2E8F0]'
                  }`}
                  title="Toggle Slide Sidebar Persamaan Boolean & Analisis"
                >
                  <Sigma className="w-4 h-4 text-emerald-400" />
                  <span>Analisis Boolean</span>
                  {isRightSidebarOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setIsFullscreenCanvas(!isFullscreenCanvas)}
                  className="p-1.5 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] border border-[#CBD5E1] transition-all"
                  title={isFullscreenCanvas ? 'Kecilkan Canvas' : 'Perluas Tinggi Canvas'}
                >
                  {isFullscreenCanvas ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Left Slidable Overlay Sidebar: Component Library */}
            {isLeftSidebarOpen && (
              <div className="absolute left-3 top-16 bottom-3 z-30 w-80 max-w-[90vw] bg-white/95 backdrop-blur-md border border-[#CBD5E1] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-left duration-200">
                <div className="p-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#1A1C1E] tracking-wider flex items-center gap-1.5">
                    <PanelLeft className="w-4 h-4 text-[#2563EB]" /> Panel Komponen Logika
                  </span>
                  <button
                    onClick={() => setIsLeftSidebarOpen(false)}
                    className="p-1 rounded hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#1A1C1E] transition-colors"
                    title="Tutup Sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
                  <ComponentLibrary onAddComponent={addNodeToCanvas} />
                </div>
              </div>
            )}

            {/* Right Slidable Overlay Sidebar: Boolean LaTeX Expression Engine */}
            {isRightSidebarOpen && (
              <div className="absolute right-3 top-16 bottom-3 z-30 w-84 max-w-[90vw] bg-white/95 backdrop-blur-md border border-[#CBD5E1] rounded-xl shadow-2xl overflow-y-auto p-1.5 animate-in fade-in slide-in-from-right duration-200 custom-scrollbar">
                <div className="p-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between mb-2 rounded-lg">
                  <span className="text-xs font-black uppercase text-[#1A1C1E] tracking-wider flex items-center gap-1.5">
                    <Sigma className="w-4 h-4 text-[#2563EB]" /> Analisis & Formula Aljabar
                  </span>
                  <button
                    onClick={() => setIsRightSidebarOpen(false)}
                    className="p-1 rounded hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#1A1C1E] transition-colors"
                    title="Tutup Sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <BooleanLaTeXSidebar nodes={nodes} edges={edges} />
              </div>
            )}

            {/* Core ReactFlow Canvas */}
            <ReactFlow
              nodes={preparedNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              colorMode="light"
              snapToGrid={snapToGrid}
              snapGrid={[20, 20]}
            >
              {bgType === 'dots' && <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#CBD5E1" />}
              <Controls className="!bg-white !border-[#D1D5DB] !text-[#1A1C1E] !shadow-sm !top-16" />
            </ReactFlow>
          </div>
        </div>

      {/* Navigation to Validator */}
      <div className="flex justify-between items-center pt-4 border-t border-[#D1D5DB]">
        <span className="text-xs text-[#64748B]">Selesai merakit sirkuit? Lakukan pengujian otomatis terhadap tabel kebenaran modul.</span>
        <button
          onClick={onNextPhase}
          className="px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          Uji Tabel Kebenaran Modul <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Vibe Coding Generated Code Modal */}
      {showVibeCodeModal && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#D1D5DB] rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-4 relative text-[#1A1C1E]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm uppercase">
                <Code2 className="w-5 h-5 text-[#2563EB]" /> Vibe Coding Generator ({module.title})
              </div>
              <button
                onClick={() => setShowVibeCodeModal(false)}
                className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1A1C1E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selection Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-lg border border-[#CBD5E1] text-xs">
                <button
                  onClick={() => setCodeTab('cpp')}
                  className={`px-3 py-1.5 rounded-md font-mono font-bold ${
                    codeTab === 'cpp' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                  }`}
                >
                  Arduino C++
                </button>
                <button
                  onClick={() => setCodeTab('python')}
                  className={`px-3 py-1.5 rounded-md font-mono font-bold ${
                    codeTab === 'python' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                  }`}
                >
                  Python (Raspberry Pi)
                </button>
                <button
                  onClick={() => setCodeTab('verilog')}
                  className={`px-3 py-1.5 rounded-md font-mono font-bold ${
                    codeTab === 'verilog' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:text-[#1A1C1E]'
                  }`}
                >
                  Verilog HDL
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#1A1C1E] flex items-center gap-1.5 border border-[#CBD5E1]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin!' : 'Salin Kode'}
              </button>
            </div>

            {/* Code Box View */}
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#334155] font-mono text-xs text-slate-100 max-h-[380px] overflow-y-auto leading-relaxed whitespace-pre">
              {vibeCodes[codeTab]}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowVibeCodeModal(false)}
                className="px-4 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#1A1C1E] border border-[#CBD5E1]"
              >
                Tutup Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
