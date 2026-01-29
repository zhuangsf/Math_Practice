<template>
  <div class="question-display">
    <div v-if="questions.length === 0" class="empty-state">
      <el-empty description="请生成题目"></el-empty>
    </div>
    <div v-else class="question-grid">
      <div
        v-for="(column, colIndex) in columns"
        :key="colIndex"
        class="question-column"
      >
        <div
          v-for="question in column"
          :key="question.id"
          class="question-item"
        >
          <div class="question-content">
            <span class="question-number">{{ question.index }}.</span>
            <span class="question-expression">{{ question.expression }}</span>
            
            <!-- Practice Mode -->
            <template v-if="answerMode === 'practice'">
              <span v-if="showAnswers" class="question-answer">{{ formatAnswer(question) }}</span>
              <span v-else class="question-placeholder">?</span>
            </template>
            
            <!-- Answering Mode -->
            <template v-else>
              <!-- is-prime/is-composite questions with yes/no buttons -->
              <template v-if="question.questionType === 'is-prime' || question.questionType === 'is-composite'">
                <div class="yes-no-buttons">
                  <el-button
                    :type="getButtonType(question.id, true)"
                    :disabled="isSubmitted"
                    size="small"
                    @click="handleBooleanAnswer(question.id, true)"
                  >
                    是
                  </el-button>
                  <el-button
                    :type="getButtonType(question.id, false)"
                    :disabled="isSubmitted"
                    size="small"
                    @click="handleBooleanAnswer(question.id, false)"
                  >
                    否
                  </el-button>
                </div>
                <span v-if="getAnswerStatus(question.id) === 'correct'" class="status-icon correct-icon">✓</span>
                <span v-else-if="getAnswerStatus(question.id) === 'wrong'" class="status-icon wrong-icon">✗</span>
              </template>
              
              <!-- prime-factors questions with input -->
              <template v-else-if="question.questionType === 'prime-factors'">
                <div class="answer-input-container">
                  <el-input
                    v-model="answerValues[question.id]"
                    :disabled="isSubmitted"
                    :tabindex="question.index"
                    placeholder="如：2,3,5"
                    class="answer-input"
                    @change="handleAnswerChange(question.id, $event)"
                  />
                  <span v-if="getAnswerStatus(question.id) === 'correct'" class="status-icon correct-icon">✓</span>
                  <span v-else-if="getAnswerStatus(question.id) === 'wrong'" class="status-icon wrong-icon">✗</span>
                </div>
              </template>
            </template>
          </div>
          <div v-if="answerMode === 'answering' && isSubmitted && getAnswerStatus(question.id) === 'wrong'" class="correct-answer-hint">
            正确答案：{{ formatAnswer(question) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement prime composite question display component with 4-column layout and answering mode support

import { computed, ref, watch } from 'vue';
import type { PrimeCompositeQuestion, AnswerStatus } from '@/types';
import { formatPrimeFactors } from '@/utils/primeCompositeUtils';

// Define props
const props = defineProps<{
  questions: PrimeCompositeQuestion[];
  showAnswers: boolean;
  answerMode: 'practice' | 'answering';
  studentAnswers?: Map<string, { answer: boolean | number[] | string | null; status: AnswerStatus }>;
  isSubmitted?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'answer-change', questionId: string, answer: boolean | number[] | string | null): void;
}>();

// Answer values for each question
const answerValues = ref<Record<string, string>>({});
const booleanAnswers = ref<Record<string, boolean>>({});

// Initialize answer values
watch(() => props.questions, (newQuestions) => {
  newQuestions.forEach(q => {
    if (!(q.id in answerValues.value)) {
      answerValues.value[q.id] = '';
    }
    if (!(q.id in booleanAnswers.value)) {
      booleanAnswers.value[q.id] = false as any;
    }
  });
}, { immediate: true });

// Format answer for display
const formatAnswer = (question: PrimeCompositeQuestion): string => {
  // modify by jx: format answer for display
  if (question.questionType === 'is-prime') {
    return (question.answer as boolean) ? '是质数' : '不是质数';
  } else if (question.questionType === 'is-composite') {
    return (question.answer as boolean) ? '是合数' : '不是合数';
  } else if (question.questionType === 'prime-factors') {
    return formatPrimeFactors(question.answer as number[]);
  }
  return '';
};

// Get answer status for a question
const getAnswerStatus = (questionId: string): AnswerStatus => {
  if (props.studentAnswers) {
    const studentAnswer = props.studentAnswers.get(questionId);
    if (studentAnswer) {
      return studentAnswer.status;
    }
  }
  const answer = answerValues.value[questionId];
  if (answer && answer.trim()) {
    return 'answered';
  }
  if (booleanAnswers.value[questionId] !== undefined) {
    return 'answered';
  }
  return 'unanswered';
};

// Get button type for yes/no buttons
const getButtonType = (questionId: string, value: boolean): '' | 'success' | 'danger' | 'info' | 'warning' | 'primary' | 'default' | undefined => {
  // modify by jx: get button type with immediate visual feedback and submission state handling
  const isSelected = booleanAnswers.value[questionId] === value;
  
  // If not submitted, show primary for selected button
  if (!props.isSubmitted) {
    return isSelected ? 'primary' : undefined;
  }
  
  // If submitted, check against correct answer
  const studentAnswer = props.studentAnswers?.get(questionId);
  if (studentAnswer && typeof studentAnswer.answer === 'boolean') {
    if (studentAnswer.status === 'correct') {
      return 'success';
    } else if (studentAnswer.status === 'wrong') {
      // Show danger for wrong answer, highlight selected button if it was wrong
      return isSelected ? 'danger' : undefined;
    }
  }
  
  // Default state
  return isSelected ? 'primary' : undefined;
};

// Handle boolean answer (yes/no)
const handleBooleanAnswer = (questionId: string, value: boolean) => {
  booleanAnswers.value[questionId] = value;
  emit('answer-change', questionId, value);
};

// Handle answer change
const handleAnswerChange = (questionId: string, value: string) => {
  answerValues.value[questionId] = value;
  emit('answer-change', questionId, value || null);
};

// Split questions into 4 columns
const columns = computed(() => {
  const cols: (PrimeCompositeQuestion & { index: number })[][] = [[], [], [], []];
  props.questions.forEach((question, index) => {
    const colIndex = index % 4;
    cols[colIndex].push({ ...question, index: index + 1 });
  });
  return cols;
});
</script>

<style scoped>
.question-display {
  margin-top: 24px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.question-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.question-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.question-number {
  font-weight: 600;
  color: #409eff;
  min-width: 24px;
}

.question-expression {
  font-size: 16px;
  color: #303133;
}

.question-answer {
  font-weight: 600;
  color: #67c23a;
}

.question-placeholder {
  color: #909399;
  font-weight: 600;
}

.yes-no-buttons {
  display: flex;
  gap: 8px;
}

.answer-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-input {
  width: 150px;
}

.status-icon {
  font-size: 20px;
  font-weight: bold;
}

.correct-icon {
  color: #67c23a;
}

.wrong-icon {
  color: #f56c6c;
}

.correct-answer-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #67c23a;
}

@media (max-width: 1200px) {
  .question-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .question-grid {
    grid-template-columns: 1fr;
  }
}
</style>
