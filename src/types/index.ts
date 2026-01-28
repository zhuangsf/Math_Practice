// Operation type for mathematical operations
// modify by jx: define operation type enum for basic arithmetic
export type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';

// Question model representing a single math problem
// modify by jx: define question interface with id, expression, answer, numbers and operators
export interface Question {
  id: string;              // Unique identifier for the question
  expression: string;      // Mathematical expression (e.g., "25 + 37")
  answer: number;          // The calculated answer
  numbers: number[];       // Array of numbers involved in the operation
  operators: OperationType[]; // Array of operators
}

// Configuration for generating questions
// modify by jx: define configuration interface for question generation parameters
export interface QuestionConfig {
  operandCount: 2 | 3 | 4 | 'mixed'; // Number of operands (2, 3, 4, or 'mixed' for random)
  minValue: number;                  // Minimum value for operands
  maxValue: number;                  // Maximum value for operands
  operations: OperationType[];       // Selected operation types
  questionCount: number;             // Number of questions to generate
}

// History item for storing past generated questions
// modify by jx: define history item interface with timestamp, config and questions
export interface HistoryItem {
  id: string;              // Unique identifier for the history record
  timestamp: Date;         // Time when questions were generated
  config: QuestionConfig; // Configuration used for generation
  questions: Question[];  // Generated questions
}

// Difficulty level for linear equations
// modify by jx: define difficulty level type for linear equations
export type EquationDifficulty = 'easy' | 'medium' | 'hard';

// Configuration for generating linear equations
// modify by jx: define configuration interface for linear equation generation
export interface EquationConfig {
  difficulty: EquationDifficulty;  // Difficulty level
  questionCount: number;           // Number of questions to generate (20, 50, or 100)
}

// Linear equation question model
// modify by jx: define linear equation question interface
export interface EquationQuestion {
  id: string;              // Unique identifier for the question
  equation: string;        // Equation expression (e.g., "2x + 5 = 13")
  answer: number;          // The value of x
  steps?: string[];        // Optional solution steps
}

// Answer mode type
// modify by jx: define answer mode type for practice or answering mode
export type AnswerMode = 'practice' | 'answering';

// Answer status for a question
// modify by jx: define answer status type for question answering state
export type AnswerStatus = 'unanswered' | 'answered' | 'correct' | 'wrong';

// Student answer for a question
// modify by jx: define student answer interface with question id and answer value
export interface StudentAnswer {
  questionId: string;     // Question ID
  answer: number | null;   // Student's answer (null if not answered)
  status: AnswerStatus;    // Answer status
  timeSpent?: number;      // Time spent on this question (seconds)
}

// Score result
// modify by jx: define score result interface with score, total, percentage and grade
export interface ScoreResult {
  correct: number;         // Number of correct answers
  total: number;           // Total number of questions
  percentage: number;      // Correct percentage (0-100)
  grade: 'excellent' | 'good' | 'pass' | 'need-improvement'; // Grade level
  timeSpent: number;       // Total time spent (seconds)
  averageTime: number;      // Average time per question (seconds)
}

// Wrong question record
// modify by jx: define wrong question interface with question info and student answer
export interface WrongQuestion {
  questionId: string;           // Question ID
  question: Question;            // Question information
  studentAnswer: number;         // Student's answer
  correctAnswer: number;         // Correct answer
  operationType: OperationType;  // Operation type
  operandCount: 2 | 3 | 4;       // Number of operands
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Wrong question statistics
// modify by jx: define wrong question statistics interface for analysis
export interface WrongQuestionStats {
  byOperationType: {
    add: number;
    subtract: number;
    multiply: number;
    divide: number;
  };
  byOperandCount: {
    binary: number;
    ternary: number;
    quaternary: number;
  };
  total: number;
}

// Fraction wrong question record
// modify by jx: define fraction wrong question interface for fraction operations
export interface FractionWrongQuestion {
  questionId: string;           // Question ID
  question: FractionQuestion;   // Question information
  studentAnswer: string;          // Student's answer (fraction string)
  correctAnswer: Fraction;       // Correct answer (fraction)
  operationType: OperationType;  // Operation type
  questionType: 'same-denominator' | 'different-denominator' | 'mixed' | 'simplify'; // Question type
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Fraction wrong question statistics
// modify by jx: define fraction wrong question statistics interface for analysis
export interface FractionWrongQuestionStats {
  byOperationType: {
    add: number;
    subtract: number;
    multiply: number;
    divide: number;
  };
  byQuestionType: {
    'same-denominator': number;
    'different-denominator': number;
    'mixed': number;
    'simplify': number;
  };
  total: number;
}

// Decimal wrong question record
// modify by jx: define decimal wrong question interface for decimal operations
export interface DecimalWrongQuestion {
  questionId: string;           // Question ID
  question: DecimalQuestion;    // Question information
  studentAnswer: number;         // Student's answer
  correctAnswer: number;         // Correct answer
  operationType: OperationType;  // Operation type
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Decimal wrong question statistics
// modify by jx: define decimal wrong question statistics interface for analysis
export interface DecimalWrongQuestionStats {
  byOperationType: {
    add: number;
    subtract: number;
    multiply: number;
    divide: number;
  };
  total: number;
}

// Tutoring plan recommendation
// modify by jx: define tutoring plan interface with recommendations
export interface TutoringPlan {
  weakAreas: {
    operationTypes: OperationType[];  // Weak operation types
    operandCounts: (2 | 3 | 4)[];    // Weak operand counts
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<QuestionConfig>; // Recommended practice configuration
}

// Fraction tutoring plan recommendation
// modify by jx: define fraction tutoring plan interface for fraction operations
export interface FractionTutoringPlan {
  weakAreas: {
    operationTypes: OperationType[];  // Weak operation types
    questionTypes: ('same-denominator' | 'different-denominator' | 'mixed' | 'simplify')[]; // Weak question types
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<FractionConfig>; // Recommended practice configuration
}

// Decimal tutoring plan recommendation
// modify by jx: define decimal tutoring plan interface for decimal operations
export interface DecimalTutoringPlan {
  weakAreas: {
    operationTypes: OperationType[];  // Weak operation types
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<DecimalConfig>; // Recommended practice configuration
}

// Answer session record
// modify by jx: define answer session interface for storing answer history
export interface AnswerSession {
  sessionId: string;         // Session ID
  timestamp: Date;           // Session timestamp
  questions: Question[];     // Questions in this session
  answers: StudentAnswer[]; // Student answers
  score: ScoreResult;       // Score result
  wrongQuestions: WrongQuestion[]; // Wrong questions
}

// Fraction representation
// modify by jx: define fraction interface with numerator and denominator
export interface Fraction {
  numerator: number;    // Numerator
  denominator: number;  // Denominator (must be > 0)
}

// Fraction question model
// modify by jx: define fraction question interface for fraction operations
export interface FractionQuestion {
  id: string;              // Unique identifier for the question
  expression: string;       // Mathematical expression (e.g., "3/5 + 2/5")
  answer: Fraction;         // The calculated answer as fraction
  fractions: Fraction[];   // Array of fractions involved in the operation
  operators: OperationType[]; // Array of operators
  questionType: 'same-denominator' | 'different-denominator' | 'mixed' | 'simplify'; // Question type
}

// Configuration for generating fraction questions
// modify by jx: define configuration interface for fraction question generation
export interface FractionConfig {
  denominatorRange: [number, number];  // Denominator range [min, max] (e.g., [2, 20])
  numeratorRange: [number, number];     // Numerator range [min, max]
  operations: OperationType[];          // Selected operation types
  questionCount: number;                 // Number of questions to generate
  includeMixedNumbers: boolean;         // Whether to include mixed numbers
  questionTypes: ('same-denominator' | 'different-denominator' | 'mixed' | 'simplify')[]; // Question types
}

// Decimal question model
// modify by jx: define decimal question interface for decimal operations
export interface DecimalQuestion {
  id: string;              // Unique identifier for the question
  expression: string;      // Mathematical expression (e.g., "3.25 + 2.17")
  answer: number;          // The calculated answer
  decimals: number[];      // Array of decimal numbers involved
  operators: OperationType[]; // Array of operators
  decimalPlaces: number;  // Number of decimal places for operands
  answerPrecision: number; // Number of decimal places for answer
}

// Configuration for generating decimal questions
// modify by jx: define configuration interface for decimal question generation
export interface DecimalConfig {
  decimalPlaces: number;      // Number of decimal places (1, 2, or 3)
  minValue: number;           // Minimum value
  maxValue: number;           // Maximum value
  operations: OperationType[]; // Selected operation types
  questionCount: number;       // Number of questions to generate
  answerPrecision: number;    // Answer precision (decimal places)
}

// Percentage question model
// modify by jx: define percentage question interface for percentage operations
export interface PercentageQuestion {
  id: string;              // Unique identifier for the question
  expression: string;      // Question expression
  answer: number | string; // Answer (number or percentage string like "75%")
  questionType: 'decimal-to-percent' | 'percent-to-decimal' | 'fraction-to-percent' | 'percent-to-fraction' | 'find-percent' | 'find-part' | 'find-total';
  // Question type: conversion or application problem
}

// Configuration for generating percentage questions
// modify by jx: define configuration interface for percentage question generation
export interface PercentageConfig {
  questionTypes: ('decimal-to-percent' | 'percent-to-decimal' | 'fraction-to-percent' | 'percent-to-fraction' | 'find-percent' | 'find-part' | 'find-total')[];
  valueRange: [number, number];  // Value range [min, max]
  questionCount: number;         // Number of questions to generate
}

// Unit conversion question model
// modify by jx: define unit conversion question interface
export interface UnitConversionQuestion {
  id: string;              // Unique identifier for the question
  expression: string;      // Question expression (e.g., "3米 = ?厘米")
  answer: number;          // Answer value
  fromUnit: string;        // Source unit
  toUnit: string;          // Target unit
  value: number;           // Original value
  unitType: 'length' | 'weight' | 'area' | 'volume' | 'time'; // Unit type
}

// Configuration for generating unit conversion questions
// modify by jx: define configuration interface for unit conversion question generation
export interface UnitConversionConfig {
  unitTypes: ('length' | 'weight' | 'area' | 'volume' | 'time')[]; // Selected unit types
  conversionDirection: 'large-to-small' | 'small-to-large' | 'mixed'; // Conversion direction
  valueRange: [number, number];  // Value range
  questionCount: number;         // Number of questions to generate
}

// Geometry question model
// modify by jx: define geometry question interface for geometry calculations
export interface GeometryQuestion {
  id: string;              // Unique identifier for the question
  expression: string;      // Question expression (e.g., "长方形长5cm，宽3cm，求周长")
  answer: number;          // Calculated answer
  shape: 'rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube'; // Shape type
  calculationType: 'perimeter' | 'area' | 'volume'; // Calculation type
  parameters: Record<string, number>; // Shape parameters (length, width, radius, etc.)
}

// Configuration for generating geometry questions
// modify by jx: define configuration interface for geometry question generation
export interface GeometryConfig {
  shapes: ('rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube')[]; // Selected shapes
  calculationTypes: ('perimeter' | 'area' | 'volume')[]; // Selected calculation types
  parameterRange: [number, number];  // Parameter range (e.g., [1, 100] cm)
  questionCount: number;             // Number of questions to generate
  piValue: number;                    // π value (3.14 or 3.14159)
}

// Factor and multiple question model
// modify by jx: define factor and multiple question interface
export interface FactorMultipleQuestion {
  id: string;              // Unique identifier for the question
  expression: string;      // Question expression
  answer: number | number[]; // Answer (single number or array of numbers)
  questionType: 'find-multiples' | 'find-factors' | 'gcd' | 'lcm'; // Question type
  numbers: number[];       // Numbers involved in the question
}

// Configuration for generating factor and multiple questions
// modify by jx: define configuration interface for factor and multiple question generation
export interface FactorMultipleConfig {
  questionTypes: ('find-multiples' | 'find-factors' | 'gcd' | 'lcm')[];
  valueRange: [number, number];  // Value range [min, max]
  questionCount: number;         // Number of questions to generate
  multipleCount?: number;        // Number of multiples to find
  factorCount?: number;          // Number of factors to find
}

// Percentage wrong question record
// modify by jx: define percentage wrong question interface for percentage operations
export interface PercentageWrongQuestion {
  questionId: string;           // Question ID
  question: PercentageQuestion;  // Question information
  studentAnswer: string | number; // Student's answer
  correctAnswer: number | string; // Correct answer
  questionType: 'decimal-to-percent' | 'percent-to-decimal' | 'fraction-to-percent' | 'percent-to-fraction' | 'find-percent' | 'find-part' | 'find-total'; // Question type
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Percentage wrong question statistics
// modify by jx: define percentage wrong question statistics interface for analysis
export interface PercentageWrongQuestionStats {
  byQuestionType: {
    'decimal-to-percent': number;
    'percent-to-decimal': number;
    'fraction-to-percent': number;
    'percent-to-fraction': number;
    'find-percent': number;
    'find-part': number;
    'find-total': number;
  };
  total: number;
}

// Percentage tutoring plan recommendation
// modify by jx: define percentage tutoring plan interface for percentage operations
export interface PercentageTutoringPlan {
  weakAreas: {
    questionTypes: ('decimal-to-percent' | 'percent-to-decimal' | 'fraction-to-percent' | 'percent-to-fraction' | 'find-percent' | 'find-part' | 'find-total')[]; // Weak question types
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<PercentageConfig>; // Recommended practice configuration
}

// Unit conversion wrong question record
// modify by jx: define unit conversion wrong question interface
export interface UnitConversionWrongQuestion {
  questionId: string;           // Question ID
  question: UnitConversionQuestion; // Question information
  studentAnswer: number;         // Student's answer
  correctAnswer: number;         // Correct answer
  unitType: 'length' | 'weight' | 'area' | 'volume' | 'time'; // Unit type
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Unit conversion wrong question statistics
// modify by jx: define unit conversion wrong question statistics interface for analysis
export interface UnitConversionWrongQuestionStats {
  byUnitType: {
    length: number;
    weight: number;
    area: number;
    volume: number;
    time: number;
  };
  total: number;
}

// Unit conversion tutoring plan recommendation
// modify by jx: define unit conversion tutoring plan interface
export interface UnitConversionTutoringPlan {
  weakAreas: {
    unitTypes: ('length' | 'weight' | 'area' | 'volume' | 'time')[]; // Weak unit types
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<UnitConversionConfig>; // Recommended practice configuration
}

// Geometry wrong question record
// modify by jx: define geometry wrong question interface for geometry calculations
export interface GeometryWrongQuestion {
  questionId: string;           // Question ID
  question: GeometryQuestion;    // Question information
  studentAnswer: number;         // Student's answer
  correctAnswer: number;         // Correct answer
  shape: 'rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube'; // Shape type
  calculationType: 'perimeter' | 'area' | 'volume'; // Calculation type
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Geometry wrong question statistics
// modify by jx: define geometry wrong question statistics interface for analysis
export interface GeometryWrongQuestionStats {
  byShape: {
    rectangle: number;
    square: number;
    triangle: number;
    circle: number;
    cuboid: number;
    cube: number;
  };
  byCalculationType: {
    perimeter: number;
    area: number;
    volume: number;
  };
  total: number;
}

// Geometry tutoring plan recommendation
// modify by jx: define geometry tutoring plan interface for geometry calculations
export interface GeometryTutoringPlan {
  weakAreas: {
    shapes: ('rectangle' | 'square' | 'triangle' | 'circle' | 'cuboid' | 'cube')[]; // Weak shapes
    calculationTypes: ('perimeter' | 'area' | 'volume')[]; // Weak calculation types
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<GeometryConfig>; // Recommended practice configuration
}

// Factor multiple wrong question record
// modify by jx: define factor multiple wrong question interface
export interface FactorMultipleWrongQuestion {
  questionId: string;           // Question ID
  question: FactorMultipleQuestion; // Question information
  studentAnswer: string | number | number[]; // Student's answer
  correctAnswer: number | number[]; // Correct answer
  questionType: 'find-multiples' | 'find-factors' | 'gcd' | 'lcm'; // Question type
  timestamp: Date;               // Answer timestamp
  timeSpent?: number;            // Time spent on this question (seconds)
}

// Factor multiple wrong question statistics
// modify by jx: define factor multiple wrong question statistics interface for analysis
export interface FactorMultipleWrongQuestionStats {
  byQuestionType: {
    'find-multiples': number;
    'find-factors': number;
    'gcd': number;
    'lcm': number;
  };
  total: number;
}

// Factor multiple tutoring plan recommendation
// modify by jx: define factor multiple tutoring plan interface
export interface FactorMultipleTutoringPlan {
  weakAreas: {
    questionTypes: ('find-multiples' | 'find-factors' | 'gcd' | 'lcm')[]; // Weak question types
  };
  suggestions: string[];              // Learning suggestions
  recommendedConfig?: Partial<FactorMultipleConfig>; // Recommended practice configuration
}