import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface BooleanMathProps {
  latex: string;
  className?: string;
  displayMode?: boolean;
}

export const BooleanMath: React.FC<BooleanMathProps> = ({
  latex,
  className = '',
  displayMode = false,
}) => {
  try {
    const html = katex.renderToString(latex, {
      displayMode: displayMode,
      throwOnError: false,
    });

    return (
      <span
        className={`inline-block font-mono ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    // Fallback if rendering fails
    return <span className={`font-mono font-bold ${className}`}>{latex}</span>;
  }
};

export const BOOLEAN_IC_DATA: Record<
  string,
  {
    name: string;
    icNumber: string;
    gateType: string;
    latexFormula: string;
    logicDiagram?: string;
    description: string;
    pins: { pin: number; label: string; type: 'VCC' | 'GND' | 'IN' | 'OUT' | 'NC' }[];
    gateMapping: { gateIndex: number; inputs: number[]; output: number }[];
    truthTable: { inputs: number[]; output: number }[];
  }
> = {
  '7408': {
    name: 'Quad 2-Input AND Gate',
    icNumber: '7408',
    gateType: 'AND',
    latexFormula: 'Y = A \\cdot B',
    logicDiagram: 'A.B atau AB (baca: A and B)',
    description: 'Gerbang AND mempunyai satu output, dan bisa memiliki 2 atau lebih input. Output akan 1 bila seluruh input = 1.',
    pins: [
      { pin: 1, label: '1A', type: 'IN' },
      { pin: 2, label: '1B', type: 'IN' },
      { pin: 3, label: '1Y', type: 'OUT' },
      { pin: 4, label: '2A', type: 'IN' },
      { pin: 5, label: '2B', type: 'IN' },
      { pin: 6, label: '2Y', type: 'OUT' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '3Y', type: 'OUT' },
      { pin: 9, label: '3A', type: 'IN' },
      { pin: 10, label: '3B', type: 'IN' },
      { pin: 11, label: '4Y', type: 'OUT' },
      { pin: 12, label: '4A', type: 'IN' },
      { pin: 13, label: '4B', type: 'IN' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [1, 2], output: 3 },
      { gateIndex: 2, inputs: [4, 5], output: 6 },
      { gateIndex: 3, inputs: [9, 10], output: 8 },
      { gateIndex: 4, inputs: [12, 13], output: 11 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 0 },
      { inputs: [1, 1], output: 1 },
    ],
  },
  '7432': {
    name: 'Quad 2-Input OR Gate',
    icNumber: '7432',
    gateType: 'OR',
    latexFormula: 'Y = A + B',
    logicDiagram: 'A + B (baca: A or B)',
    description: 'Gerbang OR mempunyai satu output, dan bisa memiliki 2 atau lebih input. Output akan 1 jika salah satu atau seluruh input = 1.',
    pins: [
      { pin: 1, label: '1A', type: 'IN' },
      { pin: 2, label: '1B', type: 'IN' },
      { pin: 3, label: '1Y', type: 'OUT' },
      { pin: 4, label: '2A', type: 'IN' },
      { pin: 5, label: '2B', type: 'IN' },
      { pin: 6, label: '2Y', type: 'OUT' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '3Y', type: 'OUT' },
      { pin: 9, label: '3A', type: 'IN' },
      { pin: 10, label: '3B', type: 'IN' },
      { pin: 11, label: '4Y', type: 'OUT' },
      { pin: 12, label: '4A', type: 'IN' },
      { pin: 13, label: '4B', type: 'IN' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [1, 2], output: 3 },
      { gateIndex: 2, inputs: [4, 5], output: 6 },
      { gateIndex: 3, inputs: [9, 10], output: 8 },
      { gateIndex: 4, inputs: [12, 13], output: 11 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 1 },
    ],
  },
  '7404': {
    name: 'Hex Inverter (NOT Gate)',
    icNumber: '7404',
    gateType: 'NOT',
    latexFormula: 'Y = \\overline{A}',
    logicDiagram: "A' atau NOT A (baca: Inverter)",
    description: 'Gerbang NOT / Inverter mempunyai satu input dan satu output. Nilai output merupakan kebalikan dari sinyal masukan input.',
    pins: [
      { pin: 1, label: '1A', type: 'IN' },
      { pin: 2, label: '1Y', type: 'OUT' },
      { pin: 3, label: '2A', type: 'IN' },
      { pin: 4, label: '2Y', type: 'OUT' },
      { pin: 5, label: '3A', type: 'IN' },
      { pin: 6, label: '3Y', type: 'OUT' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '4Y', type: 'OUT' },
      { pin: 9, label: '4A', type: 'IN' },
      { pin: 10, label: '5Y', type: 'OUT' },
      { pin: 11, label: '5A', type: 'IN' },
      { pin: 12, label: '6Y', type: 'OUT' },
      { pin: 13, label: '6A', type: 'IN' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [1], output: 2 },
      { gateIndex: 2, inputs: [3], output: 4 },
      { gateIndex: 3, inputs: [5], output: 6 },
      { gateIndex: 4, inputs: [9], output: 8 },
      { gateIndex: 5, inputs: [11], output: 10 },
      { gateIndex: 6, inputs: [13], output: 12 },
    ],
    truthTable: [
      { inputs: [0], output: 1 },
      { inputs: [1], output: 0 },
    ],
  },
  '7400': {
    name: 'Quad 2-Input NAND Gate',
    icNumber: '7400',
    gateType: 'NAND',
    latexFormula: 'Y = \\overline{A \\cdot B}',
    logicDiagram: "(A.B)' (baca: Not AND / NAND)",
    description: 'Gerbang NAND (Not-AND) menghasilkan output 0 hanya jika semua input bernilai 1. Merupakan gerbang Universal.',
    pins: [
      { pin: 1, label: '1A', type: 'IN' },
      { pin: 2, label: '1B', type: 'IN' },
      { pin: 3, label: '1Y', type: 'OUT' },
      { pin: 4, label: '2A', type: 'IN' },
      { pin: 5, label: '2B', type: 'IN' },
      { pin: 6, label: '2Y', type: 'OUT' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '3Y', type: 'OUT' },
      { pin: 9, label: '3A', type: 'IN' },
      { pin: 10, label: '3B', type: 'IN' },
      { pin: 11, label: '4Y', type: 'OUT' },
      { pin: 12, label: '4A', type: 'IN' },
      { pin: 13, label: '4B', type: 'IN' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [1, 2], output: 3 },
      { gateIndex: 2, inputs: [4, 5], output: 6 },
      { gateIndex: 3, inputs: [9, 10], output: 8 },
      { gateIndex: 4, inputs: [12, 13], output: 11 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 1 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 0 },
    ],
  },
  '7402': {
    name: 'Quad 2-Input NOR Gate',
    icNumber: '7402',
    gateType: 'NOR',
    latexFormula: 'Y = \\overline{A + B}',
    logicDiagram: "(A+B)' (baca: Not OR / NOR)",
    description: 'Gerbang NOR (Not-OR) menghasilkan output 1 hanya jika semua input bernilai 0. universal gate.',
    pins: [
      { pin: 1, label: '1Y', type: 'OUT' },
      { pin: 2, label: '1A', type: 'IN' },
      { pin: 3, label: '1B', type: 'IN' },
      { pin: 4, label: '2Y', type: 'OUT' },
      { pin: 5, label: '2A', type: 'IN' },
      { pin: 6, label: '2B', type: 'IN' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '3A', type: 'IN' },
      { pin: 9, label: '3B', type: 'IN' },
      { pin: 10, label: '3Y', type: 'OUT' },
      { pin: 11, label: '4A', type: 'IN' },
      { pin: 12, label: '4B', type: 'IN' },
      { pin: 13, label: '4Y', type: 'OUT' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [2, 3], output: 1 },
      { gateIndex: 2, inputs: [5, 6], output: 4 },
      { gateIndex: 3, inputs: [8, 9], output: 10 },
      { gateIndex: 4, inputs: [11, 12], output: 13 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 1 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 0 },
      { inputs: [1, 1], output: 0 },
    ],
  },
  '7486': {
    name: 'Quad 2-Input XOR Gate',
    icNumber: '7486',
    gateType: 'XOR',
    latexFormula: 'Y = A \\oplus B = A\\overline{B} + \\overline{A}B',
    logicDiagram: 'A ⊕ B (baca: A XOR B)',
    description: 'Gerbang XOR (Exclusive-OR) menghasilkan output 1 jika nilai input A dan B berbeda.',
    pins: [
      { pin: 1, label: '1A', type: 'IN' },
      { pin: 2, label: '1B', type: 'IN' },
      { pin: 3, label: '1Y', type: 'OUT' },
      { pin: 4, label: '2A', type: 'IN' },
      { pin: 5, label: '2B', type: 'IN' },
      { pin: 6, label: '2Y', type: 'OUT' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '3Y', type: 'OUT' },
      { pin: 9, label: '3A', type: 'IN' },
      { pin: 10, label: '3B', type: 'IN' },
      { pin: 11, label: '4Y', type: 'OUT' },
      { pin: 12, label: '4A', type: 'IN' },
      { pin: 13, label: '4B', type: 'IN' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [1, 2], output: 3 },
      { gateIndex: 2, inputs: [4, 5], output: 6 },
      { gateIndex: 3, inputs: [9, 10], output: 8 },
      { gateIndex: 4, inputs: [12, 13], output: 11 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 0 },
    ],
  },
  '7474': {
    name: 'Dual D-Type Positive-Edge-Triggered Flip-Flop',
    icNumber: '7474',
    gateType: 'D-FF',
    latexFormula: 'Q_{next} = D \\quad \\text{(saat CLK } \\uparrow \\text{)}',
    description: 'Menyimpan 1 bit data D saat transisi Clock berarah positif (Positive Edge Trigger). Dilengkapi Preset (PRE) & Clear (CLR).',
    pins: [
      { pin: 1, label: '1CLR', type: 'IN' },
      { pin: 2, label: '1D', type: 'IN' },
      { pin: 3, label: '1CLK', type: 'IN' },
      { pin: 4, label: '1PRE', type: 'IN' },
      { pin: 5, label: '1Q', type: 'OUT' },
      { pin: 6, label: '1Q\'', type: 'OUT' },
      { pin: 7, label: 'GND', type: 'GND' },
      { pin: 8, label: '2Q\'', type: 'OUT' },
      { pin: 9, label: '2Q', type: 'OUT' },
      { pin: 10, label: '2PRE', type: 'IN' },
      { pin: 11, label: '2CLK', type: 'IN' },
      { pin: 12, label: '2D', type: 'IN' },
      { pin: 13, label: '2CLR', type: 'IN' },
      { pin: 14, label: 'VCC', type: 'VCC' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [2, 3], output: 5 },
      { gateIndex: 2, inputs: [12, 11], output: 9 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 0 },
      { inputs: [1, 1], output: 1 },
    ],
  },
  '7476': {
    name: 'Dual JK Flip-Flop with Preset & Clear',
    icNumber: '7476',
    gateType: 'JK-FF',
    latexFormula: 'Q_{next} = J\\overline{Q} + \\overline{K}Q',
    description: 'Rangkaian sekuensial fleksibel dengan mode Hold (0,0), Reset (0,1), Set (1,0), dan Toggle (1,1).',
    pins: [
      { pin: 1, label: '1CLK', type: 'IN' },
      { pin: 2, label: '1PRE', type: 'IN' },
      { pin: 3, label: '1CLR', type: 'IN' },
      { pin: 4, label: '1J', type: 'IN' },
      { pin: 5, label: 'VCC', type: 'VCC' },
      { pin: 6, label: '1K', type: 'IN' },
      { pin: 7, label: '1Q\'', type: 'OUT' },
      { pin: 8, label: '1Q', type: 'OUT' },
      { pin: 9, label: '2Q', type: 'OUT' },
      { pin: 10, label: '2Q\'', type: 'OUT' },
      { pin: 11, label: '2K', type: 'IN' },
      { pin: 12, label: 'GND', type: 'GND' },
      { pin: 13, label: '2J', type: 'IN' },
      { pin: 14, label: '2CLR', type: 'IN' },
    ],
    gateMapping: [
      { gateIndex: 1, inputs: [4, 6, 1], output: 8 },
      { gateIndex: 2, inputs: [13, 11, 1], output: 9 },
    ],
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 1 },
    ],
  },
};
