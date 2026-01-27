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
          <div class="question-content" :class="{ 'long-expression': isLongExpression(question) }">
            <span class="question-number">{{ question.index }}.</span>
            <span class="question-expression">{{ question.expression }} =</span>
            
            <!-- Practice Mode -->
            <template v-if="answerMode === 'practice'">
              <span v-if="showAnswers" class="question-answer">{{ question.answer }}</span>
              <span v-else class="question-placeholder">?</span>
            </template>
            
            <!-- Answering Mode -->
            <template v-else>
              <div class="answer-input-container">
                <el-input-number
                  v-model="answerValues[question.id]"
                  :min="0"
                  :precision="0"
                  :controls="false"
                  :disabled="isSubmitted"
                  :tabindex="question.index"
                  placeholder="答案"
                  class="answer-input"
                  @change="handleAnswerChange(question.id, $event)"
                  @keyup.enter="handleEnterKey"
                />
                <span v-if="getAnswerStatus(question.id) === 'correct'" class="status-icon correct-icon">✓</span>
                <span v-else-if="getAnswerStatus(question.id) === 'wrong'" class="status-icon wrong-icon">✗</span>
              </div>
            </template>
          </div>
          <div v-if="answerMode === 'answering' && isSubmitted && getAnswerStatus(question.id) === 'wrong'" class="correct-answer-hint">
            正确答案：{{ question.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement question display component with 4-column layout and answering mode support

import { computed, ref, watch } from 'vue';
import type { Question, AnswerStatus } from '@/types';

// Define props
const props = defineProps<{
  questions: Question[];
  showAnswers: boolean;
  answerMode: 'practice' | 'answering';
  studentAnswers?: Map<string, { answer: number | null; status: AnswerStatus }>;
  isSubmitted?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'answer-change', questionId: string, answer: number | null): void;
}>();

// Answer values map
const answerValues = ref<Record<string, number | null>>({});

// Initialize answer values
watch(
  () => props.questions,
  (newQuestions) => {
    if (props.answerMode === 'answering') {
      // modify by jx: clear all answer values when questions change or mode changes
      answerValues.value = {};
      newQuestions.forEach((question) => {
        answerValues.value[question.id] = null;
      });
    }
  },
  { immediate: true }
);

// Watch answerMode to clear answers when switching modes
watch(
  () => props.answerMode,
  (newMode) => {
    if (newMode === 'answering') {
      // modify by jx: clear all answer values when entering answering mode
      answerValues.value = {};
      props.questions.forEach((question) => {
        answerValues.value[question.id] = null;
      });
    } else {
      // modify by jx: clear all answer values when switching to practice mode
      answerValues.value = {};
    }
  }
);

// Watch student answers to sync with answerValues
watch(
  () => props.studentAnswers,
  (newAnswers) => {
    if (newAnswers && props.answerMode === 'answering') {
      newAnswers.forEach((answer, questionId) => {
        if (answer.answer !== null) {
          answerValues.value[questionId] = answer.answer;
        } else {
          // modify by jx: clear answer value when student answer is cleared
          answerValues.value[questionId] = null;
        }
      });
    }
  },
  { deep: true, immediate: true }
);

// Get answer status for a question
const getAnswerStatus = (questionId: string): AnswerStatus => {
  if (!props.studentAnswers) {
    return 'unanswered';
  }
  const answer = props.studentAnswers.get(questionId);
  return answer?.status || 'unanswered';
};

// Check if expression is long (4 operands or expression length > 20)
// modify by jx: detect long expressions to apply special styling
const isLongExpression = (question: Question): boolean => {
  return question.numbers.length >= 4 || question.expression.length > 20;
};

// Handle answer change
const handleAnswerChange = (questionId: string, value: number | null) => {
  answerValues.value[questionId] = value;
  emit('answer-change', questionId, value);
};

// Handle Enter key
const handleEnterKey = () => {
  // Focus next input or submit
  // This will be handled by parent component
};

// Calculate columns for display
// Distribute questions into 4 columns
const columns = computed(() => {
  const columns: Array<{ index: number } & Question>[] = [[], [], [], []];
  const total = props.questions.length;
  
  // Distribute questions column by column
  for (let i = 0; i < total; i++) {
    const colIndex = i % 4;
    columns[colIndex].push({
      ...props.questions[i],
      index: i + 1
    });
  }
  
  return columns;
});
</script>

<style scoped>
.question-display {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
}

.question-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  font-size: 14px;
  line-height: 1.4;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  transition: all 0.3s ease;
  min-width: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.question-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  width: 100%;
  min-width: 0;
}

.question-content.long-expression {
  font-size: 14px;
  align-items: center;
}

.question-content.long-expression .question-expression {
  font-size: 14px;
  line-height: 1.3;
}

.question-item.question-answered {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.question-item.question-correct {
  background: #f0f9ff;
  border: 1px solid #67c23a;
}

.question-item.question-wrong {
  background: #fef0f0;
  border: 1px solid #f56c6c;
}

.question-number {
  font-weight: 600;
  color: #409eff;
  min-width: 28px;
  flex-shrink: 0;
  margin-right: -2px;
}

.question-expression {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
  flex: 1;
  min-width: 0;
  line-height: 1.4;
}

.question-answer {
  color: #67c23a;
  font-weight: 600;
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 13px;
}

.question-placeholder {
  color: #909399;
  font-weight: 600;
  min-width: 40px;
  flex-shrink: 0;
}

.answer-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.answer-input {
  width: 65px;
  flex-shrink: 0;
}

.answer-input :deep(.el-input__inner) {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 6px;
}

.answer-input :deep(.el-input__inner::placeholder) {
  font-size: 12px;
  color: #c0c4cc;
}

.status-icon {
  font-size: 20px;
  font-weight: bold;
  min-width: 24px;
}

.correct-icon {
  color: #67c23a;
}

.wrong-icon {
  color: #f56c6c;
}

.correct-answer-hint {
  font-size: 13px;
  color: #67c23a;
  font-weight: 500;
  white-space: nowrap;
  width: 100%;
  margin-top: 2px;
}

/* Responsive design */
@media (max-width: 1200px) {
  .question-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .question-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .question-item {
    font-size: 14px;
  }
}
</style>
