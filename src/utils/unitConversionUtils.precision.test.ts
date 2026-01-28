// Test for precision issues in unit conversion
// modify by jx: test precision issues reported by user

import { describe, it, expect } from 'vitest';
import { convertUnit } from './unitConversionUtils';

describe('UnitConversionUtils - Precision Issues', () => {
  it('should correctly convert 12mm to cm without precision errors', () => {
    // Bug: 12毫米 = ?厘米  显示 1.2000000000000002，应该是 1.2
    const result = convertUnit(12, 'length', 'mm', 'cm');
    console.log('12mm to cm (raw):', result);
    console.log('12mm to cm (string):', result.toString());
    
    // Check if result is close to 1.2
    expect(result).toBeCloseTo(1.2, 10);
    
    // Check if the string representation doesn't have precision errors
    const resultStr = result.toString();
    expect(resultStr).not.toContain('0000000000000002');
    expect(resultStr).not.toContain('999999999999999');
  });

  it('should handle various precision-sensitive conversions', () => {
    // Test cases that might have precision issues
    const testCases = [
      { value: 12, unitType: 'length' as const, from: 'mm', to: 'cm', expected: 1.2 },
      { value: 1, unitType: 'length' as const, from: 'mm', to: 'cm', expected: 0.1 },
      { value: 3, unitType: 'length' as const, from: 'mm', to: 'cm', expected: 0.3 },
      { value: 7, unitType: 'length' as const, from: 'mm', to: 'cm', expected: 0.7 },
      { value: 100, unitType: 'weight' as const, from: 'g', to: 'kg', expected: 0.1 },
      { value: 500, unitType: 'weight' as const, from: 'g', to: 'kg', expected: 0.5 },
    ];

    testCases.forEach(testCase => {
      const result = convertUnit(testCase.value, testCase.unitType, testCase.from, testCase.to);
      const resultStr = result.toString();
      console.log(`${testCase.value}${testCase.from} to ${testCase.to}: ${result} (string: ${resultStr})`);
      
      expect(result).toBeCloseTo(testCase.expected, 10);
      // Check for precision errors in string representation
      expect(resultStr).not.toMatch(/00000000000000[0-9]/);
      expect(resultStr).not.toMatch(/99999999999999[0-9]/);
    });
  });
});
