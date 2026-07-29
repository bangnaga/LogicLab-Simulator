import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Engine,
  Scene,
  Vector3,
  Color3,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  Curve3,
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  TransformNode,
  DynamicTexture,
} from '@babylonjs/core';
import { Node, Edge } from '@xyflow/react';
import { LogicNodeData, evaluateLogicGraph } from '../../utils/logicEngine';
import { PracticumModule } from '../../types';
import {
  RotateCcw,
  Eye,
  Zap,
  Box,
  Layers,
  Sparkles,
  Maximize2,
  Info,
  Play,
  CheckCircle2,
  Activity,
  Cpu,
  Power,
  Volume2,
} from 'lucide-react';

interface BabylonCircuit3DProps {
  module?: PracticumModule;
  nodes?: Node<LogicNodeData>[];
  edges?: Edge[];
  onStateChange?: (newNodes: Node<LogicNodeData>[]) => void;
}

export const BabylonCircuit3D: React.FC<BabylonCircuit3DProps> = ({
  module,
  nodes = [],
  edges = [],
  onStateChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const ledLightMapRef = useRef<Map<string, PointLight>>(new Map());
  const ledMeshMapRef = useRef<Map<string, Mesh>>(new Map());
  const switchMeshMapRef = useRef<Map<string, Mesh>>(new Map());

  // Interactive UI State
  const [selectedChip, setSelectedChip] = useState<'7408' | '7432' | '7404' | '7400' | '7486'>('7408');
  const [inputStates, setInputStates] = useState<Record<string, number>>({ A: 1, B: 0, C: 1 });
  const [wireStyle, setWireStyle] = useState<'curved' | 'straight'>('curved');
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'ic' | 'multimeter'>('iso');
  const [multimeterReadout, setMultimeterReadout] = useState<{ pin: string; voltage: string; logic: string }>({
    pin: 'Pin 3 (Y Output)',
    voltage: '5.00 V',
    logic: 'HIGH (1)',
  });
  const [labEnvironment, setLabEnvironment] = useState<'clean' | 'dark' | 'amber'>('clean');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [activeTab3D, setActiveTab3D] = useState<'VIEW' | 'CHIPS' | 'MULTIMETER'>('VIEW');

  // Extract inputs and outputs from nodes or default
  const inputNodes = nodes.filter((n) => n.type?.startsWith('input_'));
  const outputNodes = nodes.filter((n) => n.type?.startsWith('output_'));

  // Calculate logic outputs using logic engine or internal rule
  const calculateOutput = (chip: string, inA: number, inB: number): number => {
    switch (chip) {
      case '7408': // AND
        return inA && inB ? 1 : 0;
      case '7432': // OR
        return inA || inB ? 1 : 0;
      case '7404': // NOT
        return inA ? 0 : 1;
      case '7400': // NAND
        return inA && inB ? 0 : 1;
      case '7486': // XOR
        return inA !== inB ? 1 : 0;
      default:
        return 0;
    }
  };

  const outputVal = calculateOutput(selectedChip, inputStates.A ?? 0, inputStates.B ?? 0);

  // Toggle Input Handler
  const toggleInput = (key: string) => {
    setInputStates((prev) => {
      const nextVal = prev[key] === 1 ? 0 : 1;
      const updated = { ...prev, [key]: nextVal };

      // Also sync back to nodes if provided
      if (inputNodes.length > 0 && onStateChange) {
        const updatedNodes = nodes.map((n) => {
          if (n.data?.pinLabel === key || n.id.includes(key.toLowerCase())) {
            return {
              ...n,
              data: { ...n.data, value: nextVal as 0 | 1 },
            };
          }
          return n;
        });
        const evalRes = evaluateLogicGraph(updatedNodes, edges);
        onStateChange(evalRes.evaluatedNodes);
      }
      return updated;
    });
  };

  // Setup Babylon 3D Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Engine
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    engineRef.current = engine;

    // Create Scene
    const scene = new Scene(engine);
    sceneRef.current = scene;

    // Environment background color
    scene.clearColor = new Color4(0.95, 0.96, 0.98, 1.0);

    // Camera
    const camera = new ArcRotateCamera(
      'camera1',
      -Math.PI / 3.5,
      Math.PI / 3.2,
      22,
      new Vector3(0, 1.5, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 40;
    camera.wheelPrecision = 30;
    cameraRef.current = camera;

    // Lighting
    const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.85;
    hemiLight.diffuse = new Color3(1, 1, 1);
    hemiLight.groundColor = new Color3(0.4, 0.4, 0.4);

    const dirLight = new PointLight('dirLight', new Vector3(10, 20, 10), scene);
    dirLight.intensity = 0.5;

    // --- BUILD 3D BREADBOARD MATS & MESHES ---
    // Breadboard Base Plastic Body
    const boardMat = new StandardMaterial('boardMat', scene);
    boardMat.diffuseColor = new Color3(0.94, 0.94, 0.92);
    boardMat.specularColor = new Color3(0.1, 0.1, 0.1);

    const breadboard = MeshBuilder.CreateBox('breadboard', { width: 18, height: 1.2, depth: 10 }, scene);
    breadboard.position = new Vector3(0, 0, 0);
    breadboard.material = boardMat;

    // Center Divider Channel
    const dividerMat = new StandardMaterial('dividerMat', scene);
    dividerMat.diffuseColor = new Color3(0.2, 0.2, 0.22);
    const divider = MeshBuilder.CreateBox('divider', { width: 17.6, height: 1.25, depth: 0.6 }, scene);
    divider.position = new Vector3(0, 0.05, 0);
    divider.material = dividerMat;

    // Power Rails (Red + 5V Line and Blue - GND Line)
    const redMat = new StandardMaterial('redRail', scene);
    redMat.diffuseColor = new Color3(0.85, 0.15, 0.15);
    const blueMat = new StandardMaterial('blueRail', scene);
    blueMat.diffuseColor = new Color3(0.15, 0.35, 0.85);

    const railTopRed = MeshBuilder.CreateBox('railTopRed', { width: 17.2, height: 1.22, depth: 0.15 }, scene);
    railTopRed.position = new Vector3(0, 0.02, 4.2);
    railTopRed.material = redMat;

    const railTopBlue = MeshBuilder.CreateBox('railTopBlue', { width: 17.2, height: 1.22, depth: 0.15 }, scene);
    railTopBlue.position = new Vector3(0, 0.02, 3.7);
    railTopBlue.material = blueMat;

    const railBotRed = MeshBuilder.CreateBox('railBotRed', { width: 17.2, height: 1.22, depth: 0.15 }, scene);
    railBotRed.position = new Vector3(0, 0.02, -3.7);
    railBotRed.material = redMat;

    const railBotBlue = MeshBuilder.CreateBox('railBotBlue', { width: 17.2, height: 1.22, depth: 0.15 }, scene);
    railBotBlue.position = new Vector3(0, 0.02, -4.2);
    railBotBlue.material = blueMat;

    // Grid Holes (Visualized as small dark square dots)
    const holeMat = new StandardMaterial('holeMat', scene);
    holeMat.diffuseColor = new Color3(0.12, 0.12, 0.12);

    // Create instanced pinholes across breadboard grid
    for (let x = -8; x <= 8; x += 0.6) {
      for (let z of [4.2, 3.7, 2.8, 2.2, 1.6, 1.0, 0.4, -0.4, -1.0, -1.6, -2.2, -2.8, -3.7, -4.2]) {
        const hole = MeshBuilder.CreateBox(`hole_${x}_${z}`, { width: 0.2, height: 1.23, depth: 0.2 }, scene);
        hole.position = new Vector3(x, 0.02, z);
        hole.material = holeMat;
      }
    }

    // --- BUILD 3D DIP-14 INTEGRATED CIRCUIT CHIP ---
    const icNode = new TransformNode('icNode', scene);
    icNode.position = new Vector3(0, 0.6, 0);

    const icBodyMat = new StandardMaterial('icBodyMat', scene);
    icBodyMat.diffuseColor = new Color3(0.1, 0.1, 0.12);
    icBodyMat.specularColor = new Color3(0.3, 0.3, 0.3);

    const icBody = MeshBuilder.CreateBox('icBody', { width: 5.2, height: 0.9, depth: 2.2 }, scene);
    icBody.parent = icNode;
    icBody.material = icBodyMat;

    // Pin 1 Index Notch (Half Sphere or Cylinder)
    const notchMat = new StandardMaterial('notchMat', scene);
    notchMat.diffuseColor = new Color3(0.05, 0.05, 0.05);
    const notch = MeshBuilder.CreateCylinder('notch', { diameter: 0.5, height: 0.92, tessellation: 16 }, scene);
    notch.position = new Vector3(-2.6, 0.01, 0);
    notch.parent = icNode;
    notch.material = notchMat;

    // IC Metal Pins (14 Pins: 7 top, 7 bottom)
    const pinMat = new StandardMaterial('pinMat', scene);
    pinMat.diffuseColor = new Color3(0.8, 0.82, 0.85);
    pinMat.specularColor = new Color3(0.9, 0.9, 0.9);

    for (let i = 0; i < 7; i++) {
      const pinX = -2.1 + i * 0.7;
      // Top Pins (Pin 14 to Pin 8)
      const pinTop = MeshBuilder.CreateBox(`pin_top_${i}`, { width: 0.15, height: 1.2, depth: 0.4 }, scene);
      pinTop.position = new Vector3(pinX, -0.3, 1.2);
      pinTop.parent = icNode;
      pinTop.material = pinMat;

      // Bottom Pins (Pin 1 to Pin 7)
      const pinBot = MeshBuilder.CreateBox(`pin_bot_${i}`, { width: 0.15, height: 1.2, depth: 0.4 }, scene);
      pinBot.position = new Vector3(pinX, -0.3, -1.2);
      pinBot.parent = icNode;
      pinBot.material = pinMat;
    }

    // Dynamic Text Label on IC Chip
    const icTextMat = new StandardMaterial('icTextMat', scene);
    const dynamicTexture = new DynamicTexture('DynamicTexture', { width: 512, height: 256 }, scene);
    dynamicTexture.drawText('SN7408N', 120, 150, 'bold 70px monospace', '#FFFFFF', '#1A1A1A', true);
    icTextMat.diffuseTexture = dynamicTexture;
    icTextMat.specularColor = new Color3(0, 0, 0);

    const icLabelPlate = MeshBuilder.CreatePlane('icLabelPlate', { width: 4.8, height: 1.8 }, scene);
    icLabelPlate.rotation.x = Math.PI / 2;
    icLabelPlate.position = new Vector3(0, 0.46, 0);
    icLabelPlate.parent = icNode;
    icLabelPlate.material = icTextMat;

    // --- BUILD 3D TOGGLE SWITCHES (INPUTS A, B, C) ---
    const switchPos = [
      { key: 'A', x: -6.5, z: 2.2, label: 'Input A (SW1)' },
      { key: 'B', x: -6.5, z: -0.2, label: 'Input B (SW2)' },
      { key: 'C', x: -6.5, z: -2.6, label: 'Input C (SW3)' },
    ];

    switchPos.forEach((sw) => {
      const swNode = new TransformNode(`swNode_${sw.key}`, scene);
      swNode.position = new Vector3(sw.x, 0.6, sw.z);

      // Base plastic block
      const swBaseMat = new StandardMaterial(`swBaseMat_${sw.key}`, scene);
      swBaseMat.diffuseColor = new Color3(0.8, 0.2, 0.2);
      const swBase = MeshBuilder.CreateBox(`swBase_${sw.key}`, { width: 1.2, height: 0.8, depth: 1.2 }, scene);
      swBase.parent = swNode;
      swBase.material = swBaseMat;

      // Metallic Lever Arm
      const leverMat = new StandardMaterial(`leverMat_${sw.key}`, scene);
      leverMat.diffuseColor = new Color3(0.9, 0.9, 0.95);

      const lever = MeshBuilder.CreateCylinder(`lever_${sw.key}`, { diameter: 0.3, height: 1.2 }, scene);
      lever.position = new Vector3(0, 0.6, 0);
      lever.rotation.z = Math.PI / 6; // Angled ON state
      lever.parent = swNode;
      lever.material = leverMat;

      switchMeshMapRef.current.set(sw.key, lever as Mesh);

      // Click Action to toggle input
      swBase.actionManager = new ActionManager(scene);
      swBase.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          toggleInput(sw.key);
        })
      );
      lever.actionManager = new ActionManager(scene);
      lever.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          toggleInput(sw.key);
        })
      );
    });

    // --- BUILD 3D OUTPUT LED (OUTPUT Y) ---
    const ledNode = new TransformNode('ledNode', scene);
    ledNode.position = new Vector3(6.5, 0.6, 0);

    // LED Anode & Cathode Metal Legs
    const leg1 = MeshBuilder.CreateCylinder('leg1', { diameter: 0.1, height: 1.2 }, scene);
    leg1.position = new Vector3(-0.2, 0.2, 0);
    leg1.parent = ledNode;
    leg1.material = pinMat;

    const leg2 = MeshBuilder.CreateCylinder('leg2', { diameter: 0.1, height: 1.0 }, scene);
    leg2.position = new Vector3(0.2, 0.1, 0);
    leg2.parent = ledNode;
    leg2.material = pinMat;

    // LED Epoxy Dome Plastic Lens
    const ledMat = new StandardMaterial('ledMat', scene);
    ledMat.diffuseColor = new Color3(0.9, 0.1, 0.1);
    ledMat.emissiveColor = new Color3(0.8, 0.0, 0.0);
    ledMat.alpha = 0.88;

    const ledDome = MeshBuilder.CreateSphere('ledDome', { diameter: 1.4, segments: 16 }, scene);
    ledDome.position = new Vector3(0, 1.2, 0);
    ledDome.scaling = new Vector3(1, 1.4, 1);
    ledDome.parent = ledNode;
    ledDome.material = ledMat;

    ledMeshMapRef.current.set('OUT', ledDome as Mesh);

    // Dynamic Point Light for Glowing LED
    const ledLight = new PointLight('ledLight', new Vector3(6.5, 2.0, 0), scene);
    ledLight.diffuse = new Color3(1, 0.1, 0.1);
    ledLight.intensity = 1.5;
    ledLightMapRef.current.set('OUT', ledLight);

    // --- BUILD 3D DIGITAL MULTIMETER UNIT ---
    const dmmNode = new TransformNode('dmmNode', scene);
    dmmNode.position = new Vector3(4.0, 1.2, 6.0);

    const dmmMat = new StandardMaterial('dmmMat', scene);
    dmmMat.diffuseColor = new Color3(0.95, 0.65, 0.05); // Yellow Fluke-style body
    const dmmBody = MeshBuilder.CreateBox('dmmBody', { width: 3.5, height: 1.8, depth: 4.8 }, scene);
    dmmBody.rotation.x = -Math.PI / 12;
    dmmBody.parent = dmmNode;
    dmmBody.material = dmmMat;

    // DMM LCD Screen
    const screenMat = new StandardMaterial('screenMat', scene);
    screenMat.diffuseColor = new Color3(0.05, 0.15, 0.12);
    screenMat.emissiveColor = new Color3(0.02, 0.2, 0.15);

    const dmmScreen = MeshBuilder.CreatePlane('dmmScreen', { width: 2.8, height: 1.4 }, scene);
    dmmScreen.rotation.x = Math.PI / 2 - Math.PI / 12;
    dmmScreen.position = new Vector3(0, 0.95, 1.0);
    dmmScreen.parent = dmmNode;
    dmmScreen.material = screenMat;

    // --- BUILD 3D JUMPER WIRES ---
    const drawJumperWire = (
      id: string,
      start: Vector3,
      end: Vector3,
      color: Color3,
      heightCurve = 2.5
    ) => {
      const mid = Vector3.Lerp(start, end, 0.5).add(new Vector3(0, heightCurve, 0));
      const catmull = Curve3.CreateCatmullRomSpline([start, mid, end], 20);
      const wireMesh = MeshBuilder.CreateTube(
        id,
        { path: catmull.getPoints(), radius: 0.1, updatable: false },
        scene
      );

      const wMat = new StandardMaterial(`${id}_mat`, scene);
      wMat.diffuseColor = color;
      wMat.specularColor = new Color3(0.2, 0.2, 0.2);
      wireMesh.material = wMat;
    };

    // Draw connecting jumper wires in 3D
    // Wire 1: Input A to IC Pin 1
    drawJumperWire('w1', new Vector3(-6.5, 0.7, 2.2), new Vector3(-2.1, 0.6, -1.2), new Color3(0.9, 0.1, 0.1), 3.0);
    // Wire 2: Input B to IC Pin 2
    drawJumperWire('w2', new Vector3(-6.5, 0.7, -0.2), new Vector3(-1.4, 0.6, -1.2), new Color3(0.1, 0.8, 0.2), 2.2);
    // Wire 3: IC Pin 3 (Output Y) to LED Input
    drawJumperWire('w3', new Vector3(-0.7, 0.6, -1.2), new Vector3(6.5, 0.7, 0), new Color3(0.1, 0.4, 0.9), 3.5);
    // Wire 4: VCC Power Wire (5V Red)
    drawJumperWire('w4', new Vector3(0, 0.6, 3.7), new Vector3(2.1, 0.6, 1.2), new Color3(0.85, 0.1, 0.1), 1.8);
    // Wire 5: GND Ground Wire (0V Blue)
    drawJumperWire('w5', new Vector3(0, 0.6, -4.2), new Vector3(-2.1, 0.6, -1.2), new Color3(0.1, 0.2, 0.8), 1.8);

    // Render loop
    engine.runRenderLoop(() => {
      if (sceneRef.current) {
        sceneRef.current.render();
      }
    });

    // Resize handling
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  // Sync Input Lever Position, LED Glow & Multimeter Reading on state changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Update LED glow material & light intensity
    const ledDome = ledMeshMapRef.current.get('OUT');
    const ledLight = ledLightMapRef.current.get('OUT');

    if (ledDome && ledDome.material) {
      const mat = ledDome.material as StandardMaterial;
      if (outputVal === 1) {
        mat.emissiveColor = new Color3(1.0, 0.2, 0.1);
        mat.diffuseColor = new Color3(1.0, 0.3, 0.2);
        mat.alpha = 1.0;
        if (ledLight) ledLight.intensity = 2.5;
      } else {
        mat.emissiveColor = new Color3(0.15, 0.02, 0.02);
        mat.diffuseColor = new Color3(0.4, 0.05, 0.05);
        mat.alpha = 0.6;
        if (ledLight) ledLight.intensity = 0.0;
      }
    }

    // Update Switch Lever Rotations
    ['A', 'B', 'C'].forEach((key) => {
      const lever = switchMeshMapRef.current.get(key);
      if (lever) {
        const val = inputStates[key] ?? 0;
        lever.rotation.z = val === 1 ? Math.PI / 6 : -Math.PI / 6;
      }
    });

    // Update Multimeter Readout State
    setMultimeterReadout({
      pin: `Pin 3 (Y Output - ${selectedChip})`,
      voltage: outputVal === 1 ? '5.02 V' : '0.04 V',
      logic: outputVal === 1 ? 'HIGH (1)' : 'LOW (0)',
    });
  }, [inputStates, outputVal, selectedChip]);

  // Handle IC Chip Texture Update
  useEffect(() => {
    if (!sceneRef.current) return;

    const icPlate = sceneRef.current.getMeshByName('icLabelPlate');
    if (icPlate && icPlate.material) {
      const mat = icPlate.material as StandardMaterial;
      if (mat.diffuseTexture) {
        const dynamicTexture = mat.diffuseTexture as DynamicTexture;
        dynamicTexture.drawText(`SN${selectedChip}N`, 110, 150, 'bold 70px monospace', '#FFFFFF', '#1A1A1A', true);
      }
    }
  }, [selectedChip]);

  // Handle Camera Presets
  const applyCameraPreset = (preset: 'iso' | 'top' | 'ic' | 'multimeter') => {
    setCameraPreset(preset);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;

    switch (preset) {
      case 'iso':
        cam.alpha = -Math.PI / 3.5;
        cam.beta = Math.PI / 3.2;
        cam.radius = 22;
        cam.target = new Vector3(0, 1.5, 0);
        break;
      case 'top':
        cam.alpha = -Math.PI / 2;
        cam.beta = 0.05;
        cam.radius = 20;
        cam.target = new Vector3(0, 0, 0);
        break;
      case 'ic':
        cam.alpha = -Math.PI / 2.8;
        cam.beta = Math.PI / 4;
        cam.radius = 11;
        cam.target = new Vector3(0, 1.2, 0);
        break;
      case 'multimeter':
        cam.alpha = Math.PI / 4;
        cam.beta = Math.PI / 3.5;
        cam.radius = 12;
        cam.target = new Vector3(4.0, 1.2, 5.0);
        break;
    }
  };

  // Toggle Auto Rotation
  useEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.useAutoRotationBehavior = isAutoRotate;
    if (isAutoRotate && cameraRef.current.autoRotationBehavior) {
      cameraRef.current.autoRotationBehavior.idleRotationSpeed = 0.4;
    }
  }, [isAutoRotate]);

  // Handle Environment Backdrop Color
  useEffect(() => {
    if (!sceneRef.current) return;
    if (labEnvironment === 'dark') {
      sceneRef.current.clearColor = new Color4(0.08, 0.1, 0.14, 1.0);
    } else if (labEnvironment === 'amber') {
      sceneRef.current.clearColor = new Color4(0.12, 0.08, 0.05, 1.0);
    } else {
      sceneRef.current.clearColor = new Color4(0.95, 0.96, 0.98, 1.0);
    }
  }, [labEnvironment]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0F172A] text-white rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      {/* 3D Header Toolbar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold shadow-inner">
            <Box className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Simulasi 3D Breadboard IC <span className="text-blue-400 font-mono text-xs">(Babylon.js)</span>
              </h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Real-Time 3D Physics
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              Interaksi langsung pin IC 74xx, saklar 3D, LED indikator, dan pembacaan Multimeter digital
            </p>
          </div>
        </div>

        {/* Top Control Bar Tabs */}
        <div className="flex items-center gap-2">
          {/* IC Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 font-mono">Pilih IC 3D:</span>
            <select
              value={selectedChip}
              onChange={(e) => setSelectedChip(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer font-mono"
            >
              <option value="7408" className="bg-slate-900 text-white">
                IC 7408 (AND 2-Input)
              </option>
              <option value="7432" className="bg-slate-900 text-white">
                IC 7432 (OR 2-Input)
              </option>
              <option value="7404" className="bg-slate-900 text-white">
                IC 7404 (NOT Inverter)
              </option>
              <option value="7400" className="bg-slate-900 text-white">
                IC 7400 (NAND Gate)
              </option>
              <option value="7486" className="bg-slate-900 text-white">
                IC 7486 (XOR Gate)
              </option>
            </select>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
              isAutoRotate
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Putar Kamera Otomatis 360°"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
            <span>Orbit {isAutoRotate ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Rendering Canvas */}
      <div className="relative flex-1 w-full h-[540px] bg-slate-950 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full outline-none cursor-grab active:cursor-grabbing" />

        {/* 3D Interactive Floating Overlay Control Panel (Left Side) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-xs">
          {/* Preset Camera Angle Buttons */}
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-2.5 shadow-xl">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Sudut Pandang 3D</span>
              <Eye className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => applyCameraPreset('iso')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  cameraPreset === 'iso'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                <span>Isometric 3D</span>
              </button>
              <button
                onClick={() => applyCameraPreset('top')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  cameraPreset === 'top'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Top-Down (2D)</span>
              </button>
              <button
                onClick={() => applyCameraPreset('ic')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  cameraPreset === 'ic'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Fokus Pin IC</span>
              </button>
              <button
                onClick={() => applyCameraPreset('multimeter')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  cameraPreset === 'multimeter'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-yellow-400" />
                <span>Multimeter</span>
              </button>
            </div>
          </div>

          {/* Real-time Interactive 3D Switch Input Panel */}
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-xl">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Kontrol Saklar Input 3D</span>
              <Power className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex flex-col gap-2">
              {['A', 'B'].map((key) => {
                const isHigh = inputStates[key] === 1;
                return (
                  <div key={key} className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-xs font-bold font-mono text-slate-300">Saklar {key}:</span>
                    <button
                      onClick={() => toggleInput(key)}
                      className={`px-3 py-1 rounded font-mono text-xs font-extrabold transition-all flex items-center gap-1.5 border shadow-sm ${
                        isHigh
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                      }`}
                    >
                      <Zap className={`w-3 h-3 ${isHigh ? 'text-amber-300' : 'text-slate-500'}`} />
                      <span>{isHigh ? 'HIGH (1 / 5V)' : 'LOW (0 / 0V)'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-Time Multimeter Screen Widget (Top-Right Floating) */}
        <div className="absolute top-4 right-4 z-20 bg-slate-900/95 border border-amber-500/40 backdrop-blur-md rounded-xl p-3 shadow-2xl w-64">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Digital Multimeter Probe</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
              DC 5V Max
            </span>
          </div>

          <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 font-mono text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
              Tegangan Pin Terukur
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 tracking-wider font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
              {multimeterReadout.voltage}
            </div>
            <div className="text-[11px] font-bold text-slate-300 mt-1 flex items-center justify-center gap-1.5">
              <span>Status Logika:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${outputVal === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
                {multimeterReadout.logic}
              </span>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between px-1">
            <span>Komponen: SN{selectedChip}N</span>
            <span className="text-blue-400 font-bold">Pin 3 Output</span>
          </div>
        </div>

        {/* Bottom Status Bar & Legend */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xl">
          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span>Rail VCC (+5V Red)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-400 shadow-[0_0_6px_rgba(37,99,235,0.8)]" />
              <span>Rail GND (0V Blue)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
              <span>Sinyal Input (Hijau)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-200" />
              <span>Output LED (Oranye/Merah)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">Latar Belakang:</span>
            <button
              onClick={() => setLabEnvironment('clean')}
              className={`w-4 h-4 rounded-full border ${labEnvironment === 'clean' ? 'ring-2 ring-blue-400 bg-slate-200' : 'bg-slate-300'}`}
              title="Terang / Clean Lab"
            />
            <button
              onClick={() => setLabEnvironment('dark')}
              className={`w-4 h-4 rounded-full border ${labEnvironment === 'dark' ? 'ring-2 ring-blue-400 bg-slate-900' : 'bg-slate-800'}`}
              title="Gelap / Dark Lab"
            />
            <button
              onClick={() => setLabEnvironment('amber')}
              className={`w-4 h-4 rounded-full border ${labEnvironment === 'amber' ? 'ring-2 ring-amber-400 bg-amber-900' : 'bg-amber-950'}`}
              title="Atmosphere Vintage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
