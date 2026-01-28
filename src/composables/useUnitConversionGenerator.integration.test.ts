// Integration tests for unit conversion question generation
// modify by jx: add integration tests to verify actual generated questions have correct answers

import { describe, it, expect } from 'vitest';
import { generateUnitConversionQuestions } from './useUnitConversionGenerator';
import { convertUnit } from '@/utils/unitConversionUtils';
import type { UnitConversionConfig } from '@/types';

describe('UnitConversionGenerator - Integration Tests', () => {
  it('should generate questions with mathematically correct answers for all unit types', () => {
    const config: UnitConversionConfig = {
      unitTypes: ['length', 'weight', 'area', 'volume', 'time'],
      conversionDirection: 'mixed',
      valueRange: [1, 100],
      questionCount: 100
    };

    const questions = generateUnitConversionQuestions(config);
    expect(questions.length).toBe(100);

    // Verify each question's answer is mathematically correct
    questions.forEach((question, index) => {
      const expectedAnswer = convertUnit(
        question.value,
        question.unitType,
        question.fromUnit,
        question.toUnit
      );
      
      // Check if answer matches expected value (with tolerance for floating point precision)
      const difference = Math.abs(question.answer - expectedAnswer);
      const tolerance = Math.max(Math.abs(expectedAnswer) * 1e-10, 1e-10);
      
      if (difference > tolerance) {
        console.error(`Question ${index + 1} has incorrect answer:`, {
          expression: question.expression,
          value: question.value,
          fromUnit: question.fromUnit,
          toUnit: question.toUnit,
          unitType: question.unitType,
          expectedAnswer,
          actualAnswer: question.answer,
          difference
        });
      }
      
      expect(difference).toBeLessThanOrEqual(tolerance);
    });
  });

  it('should generate questions with correct answers for specific volume conversions', () => {
    const config: UnitConversionConfig = {
      unitTypes: ['volume'],
      conversionDirection: 'mixed',
      valueRange: [1, 50],
      questionCount: 200
    };

    const questions = generateUnitConversionQuestions(config);
    
    // Check L to mL conversions
    const lToMl = questions.filter(q => q.fromUnit === 'L' && q.toUnit === 'mL');
    lToMl.forEach(q => {
      expect(q.answer).toBe(q.value * 1000);
    });

    // Check mL to L conversions
    const mlToL = questions.filter(q => q.fromUnit === 'mL' && q.toUnit === 'L');
    mlToL.forEach(q => {
      expect(q.answer).toBeCloseTo(q.value / 1000, 10);
    });

    // Check L to dm³ conversions
    const lToDm3 = questions.filter(q => q.fromUnit === 'L' && q.toUnit === 'dm³');
    lToDm3.forEach(q => {
      expect(q.answer).toBe(q.value);
    });

    // Check mL to cm³ conversions
    const mlToCm3 = questions.filter(q => q.fromUnit === 'mL' && q.toUnit === 'cm³');
    mlToCm3.forEach(q => {
      expect(q.answer).toBe(q.value);
    });
  });

  it('should generate questions with correct answers for length conversions', () => {
    const config: UnitConversionConfig = {
      unitTypes: ['length'],
      conversionDirection: 'mixed',
      valueRange: [1, 100],
      questionCount: 100
    };

    const questions = generateUnitConversionQuestions(config);
    
    // Check m to cm conversions
    const mToCm = questions.filter(q => q.fromUnit === 'm' && q.toUnit === 'cm');
    mToCm.forEach(q => {
      expect(q.answer).toBe(q.value * 100);
    });

    // Check cm to m conversions
    const cmToM = questions.filter(q => q.fromUnit === 'cm' && q.toUnit === 'm');
    cmToM.forEach(q => {
      expect(q.answer).toBeCloseTo(q.value / 100, 10);
    });

    // Check km to m conversions
    const kmToM = questions.filter(q => q.fromUnit === 'km' && q.toUnit === 'm');
    kmToM.forEach(q => {
      expect(q.answer).toBe(q.value * 1000);
    });
  });

  it('should generate questions with correct answers for weight conversions', () => {
    const config: UnitConversionConfig = {
      unitTypes: ['weight'],
      conversionDirection: 'mixed',
      valueRange: [1, 100],
      questionCount: 100
    };

    const questions = generateUnitConversionQuestions(config);
    
    // Check kg to g conversions
    const kgToG = questions.filter(q => q.fromUnit === 'kg' && q.toUnit === 'g');
    kgToG.forEach(q => {
      expect(q.answer).toBe(q.value * 1000);
    });

    // Check g to kg conversions
    const gToKg = questions.filter(q => q.fromUnit === 'g' && q.toUnit === 'kg');
    gToKg.forEach(q => {
      expect(q.answer).toBeCloseTo(q.value / 1000, 10);
    });
  });

  it('should generate questions with correct answers for time conversions', () => {
    const config: UnitConversionConfig = {
      unitTypes: ['time'],
      conversionDirection: 'mixed',
      valueRange: [1, 100],
      questionCount: 100
    };

    const questions = generateUnitConversionQuestions(config);
    
    // Check h to min conversions
    const hToMin = questions.filter(q => q.fromUnit === 'h' && q.toUnit === 'min');
    hToMin.forEach(q => {
      expect(q.answer).toBe(q.value * 60);
    });

    // Check h to s conversions
    const hToS = questions.filter(q => q.fromUnit === 'h' && q.toUnit === 's');
    hToS.forEach(q => {
      expect(q.answer).toBe(q.value * 3600);
    });

    // Check d to h conversions
    const dToH = questions.filter(q => q.fromUnit === 'd' && q.toUnit === 'h');
    dToH.forEach(q => {
      expect(q.answer).toBe(q.value * 24);
    });
  });
});
