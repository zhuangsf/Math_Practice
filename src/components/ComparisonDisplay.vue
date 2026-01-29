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
              <span v-if="showAnswers" class="question-answer">{{ formatAnswer(question.answer) }}</span>
              <span v-else class="question-placeholder">?</span>
            </template>
            
            <!-- Answering Mode -->
            <template v-else>
              <div class="comparison-symbols">
                <el-button
                  :type="getSymbolButtonType(question.id, '<')"
                  :disabled="isSubmitted"
                  size="small"
                  @click="handleSymbolAnswer(question.id, '<')"
                >
                  &lt;
                </el-button>
                <el-button
                  :type="getSymbolButtonType(question.id, '=')"
                  :disabled="isSubmitted"
                  size="small"
                  @click="handleSymbolAnswer(question.id, '=')"
                >
                  =
                </el-button>
                <el-button
                  :type="getSymbolButtonType(question.id, '>')"
                  :disabled="isSubmitted"
                  size="small"
                  @click="handleSymbolAnswer(question.id, '>')"
                >
                  &gt;
                </el-button>
              </div>
              <span v-if="getAnswerStatus(question.id) === 'correct'" class="status-icon correct-icon">✓</span>
              <span v-else-if="getAnswerStatus(question.id) === 'wrong'" class="status-icon wrong-icon">✗</span>
            </template>
          </div>
          <div v-if="answerMode === 'answering' && isSubmitted && getAnswerStatus(question.id) === 'wrong'" class="correct-answer-hint">
            正确答案：{{ formatAnswer(question.answer) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement comparison question display component with 4-column layout and answering mode support

import { computed, ref, watch } from 'vue';
import type { ComparisonQuestion, AnswerStatus } from '@/types';
import { formatComparisonResult } from '@/utils/comparisonUtils';

// Define props
const props = defineProps<{
  questions: ComparisonQuestion[];
  showAnswers: boolean;
  answerMode: 'practice' | 'answering';
  studentAnswers?: Map<string, { answer: string | null; status: AnswerStatus }>;
  isSubmitted?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'answer-change', questionId: string, answer: string | null): void;
}>();

// Answer values for each question
const answerValues = ref<Record<string, string>>({});

// Initialize answer values
watch(() => props.questions, (newQuestions) => {
  newQuestions.forEach(q => {
    if (!(q.id in answerValues.value)) {
      answerValues.value[q.id] = '';
    }
  });
}, { immediate: true });

// Format answer for display
const formatAnswer = (answer: number): string => {
  // modify by jx: format answer for display
  return formatComparisonResult(answer);
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
  return 'unanswered';
};

// Get button type for symbol buttons
// modify by jx: fix button highlight logic - show selected state when not submitted
const getSymbolButtonType = (questionId: string, symbol: string): '' | 'success' | 'danger' | 'info' | 'warning' | 'primary' | 'default' | undefined => {
  // First, check if user has selected this symbol
  if (answerValues.value[questionId] === symbol) {
    // If submitted, check if it's correct or wrong
    if (props.isSubmitted) {
      const studentAnswer = props.studentAnswers?.get(questionId);
      if (studentAnswer) {
        if (studentAnswer.status === 'correct') {
          return 'success';
        } else if (studentAnswer.status === 'wrong') {
          return studentAnswer.answer === symbol ? 'danger' : undefined;
        }
      }
    }
    // If not submitted or not found in studentAnswers, show as selected
    return 'primary';
  }
  
  // If submitted and this symbol is not selected but is the correct answer, show success
  if (props.isSubmitted) {
    const studentAnswer = props.studentAnswers?.get(questionId);
    if (studentAnswer && studentAnswer.status === 'correct') {
      // Show the correct answer for comparison
      const question = props.questions.find(q => q.id === questionId);
      if (question) {
        const correctSymbol = formatComparisonResult(question.answer);
        if (correctSymbol === symbol) {
          return 'success';
        }
      }
    }
  }
  
  return undefined;
};

// Handle symbol answer
const handleSymbolAnswer = (questionId: string, symbol: string) => {
  answerValues.value[questionId] = symbol;
  emit('answer-change', questionId, symbol);
};

// Split questions into 4 columns
const columns = computed(() => {
  const cols: (ComparisonQuestion & { index: number })[][] = [[], [], [], []];
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

.comparison-symbols {
  display: flex;
  gap: 8px;
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
