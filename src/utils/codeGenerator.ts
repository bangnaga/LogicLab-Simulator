import { Node, Edge } from '@xyflow/react';
import { LogicNodeData } from './logicEngine';

export function generateVibeCode(
  nodes: Node<LogicNodeData>[],
  edges: Edge[],
  moduleTitle: string
): { cpp: string; python: string; verilog: string } {
  // Extract inputs, gates, and outputs
  const inputs = nodes.filter((n) => n.type?.startsWith('input_'));
  const gates = nodes.filter((n) => n.type?.startsWith('gate_') || n.type?.startsWith('ic_'));
  const outputs = nodes.filter((n) => n.type?.startsWith('output_'));

  // Generate C++ / Arduino Code
  const cppInputs = inputs
    .map((n, idx) => {
      const pin = idx + 2; // Pin 2, 3, 4...
      const label = (n.data.pinLabel || n.data.label || `INPUT_${idx + 1}`).replace(/[^a-zA-Z0-9_]/g, '_');
      return `const int PIN_${label} = ${pin};`;
    })
    .join('\n');

  const cppOutputs = outputs
    .map((n, idx) => {
      const pin = idx + 10; // Pin 10, 11...
      const label = (n.data.pinLabel || n.data.label || `OUTPUT_${idx + 1}`).replace(/[^a-zA-Z0-9_]/g, '_');
      return `const int PIN_${label} = ${pin};`;
    })
    .join('\n');

  const cppSetupPinModes = [
    ...inputs.map((n) => {
      const label = (n.data.pinLabel || n.data.label || 'IN').replace(/[^a-zA-Z0-9_]/g, '_');
      return `  pinMode(PIN_${label}, INPUT);`;
    }),
    ...outputs.map((n) => {
      const label = (n.data.pinLabel || n.data.label || 'OUT').replace(/[^a-zA-Z0-9_]/g, '_');
      return `  pinMode(PIN_${label}, OUTPUT);`;
    }),
  ].join('\n');

  const cppReadVariables = inputs
    .map((n) => {
      const label = (n.data.pinLabel || n.data.label || 'IN').replace(/[^a-zA-Z0-9_]/g, '_');
      return `  int val_${label} = digitalRead(PIN_${label});`;
    })
    .join('\n');

  // Build logic expression for primary output
  let primaryExpr = 'LOW';
  if (gates.length > 0) {
    const gateTypes = gates.map((g) => g.type);
    if (gateTypes.includes('gate_and')) {
      const inLabels = inputs.map((i) => `val_${(i.data.pinLabel || i.data.label || 'IN').replace(/[^a-zA-Z0-9_]/g, '_')}`);
      primaryExpr = inLabels.length > 1 ? inLabels.join(' && ') : `${inLabels[0]} == HIGH`;
    } else if (gateTypes.includes('gate_or')) {
      const inLabels = inputs.map((i) => `val_${(i.data.pinLabel || i.data.label || 'IN').replace(/[^a-zA-Z0-9_]/g, '_')}`);
      primaryExpr = inLabels.length > 1 ? inLabels.join(' || ') : `${inLabels[0]} == HIGH`;
    } else {
      primaryExpr = 'val_' + (inputs[0]?.data.pinLabel || 'SW_A').replace(/[^a-zA-Z0-9_]/g, '_');
    }
  }

  const cppWriteOutputs = outputs
    .map((n) => {
      const label = (n.data.pinLabel || n.data.label || 'OUT').replace(/[^a-zA-Z0-9_]/g, '_');
      return `  digitalWrite(PIN_${label}, (${primaryExpr}) ? HIGH : LOW);`;
    })
    .join('\n');

  const cppCode = `/* 
 * LogicLab Vibe Coding Generated Code
 * Modul Praktikum: ${moduleTitle}
 * Target Platform: Arduino UNO / ESP32 / ATmega328P
 * Auto-generated based on DR-UCOK Canvas Topology
 */

#include <Arduino.h>

// Deklarasi Pin I/O Hardware
${cppInputs}
${cppOutputs}

void setup() {
  Serial.begin(115200);
  Serial.println("LogicLab - System Active");

  // Inisialisasi Mode Pin
${cppSetupPinModes}
}

void loop() {
  // Read Digital Sensor States
${cppReadVariables}

  // Execute Generated Logic Equation
${cppWriteOutputs}

  delay(50); // Loop interval 20Hz
}
`;

  // Python Code
  const pythonCode = `# LogicLab Vibe Coding (Python / Raspberry Pi GPIO)
# Modul: ${moduleTitle}

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Pin Setup
INPUT_PINS = [17, 27, 22]
OUTPUT_PINS = [23, 24]

for pin in INPUT_PINS:
    GPIO.setup(pin, GPIO.IN)

for pin in OUTPUT_PINS:
    GPIO.setup(pin, GPIO.OUT)

print("LogicLab Python Engine Running...")

try:
    while True:
        # Read Inputs
        inputs = [GPIO.input(p) for p in INPUT_PINS]
        
        # Evaluasi Logika Gerbang (${moduleTitle})
        result = 1 if all(inputs) else 0
        
        # Drive Output Relay/Actuator
        for out_pin in OUTPUT_PINS:
            GPIO.output(out_pin, result)
            
        time.sleep(0.05)
except KeyboardInterrupt:
    GPIO.cleanup()
`;

  // Verilog Code
  const verilogCode = `// LogicLab Vibe Coding (Verilog HDL for FPGA / Quartus)
// Modul: ${moduleTitle}

module LogicLab_Circuit (
    input wire clk,
    input wire [${Math.max(0, inputs.length - 1)}:0] in_signals,
    output reg [${Math.max(0, outputs.length - 1)}:0] out_signals
);

    wire logic_out;

    // Direct Boolean Assignment
    assign logic_out = &in_signals; // Logic Reduction AND

    always @(posedge clk) begin
        out_signals <= {${outputs.length}{logic_out}};
    end

endmodule
`;

  return { cpp: cppCode, python: pythonCode, verilog: verilogCode };
}
