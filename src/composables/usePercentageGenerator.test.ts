// Unit tests for percentage generator
// modify by jx: implement unit tests for percentage question generation

import { describe, it, expect } from 'vitest';
import { generatePercentageQuestions, usePercentageGenerator } from './usePercentageGenerator';
import type { PercentageConfig } from '@/types';
import {
  parsePercentAnswer,
  validatePercentAnswer
} from '@/utils/percentageUtils';

describe('usePercentageGenerator', () => {
  describe('generatePercentageQuestions', () => {
    it('should generate decimal to percent conversion questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['decimal-to-percent'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('decimal-to-percent');
        // Answer should end with %
        expect(q.answer).toMatch(/^\d+(\.\d+)?%$/);
      });
    });

    it('should generate percent to decimal conversion questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['percent-to-decimal'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('percent-to-decimal');
        // Answer should be a decimal number
        const answerNum = typeof q.answer === 'string' ? parseFloat(q.answer) : q.answer;
        expect(answerNum).toBeGreaterThanOrEqual(0);
        expect(answerNum).toBeLessThanOrEqual(1);
      });
    });

    it('should generate fraction to percent conversion questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['fraction-to-percent'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('fraction-to-percent');
        // Expression should contain /
        expect(q.expression).toContain('/');
        // Answer should end with %
        expect(q.answer).toMatch(/^\d+(\.\d+)?%$/);
      });
    });

    it('should generate percent to fraction conversion questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['percent-to-fraction'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('percent-to-fraction');
        // Answer should be in fraction format
        expect(q.answer).toMatch(/^\d+\/\d+$/);
      });
    });

    it('should generate find percent questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['find-percent'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('find-percent');
        // Expression should be in Chinese format
        expect(q.expression).toContain('是');
        expect(q.expression).toContain('的百分之几');
        // Answer should end with %
        expect(q.answer).toMatch(/^\d+(\.\d+)?%$/);
      });
    });

    it('should generate find part questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['find-part'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('find-part');
        // Expression should be in Chinese format
        expect(q.expression).toContain('的');
        expect(q.expression).toContain('%是多少');
      });
    });

    it('should generate find total questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['find-total'],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);

      questions.forEach(q => {
        expect(q.questionType).toBe('find-total');
        // Expression should be in Chinese format
        expect(q.expression).toContain('多少的');
        expect(q.expression).toContain('%是');
      });
    });

    it('should generate correct number of questions', () => {
      const config: PercentageConfig = {
        questionTypes: ['decimal-to-percent'],
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(10);
    });

    it('should generate questions with multiple types', () => {
      const config: PercentageConfig = {
        questionTypes: ['decimal-to-percent', 'percent-to-decimal'],
        valueRange: [1, 100],
        questionCount: 20
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(20);

      const types = new Set(questions.map(q => q.questionType));
      expect(types.size).toBeGreaterThan(1);
    });

    it('should use default question types when none specified', () => {
      const config: PercentageConfig = {
        questionTypes: [],
        valueRange: [1, 100],
        questionCount: 5
      };

      const questions = generatePercentageQuestions(config);
      expect(questions.length).toBe(5);
    });
  });

  describe('usePercentageGenerator composable', () => {
    it('should initialize with empty questions', () => {
      const { questions, isGenerating } = usePercentageGenerator();
      expect(questions.value).toEqual([]);
      expect(isGenerating.value).toBe(false);
    });

    it('should generate questions', () => {
      const { questions, generate, isGenerating } = usePercentageGenerator();
      
      const config: PercentageConfig = {
        questionTypes: ['decimal-to-percent'],
        valueRange: [1, 100],
        questionCount: 5
      };

      generate(config);
      
      expect(questions.value.length).toBe(5);
      expect(isGenerating.value).toBe(false);
    });

    it('should clear questions', () => {
      const { questions, generate, clear } = usePercentageGenerator();
      
      const config: PercentageConfig = {
        questionTypes: ['decimal-to-percent'],
        valueRange: [1, 100],
        questionCount: 5
      };

      generate(config);
      expect(questions.value.length).toBe(5);
      
      clear();
      expect(questions.value).toEqual([]);
    });
  });

  describe('answer validation', () => {
    it('should validate decimal to percent answers correctly', () => {
      const config: PercentageConfig = {
        questionTypes: ['decimal-to-percent'],
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generatePercentageQuestions(config);
      
      questions.forEach(q => {
        // Test with correct answer
        const correctAnswer = q.answer;
        expect(validatePercentAnswer(correctAnswer, correctAnswer)).toBe(true);
        
        // Test with incorrect answer
        expect(validatePercentAnswer('0%', correctAnswer)).toBe(false);
      });
    });

    it('should validate percent to decimal answers correctly', () => {
      const config: PercentageConfig = {
        questionTypes: ['percent-to-decimal'],
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generatePercentageQuestions(config);
      
      questions.forEach(q => {
        const answerNum = typeof q.answer === 'string' ? parseFloat(q.answer) : q.answer;
        
        // Test with correct answer - the answer is a decimal (0.5 for 50%)
        // modify by jx: when answer is a decimal like 0.5, it represents 50%, so we compare as decimal
        expect(validatePercentAnswer(answerNum, q.answer)).toBe(true);
        
        // Test with incorrect answer
        expect(validatePercentAnswer(0, q.answer)).toBe(false);
        
        // Test with percentage string format
        const expectedPercent = answerNum * 100;
        expect(validatePercentAnswer(`${expectedPercent}%`, q.answer)).toBe(true);
      });
    });

    it('should validate find percent answers correctly', () => {
      const config: PercentageConfig = {
        questionTypes: ['find-percent'],
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generatePercentageQuestions(config);
      
      questions.forEach(q => {
        // Extract part and total from expression
        const match = q.expression.match(/(\d+)是(\d+)的百分之几/);
        if (match) {
          const part = parseInt(match[1]);
          const total = parseInt(match[2]);
          const expectedPercent = (part / total) * 100;
          
          // Test with correct answer
          // modify by jx: use tolerance for floating point comparison
          expect(validatePercentAnswer(q.answer, `${expectedPercent.toFixed(0)}%`, 0.5)).toBe(true);
          
          // Test with decimal answer format
          expect(validatePercentAnswer(expectedPercent / 100, q.answer, 0.5)).toBe(true);
        }
      });
    });

    it('should validate find part answers correctly', () => {
      const config: PercentageConfig = {
        questionTypes: ['find-part'],
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generatePercentageQuestions(config);
      
      questions.forEach(q => {
        // Extract percent and total from expression
        // Expression format: "100的25%是多少"
        const match = q.expression.match(/(\d+)的(\d+)%是多少/);
        if (match) {
          const total = parseInt(match[1]);
          const percent = parseInt(match[2]);
          const expectedPart = (percent / 100) * total;
          
          // The stored answer is rounded to 2 decimal places
          const storedAnswer = q.answer;
          
          // Test with the stored answer
          // modify by jx: use tolerance to account for rounding differences
          expect(validatePercentAnswer(storedAnswer, storedAnswer)).toBe(true);
          
          // Test with integer approximation (tolerance 2 to allow rounding and float variance)
          expect(validatePercentAnswer(Math.round(expectedPart), storedAnswer, 2)).toBe(true);
        }
      });
    });

    it('should validate find total answers correctly', () => {
      const config: PercentageConfig = {
        questionTypes: ['find-total'],
        valueRange: [1, 100],
        questionCount: 10
      };

      const questions = generatePercentageQuestions(config);
      
      questions.forEach(q => {
        // Extract percent and part from expression
        const match = q.expression.match(/多少的(\d+)%是(\d+)/);
        if (match) {
          const percent = parseInt(match[1]);
          const part = parseInt(match[2]);
          const expectedTotal = (part / percent) * 100;
          
          // Test with correct answer (allow tolerance for rounding)
          expect(validatePercentAnswer(Math.round(expectedTotal), q.answer, 0.5)).toBe(true);
        }
      });
    });
  });
});
