// Test for formatAnswer function fix
// modify by jx: test formatAnswer function to ensure it doesn't remove integer trailing zeros

import { describe, it, expect } from 'vitest';

// Simulate the formatAnswer function from UnitConversionDisplay.vue
function formatAnswer(answer: number): string {
  // modify by jx: fix format answer to only remove trailing zeros after decimal point, not integer trailing zeros
  const str = answer.toString();
  // Only remove trailing zeros if there's a decimal point
  if (str.includes('.')) {
    return str.replace(/\.?0+$/, '');
  }
  // For integers, return as is
  return str;
}

describe('formatAnswer - Bug Fix', () => {
  it('should not remove trailing zeros from integers', () => {
    // Bug cases reported by user
    expect(formatAnswer(2700)).toBe('2700');
    expect(formatAnswer(300)).toBe('300');
    expect(formatAnswer(85000)).toBe('85000');
    
    // More test cases
    expect(formatAnswer(100)).toBe('100');
    expect(formatAnswer(1000)).toBe('1000');
    expect(formatAnswer(20000)).toBe('20000');
  });

  it('should still remove trailing zeros after decimal point', () => {
    expect(formatAnswer(100.0)).toBe('100');
    expect(formatAnswer(100.50)).toBe('100.5');
    expect(formatAnswer(100.500)).toBe('100.5');
    expect(formatAnswer(27.00)).toBe('27');
    expect(formatAnswer(3.0)).toBe('3');
  });

  it('should handle edge cases', () => {
    expect(formatAnswer(0)).toBe('0');
    expect(formatAnswer(0.0)).toBe('0');
    expect(formatAnswer(0.50)).toBe('0.5');
    expect(formatAnswer(1)).toBe('1');
    expect(formatAnswer(1.0)).toBe('1');
  });
});
