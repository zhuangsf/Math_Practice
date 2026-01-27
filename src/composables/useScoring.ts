// Composable for calculating scores and grades
// modify by jx: implement scoring logic with score calculation, grade evaluation and statistics

import type { StudentAnswer, ScoreResult } from '@/types';

/**
 * Calculate score result from student answers
 * @param answers Array of student answers
 * @param timeSpent Total time spent in seconds
 * @returns ScoreResult object
 */
export function calculateScore(
  answers: StudentAnswer[],
  timeSpent: number
): ScoreResult {
  const total = answers.length;
  const correct = answers.filter((answer) => answer.status === 'correct').length;
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  const averageTime = total > 0 ? timeSpent / total : 0;

  // Determine grade level
  let grade: ScoreResult['grade'];
  if (percentage >= 90) {
    grade = 'excellent';
  } else if (percentage >= 80) {
    grade = 'good';
  } else if (percentage >= 60) {
    grade = 'pass';
  } else {
    grade = 'need-improvement';
  }

  return {
    correct,
    total,
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    grade,
    timeSpent,
    averageTime: Math.round(averageTime * 10) / 10
  };
}

/**
 * Format time in seconds to readable string
 * @param seconds Time in seconds
 * @returns Formatted time string (e.g., "15分30秒" or "15:30")
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
}

/**
 * Format time in seconds to MM:SS format
 * @param seconds Time in seconds
 * @returns Formatted time string (e.g., "15:30")
 */
export function formatTimeMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get grade display text and color
 * @param grade Grade level
 * @returns Object with text, color and icon
 */
export function getGradeDisplay(grade: ScoreResult['grade']): {
  text: string;
  color: string;
  icon: string;
} {
  const gradeMap = {
    excellent: {
      text: '优秀',
      color: '#67c23a',
      icon: '⭐'
    },
    good: {
      text: '良好',
      color: '#409eff',
      icon: '👍'
    },
    pass: {
      text: '及格',
      color: '#e6a23c',
      icon: '✓'
    },
    'need-improvement': {
      text: '需努力',
      color: '#f56c6c',
      icon: '💪'
    }
  };

  return gradeMap[grade];
}

/**
 * Composable for scoring functionality
 */
export function useScoring() {
  return {
    calculateScore,
    formatTime,
    formatTimeMMSS,
    getGradeDisplay
  };
}
