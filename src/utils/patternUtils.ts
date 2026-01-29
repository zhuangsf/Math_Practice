// Pattern utilities
// modify by jx: implement pattern generation and calculation functions for number sequences

/**
 * Generate an arithmetic sequence (等差数列)
 * @param start First term
 * @param diff Common difference
 * @param count Number of terms
 * @returns Array of numbers
 */
export function generateArithmeticSequence(start: number, diff: number, count: number): number[] {
  // modify by jx: generate an arithmetic sequence
  const sequence: number[] = [];
  let current = start;
  for (let i = 0; i < count; i++) {
    sequence.push(current);
    current += diff;
  }
  return sequence;
}

/**
 * Generate a geometric sequence (等比数列)
 * @param start First term
 * @param ratio Common ratio
 * @param count Number of terms
 * @returns Array of numbers
 */
export function generateGeometricSequence(start: number, ratio: number, count: number): number[] {
  // modify by jx: generate a geometric sequence
  const sequence: number[] = [];
  let current = start;
  for (let i = 0; i < count; i++) {
    sequence.push(current);
    current *= ratio;
  }
  return sequence;
}

/**
 * Generate Fibonacci-like sequence (斐波那契数列)
 * @param count Number of terms
 * @param startValues First two values [a, b]
 * @returns Array of numbers
 */
export function generateFibonacciSequence(count: number, startValues: [number, number] = [1, 1]): number[] {
  // modify by jx: generate Fibonacci-like sequence
  const sequence: number[] = [...startValues];
  while (sequence.length < count) {
    const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    sequence.push(next);
  }
  return sequence.slice(0, count);
}

/**
 * Generate square sequence (平方数列)
 * @param start Starting number
 * @param count Number of terms
 * @returns Array of numbers (n², (n+1)², (n+2)², ...)
 */
export function generateSquareSequence(start: number, count: number): number[] {
  // modify by jx: generate square sequence
  const sequence: number[] = [];
  for (let i = 0; i < count; i++) {
    const n = start + i;
    sequence.push(n * n);
  }
  return sequence;
}

/**
 * Generate cube sequence (立方数列)
 * @param start Starting number
 * @param count Number of terms
 * @returns Array of numbers (n³, (n+1)³, (n+2)³, ...)
 */
export function generateCubeSequence(start: number, count: number): number[] {
  // modify by jx: generate cube sequence
  const sequence: number[] = [];
  for (let i = 0; i < count; i++) {
    const n = start + i;
    sequence.push(n * n * n);
  }
  return sequence;
}

/**
 * Calculate the next term in a sequence
 * @param sequence Array of numbers
 * @param patternType Pattern type
 * @returns Next term
 */
export function calculateNextTerm(sequence: number[], patternType: string): number {
  // modify by jx: calculate next term based on pattern type
  switch (patternType) {
    case 'arithmetic':
      return sequence[sequence.length - 1] + (sequence[1] - sequence[0]);
    case 'geometric':
      return sequence[sequence.length - 1] * (sequence[1] / sequence[0]);
    case 'fibonacci':
      return sequence[sequence.length - 1] + sequence[sequence.length - 2];
    case 'square':
      const lastIndex = Math.sqrt(sequence[sequence.length - 1]);
      return (lastIndex + 1) * (lastIndex + 1);
    case 'cube':
      const lastCubeRoot = Math.cbrt(sequence[sequence.length - 1]);
      return Math.pow(lastCubeRoot + 1, 3);
    default:
      return 0;
  }
}

/**
 * Format sequence for display
 * @param sequence Array of numbers
 * @param missingIndex Index of missing number (-1 for no missing)
 * @returns Formatted string
 */
export function formatSequence(sequence: number[], missingIndex: number = -1): string {
  // modify by jx: format sequence for display
  return sequence.map((num, index) => {
    if (index === missingIndex) {
      return '?';
    }
    return num.toString();
  }).join(', ');
}

/**
 * Validate pattern answer
 * @param studentAnswer Student's answer
 * @param correctAnswer Correct answer
 * @returns True if answer is correct
 */
export function validatePatternAnswer(studentAnswer: string, correctAnswer: number): boolean {
  // modify by jx: validate pattern answer
  const parsedAnswer = parseInt(studentAnswer.trim(), 10);
  return !isNaN(parsedAnswer) && parsedAnswer === correctAnswer;
}

/**
 * Generate random arithmetic sequence parameters
 * @param minValue Minimum value
 * @param maxValue Maximum value
 * @returns Object with start and diff
 */
export function generateArithmeticParams(minValue: number, maxValue: number): { start: number; diff: number } {
  // modify by jx: generate random arithmetic sequence parameters
  const diff = Math.floor(Math.random() * 5) + 1;
  const start = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  return { start, diff };
}

/**
 * Generate random geometric sequence parameters
 * @param _maxValue Maximum value (reserved for future use)
 * @returns Object with start and ratio
 */
// modify by jx: generate random geometric sequence parameters
export function generateGeometricParams(_maxValue: number): { start: number; ratio: number } {
  const ratio = Math.floor(Math.random() * 3) + 2; // ratio 2-4
  const start = Math.floor(Math.random() * 3) + 1; // start 1-3
  return { start, ratio };
}

/**
 * Get pattern type display name
 * @param patternType Pattern type
 * @returns Display name
 */
export function getPatternTypeDisplayName(patternType: string): string {
  // modify by jx: get pattern type display name
  const nameMap: Record<string, string> = {
    'arithmetic': '等差数列',
    'geometric': '等比数列',
    'fibonacci': '斐波那契数列',
    'square': '平方数列',
    'cube': '立方数列'
  };
  return nameMap[patternType] || patternType;
}
