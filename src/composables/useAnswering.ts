// Composable for handling question answering
// modify by jx: implement answering logic with answer input, validation and submission

import { ref, computed } from 'vue';
import type { Question, StudentAnswer } from '@/types';

/**
 * Composable for managing question answering state and logic
 */
export function useAnswering(questions: () => Question[]) {
  // Student answers map: questionId -> StudentAnswer
  const answers = ref<Map<string, StudentAnswer>>(new Map());
  
  // Start time for answering session
  const startTime = ref<Date | null>(null);
  
  // Whether answers have been submitted
  const isSubmitted = ref(false);

  /**
   * Initialize answers map for all questions
   */
  const initializeAnswers = () => {
    answers.value.clear();
    questions().forEach((question) => {
      answers.value.set(question.id, {
        questionId: question.id,
        answer: null,
        status: 'unanswered'
      });
    });
    isSubmitted.value = false;
    startTime.value = new Date();
  };

  /**
   * Set answer for a specific question
   * @param questionId Question ID
   * @param answer Student's answer
   */
  const setAnswer = (questionId: string, answer: number | null) => {
    const currentAnswer = answers.value.get(questionId);
    if (currentAnswer) {
      answers.value.set(questionId, {
        ...currentAnswer,
        answer: answer,
        status: answer !== null ? 'answered' : 'unanswered'
      });
    }
  };

  /**
   * Get answer for a specific question
   * @param questionId Question ID
   * @returns StudentAnswer or undefined
   */
  const getAnswer = (questionId: string): StudentAnswer | undefined => {
    return answers.value.get(questionId);
  };

  /**
   * Get all answers as array
   */
  const getAllAnswers = computed((): StudentAnswer[] => {
    return Array.from(answers.value.values());
  });

  /**
   * Check if all questions are answered
   */
  const isAllAnswered = computed((): boolean => {
    return getAllAnswers.value.every(
      (answer) => answer.answer !== null && answer.answer !== undefined
    );
  });

  /**
   * Submit all answers and check correctness
   * @returns Array of StudentAnswer with status updated
   */
  const submitAnswers = (): StudentAnswer[] => {
    if (isSubmitted.value) {
      return getAllAnswers.value;
    }

    const questionMap = new Map(questions().map((q) => [q.id, q]));
    const updatedAnswers: StudentAnswer[] = [];

    answers.value.forEach((studentAnswer, questionId) => {
      const question = questionMap.get(questionId);
      if (!question) {
        return;
      }

      const isCorrect = studentAnswer.answer === question.answer;
      const updatedAnswer: StudentAnswer = {
        ...studentAnswer,
        status: isCorrect ? 'correct' : 'wrong'
      };

      answers.value.set(questionId, updatedAnswer);
      updatedAnswers.push(updatedAnswer);
    });

    isSubmitted.value = true;
    return updatedAnswers;
  };

  /**
   * Reset all answers
   */
  const resetAnswers = () => {
    initializeAnswers();
  };

  /**
   * Clear all answers
   */
  const clearAnswers = () => {
    answers.value.clear();
    isSubmitted.value = false;
    startTime.value = null;
  };

  /**
   * Get elapsed time since start
   */
  const getElapsedTime = computed((): number => {
    if (!startTime.value) {
      return 0;
    }
    return Math.floor((new Date().getTime() - startTime.value.getTime()) / 1000);
  });

  return {
    answers,
    startTime,
    isSubmitted,
    getAllAnswers,
    isAllAnswered,
    initializeAnswers,
    setAnswer,
    getAnswer,
    submitAnswers,
    resetAnswers,
    clearAnswers,
    getElapsedTime
  };
}
