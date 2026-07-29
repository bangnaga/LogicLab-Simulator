export type AppTabMode = 'SIMULATOR' | 'LAB_EXERCISES' | 'THEORY' | 'VALIDATOR' | 'REPORT' | 'DATASHEETS' | 'CURRICULUM';

export type ViewMode = 'SCHEMATIC';

export type LogicValue = 0 | 1;

export type NodeTypeCategory = 'INPUT' | 'GATE' | 'IC' | 'IOT_OUTPUT' | 'SENSORS';

export type LogicNodeType =
  | 'input_switch'
  | 'input_clock'
  | 'input_sensor_temp'
  | 'input_sensor_pir'
  | 'input_sensor_light'
  | 'gate_and'
  | 'gate_or'
  | 'gate_not'
  | 'gate_nand'
  | 'gate_nor'
  | 'gate_xor'
  | 'gate_xnor'
  | 'ic_7408'
  | 'ic_7432'
  | 'ic_7404'
  | 'ic_7400'
  | 'output_led'
  | 'output_relay'
  | 'output_motor'
  | 'output_buzzer'
  | 'output_bulb';

export interface IOSpecification {
  id: string;
  name: string;
  type: 'Input' | 'Output' | 'Sensor' | 'Actuator';
  description: string;
  pinLabel: string;
  expectedBehavior: string;
}

export interface TruthTableRow {
  id: string;
  inputs: Record<string, LogicValue>;
  expectedOutputs: Record<string, LogicValue>;
  userOutputs?: Record<string, LogicValue>;
  actualOutputs?: Record<string, LogicValue>;
  isValid?: boolean;
}

export interface PracticumModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'Gerbang Dasar' | 'Sirkuit Kombinasional' | 'Sirkuit Sekuensial' | 'Jembatan IoT';
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  estimatedMinutes: number;
  problemStatement: string;
  learningObjectives: string[];
  theoryExplanation?: string;
  theorySummary?: string;
  booleanFormula?: string;
  practicalSteps?: string[];
  practiceGuide?: string[];
  ioSpecs: IOSpecification[];
  inputLabels: string[];
  outputLabels: string[];
  expectedTruthTable: TruthTableRow[];
  recommendedICs: string[];
  iotBridgeContext: {
    sensorRole: string;
    logicRole: string;
    actuatorRole: string;
    realWorldApplication: string;
  };
}

export interface ICPin {
  pinNumber: number;
  name: string;
  type: 'VCC' | 'GND' | 'INPUT_A' | 'INPUT_B' | 'OUTPUT' | 'NC';
  description: string;
  gateIndex?: number;
}

export interface ICDatasheet {
  chipNumber: string;
  name: string;
  category: string;
  packageType: string;
  pinsCount: number;
  supplyVoltage: string;
  description: string;
  pins: ICPin[];
  truthTable: { inputs: string[]; outputs: string[]; rows: (number[])[] };
  logicDiagram: string;
}

export interface AutoGradeTestLog {
  testIndex: number;
  inputState: Record<string, LogicValue>;
  expectedOutput: Record<string, LogicValue>;
  actualOutput: Record<string, LogicValue>;
  passed: boolean;
}

export interface AutoGradeResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  totalTests: number;
  passedCount: number;
  logs: AutoGradeTestLog[];
  feedback: string[];
  timestamp: string;
}

export interface LabReportData {
  studentName: string;
  studentNIM: string;
  studentClass: string;
  date: string;
  moduleId: string;
  moduleTitle: string;
  defineNotes: string;
  draftedTruthTable: TruthTableRow[];
  icAnalysisNotes: string;
  generatedCode: {
    cpp: string;
    python: string;
    verilog: string;
  };
  gradeResult?: AutoGradeResult;
  studentConclusion: string;
}

export interface CBAMetrics {
  totalVirtualICsUsed: number;
  totalLabSessions: number;
  physicalICCostPerUnit: number; // e.g. Rp 8.000
  breadboardCostPerUnit: number; // e.g. Rp 25.000
  multimeterCostPerUnit: number; // e.g. Rp 150.000
  preventedDamageRate: number; // e.g. 98.5%
  totalSavedIDR: number;
  co2SavedKg: number;
}
