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