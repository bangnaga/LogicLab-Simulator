import { Node, Edge } from '@xyflow/react';
import { LogicValue, AutoGradeResult, AutoGradeTestLog, PracticumModule } from '../types';

export interface LogicNodeData {
  label: string;
  pinLabel?: string;
  type?: string;
  value?: LogicValue;
  tempValue?: number; // for temp sensor
  motionValue?: boolean;
  frequency?: number;
  [key: string]: unknown;
}

export function evaluateLogicGraph(
  nodes: Node<LogicNodeData>[],
  edges: Edge[]
): {
  evaluatedNodes: Node<LogicNodeData>[];
  evaluatedEdges: Edge[];
  nodeOutputs: Record<string, LogicValue>;
} {
  const nodeOutputs: Record<string, LogicValue> = {};
  const nodeMap = new Map<string, Node<LogicNodeData>>();

  // Copy nodes
  nodes.forEach((n) => {
    nodeMap.set(n.id, { ...n, data: { ...n.data } });
  });

  // Identify input values
  nodes.forEach((node) => {
    const type = node.type || 'gate_and';
    if (type === 'input_switch') {
      nodeOutputs[node.id] = (node.data.value ?? 0) as LogicValue;
    } else if (type === 'input_clock') {
      nodeOutputs[node.id] = (node.data.value ?? 0) as LogicValue;
    } else if (type === 'input_sensor_temp') {
      const temp = node.data.tempValue ?? 25;
      nodeOutputs[node.id] = temp >= 30 ? 1 : 0;
    } else if (type === 'input_sensor_pir') {
      nodeOutputs[node.id] = node.data.motionValue ? 1 : 0;
    } else if (type === 'input_sensor_light') {
      const light = (node.data.tempValue ?? 50);
      nodeOutputs[node.id] = light >= 50 ? 1 : 0;
    }
  });

  // Topological / iterative evaluation loop (max 10 iterations to prevent infinite loops in feedback circuits)
  let changed = true;
  let iterations = 0;

  while (changed && iterations < 12) {
    changed = false;
    iterations++;

    nodes.forEach((node) => {
      const type = node.type || '';
      if (
        type.startsWith('input_')
      ) {
        return; // inputs already set
      }

      // Find incoming edges
      const incoming = edges.filter((e) => e.target === node.id);

      // Handle standard gates
      if (type === 'gate_and') {
        const inputVals = incoming.map((e) => nodeOutputs[e.source]).filter((v) => v !== undefined);
        const newVal: LogicValue = inputVals.length > 0 && inputVals.every((v) => v === 1) ? 1 : 0;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'gate_or') {
        const inputVals = incoming.map((e) => nodeOutputs[e.source]).filter((v) => v !== undefined);
        const newVal: LogicValue = inputVals.some((v) => v === 1) ? 1 : 0;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'gate_not') {
        const inputVal = incoming.length > 0 ? nodeOutputs[incoming[0].source] ?? 0 : 0;
        const newVal: LogicValue = inputVal === 1 ? 0 : 1;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'gate_nand') {
        const inputVals = incoming.map((e) => nodeOutputs[e.source]).filter((v) => v !== undefined);
        const andVal = inputVals.length > 0 && inputVals.every((v) => v === 1);
        const newVal: LogicValue = andVal ? 0 : 1;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'gate_nor') {
        const inputVals = incoming.map((e) => nodeOutputs[e.source]).filter((v) => v !== undefined);
        const orVal = inputVals.some((v) => v === 1);
        const newVal: LogicValue = orVal ? 0 : 1;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'gate_xor') {
        const inputVals = incoming.map((e) => nodeOutputs[e.source] ?? 0);
        const onesCount = inputVals.filter((v) => v === 1).length;
        const newVal: LogicValue = onesCount % 2 === 1 ? 1 : 0;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'gate_xnor') {
        const inputVals = incoming.map((e) => nodeOutputs[e.source] ?? 0);
        const onesCount = inputVals.filter((v) => v === 1).length;
        const newVal: LogicValue = onesCount % 2 === 1 ? 0 : 1;
        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type.startsWith('ic_74')) {
        // TTL IC Chips
        if (type === 'ic_7408') {
          // Quad AND: assume first incoming is 1A, second is 1B -> Output 1Y
          const inputVals = incoming.map((e) => nodeOutputs[e.source] ?? 0);
          const newVal: LogicValue = inputVals.length > 0 && inputVals.every((v) => v === 1) ? 1 : 0;
          if (nodeOutputs[node.id] !== newVal) {
            nodeOutputs[node.id] = newVal;
            changed = true;
          }
        } else if (type === 'ic_7432') {
          const inputVals = incoming.map((e) => nodeOutputs[e.source] ?? 0);
          const newVal: LogicValue = inputVals.some((v) => v === 1) ? 1 : 0;
          if (nodeOutputs[node.id] !== newVal) {
            nodeOutputs[node.id] = newVal;
            changed = true;
          }
        } else if (type === 'ic_7404') {
          const inputVal = incoming.length > 0 ? nodeOutputs[incoming[0].source] ?? 0 : 0;
          const newVal: LogicValue = inputVal === 1 ? 0 : 1;
          if (nodeOutputs[node.id] !== newVal) {
            nodeOutputs[node.id] = newVal;
            changed = true;
          }
        } else {
          const inputVals = incoming.map((e) => nodeOutputs[e.source] ?? 0);
          const newVal: LogicValue = inputVals.some((v) => v === 1) ? 1 : 0;
          if (nodeOutputs[node.id] !== newVal) {
            nodeOutputs[node.id] = newVal;
            changed = true;
          }
        }
      } else if (type === 'ff_d' || type === 'ic_7474') {
        // D Flip-Flop: output Q follows D when CLK is 1, with PRE/CLR support
        const dEdge = incoming.find((e) => e.targetHandle === 'd' || e.targetHandle?.includes('d')) || incoming[0];
        const clkEdge = incoming.find((e) => e.targetHandle === 'clk' || e.targetHandle?.includes('clk')) || incoming[1];
        const preEdge = incoming.find((e) => e.targetHandle === 'pre');
        const clrEdge = incoming.find((e) => e.targetHandle === 'clr');

        const dVal = dEdge ? (dEdge.sourceHandle === 'out_qprime' ? (nodeOutputs[`${dEdge.source}_qprime`] ?? 0) : nodeOutputs[dEdge.source] ?? 0) : 0;
        const clkVal = clkEdge ? (clkEdge.sourceHandle === 'out_qprime' ? (nodeOutputs[`${clkEdge.source}_qprime`] ?? 0) : nodeOutputs[clkEdge.source] ?? 0) : 1;
        const preVal = preEdge ? (preEdge.sourceHandle === 'out_qprime' ? (nodeOutputs[`${preEdge.source}_qprime`] ?? 0) : nodeOutputs[preEdge.source] ?? 1) : 1;
        const clrVal = clrEdge ? (clrEdge.sourceHandle === 'out_qprime' ? (nodeOutputs[`${clrEdge.source}_qprime`] ?? 0) : nodeOutputs[clrEdge.source] ?? 1) : 1;

        let prevQ = nodeOutputs[node.id] ?? 0;
        let newQ: LogicValue = prevQ;

        if (preVal === 0 && clrVal === 1) {
          newQ = 1;
        } else if (clrVal === 0 && preVal === 1) {
          newQ = 0;
        } else if (preVal === 0 && clrVal === 0) {
          newQ = 1;
        } else {
          newQ = clkVal === 1 ? dVal : prevQ;
        }

        const newQPrime: LogicValue = newQ === 1 ? 0 : 1;

        if (nodeOutputs[node.id] !== newQ || nodeOutputs[`${node.id}_qprime`] !== newQPrime) {
          nodeOutputs[node.id] = newQ;
          nodeOutputs[`${node.id}_qprime`] = newQPrime;
          changed = true;
        }
      } else if (type === 'ff_jk' || type === 'ic_7476') {
        // JK Flip-Flop: J & K inputs + CLK
        const jEdge = incoming.find((e) => e.targetHandle === 'j') || incoming[0];
        const kEdge = incoming.find((e) => e.targetHandle === 'k') || incoming[1];
        const clkEdge = incoming.find((e) => e.targetHandle === 'clk') || incoming[2];

        const jVal = jEdge ? (nodeOutputs[jEdge.source] ?? 0) : 0;
        const kVal = kEdge ? (nodeOutputs[kEdge.source] ?? 0) : 0;
        const clkVal = clkEdge ? (nodeOutputs[clkEdge.source] ?? 0) : 1;

        let prevQ = nodeOutputs[node.id] ?? 0;
        let newVal: LogicValue = prevQ;

        if (clkVal === 1) {
          if (jVal === 0 && kVal === 1) newVal = 0; // Reset
          else if (jVal === 1 && kVal === 0) newVal = 1; // Set
          else if (jVal === 1 && kVal === 1) newVal = prevQ === 1 ? 0 : 1; // Toggle
        }

        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'ff_sr') {
        // SR Latch / Flip-Flop
        const sEdge = incoming.find((e) => e.targetHandle === 's') || incoming[0];
        const rEdge = incoming.find((e) => e.targetHandle === 'r') || incoming[1];

        const sVal = sEdge ? (nodeOutputs[sEdge.source] ?? 0) : 0;
        const rVal = rEdge ? (nodeOutputs[rEdge.source] ?? 0) : 0;

        let prevQ = nodeOutputs[node.id] ?? 0;
        let newVal: LogicValue = prevQ;

        if (sVal === 1 && rVal === 0) newVal = 1;
        else if (sVal === 0 && rVal === 1) newVal = 0;
        else if (sVal === 1 && rVal === 1) newVal = 0; // Invalid / prohibited

        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type === 'ff_t') {
        // T Flip-Flop
        const tEdge = incoming.find((e) => e.targetHandle === 't') || incoming[0];
        const clkEdge = incoming.find((e) => e.targetHandle === 'clk') || incoming[1];

        const tVal = tEdge ? (nodeOutputs[tEdge.source] ?? 0) : 0;
        const clkVal = clkEdge ? (nodeOutputs[clkEdge.source] ?? 0) : 1;

        let prevQ = nodeOutputs[node.id] ?? 0;
        let newVal: LogicValue = prevQ;

        if (clkVal === 1 && tVal === 1) {
          newVal = prevQ === 1 ? 0 : 1;
        }

        if (nodeOutputs[node.id] !== newVal) {
          nodeOutputs[node.id] = newVal;
          changed = true;
        }
      } else if (type.startsWith('output_')) {
        // Output Actuators
        const inputVal = incoming.length > 0 ? nodeOutputs[incoming[0].source] ?? 0 : 0;
        if (nodeOutputs[node.id] !== inputVal) {
          nodeOutputs[node.id] = inputVal;
          changed = true;
        }
      }
    });
  }

  // Update Node data with computed logic value
  const evaluatedNodes = nodes.map((node) => {
    const val = nodeOutputs[node.id] ?? 0;
    return {
      ...node,
      data: {
        ...node.data,
        value: val,
      },
    };
  });

  // Evaluate wire edges color styling for real-time signal propagation
  const evaluatedEdges = edges.map((edge) => {
    const sourceVal = (edge.sourceHandle === 'out_qprime' || edge.sourceHandle === 'qn')
      ? (nodeOutputs[`${edge.source}_qprime`] ?? (nodeOutputs[edge.source] === 1 ? 0 : 1))
      : (nodeOutputs[edge.source] ?? 0);
    const isHigh = sourceVal === 1;
    return {
      ...edge,
      className: isHigh ? 'high-signal' : 'low-signal',
      style: {
        stroke: isHigh ? '#DC2626' : '#94A3B8', // Red (#DC2626) for HIGH (1), Grey (#94A3B8) for LOW (0)
        strokeWidth: isHigh ? 3.5 : 2,
        filter: isHigh ? 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.5))' : 'none',
        transition: 'stroke 0.2s, stroke-width 0.2s, filter 0.2s',
      },
      animated: isHigh,
    };
  });

  return { evaluatedNodes, evaluatedEdges, nodeOutputs };
}

export function runAutoGrade(
  module: PracticumModule,
  nodes: Node<LogicNodeData>[],
  edges: Edge[]
): AutoGradeResult {
  const logs: AutoGradeTestLog[] = [];
  const feedback: string[] = [];
  let passedCount = 0;

  // Find input nodes mapped to module input labels
  const inputNodeMap: Record<string, Node<LogicNodeData>> = {};
  module.inputLabels.forEach((label) => {
    const match = nodes.find(
      (n) =>
        n.data.pinLabel?.toUpperCase() === label.toUpperCase() ||
        n.data.label?.toUpperCase().includes(label.toUpperCase()) ||
        n.id.toUpperCase().includes(label.toUpperCase())
    );
    if (match) {
      inputNodeMap[label] = match;
    }
  });

  // Find output nodes mapped to module output labels
  const outputNodeMap: Record<string, Node<LogicNodeData>> = {};
  module.outputLabels.forEach((label) => {
    const match = nodes.find(
      (n) =>
        n.data.pinLabel?.toUpperCase() === label.toUpperCase() ||
        n.data.label?.toUpperCase().includes(label.toUpperCase()) ||
        n.id.toUpperCase().includes(label.toUpperCase()) ||
        n.type?.startsWith('output_')
    );
    if (match) {
      outputNodeMap[label] = match;
    }
  });

  const totalTests = module.expectedTruthTable.length;

  module.expectedTruthTable.forEach((tableRow, index) => {
    // Clone nodes
    const testNodes = nodes.map((n) => ({ ...n, data: { ...n.data } }));

    // Apply input states for this row
    Object.entries(tableRow.inputs).forEach(([inpLabel, val]) => {
      const targetNode = testNodes.find(
        (n) =>
          n.data.pinLabel?.toUpperCase() === inpLabel.toUpperCase() ||
          n.data.label?.toUpperCase().includes(inpLabel.toUpperCase()) ||
          (inputNodeMap[inpLabel] && n.id === inputNodeMap[inpLabel].id)
      );
      if (targetNode) {
        targetNode.data.value = val;
        if (targetNode.type === 'input_sensor_temp') {
          targetNode.data.tempValue = val === 1 ? 35 : 20;
        } else if (targetNode.type === 'input_sensor_pir') {
          targetNode.data.motionValue = val === 1;
        }
      }
    });

    // Evaluate logic graph for this state
    const { nodeOutputs } = evaluateLogicGraph(testNodes, edges);

    // Collect actual outputs
    const actualOutputs: Record<string, LogicValue> = {};
    let rowPassed = true;

    Object.entries(tableRow.expectedOutputs).forEach(([outLabel, expectedVal]) => {
      const targetOutNode = testNodes.find(
        (n) =>
          n.data.pinLabel?.toUpperCase() === outLabel.toUpperCase() ||
          n.data.label?.toUpperCase().includes(outLabel.toUpperCase()) ||
          (outputNodeMap[outLabel] && n.id === outputNodeMap[outLabel].id)
      );

      const actualVal = targetOutNode ? nodeOutputs[targetOutNode.id] ?? 0 : 0;
      actualOutputs[outLabel] = actualVal;

      if (actualVal !== expectedVal) {
        rowPassed = false;
      }
    });

    if (rowPassed) {
      passedCount++;
    } else {
      const inputStr = Object.entries(tableRow.inputs)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      feedback.push(`Gagal pada Pengujian #${index + 1} (${inputStr}): Hasil aktual tidak sesuai tabel kebenaran teoritis.`);
    }

    logs.push({
      testIndex: index + 1,
      inputState: tableRow.inputs,
      expectedOutput: tableRow.expectedOutputs,
      actualOutput: actualOutputs,
      passed: rowPassed,
    });
  });

  const percentage = Math.round((passedCount / totalTests) * 100);
  const passed = percentage === 100;

  if (passed) {
    feedback.unshift('Selamat! Skenario sirkuit logika berhasil memvalidasi 100% tabel kebenaran modul praktikum.');
  } else if (passedCount > 0) {
    feedback.unshift(`Sirkuit Anda memenuhi ${passedCount} dari ${totalTests} kondisi pengujian. Periksa kembali sambungan gerbang.`);
  } else {
    feedback.unshift('Rangkaian belum memproduksi sinyal yang tepat. Pastikan semua kabel terhubung ke gerbang dan komponen output.');
  }

  return {
    score: passedCount * 10,
    maxScore: totalTests * 10,
    percentage,
    passed,
    totalTests,
    passedCount,
    logs,
    feedback,
    timestamp: new Date().toLocaleString('id-ID'),
  };
}
