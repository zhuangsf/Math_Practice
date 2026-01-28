// Bug reproduction tests for unit conversion question generation
// modify by jx: reproduce specific bugs in question generation

import { describe, it, expect } from 'vitest';
import { generateUnitConversionQuestions } from './useUnitConversionGenerator';
import { convertUnit } from '@/utils/unitConversionUtils';
import type { UnitConversionConfig } from '@/types';

describe('UnitConversionGenerator - Bug Reproduction', () => {
  it('should generate questions with correct answers for specific cases', () => {
    // Generate many questions to find the problematic ones
    const config: UnitConversionConfig = {
      unitTypes: ['length', 'weight'],
      conversionDirection: 'mixed',
      valueRange: [1, 100],
      questionCount: 1000
    };

    const questions = generateUnitConversionQuestions(config);
    
    // Find questions matching the bug cases
    const mToCmQuestions = questions.filter(q => 
      q.fromUnit === 'm' && q.toUnit === 'cm'
    );
    
    const dmToCmQuestions = questions.filter(q => 
      q.fromUnit === 'dm' && q.toUnit === 'cm'
    );
    
    const tToKgQuestions = questions.filter(q => 
      q.fromUnit === 't' && q.toUnit === 'kg'
    );

    // Check if any have incorrect answers
    mToCmQuestions.forEach(q => {
      const expected = convertUnit(q.value, 'length', 'm', 'cm');
      if (Math.abs(q.answer - expected) > 0.01) {
        console.error('Bug found in m to cm:', {
          value: q.value,
          expected,
          actual: q.answer,
          expression: q.expression
        });
      }
      expect(q.answer).toBeCloseTo(expected, 10);
    });

    dmToCmQuestions.forEach(q => {
      const expected = convertUnit(q.value, 'length', 'dm', 'cm');
      if (Math.abs(q.answer - expected) > 0.01) {
        console.error('Bug found in dm to cm:', {
          value: q.value,
          expected,
          actual: q.answer,
          expression: q.expression
        });
      }
      expect(q.answer).toBeCloseTo(expected, 10);
    });

    tToKgQuestions.forEach(q => {
      const expected = convertUnit(q.value, 'weight', 't', 'kg');
      if (Math.abs(q.answer - expected) > 0.01) {
        console.error('Bug found in t to kg:', {
          value: q.value,
          expected,
          actual: q.answer,
          expression: q.expression
        });
      }
      expect(q.answer).toBeCloseTo(expected, 10);
    });
  });

  it('should verify answer calculation in question generation', () => {
    // Test the specific bug cases manually
    const testCases = [
      { value: 27, unitType: 'length' as const, fromUnit: 'm', toUnit: 'cm', expected: 2700 },
      { value: 30, unitType: 'length' as const, fromUnit: 'dm', toUnit: 'cm', expected: 300 },
      { value: 85, unitType: 'weight' as const, fromUnit: 't', toUnit: 'kg', expected: 85000 }
    ];

    testCases.forEach(testCase => {
      const calculated = convertUnit(
        testCase.value,
        testCase.unitType,
        testCase.fromUnit,
        testCase.toUnit
      );
      console.log(`Test: ${testCase.value}${testCase.fromUnit} to ${testCase.toUnit} = ${calculated} (expected ${testCase.expected})`);
      expect(calculated).toBe(testCase.expected);
    });
  });
});
