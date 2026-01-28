// Factor and multiple utilities
// modify by jx: implement factor and multiple calculation functions

/**
 * Find all factors of a number
 * @param num Number
 * @returns Array of factors
 */
export function findFactors(num: number): number[] {
  // modify by jx: find all factors of a number
  const factors: number[] = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

/**
 * Find multiples of a number up to a limit
 * @param num Number
 * @param limit Maximum value
 * @param count Number of multiples to find (optional)
 * @returns Array of multiples
 */
export function findMultiples(num: number, limit: number, count?: number): number[] {
  // modify by jx: find multiples of a number up to a limit
  const multiples: number[] = [];
  let current = num;
  
  while (current <= limit) {
    multiples.push(current);
    current += num;
    
    if (count && multiples.length >= count) {
      break;
    }
  }
  
  return multiples;
}

/**
 * Calculate greatest common divisor (GCD) using Euclidean algorithm
 * @param a First number
 * @param b Second number
 * @returns GCD of a and b
 */
export function gcd(a: number, b: number): number {
  // modify by jx: calculate GCD using Euclidean algorithm
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Calculate least common multiple (LCM) of two numbers
 * @param a First number
 * @param b Second number
 * @returns LCM of a and b
 */
export function lcm(a: number, b: number): number {
  // modify by jx: calculate LCM using GCD formula: LCM(a,b) = |a*b| / GCD(a,b)
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Calculate LCM of multiple numbers
 * @param numbers Array of numbers
 * @returns LCM of all numbers
 */
export function lcmMultiple(numbers: number[]): number {
  // modify by jx: calculate LCM of multiple numbers
  if (numbers.length === 0) {
    return 1;
  }
  if (numbers.length === 1) {
    return Math.abs(numbers[0]);
  }
  
  let result = Math.abs(numbers[0]);
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, Math.abs(numbers[i]));
  }
  
  return result;
}

/**
 * Validate factor/multiple answer
 * @param studentAnswer Student's answer (number or array of numbers)
 * @param correctAnswer Correct answer (number or array of numbers)
 * @returns True if answer is correct
 */
export function validateFactorMultipleAnswer(
  studentAnswer: number | number[],
  correctAnswer: number | number[]
): boolean {
  // modify by jx: validate factor/multiple answer
  if (Array.isArray(studentAnswer) && Array.isArray(correctAnswer)) {
    if (studentAnswer.length !== correctAnswer.length) {
      return false;
    }
    // Sort both arrays for comparison
    const sortedStudent = [...studentAnswer].sort((a, b) => a - b);
    const sortedCorrect = [...correctAnswer].sort((a, b) => a - b);
    return sortedStudent.every((val, idx) => val === sortedCorrect[idx]);
  } else if (typeof studentAnswer === 'number' && typeof correctAnswer === 'number') {
    return studentAnswer === correctAnswer;
  }
  return false;
}

/**
 * Parse factor/multiple answer from string
 * @param answer Answer string (e.g., "1,2,3" or "6")
 * @returns Number or array of numbers
 */
export function parseFactorMultipleAnswer(answer: string): number | number[] {
  // modify by jx: parse factor/multiple answer from string
  const cleaned = answer.trim();
  if (cleaned.includes(',')) {
    // Multiple values
    const parts = cleaned.split(',').map(s => parseInt(s.trim(), 10));
    if (parts.some(isNaN)) {
      throw new Error(`Invalid answer format: ${answer}`);
    }
    return parts;
  } else {
    // Single value
    const num = parseInt(cleaned, 10);
    if (isNaN(num)) {
      throw new Error(`Invalid answer format: ${answer}`);
    }
    return num;
  }
}
