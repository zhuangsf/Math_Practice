// Utility functions for number generation
// modify by jx: implement random number generation utilities

/**
 * Generate a random integer between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random integer between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a pair of numbers that are divisible
 * Used for division problems to ensure no remainder
 * @param min Minimum value
 * @param max Maximum value
 * @returns A pair [dividend, divisor] where dividend is divisible by divisor
 */
export function generateDivisibleNumbers(min: number, max: number): [number, number] {
  const divisor = randomInt(2, max); // Divisor must be at least 2
  const maxQuotient = Math.floor(max / divisor);
  // modify by jx: ensure dividend is not zero by using Math.max(minQuotient, 1)
  const minQuotient = Math.max(Math.floor(min / divisor), 1); // Quotient must be at least 1 to avoid zero dividend
  const quotient = randomInt(minQuotient, maxQuotient);
  const dividend = divisor * quotient;
  
  // Ensure dividend >= divisor (as per requirement)
  if (dividend < divisor) {
    return generateDivisibleNumbers(min, max);
  }
  
  // modify by jx: ensure dividend is not zero
  if (dividend === 0) {
    return generateDivisibleNumbers(min, max);
  }
  
  return [dividend, divisor];
}

/**
 * Shuffle an array randomly
 * @param array Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate multiple random numbers
 * @param count Number of random numbers to generate
 * @param min Minimum value
 * @param max Maximum value
 * @returns Array of random numbers
 */
export function generateRandomNumbers(count: number, min: number, max: number): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < count; i++) {
    numbers.push(randomInt(min, max));
  }
  return numbers;
}
