// Unit tests for useQuestionGenerator
// modify by jx: add unit tests to verify generated questions have integer answers

import { describe, it, expect } from 'vitest';
import { useQuestionGenerator } from './useQuestionGenerator';
import type { OperationType } from '@/types';

describe('useQuestionGenerator', () => {
  describe('Division Questions - Integer Results', () => {
    it('should generate binary division questions with integer results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['divide'] as OperationType[],
        operandCount: 2 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 100,
        questionCount: 10
      };

      const questions = generateQuestions(config);
      
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach((question, index) => {
        // Verify answer is integer
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.answer >= 0).toBe(true);
        expect(question.answer <= 100).toBe(true);
        
        // Verify expression calculation matches answer
        const [a, b] = question.numbers;
        const calculated = a / b;
        expect(calculated).toBe(question.answer);
        
        console.log(`Binary division ${index + 1}: ${question.expression} = ${question.answer}`);
      });
    });

    it('should generate ternary division questions with integer results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['divide', 'divide'] as OperationType[],
        operandCount: 3 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 100,
        questionCount: 10
      };

      const questions = generateQuestions(config);
      
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach((question, index) => {
        // Verify answer is integer
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.answer >= 0).toBe(true);
        expect(question.answer <= 100).toBe(true);
        
        console.log(`Ternary division ${index + 1}: ${question.expression} = ${question.answer}`);
      });
    });

    it('should generate quaternary division questions with integer results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['divide', 'divide', 'divide'] as OperationType[],
        operandCount: 4 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 1000,
        questionCount: 10
      };

      const questions = generateQuestions(config);
      
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach((question, index) => {
        // Verify answer is integer
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.answer >= 0).toBe(true);
        expect(question.answer <= 1000).toBe(true);
        
        console.log(`Quaternary division ${index + 1}: ${question.expression} = ${question.answer}`);
      });
    });

    it('should NOT generate questions like 374 ÷ 562 ÷ 648 ÷ 81 with decimal results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['divide', 'divide', 'divide'] as OperationType[],
        operandCount: 4 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 1000,
        questionCount: 50
      };

      const questions = generateQuestions(config);
      
      expect(questions.length).toBeGreaterThan(0);
      
      // Verify all questions have integer answers
      questions.forEach((question) => {
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.answer >= 0).toBe(true);
        expect(question.answer <= 1000).toBe(true);
        
        // Verify no decimal in expression string representation
        expect(question.answer.toString()).not.toContain('.');
      });
    });

    it('should generate mixed operation questions with integer results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['add', 'subtract', 'multiply', 'divide'] as OperationType[],
        operandCount: 4 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 100,
        questionCount: 20
      };

      const questions = generateQuestions(config);
      
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach((question) => {
        // Verify answer is integer
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.answer >= 0).toBe(true);
        expect(question.answer <= 100).toBe(true);
      });
    });

    it('should handle division with other operations correctly', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['multiply', 'divide', 'add'] as OperationType[],
        operandCount: 4 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 100,
        questionCount: 10
      };

      const questions = generateQuestions(config);
      
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach((question, index) => {
        // Verify answer is integer
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.answer >= 0).toBe(true);
        expect(question.answer <= 100).toBe(true);
        
        console.log(`Mixed operation ${index + 1}: ${question.expression} = ${question.answer}`);
      });
    });
  });

  describe('PRD Requirements - 100% Accuracy', () => {
    it('should ensure ALL generated division questions produce integer results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      // Test with various configurations
      const configs = [
        {
          operations: ['divide'] as OperationType[],
          operandCount: 2 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 1000,
          questionCount: 20
        },
        {
          operations: ['divide', 'divide'] as OperationType[],
          operandCount: 3 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 1000,
          questionCount: 20
        },
        {
          operations: ['divide', 'divide', 'divide'] as OperationType[],
          operandCount: 4 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 1000,
          questionCount: 20
        },
        {
          operations: ['add', 'subtract', 'multiply', 'divide'] as OperationType[],
          operandCount: 4 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 1000,
          questionCount: 50
        }
      ];

      configs.forEach((config, configIndex) => {
        const questions = generateQuestions(config);
        
        expect(questions.length).toBeGreaterThan(0);
        
        questions.forEach((question, questionIndex) => {
          // Verify answer is integer (PRD requirement: answers 100% accurate)
          expect(Number.isInteger(question.answer), 
            `Config ${configIndex}, Question ${questionIndex}: ${question.expression} = ${question.answer} is not integer`
          ).toBe(true);
          
          // Verify answer is within range
          expect(question.answer >= config.minValue).toBe(true);
          expect(question.answer <= config.maxValue).toBe(true);
          
          // Verify answer is not a decimal
          expect(question.answer.toString().indexOf('.')).toBe(-1);
        });
      });
    });

    it('should not generate questions with negative results', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const config = {
        operations: ['subtract', 'divide'] as OperationType[],
        operandCount: 4 as 2 | 3 | 4,
        minValue: 0,
        maxValue: 1000,
        questionCount: 50
      };

      const questions = generateQuestions(config);
      
      questions.forEach((question) => {
        expect(question.answer >= 0).toBe(true);
      });
    });

    // modify by jx: add test to ensure zero dividend is not generated
    it('should NOT generate questions with zero as first dividend (e.g., 0 ÷ 7 ÷ 6)', () => {
      const { generateQuestions } = useQuestionGenerator();
      
      const configs = [
        {
          operations: ['divide'] as OperationType[],
          operandCount: 2 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 100,
          questionCount: 50
        },
        {
          operations: ['divide', 'divide'] as OperationType[],
          operandCount: 3 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 100,
          questionCount: 50
        },
        {
          operations: ['divide', 'divide', 'divide'] as OperationType[],
          operandCount: 4 as 2 | 3 | 4,
          minValue: 0,
          maxValue: 1000,
          questionCount: 50
        }
      ];

      configs.forEach((config) => {
        const questions = generateQuestions(config);
        
        expect(questions.length).toBeGreaterThan(0);
        
        questions.forEach((question) => {
          // Verify first operand (dividend) is not zero
          const firstNumber = question.numbers[0];
          expect(firstNumber).not.toBe(0);
          expect(firstNumber).toBeGreaterThan(0);
          
          // Verify expression does not start with "0 ÷"
          expect(question.expression).not.toMatch(/^0\s*÷/);
          
          // Verify answer is valid
          expect(Number.isInteger(question.answer)).toBe(true);
          expect(question.answer >= 0).toBe(true);
        });
      });
    });
  });
});
