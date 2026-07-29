import React, { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { PRACTICUM_MODULES } from './data/modules';
import { AppTabMode, ViewMode, TruthTableRow, AutoGradeResult, PracticumModule } from './types';
import { LogicNodeData, evaluateLogicGraph } from './utils/logicEngine';

import { Header } from './components/Header';
import { CreatePhase } from './components/DRUCOK/CreatePhase';
import { LabExercisesView } from './components/LabExercisesView';
import { OperatePhase } from './components/DRUCOK/OperatePhase';
import { CommunicatePhase } from './components/DRUCOK/CommunicatePhase';
import { AnalyzePhase } from './components/DRUCOK/AnalyzePhase';
import { LabGovernanceDashboard } from './components/Dashboard/LabGovernanceDashboard';
import { DigitalTheoryBank } from './components/DigitalTheoryBank';
import { BabylonCircuit3D } from './components/Simulasi3D/BabylonCircuit3D';

function buildDefaultModuleGraph(module: PracticumModule): { nodes: Node<LogicNodeData>[]; edges: Edge[] } {
  let nodes: Node<LogicNodeData>[] = [];
  let edges: Edge[] = [];

  const createInputNode = (lbl: string, x: number, y: number, idx: number): Node<LogicNodeData> => ({
    id: `in_${lbl}_${idx}`,
    type: lbl.includes('TEMP')
      ? 'input_sensor_temp'
      : lbl.includes('LGT') || lbl.includes('LIGHT')
      ? 'input_sensor_light'
      : lbl.includes('PIR')
      ? 'input_sensor_pir'
      : lbl.includes('CLK') || lbl.includes('CLOCK')
      ? 'input_clock'
      : 'input_switch',
    position: { x, y },
    data: {
      label: `Input (${lbl})`,
      pinLabel: lbl,
      value: 0,
      tempValue: lbl.includes('LGT') ? 20 : 25,
      motionValue: false,
    },
  });

  const createOutputNode = (lbl: string, x: number, y: number, idx: number): Node<LogicNodeData> => ({
    id: `out_${lbl}_${idx}`,
    type: lbl.includes('LIGHT') || lbl.includes('BULB') || lbl.includes('LAMP')
      ? 'output_bulb'
      : lbl.includes('RELAY') || lbl.includes('FAN')
      ? 'output_relay'
      : lbl.includes('PUMP')
      ? 'output_motor'
      : 'output_led',
    position: { x, y },
    data: { label: `Output (${lbl})`, pinLabel: lbl, value: 0 },
  });

  const createEdge = (id: string, source: string, target: string, targetHandle = 'in1', sourceHandle?: string): Edge => ({
    id,
    source,
    target,
    targetHandle,
    sourceHandle,
    animated: true,
    style: { stroke: '#2563EB', strokeWidth: 2.5 },
  });

  if (module.id === 'mod-01') {
    // MOD-01 Security Alarm: Y = A · (P + J)
    const inA = createInputNode('SW_A', 60, 100, 0);
    const inP = createInputNode('SENS_P', 60, 220, 1);
    const inJ = createInputNode('SENS_J', 60, 340, 2);

    const gateOr: Node<LogicNodeData> = {
      id: 'gate_or_1',
      type: 'gate_or',
      position: { x: 340, y: 260 },
      data: { label: 'Gerbang OR (P+J)', value: 0 },
    };
    const gateAnd: Node<LogicNodeData> = {
      id: 'gate_and_1',
      type: 'gate_and',
      position: { x: 540, y: 160 },
      data: { label: 'Gerbang AND Utama', value: 0 },
    };

    const outBuzzer = createOutputNode('ALARM_OUT', 760, 160, 0);

    nodes = [inA, inP, inJ, gateOr, gateAnd, outBuzzer];
    edges = [
      createEdge('e1', inP.id, gateOr.id, 'in1'),
      createEdge('e2', inJ.id, gateOr.id, 'in2'),
      createEdge('e3', inA.id, gateAnd.id, 'in1'),
      createEdge('e4', gateOr.id, gateAnd.id, 'in2'),
      createEdge('e5', gateAnd.id, outBuzzer.id),
    ];
  } else if (module.id === 'mod-01-nand') {
    // MOD-01-NAND Factory Interlock
    const inSa = createInputNode('SENS_A', 60, 80, 0);
    const inSb = createInputNode('SENS_B', 60, 200, 1);
    const inOv = createInputNode('OVERRIDE', 60, 320, 2);

    const gateNand1: Node<LogicNodeData> = { id: 'gate_nand_1', type: 'gate_nand', position: { x: 280, y: 120 }, data: { label: 'NAND 1 (A·B)\'', value: 0 } };
    const gateNotOv: Node<LogicNodeData> = { id: 'gate_not_ov', type: 'gate_not', position: { x: 280, y: 320 }, data: { label: 'NOT (OVERRIDE)', value: 0 } };
    const gateNand2: Node<LogicNodeData> = { id: 'gate_nand_2', type: 'gate_nand', position: { x: 520, y: 200 }, data: { label: 'NAND 2 Output', value: 0 } };

    const outSafe = createOutputNode('SAFE_OUT', 740, 200, 0);

    nodes = [inSa, inSb, inOv, gateNand1, gateNotOv, gateNand2, outSafe];
    edges = [
      createEdge('e1', inSa.id, gateNand1.id, 'in1'),
      createEdge('e2', inSb.id, gateNand1.id, 'in2'),
      createEdge('e3', inOv.id, gateNotOv.id, 'in1'),
      createEdge('e4', gateNand1.id, gateNand2.id, 'in1'),
      createEdge('e5', gateNotOv.id, gateNand2.id, 'in2'),
      createEdge('e6', gateNand2.id, outSafe.id),
    ];
  } else if (module.id === 'mod-01-nor') {
    // MOD-01-NOR Control Panel Start/Stop Motor
    const inStart = createInputNode('START_SW', 60, 80, 0);
    const inStop = createInputNode('STOP_SW', 60, 200, 1);
    const inReset = createInputNode('RESET_SW', 60, 320, 2);

    const gateNotStart: Node<LogicNodeData> = { id: 'gate_not_start', type: 'gate_not', position: { x: 280, y: 80 }, data: { label: 'NOT START', value: 0 } };
    const gateNor1: Node<LogicNodeData> = { id: 'gate_nor_1', type: 'gate_nor', position: { x: 500, y: 180 }, data: { label: 'NOR Gate Triple', value: 0 } };

    const outMotor = createOutputNode('MOTOR_RUN', 720, 180, 0);

    nodes = [inStart, inStop, inReset, gateNotStart, gateNor1, outMotor];
    edges = [
      createEdge('e1', inStart.id, gateNotStart.id, 'in1'),
      createEdge('e2', gateNotStart.id, gateNor1.id, 'in1'),
      createEdge('e3', inStop.id, gateNor1.id, 'in2'),
      createEdge('e4', gateNor1.id, outMotor.id),
    ];
  } else if (module.id === 'mod-01-xor') {
    // MOD-01-XOR Parity Checker
    const inD0 = createInputNode('D0', 60, 80, 0);
    const inD1 = createInputNode('D1', 60, 200, 1);
    const inD2 = createInputNode('D2', 60, 320, 2);

    const gateXor1: Node<LogicNodeData> = { id: 'gate_xor_1', type: 'gate_xor', position: { x: 300, y: 120 }, data: { label: 'XOR 1 (D0 ⊕ D1)', value: 0 } };
    const gateXor2: Node<LogicNodeData> = { id: 'gate_xor_2', type: 'gate_xor', position: { x: 520, y: 220 }, data: { label: 'XOR 2 Parity', value: 0 } };

    const outErr = createOutputNode('PARITY_ERR', 740, 220, 0);

    nodes = [inD0, inD1, inD2, gateXor1, gateXor2, outErr];
    edges = [
      createEdge('e1', inD0.id, gateXor1.id, 'in1'),
      createEdge('e2', inD1.id, gateXor1.id, 'in2'),
      createEdge('e3', gateXor1.id, gateXor2.id, 'in1'),
      createEdge('e4', inD2.id, gateXor2.id, 'in2'),
      createEdge('e5', gateXor2.id, outErr.id),
    ];
  } else if (module.id === 'mod-01-majority') {
    // MOD-01-MAJ Majority Voting Decision
    const inVa = createInputNode('VOTE_A', 60, 80, 0);
    const inVb = createInputNode('VOTE_B', 60, 200, 1);
    const inVc = createInputNode('VOTE_C', 60, 320, 2);

    const gateAndAB: Node<LogicNodeData> = { id: 'gate_and_ab', type: 'gate_and', position: { x: 300, y: 60 }, data: { label: 'AND (A · B)', value: 0 } };
    const gateAndBC: Node<LogicNodeData> = { id: 'gate_and_bc', type: 'gate_and', position: { x: 300, y: 180 }, data: { label: 'AND (B · C)', value: 0 } };
    const gateAndAC: Node<LogicNodeData> = { id: 'gate_and_ac', type: 'gate_and', position: { x: 300, y: 300 }, data: { label: 'AND (A · C)', value: 0 } };

    const gateOr3: Node<LogicNodeData> = { id: 'gate_or_3', type: 'gate_or', position: { x: 540, y: 180 }, data: { label: 'OR Majority', value: 0 } };
    const outVote = createOutputNode('VOTE_OUT', 740, 180, 0);

    nodes = [inVa, inVb, inVc, gateAndAB, gateAndBC, gateAndAC, gateOr3, outVote];
    edges = [
      createEdge('e1', inVa.id, gateAndAB.id, 'in1'),
      createEdge('e2', inVb.id, gateAndAB.id, 'in2'),
      createEdge('e3', inVb.id, gateAndBC.id, 'in1'),
      createEdge('e4', inVc.id, gateAndBC.id, 'in2'),
      createEdge('e5', inVa.id, gateAndAC.id, 'in1'),
      createEdge('e6', inVc.id, gateAndAC.id, 'in2'),
      createEdge('e7', gateAndAB.id, gateOr3.id, 'in1'),
      createEdge('e8', gateAndBC.id, gateOr3.id, 'in2'),
      createEdge('e9', gateOr3.id, outVote.id),
    ];
  } else if (module.id === 'mod-02') {
    // MOD-02 Half Adder: Sum = A ⊕ B, Carry = A · B
    const inA = createInputNode('A', 60, 100, 0);
    const inB = createInputNode('B', 60, 260, 1);

    const gateXor: Node<LogicNodeData> = {
      id: 'gate_xor_1',
      type: 'gate_xor',
      position: { x: 360, y: 80 },
      data: { label: 'XOR (Sum)', value: 0 },
    };
    const gateAnd: Node<LogicNodeData> = {
      id: 'gate_and_1',
      type: 'gate_and',
      position: { x: 360, y: 260 },
      data: { label: 'AND (Carry)', value: 0 },
    };

    const outSum = createOutputNode('SUM', 660, 80, 0);
    const outCarry = createOutputNode('CARRY', 660, 260, 1);

    nodes = [inA, inB, gateXor, gateAnd, outSum, outCarry];
    edges = [
      createEdge('e1', inA.id, gateXor.id, 'in1'),
      createEdge('e2', inB.id, gateXor.id, 'in2'),
      createEdge('e3', inA.id, gateAnd.id, 'in1'),
      createEdge('e4', inB.id, gateAnd.id, 'in2'),
      createEdge('e5', gateXor.id, outSum.id),
      createEdge('e6', gateAnd.id, outCarry.id),
    ];
  } else if (module.id === 'mod-02-fa') {
    // MOD-02-FA Full Adder 1-Bit
    const inA = createInputNode('A', 60, 80, 0);
    const inB = createInputNode('B', 60, 200, 1);
    const inCin = createInputNode('CIN', 60, 320, 2);

    const gateXor1: Node<LogicNodeData> = { id: 'gate_xor_1', type: 'gate_xor', position: { x: 280, y: 100 }, data: { label: 'XOR 1 (A ⊕ B)', value: 0 } };
    const gateAnd1: Node<LogicNodeData> = { id: 'gate_and_1', type: 'gate_and', position: { x: 280, y: 240 }, data: { label: 'AND 1 (A · B)', value: 0 } };
    const gateXor2: Node<LogicNodeData> = { id: 'gate_xor_2', type: 'gate_xor', position: { x: 480, y: 120 }, data: { label: 'XOR 2 (Sum)', value: 0 } };
    const gateAnd2: Node<LogicNodeData> = { id: 'gate_and_2', type: 'gate_and', position: { x: 480, y: 280 }, data: { label: 'AND 2 (Cin · (A⊕B))', value: 0 } };
    const gateOr: Node<LogicNodeData> = { id: 'gate_or_1', type: 'gate_or', position: { x: 680, y: 260 }, data: { label: 'OR (Cout)', value: 0 } };

    const outSum = createOutputNode('SUM', 720, 120, 0);
    const outCout = createOutputNode('COUT', 880, 260, 1);

    nodes = [inA, inB, inCin, gateXor1, gateAnd1, gateXor2, gateAnd2, gateOr, outSum, outCout];
    edges = [
      createEdge('e1', inA.id, gateXor1.id, 'in1'),
      createEdge('e2', inB.id, gateXor1.id, 'in2'),
      createEdge('e3', inA.id, gateAnd1.id, 'in1'),
      createEdge('e4', inB.id, gateAnd1.id, 'in2'),
      createEdge('e5', gateXor1.id, gateXor2.id, 'in1'),
      createEdge('e6', inCin.id, gateXor2.id, 'in2'),
      createEdge('e7', gateXor1.id, gateAnd2.id, 'in1'),
      createEdge('e8', inCin.id, gateAnd2.id, 'in2'),
      createEdge('e9', gateAnd1.id, gateOr.id, 'in1'),
      createEdge('e10', gateAnd2.id, gateOr.id, 'in2'),
      createEdge('e11', gateXor2.id, outSum.id),
      createEdge('e12', gateOr.id, outCout.id),
    ];
  } else if (module.id === 'mod-03') {
    // MOD-03 Multiplexer 2x1: Y = (D0 · S') + (D1 · S)
    const inD0 = createInputNode('D0', 60, 80, 0);
    const inD1 = createInputNode('D1', 60, 220, 1);
    const inSel = createInputNode('SEL', 60, 360, 2);

    const gateNot: Node<LogicNodeData> = { id: 'gate_not_s', type: 'gate_not', position: { x: 260, y: 360 }, data: { label: 'NOT (SEL)', value: 0 } };
    const gateAnd0: Node<LogicNodeData> = { id: 'gate_and_0', type: 'gate_and', position: { x: 460, y: 100 }, data: { label: 'AND D0', value: 0 } };
    const gateAnd1: Node<LogicNodeData> = { id: 'gate_and_1', type: 'gate_and', position: { x: 460, y: 240 }, data: { label: 'AND D1', value: 0 } };
    const gateOr: Node<LogicNodeData> = { id: 'gate_or_y', type: 'gate_or', position: { x: 680, y: 170 }, data: { label: 'OR Mux Output', value: 0 } };

    const outY = createOutputNode('Y_OUT', 880, 170, 0);

    nodes = [inD0, inD1, inSel, gateNot, gateAnd0, gateAnd1, gateOr, outY];
    edges = [
      createEdge('e1', inSel.id, gateNot.id, 'in1'),
      createEdge('e2', inD0.id, gateAnd0.id, 'in1'),
      createEdge('e3', gateNot.id, gateAnd0.id, 'in2'),
      createEdge('e4', inD1.id, gateAnd1.id, 'in1'),
      createEdge('e5', inSel.id, gateAnd1.id, 'in2'),
      createEdge('e6', gateAnd0.id, gateOr.id, 'in1'),
      createEdge('e7', gateAnd1.id, gateOr.id, 'in2'),
      createEdge('e8', gateOr.id, outY.id),
    ];
  } else if (module.id === 'mod-03-decoder') {
    // MOD-03-DEC Dekoder 2-to-4 Line
    const inA1 = createInputNode('A1', 60, 100, 0);
    const inA0 = createInputNode('A0', 60, 260, 1);

    const gateNot1: Node<LogicNodeData> = { id: 'gate_not_a1', type: 'gate_not', position: { x: 260, y: 100 }, data: { label: 'NOT A1', value: 0 } };
    const gateNot0: Node<LogicNodeData> = { id: 'gate_not_a0', type: 'gate_not', position: { x: 260, y: 260 }, data: { label: 'NOT A0', value: 0 } };

    const gateAndY0: Node<LogicNodeData> = { id: 'gate_and_y0', type: 'gate_and', position: { x: 480, y: 60 }, data: { label: 'AND Y0 (00)', value: 0 } };
    const gateAndY1: Node<LogicNodeData> = { id: 'gate_and_y1', type: 'gate_and', position: { x: 480, y: 180 }, data: { label: 'AND Y1 (01)', value: 0 } };
    const gateAndY2: Node<LogicNodeData> = { id: 'gate_and_y2', type: 'gate_and', position: { x: 480, y: 300 }, data: { label: 'AND Y2 (10)', value: 0 } };
    const gateAndY3: Node<LogicNodeData> = { id: 'gate_and_y3', type: 'gate_and', position: { x: 480, y: 420 }, data: { label: 'AND Y3 (11)', value: 0 } };

    const outY0 = createOutputNode('Y0', 700, 60, 0);
    const outY1 = createOutputNode('Y1', 700, 180, 1);
    const outY2 = createOutputNode('Y2', 700, 300, 2);
    const outY3 = createOutputNode('Y3', 700, 420, 3);

    nodes = [inA1, inA0, gateNot1, gateNot0, gateAndY0, gateAndY1, gateAndY2, gateAndY3, outY0, outY1, outY2, outY3];
    edges = [
      createEdge('e1', inA1.id, gateNot1.id, 'in1'),
      createEdge('e2', inA0.id, gateNot0.id, 'in1'),
      createEdge('e3', gateNot1.id, gateAndY0.id, 'in1'),
      createEdge('e4', gateNot0.id, gateAndY0.id, 'in2'),
      createEdge('e5', gateNot1.id, gateAndY1.id, 'in1'),
      createEdge('e6', inA0.id, gateAndY1.id, 'in2'),
      createEdge('e7', inA1.id, gateAndY2.id, 'in1'),
      createEdge('e8', gateNot0.id, gateAndY2.id, 'in2'),
      createEdge('e9', inA1.id, gateAndY3.id, 'in1'),
      createEdge('e10', inA0.id, gateAndY3.id, 'in2'),
      createEdge('e11', gateAndY0.id, outY0.id),
      createEdge('e12', gateAndY1.id, outY1.id),
      createEdge('e13', gateAndY2.id, outY2.id),
      createEdge('e14', gateAndY3.id, outY3.id),
    ];
  } else if (module.id === 'mod-03-comp') {
    // MOD-03-CMP Magnitude Comparator 2-Bit
    const inA = createInputNode('A', 60, 120, 0);
    const inB = createInputNode('B', 60, 280, 1);

    const gateNotA: Node<LogicNodeData> = { id: 'gate_not_a', type: 'gate_not', position: { x: 260, y: 120 }, data: { label: 'NOT A', value: 0 } };
    const gateNotB: Node<LogicNodeData> = { id: 'gate_not_b', type: 'gate_not', position: { x: 260, y: 280 }, data: { label: 'NOT B', value: 0 } };

    const gateAndLess: Node<LogicNodeData> = { id: 'gate_and_less', type: 'gate_and', position: { x: 480, y: 80 }, data: { label: 'AND (A < B)', value: 0 } };
    const gateXnorEqual: Node<LogicNodeData> = { id: 'gate_xnor_eq', type: 'gate_xnor', position: { x: 480, y: 200 }, data: { label: 'XNOR (A = B)', value: 0 } };
    const gateAndGreat: Node<LogicNodeData> = { id: 'gate_and_great', type: 'gate_and', position: { x: 480, y: 320 }, data: { label: 'AND (A > B)', value: 0 } };

    const outLess = createOutputNode('A_LESS', 700, 80, 0);
    const outEqual = createOutputNode('A_EQUAL', 700, 200, 1);
    const outGreat = createOutputNode('A_GREAT', 700, 320, 2);

    nodes = [inA, inB, gateNotA, gateNotB, gateAndLess, gateXnorEqual, gateAndGreat, outLess, outEqual, outGreat];
    edges = [
      createEdge('e1', inA.id, gateNotA.id, 'in1'),
      createEdge('e2', inB.id, gateNotB.id, 'in1'),
      createEdge('e3', gateNotA.id, gateAndLess.id, 'in1'),
      createEdge('e4', inB.id, gateAndLess.id, 'in2'),
      createEdge('e5', inA.id, gateXnorEqual.id, 'in1'),
      createEdge('e6', inB.id, gateXnorEqual.id, 'in2'),
      createEdge('e7', inA.id, gateAndGreat.id, 'in1'),
      createEdge('e8', gateNotB.id, gateAndGreat.id, 'in2'),
      createEdge('e9', gateAndLess.id, outLess.id),
      createEdge('e10', gateXnorEqual.id, outEqual.id),
      createEdge('e11', gateAndGreat.id, outGreat.id),
    ];
  } else if (module.id === 'mod-04') {
    // MOD-04 D Flip-Flop
    const inD = createInputNode('D_IN', 60, 120, 0);
    const inClk = createInputNode('CLK_PULSE', 60, 260, 1);

    const nodeDFF: Node<LogicNodeData> = {
      id: 'dff_1',
      type: 'ic_7474',
      position: { x: 360, y: 140 },
      data: { label: 'D Flip-Flop (IC 7474)', value: 0 },
    };

    const outQ = createOutputNode('Q_OUT', 680, 100, 0);
    const outQn = createOutputNode('QN_OUT', 680, 240, 1);

    nodes = [inD, inClk, nodeDFF, outQ, outQn];
    edges = [
      createEdge('e1', inD.id, nodeDFF.id, 'd'),
      createEdge('e2', inClk.id, nodeDFF.id, 'clk'),
      createEdge('e3', nodeDFF.id, outQ.id, 'in1', 'out_q'),
      createEdge('e4', nodeDFF.id, outQn.id, 'in1', 'out_qprime'),
    ];
  } else if (module.id === 'mod-07-jkff') {
    // MOD-07-JKFF JK Flip-Flop
    const inJ = createInputNode('J_IN', 60, 80, 0);
    const inK = createInputNode('K_IN', 60, 200, 1);
    const inClk = createInputNode('CLK_PULSE', 60, 320, 2);

    const nodeJKFF: Node<LogicNodeData> = {
      id: 'jkff_1',
      type: 'ic_7476',
      position: { x: 360, y: 140 },
      data: { label: 'JK Flip-Flop (IC 7476)', value: 0 },
    };

    const outQ = createOutputNode('Q_BIT', 680, 160, 0);

    nodes = [inJ, inK, inClk, nodeJKFF, outQ];
    edges = [
      createEdge('e1', inJ.id, nodeJKFF.id, 'j'),
      createEdge('e2', inK.id, nodeJKFF.id, 'k'),
      createEdge('e3', inClk.id, nodeJKFF.id, 'clk'),
      createEdge('e4', nodeJKFF.id, outQ.id),
    ];
  } else if (module.id === 'mod-07-tff') {
    // MOD-07-TFF T Flip-Flop
    const inT = createInputNode('T_IN', 60, 120, 0);
    const inClk = createInputNode('CLK_PULSE', 60, 260, 1);

    const gateAndT: Node<LogicNodeData> = { id: 'gate_and_t', type: 'gate_and', position: { x: 340, y: 180 }, data: { label: 'TFF Drive Gate', value: 0 } };
    const outDiv = createOutputNode('DIV2_OUT', 640, 180, 0);

    nodes = [inT, inClk, gateAndT, outDiv];
    edges = [
      createEdge('e1', inT.id, gateAndT.id, 'in1'),
      createEdge('e2', inClk.id, gateAndT.id, 'in2'),
      createEdge('e3', gateAndT.id, outDiv.id),
    ];
  } else if (module.id === 'mod-07-counter') {
    // MOD-07-CNT 2-Bit Counter
    const inClk = createInputNode('CLK_PULSE', 60, 120, 0);
    const inRst = createInputNode('RESET_SW', 60, 260, 1);

    const gateNotRst: Node<LogicNodeData> = { id: 'gate_not_rst', type: 'gate_not', position: { x: 280, y: 260 }, data: { label: 'NOT RESET', value: 0 } };
    const gateQ0: Node<LogicNodeData> = { id: 'gate_q0', type: 'gate_and', position: { x: 460, y: 100 }, data: { label: 'Q0 LSB Gate', value: 0 } };
    const gateQ1: Node<LogicNodeData> = { id: 'gate_q1', type: 'gate_and', position: { x: 460, y: 220 }, data: { label: 'Q1 MSB Gate', value: 0 } };

    const outQ0 = createOutputNode('Q0_LSB', 680, 100, 0);
    const outQ1 = createOutputNode('Q1_MSB', 680, 220, 1);

    nodes = [inClk, inRst, gateNotRst, gateQ0, gateQ1, outQ0, outQ1];
    edges = [
      createEdge('e1', inRst.id, gateNotRst.id, 'in1'),
      createEdge('e2', inClk.id, gateQ0.id, 'in1'),
      createEdge('e3', gateNotRst.id, gateQ0.id, 'in2'),
      createEdge('e4', gateQ0.id, gateQ1.id, 'in1'),
      createEdge('e5', gateNotRst.id, gateQ1.id, 'in2'),
      createEdge('e6', gateQ0.id, outQ0.id),
      createEdge('e7', gateQ1.id, outQ1.id),
    ];
  } else if (module.id === 'mod-07-shift') {
    // MOD-07-SIPO 2-Bit Shift Register
    const inData = createInputNode('DATA_IN', 60, 120, 0);
    const inClk = createInputNode('CLK_PULSE', 60, 260, 1);

    const gateQ0: Node<LogicNodeData> = { id: 'gate_q0', type: 'gate_and', position: { x: 340, y: 100 }, data: { label: 'Shift Q0 Gate', value: 0 } };
    const gateQ1: Node<LogicNodeData> = { id: 'gate_q1', type: 'gate_and', position: { x: 520, y: 200 }, data: { label: 'Shift Q1 Gate', value: 0 } };

    const outQ0 = createOutputNode('OUT_Q0', 700, 100, 0);
    const outQ1 = createOutputNode('OUT_Q1', 700, 200, 1);

    nodes = [inData, inClk, gateQ0, gateQ1, outQ0, outQ1];
    edges = [
      createEdge('e1', inData.id, gateQ0.id, 'in1'),
      createEdge('e2', inClk.id, gateQ0.id, 'in2'),
      createEdge('e3', gateQ0.id, gateQ1.id, 'in1'),
      createEdge('e4', inClk.id, gateQ1.id, 'in2'),
      createEdge('e5', gateQ0.id, outQ0.id),
      createEdge('e6', gateQ1.id, outQ1.id),
    ];
  } else if (module.id === 'mod-05') {
    // MOD-05 Smart Greenhouse
    const inTemp = createInputNode('TEMP_HIGH', 60, 80, 0);
    const inAuto = createInputNode('AUTO_MODE', 60, 200, 1);
    const inManual = createInputNode('MANUAL_SW', 60, 320, 2);

    const gateAnd: Node<LogicNodeData> = { id: 'gate_and_1', type: 'gate_and', position: { x: 340, y: 120 }, data: { label: 'AND (TEMP & AUTO)', value: 0 } };
    const gateOr: Node<LogicNodeData> = { id: 'gate_or_1', type: 'gate_or', position: { x: 540, y: 220 }, data: { label: 'OR (Manual Override)', value: 0 } };

    const outFan = createOutputNode('RELAY_FAN', 760, 220, 0);

    nodes = [inTemp, inAuto, inManual, gateAnd, gateOr, outFan];
    edges = [
      createEdge('e1', inTemp.id, gateAnd.id, 'in1'),
      createEdge('e2', inAuto.id, gateAnd.id, 'in2'),
      createEdge('e3', gateAnd.id, gateOr.id, 'in1'),
      createEdge('e4', inManual.id, gateOr.id, 'in2'),
      createEdge('e5', gateOr.id, outFan.id),
    ];
  } else if (module.id === 'mod-06') {
    // MOD-06 Pump Water Level Interlock
    const inLow = createInputNode('LOW_SENS', 60, 80, 0);
    const inHigh = createInputNode('HIGH_SENS', 60, 200, 1);
    const inWell = createInputNode('WELL_OK', 60, 320, 2);

    const gateNotLow: Node<LogicNodeData> = { id: 'gate_not_low', type: 'gate_not', position: { x: 280, y: 80 }, data: { label: 'NOT (LOW_SENS)', value: 0 } };
    const gateNotHigh: Node<LogicNodeData> = { id: 'gate_not_high', type: 'gate_not', position: { x: 280, y: 200 }, data: { label: 'NOT (HIGH_SENS)', value: 0 } };
    const gateAndPermit: Node<LogicNodeData> = { id: 'gate_and_permit', type: 'gate_and', position: { x: 480, y: 240 }, data: { label: 'AND (WELL & NOT HIGH)', value: 0 } };
    const gateAndPump: Node<LogicNodeData> = { id: 'gate_and_pump', type: 'gate_and', position: { x: 680, y: 160 }, data: { label: 'AND Pump Drive', value: 0 } };

    const outPump = createOutputNode('PUMP_ON', 900, 160, 0);

    nodes = [inLow, inHigh, inWell, gateNotLow, gateNotHigh, gateAndPermit, gateAndPump, outPump];
    edges = [
      createEdge('e1', inLow.id, gateNotLow.id, 'in1'),
      createEdge('e2', inHigh.id, gateNotHigh.id, 'in1'),
      createEdge('e3', inWell.id, gateAndPermit.id, 'in1'),
      createEdge('e4', gateNotHigh.id, gateAndPermit.id, 'in2'),
      createEdge('e5', gateNotLow.id, gateAndPump.id, 'in1'),
      createEdge('e6', gateAndPermit.id, gateAndPump.id, 'in2'),
      createEdge('e7', gateAndPump.id, outPump.id),
    ];
  } else if (module.id === 'mod-08-gpio') {
    // MOD-08-GPIO MCU GPIO Register
    const inDdr = createInputNode('DDR_ENABLE', 60, 120, 0);
    const inPort = createInputNode('PORT_DATA', 60, 260, 1);

    const gateAndGpio: Node<LogicNodeData> = { id: 'gate_and_gpio', type: 'gate_and', position: { x: 360, y: 180 }, data: { label: 'AND Driver (DDR · PORT)', value: 0 } };
    const outGpio = createOutputNode('GPIO_OUT', 660, 180, 0);

    nodes = [inDdr, inPort, gateAndGpio, outGpio];
    edges = [
      createEdge('e1', inDdr.id, gateAndGpio.id, 'in1'),
      createEdge('e2', inPort.id, gateAndGpio.id, 'in2'),
      createEdge('e3', gateAndGpio.id, outGpio.id),
    ];
  } else if (module.id === 'mod-08-alu') {
    // MOD-08-ALU Mini 1-Bit ALU
    const inA = createInputNode('ALU_A', 60, 80, 0);
    const inB = createInputNode('ALU_B', 60, 200, 1);
    const inSel = createInputNode('ALU_SEL', 60, 320, 2);

    const gateXorAdd: Node<LogicNodeData> = { id: 'gate_xor_add', type: 'gate_xor', position: { x: 280, y: 80 }, data: { label: 'XOR (Adder)', value: 0 } };
    const gateAndLog: Node<LogicNodeData> = { id: 'gate_and_log', type: 'gate_and', position: { x: 280, y: 200 }, data: { label: 'AND (Logic)', value: 0 } };
    const gateNotSel: Node<LogicNodeData> = { id: 'gate_not_sel', type: 'gate_not', position: { x: 280, y: 320 }, data: { label: 'NOT (ALU_SEL)', value: 0 } };

    const gateAndOp0: Node<LogicNodeData> = { id: 'gate_and_op0', type: 'gate_and', position: { x: 500, y: 100 }, data: { label: 'AND Op 0 (Adder)', value: 0 } };
    const gateAndOp1: Node<LogicNodeData> = { id: 'gate_and_op1', type: 'gate_and', position: { x: 500, y: 240 }, data: { label: 'AND Op 1 (Logic)', value: 0 } };
    const gateOrAlu: Node<LogicNodeData> = { id: 'gate_or_alu', type: 'gate_or', position: { x: 700, y: 170 }, data: { label: 'OR Mux ALU Output', value: 0 } };

    const outAlu = createOutputNode('ALU_OUT', 900, 170, 0);

    nodes = [inA, inB, inSel, gateXorAdd, gateAndLog, gateNotSel, gateAndOp0, gateAndOp1, gateOrAlu, outAlu];
    edges = [
      createEdge('e1', inA.id, gateXorAdd.id, 'in1'),
      createEdge('e2', inB.id, gateXorAdd.id, 'in2'),
      createEdge('e3', inA.id, gateAndLog.id, 'in1'),
      createEdge('e4', inB.id, gateAndLog.id, 'in2'),
      createEdge('e5', inSel.id, gateNotSel.id, 'in1'),
      createEdge('e6', gateXorAdd.id, gateAndOp0.id, 'in1'),
      createEdge('e7', gateNotSel.id, gateAndOp0.id, 'in2'),
      createEdge('e8', gateAndLog.id, gateAndOp1.id, 'in1'),
      createEdge('e9', inSel.id, gateAndOp1.id, 'in2'),
      createEdge('e10', gateAndOp0.id, gateOrAlu.id, 'in1'),
      createEdge('e11', gateAndOp1.id, gateOrAlu.id, 'in2'),
      createEdge('e12', gateOrAlu.id, outAlu.id),
    ];
  } else if (module.id === 'mod-08-capstone') {
    // MOD-08-CAPSTONE Smart Home Automation
    const inLgt = createInputNode('LGT_SENS', 60, 80, 0);
    const inPir = createInputNode('PIR_SENS', 60, 200, 1);
    const inClk = createInputNode('CLK_EN', 60, 320, 2);

    const gateNotLgt: Node<LogicNodeData> = { id: 'gate_not_lgt', type: 'gate_not', position: { x: 280, y: 80 }, data: { label: 'NOT (Dark Detector)', value: 0 } };
    const gateAndNightPir: Node<LogicNodeData> = { id: 'gate_and_pir', type: 'gate_and', position: { x: 480, y: 120 }, data: { label: 'AND (Dark & PIR)', value: 0 } };
    const gateOrLight: Node<LogicNodeData> = { id: 'gate_or_light', type: 'gate_or', position: { x: 680, y: 220 }, data: { label: 'OR (Light Drive)', value: 0 } };

    const outLight = createOutputNode('LIGHT_OUT', 900, 220, 0);

    nodes = [inLgt, inPir, inClk, gateNotLgt, gateAndNightPir, gateOrLight, outLight];
    edges = [
      createEdge('e1', inLgt.id, gateNotLgt.id, 'in1'),
      createEdge('e2', gateNotLgt.id, gateAndNightPir.id, 'in1'),
      createEdge('e3', inPir.id, gateAndNightPir.id, 'in2'),
      createEdge('e4', gateAndNightPir.id, gateOrLight.id, 'in1'),
      createEdge('e5', inClk.id, gateOrLight.id, 'in2'),
      createEdge('e6', gateOrLight.id, outLight.id),
    ];
  } else {
    // Generic Fallback
    const initialInputs = module.inputLabels.map((lbl, idx) => createInputNode(lbl, 80, 100 + idx * 130, idx));
    const gateNode: Node<LogicNodeData> = { id: 'gate_1', type: 'gate_and', position: { x: 380, y: 160 }, data: { label: 'Gerbang Utama', value: 0 } };
    const initialOutputs = module.outputLabels.map((lbl, idx) => createOutputNode(lbl, 680, 120 + idx * 140, idx));

    nodes = [...initialInputs, gateNode, ...initialOutputs];
    edges = [
      createEdge('e1', initialInputs[0]?.id || '', gateNode.id, 'in1'),
      createEdge('e2', initialInputs[1]?.id || initialInputs[0]?.id || '', gateNode.id, 'in2'),
      createEdge('e3', gateNode.id, initialOutputs[0]?.id || ''),
    ];
  }

  return { nodes, edges };
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTabMode>('SIMULATOR');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-01');
  const [viewMode, setViewMode] = useState<ViewMode>('SCHEMATIC');

  const activeModule = PRACTICUM_MODULES.find((m) => m.id === selectedModuleId) || PRACTICUM_MODULES[0];

  // Student Notes & Report State
  const [defineNotes, setDefineNotes] = useState<string>('');
  const [draftedTruthTable, setDraftedTruthTable] = useState<TruthTableRow[]>([]);
  const [icAnalysisNotes, setIcAnalysisNotes] = useState<string>('');
  const [conclusionNotes, setConclusionNotes] = useState<string>('');

  // Student Identity Metadata
  const [studentName, setStudentName] = useState<string>('');
  const [studentNIM, setStudentNIM] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');

  // Canvas State
  const [nodes, setNodes] = useState<Node<LogicNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Auto-Grading Results
  const [gradeResult, setGradeResult] = useState<AutoGradeResult | undefined>(undefined);

  // Initialize Canvas & Truth Table whenever active module changes
  useEffect(() => {
    setDraftedTruthTable(activeModule.expectedTruthTable.map((row) => ({ ...row })));
    setGradeResult(undefined);

    // Build Default Canvas Nodes & Edges for selected module
    const { nodes: defaultNodes, edges: defaultEdges } = buildDefaultModuleGraph(activeModule);

    const evaluated = evaluateLogicGraph(defaultNodes, defaultEdges);
    setNodes(evaluated.evaluatedNodes);
    setEdges(evaluated.evaluatedEdges);
  }, [selectedModuleId]);

  // Load Exercise directly into Simulator Canvas
  const handleLoadExerciseToSimulator = (mod: PracticumModule) => {
    setSelectedModuleId(mod.id);
    setCurrentTab('SIMULATOR');
  };

  // Export JSON State File
  const handleExportJSON = () => {
    const exportData = {
      version: '2.0-LogicLab',
      timestamp: new Date().toISOString(),
      student: { name: studentName, nim: studentNIM, class: studentClass },
      module: { id: activeModule.id, title: activeModule.title },
      notes: { defineNotes, icAnalysisNotes, conclusionNotes },
      draftedTruthTable,
      nodes,
      edges,
      gradeResult,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `LogicLab_${activeModule.code}_${studentNIM || 'Circuit'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON State File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.student) {
            setStudentName(parsed.student.name || '');
            setStudentNIM(parsed.student.nim || '');
            setStudentClass(parsed.student.class || '');
          }
          if (parsed.module?.id) {
            setSelectedModuleId(parsed.module.id);
          }
          if (parsed.notes) {
            setDefineNotes(parsed.notes.defineNotes || '');
            setIcAnalysisNotes(parsed.notes.icAnalysisNotes || '');
            setConclusionNotes(parsed.notes.conclusionNotes || '');
          }
          if (parsed.draftedTruthTable) setDraftedTruthTable(parsed.draftedTruthTable);
          if (parsed.nodes) setNodes(parsed.nodes);
          if (parsed.edges) setEdges(parsed.edges);
          if (parsed.gradeResult) setGradeResult(parsed.gradeResult);

          setCurrentTab('SIMULATOR');
        } catch {
          alert('Format file JSON tidak valid.');
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1A1C1E] font-sans selection:bg-[#2563EB] selection:text-white flex flex-col">
      {/* Navigation Header Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeModule={activeModule}
        onSelectModule={setSelectedModuleId}
        allModules={PRACTICUM_MODULES}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Main Content Workspace View */}
      <main className="flex-1 px-3 py-3">
        {currentTab === 'SIMULATOR' && (
          <CreatePhase
            module={activeModule}
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onNextPhase={() => setCurrentTab('VALIDATOR')}
          />
        )}

        {currentTab === 'SIMULATOR_3D' && (
          <div className="w-full max-w-7xl mx-auto space-y-4">
            <BabylonCircuit3D
              module={activeModule}
              nodes={nodes}
              edges={edges}
              onStateChange={(newNodes) => setNodes(newNodes)}
            />
          </div>
        )}

        {currentTab === 'LAB_EXERCISES' && (
          <LabExercisesView
            modules={PRACTICUM_MODULES}
            activeModule={activeModule}
            onSelectModule={setSelectedModuleId}
            onLoadExerciseToSimulator={handleLoadExerciseToSimulator}
            onImportCustomExercise={handleImportJSON}
          />
        )}

        {currentTab === 'VALIDATOR' && (
          <OperatePhase
            module={activeModule}
            nodes={nodes}
            edges={edges}
            gradeResult={gradeResult}
            setGradeResult={setGradeResult}
            onNextPhase={() => setCurrentTab('REPORT')}
          />
        )}

        {currentTab === 'REPORT' && (
          <CommunicatePhase
            module={activeModule}
            studentName={studentName}
            setStudentName={setStudentName}
            studentNIM={studentNIM}
            setStudentNIM={setStudentNIM}
            studentClass={studentClass}
            setStudentClass={setStudentClass}
            defineNotes={defineNotes}
            draftedTruthTable={draftedTruthTable}
            icAnalysisNotes={icAnalysisNotes}
            gradeResult={gradeResult}
            conclusionNotes={conclusionNotes}
            setConclusionNotes={setConclusionNotes}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
          />
        )}

        {currentTab === 'DATASHEETS' && (
          <AnalyzePhase
            icAnalysisNotes={icAnalysisNotes}
            setIcAnalysisNotes={setIcAnalysisNotes}
            onNextPhase={() => setCurrentTab('SIMULATOR')}
          />
        )}

        {currentTab === 'THEORY' && <DigitalTheoryBank />}

        {currentTab === 'CURRICULUM' && <LabGovernanceDashboard />}
      </main>

      {/* Persistent Global Credit Footer */}
      <footer className="bg-white border-t border-[#CBD5E1] py-3 px-4 text-center text-xs text-[#334155] shrink-0 font-medium shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="font-extrabold text-[#1E293B]">
            Aplikasi ini dikembangkan Oleh Tim Peneliti Dosen Teknik Informatika Universitas Indonesia Timur
          </span>
        </div>
        <div className="text-[11px] text-[#64748B] font-mono mx-auto sm:mx-0">
          LogicLab Simulator • Modul Aljabar Boolean & Penyederhanaan Fungsi Digital
        </div>
      </footer>
    </div>
  );
}

