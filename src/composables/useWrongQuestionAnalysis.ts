// Composable for analyzing wrong questions
// modify by jx: implement wrong question analysis with statistics and categorization

import type { Question, StudentAnswer, WrongQuestion, WrongQuestionStats } from '@/types';

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
 * Composable for wrong question analysis
 */
export function useWrongQuestionAnalysis() {
  return {
    extractWrongQuestions,
    calculateWrongQuestionStats,
    getOperationTypeName,
    getOperandCountName
  };
}
