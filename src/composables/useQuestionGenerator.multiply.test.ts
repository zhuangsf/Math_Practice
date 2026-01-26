// Test for multiplication-only questions
// modify by jx: add tests to reproduce the multiplication bug

import { useQuestionGenerator } from './useQuestionGenerator';
import type { OperationType } from '@/types';

describe('useQuestionGenerator - Multiplication Only', () => {
  it('should generate ternary multiplication questions (3 operands)', () => {
    const { generateQuestions } = useQuestionGenerator();

    const config = {
      operations: ['multiply'] as OperationType[],
      operandCount: 3 as 2 | 3 | 4,
      minValue: 0,
      maxValue: 1000,
      questionCount: 20
    };

    const questions = generateQuestions(config);

    console.log(`Generated ${questions.length} out of ${config.questionCount} ternary multiplication questions`);

    expect(questions.length).toBeGreaterThan(0);

    questions.forEach((question, index) => {
      console.log(`Question ${index + 1}: ${question.expression} = ${question.answer}`);
      expect(question.answer).toBeGreaterThan(0);
      expect(question.answer).toBeLessThanOrEqual(1000);
    });
  });

  it('should generate quaternary multiplication questions (4 operands)', () => {
    const { generateQuestions } = useQuestionGenerator();

    const config = {
      operations: ['multiply'] as OperationType[],
      operandCount: 4 as 2 | 3 | 4,
      minValue: 0,
      maxValue: 1000,
      questionCount: 20
    };

    const questions = generateQuestions(config);

    console.log(`Generated ${questions.length} out of ${config.questionCount} quaternary multiplication questions`);

    expect(questions.length).toBeGreaterThan(0);

    questions.forEach((question, index) => {
      console.log(`Question ${index + 1}: ${question.expression} = ${question.answer}`);
      expect(question.answer).toBeGreaterThan(0);
      expect(question.answer).toBeLessThanOrEqual(1000);
    });
  });
});
