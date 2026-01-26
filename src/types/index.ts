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
  operandCount: 2 | 3 | 4;           // Number of operands (2, 3, or 4)
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