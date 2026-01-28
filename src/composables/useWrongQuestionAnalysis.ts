// Composable for analyzing wrong questions
// modify by jx: implement wrong question analysis with statistics and categorization

import type { 
  Question, 
  StudentAnswer, 
  WrongQuestion, 
  WrongQuestionStats,
  FractionQuestion,
  FractionWrongQuestion,
  FractionWrongQuestionStats,
  DecimalQuestion,
  DecimalWrongQuestion,
  DecimalWrongQuestionStats,
  PercentageQuestion,
  PercentageWrongQuestion,
  PercentageWrongQuestionStats,
  UnitConversionQuestion,
  UnitConversionWrongQuestion,
  UnitConversionWrongQuestionStats,
  GeometryQuestion,
  GeometryWrongQuestion,
  GeometryWrongQuestionStats,
  FactorMultipleQuestion,
  FactorMultipleWrongQuestion,
  FactorMultipleWrongQuestionStats
} from '@/types';

/**
 * Extract wrong questions from student answers
 * @param questions Array of questions
 * @param answers Array of student answers
 * @returns Array of wrong questions
 */
export function extractWrongQuestions(
  questions: Question[],
  answers: StudentAnswer[]
): WrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: WrongQuestion[] = [];

  answers.forEach((answer) => {
    if (answer.status === 'wrong' && answer.answer !== null) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return;
      }

      // Determine operation type from operators
      const operationType = question.operators[0] || 'add';
      const operandCount = question.operators.length + 1 as 2 | 3 | 4;

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        operationType,
        operandCount,
        timestamp: new Date(),
        timeSpent: answer.timeSpent
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate wrong question statistics
 * @param wrongQuestions Array of wrong questions
 * @returns WrongQuestionStats object
 */
export function calculateWrongQuestionStats(
  wrongQuestions: WrongQuestion[]
): WrongQuestionStats {
  const stats: WrongQuestionStats = {
    byOperationType: {
      add: 0,
      subtract: 0,
      multiply: 0,
      divide: 0
    },
    byOperandCount: {
      binary: 0,
      ternary: 0,
      quaternary: 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    // Count by operation type
    stats.byOperationType[wrongQuestion.operationType]++;

    // Count by operand count
    if (wrongQuestion.operandCount === 2) {
      stats.byOperandCount.binary++;
    } else if (wrongQuestion.operandCount === 3) {
      stats.byOperandCount.ternary++;
    } else if (wrongQuestion.operandCount === 4) {
      stats.byOperandCount.quaternary++;
    }
  });

  return stats;
}

/**
 * Get operation type display name
 * @param operationType Operation type
 * @returns Display name
 */
export function getOperationTypeName(operationType: string): string {
  const nameMap: Record<string, string> = {
    add: '加法',
    subtract: '减法',
    multiply: '乘法',
    divide: '除法'
  };
  return nameMap[operationType] || operationType;
}

/**
 * Get operand count display name
 * @param operandCount Number of operands
 * @returns Display name
 */
export function getOperandCountName(operandCount: 2 | 3 | 4): string {
  const nameMap: Record<number, string> = {
    2: '二元运算',
    3: '三元运算',
    4: '四元运算'
  };
  return nameMap[operandCount] || `${operandCount}元运算`;
}

/**
 * Extract wrong fraction questions from student answers
 * modify by jx: add function to extract wrong fraction questions
 * @param questions Array of fraction questions
 * @param answers Map of student answers (questionId -> { answer: string | null, status: AnswerStatus })
 * @returns Array of wrong fraction questions
 */
export function extractFractionWrongQuestions(
  questions: FractionQuestion[],
  answers: Map<string, { answer: string | null; status: string }>
): FractionWrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: FractionWrongQuestion[] = [];

  answers.forEach((answer, questionId) => {
    if (answer.status === 'wrong' && answer.answer !== null) {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      // Determine operation type from operators
      const operationType = question.operators[0] || 'add';

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        operationType,
        questionType: question.questionType,
        timestamp: new Date()
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate fraction wrong question statistics
 * modify by jx: add function to calculate fraction wrong question statistics
 * @param wrongQuestions Array of wrong fraction questions
 * @returns FractionWrongQuestionStats object
 */
export function calculateFractionWrongQuestionStats(
  wrongQuestions: FractionWrongQuestion[]
): FractionWrongQuestionStats {
  const stats: FractionWrongQuestionStats = {
    byOperationType: {
      add: 0,
      subtract: 0,
      multiply: 0,
      divide: 0
    },
    byQuestionType: {
      'same-denominator': 0,
      'different-denominator': 0,
      'mixed': 0,
      'simplify': 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    // Count by operation type
    stats.byOperationType[wrongQuestion.operationType]++;

    // Count by question type
    stats.byQuestionType[wrongQuestion.questionType]++;
  });

  return stats;
}

/**
 * Extract wrong decimal questions from student answers
 * modify by jx: add function to extract wrong decimal questions
 * @param questions Array of decimal questions
 * @param answers Map of student answers (questionId -> { answer: number | null, status: AnswerStatus })
 * @returns Array of wrong decimal questions
 */
export function extractDecimalWrongQuestions(
  questions: DecimalQuestion[],
  answers: Map<string, { answer: number | null; status: string }>
): DecimalWrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: DecimalWrongQuestion[] = [];

  answers.forEach((answer, questionId) => {
    if (answer.status === 'wrong' && answer.answer !== null) {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      // Determine operation type from operators
      const operationType = question.operators[0] || 'add';

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        operationType,
        timestamp: new Date()
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate decimal wrong question statistics
 * modify by jx: add function to calculate decimal wrong question statistics
 * @param wrongQuestions Array of wrong decimal questions
 * @returns DecimalWrongQuestionStats object
 */
export function calculateDecimalWrongQuestionStats(
  wrongQuestions: DecimalWrongQuestion[]
): DecimalWrongQuestionStats {
  const stats: DecimalWrongQuestionStats = {
    byOperationType: {
      add: 0,
      subtract: 0,
      multiply: 0,
      divide: 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    // Count by operation type
    stats.byOperationType[wrongQuestion.operationType]++;
  });

  return stats;
}

/**
 * Extract wrong percentage questions from student answers
 * modify by jx: add function to extract wrong percentage questions
 * @param questions Array of percentage questions
 * @param answers Map of student answers (questionId -> { answer: string | number | null, status: AnswerStatus })
 * @returns Array of wrong percentage questions
 */
export function extractPercentageWrongQuestions(
  questions: PercentageQuestion[],
  answers: Map<string, { answer: string | number | null; status: string }>
): PercentageWrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: PercentageWrongQuestion[] = [];

  answers.forEach((answer, questionId) => {
    if (answer.status === 'wrong' && answer.answer !== null && answer.answer !== undefined) {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        questionType: question.questionType,
        timestamp: new Date()
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate percentage wrong question statistics
 * modify by jx: add function to calculate percentage wrong question statistics
 * @param wrongQuestions Array of wrong percentage questions
 * @returns PercentageWrongQuestionStats object
 */
export function calculatePercentageWrongQuestionStats(
  wrongQuestions: PercentageWrongQuestion[]
): PercentageWrongQuestionStats {
  const stats: PercentageWrongQuestionStats = {
    byQuestionType: {
      'decimal-to-percent': 0,
      'percent-to-decimal': 0,
      'fraction-to-percent': 0,
      'percent-to-fraction': 0,
      'find-percent': 0,
      'find-part': 0,
      'find-total': 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    stats.byQuestionType[wrongQuestion.questionType]++;
  });

  return stats;
}

/**
 * Extract wrong unit conversion questions from student answers
 * modify by jx: add function to extract wrong unit conversion questions
 * @param questions Array of unit conversion questions
 * @param answers Map of student answers (questionId -> { answer: number | null, status: AnswerStatus })
 * @returns Array of wrong unit conversion questions
 */
export function extractUnitConversionWrongQuestions(
  questions: UnitConversionQuestion[],
  answers: Map<string, { answer: number | null; status: string }>
): UnitConversionWrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: UnitConversionWrongQuestion[] = [];

  answers.forEach((answer, questionId) => {
    if (answer.status === 'wrong' && answer.answer !== null && answer.answer !== undefined) {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        unitType: question.unitType,
        timestamp: new Date()
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate unit conversion wrong question statistics
 * modify by jx: add function to calculate unit conversion wrong question statistics
 * @param wrongQuestions Array of wrong unit conversion questions
 * @returns UnitConversionWrongQuestionStats object
 */
export function calculateUnitConversionWrongQuestionStats(
  wrongQuestions: UnitConversionWrongQuestion[]
): UnitConversionWrongQuestionStats {
  const stats: UnitConversionWrongQuestionStats = {
    byUnitType: {
      length: 0,
      weight: 0,
      area: 0,
      volume: 0,
      time: 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    stats.byUnitType[wrongQuestion.unitType]++;
  });

  return stats;
}

/**
 * Extract wrong geometry questions from student answers
 * modify by jx: add function to extract wrong geometry questions
 * @param questions Array of geometry questions
 * @param answers Map of student answers (questionId -> { answer: number | null, status: AnswerStatus })
 * @returns Array of wrong geometry questions
 */
export function extractGeometryWrongQuestions(
  questions: GeometryQuestion[],
  answers: Map<string, { answer: number | null; status: string }>
): GeometryWrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: GeometryWrongQuestion[] = [];

  answers.forEach((answer, questionId) => {
    if (answer.status === 'wrong' && answer.answer !== null && answer.answer !== undefined) {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        shape: question.shape,
        calculationType: question.calculationType,
        timestamp: new Date()
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate geometry wrong question statistics
 * modify by jx: add function to calculate geometry wrong question statistics
 * @param wrongQuestions Array of wrong geometry questions
 * @returns GeometryWrongQuestionStats object
 */
export function calculateGeometryWrongQuestionStats(
  wrongQuestions: GeometryWrongQuestion[]
): GeometryWrongQuestionStats {
  const stats: GeometryWrongQuestionStats = {
    byShape: {
      rectangle: 0,
      square: 0,
      triangle: 0,
      circle: 0,
      cuboid: 0,
      cube: 0
    },
    byCalculationType: {
      perimeter: 0,
      area: 0,
      volume: 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    stats.byShape[wrongQuestion.shape]++;
    stats.byCalculationType[wrongQuestion.calculationType]++;
  });

  return stats;
}

/**
 * Extract wrong factor multiple questions from student answers
 * modify by jx: add function to extract wrong factor multiple questions
 * @param questions Array of factor multiple questions
 * @param answers Map of student answers (questionId -> { answer: string | number | number[] | null, status: AnswerStatus })
 * @returns Array of wrong factor multiple questions
 */
export function extractFactorMultipleWrongQuestions(
  questions: FactorMultipleQuestion[],
  answers: Map<string, { answer: string | number | number[] | null; status: string }>
): FactorMultipleWrongQuestion[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const wrongQuestions: FactorMultipleWrongQuestion[] = [];

  answers.forEach((answer, questionId) => {
    if (answer.status === 'wrong' && answer.answer !== null && answer.answer !== undefined) {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      wrongQuestions.push({
        questionId: question.id,
        question,
        studentAnswer: answer.answer,
        correctAnswer: question.answer,
        questionType: question.questionType,
        timestamp: new Date()
      });
    }
  });

  return wrongQuestions;
}

/**
 * Calculate factor multiple wrong question statistics
 * modify by jx: add function to calculate factor multiple wrong question statistics
 * @param wrongQuestions Array of wrong factor multiple questions
 * @returns FactorMultipleWrongQuestionStats object
 */
export function calculateFactorMultipleWrongQuestionStats(
  wrongQuestions: FactorMultipleWrongQuestion[]
): FactorMultipleWrongQuestionStats {
  const stats: FactorMultipleWrongQuestionStats = {
    byQuestionType: {
      'find-multiples': 0,
      'find-factors': 0,
      'gcd': 0,
      'lcm': 0
    },
    total: wrongQuestions.length
  };

  wrongQuestions.forEach((wrongQuestion) => {
    stats.byQuestionType[wrongQuestion.questionType]++;
  });

  return stats;
}

/**
 * Composable for wrong question analysis
 */
export function useWrongQuestionAnalysis() {
  return {
    extractWrongQuestions,
    calculateWrongQuestionStats,
    extractFractionWrongQuestions,
    calculateFractionWrongQuestionStats,
    extractDecimalWrongQuestions,
    calculateDecimalWrongQuestionStats,
    extractPercentageWrongQuestions,
    calculatePercentageWrongQuestionStats,
    extractUnitConversionWrongQuestions,
    calculateUnitConversionWrongQuestionStats,
    extractGeometryWrongQuestions,
    calculateGeometryWrongQuestionStats,
    extractFactorMultipleWrongQuestions,
    calculateFactorMultipleWrongQuestionStats,
    getOperationTypeName,
    getOperandCountName
  };
}
