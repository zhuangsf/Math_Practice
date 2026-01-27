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
          :class="{
            'question-correct': answerMode === 'answering' && getAnswerStatus(question.id) === 'correct',
            'question-wrong': answerMode === 'answering' && getAnswerStatus(question.id) === 'wrong',
            'question-answered': answerMode === 'answering' && getAnswerStatus(question.id) === 'answered'
          }"
        >
          <div class="question-content">
            <span class="question-number">{{ question.index }}.</span>
            <span class="question-expression">{{ question.expression }} =</span>
            
            <!-- Practice Mode -->
            <template v-if="answerMode === 'practice'">
              <span v-if="showAnswers" class="question-answer">{{ formatDecimal(question.answer, question.answerPrecision) }}</span>
              <span v-else class="question-placeholder">?</span>
            </template>
            
            <!-- Answering Mode -->
            <template v-else>
              <div class="answer-input-container">
                <el-input-number
                  v-model="answerValues[question.id]"
                  :precision="question.answerPrecision"
                  :step="0.1"
                  :disabled="isSubmitted"
                  :tabindex="question.index"
                  placeholder="答案"
                  class="answer-input"
                  @change="handleAnswerChange(question.id, $event)"
                />
                <span v-if="getAnswerStatus(question.id) === 'correct'" class="status-icon correct-icon">✓</span>
                <span v-else-if="getAnswerStatus(question.id) === 'wrong'" class="status-icon wrong-icon">✗</span>
              </div>
            </template>
          </div>
          <div v-if="answerMode === 'answering' && isSubmitted && getAnswerStatus(question.id) === 'wrong'" class="correct-answer-hint">
            正确答案：{{ formatDecimal(question.answer, question.answerPrecision) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement decimal question display component with 4-column layout and answering mode support

import { computed, ref, watch } from 'vue';
import type { DecimalQuestion, AnswerStatus } from '@/types';
import { formatDecimal } from '@/utils/decimalUtils';

// Define props
const props = defineProps<{
  questions: DecimalQuestion[];
  showAnswers: boolean;
  answerMode: 'practice' | 'answering';
  studentAnswers?: Map<string, { answer: number | null; status: AnswerStatus }>;
  isSubmitted?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'answer-change', questionId: string, answer: number | null): void;
}>();

// Answer values for each question
const answerValues = ref<Record<string, number | null>>({});

// Initialize answer values
watch(() => props.questions, (newQuestions) => {
  newQuestions.forEach(q => {
    if (!(q.id in answerValues.value)) {
      answerValues.value[q.id] = null;
    }
  });
}, { immediate: true });

// Get answer status for a question
const getAnswerStatus = (questionId: string): AnswerStatus => {
  if (props.studentAnswers) {
    const studentAnswer = props.studentAnswers.get(questionId);
    if (studentAnswer) {
      return studentAnswer.status;
    }
  }
  const answer = answerValues.value[questionId];
  if (answer !== null && answer !== undefined) {
    return 'answered';
  }
  return 'unanswered';
};

// Handle answer change
const handleAnswerChange = (questionId: string, value: number | null) => {
  answerValues.value[questionId] = value;
  emit('answer-change', questionId, value);
};

// Split questions into 4 columns
const columns = computed(() => {
  const cols: (DecimalQuestion & { index: number })[][] = [[], [], [], []];
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
  transition: all 0.3s;
}

.question-item.question-correct {
  background: #f0f9ff;
  border: 1px solid #67c23a;
}

.question-item.question-wrong {
  background: #fef0f0;
  border: 1px solid #f56c6c;
}

.question-item.question-answered {
  background: #f4f4f5;
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

.answer-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.answer-input {
  width: 120px;
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
