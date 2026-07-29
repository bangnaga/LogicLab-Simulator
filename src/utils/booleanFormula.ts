import { Node, Edge } from '@xyflow/react';
import { LogicNodeData } from './logicEngine';

export interface GeneratedExpression {
  nodeId: string;
  label: string;
  nodeType: string;
  latex: string;
  rawFormulaLatex: string;
  currentValue: number;
}

export function generateBooleanExpressions(
  nodes: Node<LogicNodeData>[],
  edges: Edge[],
  nodeOutputs: Record<string, number> = {}
): GeneratedExpression[] {
  const nodeMap = new Map<string, Node<LogicNodeData>>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  function getNodeLatex(nodeId: string, visited: Set<string> = new Set()): string {
    if (visited.has(nodeId)) {
      return '\\text{Loop}';
    }

    const node = nodeMap.get(nodeId);
    if (!node) return '?';

    const type = node.type || '';
    const label = node.data?.pinLabel || node.data?.label || node.id;
    const cleanLabel = label.replace(/_/g, '\\_');

    // Input nodes
    if (type.startsWith('input_')) {
      if (type === 'input_high') return '1';
      if (type === 'input_low') return '0';
      return cleanLabel;
    }

    visited.add(nodeId);

    // Incoming edges
    const incomingEdges = edges.filter((e) => e.target === nodeId);

    // Sort edges by handle name if available
    incomingEdges.sort((a, b) => {
      const hA = a.targetHandle || '';
      const hB = b.targetHandle || '';
      return hA.localeCompare(hB);
    });

    const childLatexList = incomingEdges.map((e) =>
      getNodeLatex(e.source, new Set(visited))
    );

    if (childLatexList.length === 0) {
      return '\\text{?}';
    }

    // Gate Types
    if (type === 'gate_and' || type === 'ic_7408') {
      if (childLatexList.length === 1) return childLatexList[0];
      const items = childLatexList.map((expr) =>
        expr.includes('+') || expr.includes('\\oplus') ? `(${expr})` : expr
      );
      return items.join(' \\cdot ');
    }

    if (type === 'gate_or' || type === 'ic_7432') {
      if (childLatexList.length === 1) return childLatexList[0];
      return childLatexList.join(' + ');
    }

    if (type === 'gate_not' || type === 'ic_7404') {
      const child = childLatexList[0] || '\\text{?}';
      return `\\overline{${child}}`;
    }

    if (type === 'gate_nand' || type === 'ic_7400') {
      const items = childLatexList.map((expr) =>
        expr.includes('+') || expr.includes('\\oplus') ? `(${expr})` : expr
      );
      return `\\overline{${items.join(' \\cdot ')}}`;
    }

    if (type === 'gate_nor' || type === 'ic_7402') {
      return `\\overline{${childLatexList.join(' + ')}}`;
    }

    if (type === 'gate_xor' || type === 'ic_7486') {
      return childLatexList.join(' \\oplus ');
    }

    if (type === 'gate_xnor') {
      return `\\overline{${childLatexList.join(' \\oplus ')}}`;
    }

    if (type === 'ff_d' || type === 'ic_7474') {
      return childLatexList[0] || 'D';
    }

    if (type === 'ff_jk' || type === 'ic_7476') {
      const j = childLatexList[0] || 'J';
      const k = childLatexList[1] || 'K';
      return `${j}\\overline{Q} + \\overline{${k}}Q`;
    }

    if (type === 'ff_sr') {
      const s = childLatexList[0] || 'S';
      const r = childLatexList[1] || 'R';
      return `${s} + \\overline{${r}}Q`;
    }

    if (type === 'ff_t') {
      const t = childLatexList[0] || 'T';
      return `${t} \\oplus Q`;
    }

    if (type.startsWith('output_')) {
      return childLatexList[0] || '0';
    }

    return childLatexList.join(' ');
  }

  const results: GeneratedExpression[] = [];

  // Sort nodes: outputs first, then logic gates / ICs
  const outputNodes = nodes.filter((n) => n.type?.startsWith('output_'));
  const gateNodes = nodes.filter((n) => n.type?.startsWith('gate_') || n.type?.startsWith('ic_'));

  const orderedNodes = [...outputNodes, ...gateNodes];

  orderedNodes.forEach((node) => {
    const rawFormulaLatex = getNodeLatex(node.id);
    const nodeLabel = node.data?.pinLabel || node.data?.label || node.id;
    const cleanLabel = nodeLabel.replace(/_/g, '\\_');

    const latex = `Y_{\\text{${cleanLabel}}} = ${rawFormulaLatex}`;

    results.push({
      nodeId: node.id,
      label: node.data?.label || node.id,
      nodeType: node.type || 'unknown',
      latex,
      rawFormulaLatex,
      currentValue: nodeOutputs[node.id] ?? (node.data?.value as number) ?? 0,
    });
  });

  return results;
}
