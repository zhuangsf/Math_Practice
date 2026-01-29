// Prime and composite utilities
// modify by jx: implement prime and composite number calculation functions

/**
 * Check if a number is a prime number
 * @param num Number to check
 * @returns True if prime, false otherwise
 */
export function isPrime(num: number): boolean {
  // modify by jx: check if a number is a prime number
  if (num < 2) {
    return false;
  }
  if (num === 2) {
    return true;
  }
  if (num % 2 === 0) {
    return false;
  }
  // Check odd divisors up to sqrt(num)
  const sqrtNum = Math.sqrt(num);
  for (let i = 3; i <= sqrtNum; i += 2) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

/**
 * Check if a number is a composite number
 * @param num Number to check
 * @returns True if composite, false otherwise
 */
export function isComposite(num: number): boolean {
  // modify by jx: check if a number is a composite number
  if (num < 2) {
    return false;
  }
  return !isPrime(num);
}

/**
 * Get prime factorization of a number
 * @param num Number to factorize
 * @returns Array of prime factors
 */
export function getPrimeFactors(num: number): number[] {
  // modify by jx: get prime factorization of a number
  if (num < 2) {
    return [];
  }
  
  const factors: number[] = [];
  let n = Math.abs(num);
  
  // Factor out 2 first
  while (n % 2 === 0) {
    factors.push(2);
    n = n / 2;
  }
  
  // Factor out odd primes
  let i = 3;
  while (i * i <= n) {
    while (n % i === 0) {
      factors.push(i);
      n = n / i;
    }
    i += 2;
  }
  
  // If n is still greater than 1, it's a prime
  if (n > 1) {
    factors.push(n);
  }
  
  return factors;
}

/**
 * Get all primes in a given range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of prime numbers
 */
export function getPrimesInRange(min: number, max: number): number[] {
  // modify by jx: get all primes in a given range
  const primes: number[] = [];
  for (let num = Math.max(2, min); num <= max; num++) {
    if (isPrime(num)) {
      primes.push(num);
    }
  }
  return primes;
}

/**
 * Get all composite numbers in a given range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of composite numbers
 */
export function getCompositesInRange(min: number, max: number): number[] {
  // modify by jx: get all composite numbers in a given range
  const composites: number[] = [];
  for (let num = Math.max(4, min); num <= max; num++) {
    if (isComposite(num)) {
      composites.push(num);
    }
  }
  return composites;
}

/**
 * Validate prime/composite answer
 * @param studentAnswer Student's answer (boolean for is-prime, array for prime factors)
 * @param correctAnswer Correct answer
 * @param questionType Type of question
 * @returns True if answer is correct
 */
export function validatePrimeCompositeAnswer(
  studentAnswer: boolean | number[],
  correctAnswer: boolean | number[],
  questionType: 'is-prime' | 'is-composite' | 'prime-factors'
): boolean {
  // modify by jx: validate prime/composite answer
  if (questionType === 'is-prime' || questionType === 'is-composite') {
    return studentAnswer === correctAnswer;
  } else if (questionType === 'prime-factors') {
    if (Array.isArray(studentAnswer) && Array.isArray(correctAnswer)) {
      if (studentAnswer.length !== correctAnswer.length) {
        return false;
      }
      // Sort both arrays for comparison
      const sortedStudent = [...studentAnswer].sort((a, b) => a - b);
      const sortedCorrect = [...correctAnswer].sort((a, b) => a - b);
      return sortedStudent.every((val, idx) => val === sortedCorrect[idx]);
    }
    return false;
  }
  return false;
}

/**
 * Parse prime factors answer from string
 * @param answer Answer string (e.g., "2,3,5")
 * @returns Array of numbers
 */
export function parsePrimeFactorsAnswer(answer: string): number[] {
  // modify by jx: parse prime factors answer from string
  const cleaned = answer.trim();
  if (!cleaned) {
    throw new Error(`Invalid answer format: ${answer}`);
  }
  const parts = cleaned.split(',').map(s => parseInt(s.trim(), 10));
  if (parts.some(isNaN)) {
    throw new Error(`Invalid answer format: ${answer}`);
  }
  return parts;
}

/**
 * Format prime factors for display
 * @param factors Array of prime factors
 * @returns Formatted string
 */
export function formatPrimeFactors(factors: number[]): string {
  // modify by jx: format prime factors for display
  return factors.join(' × ');
}
