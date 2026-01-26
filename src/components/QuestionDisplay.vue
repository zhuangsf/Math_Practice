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
          <span class="question-number">{{ question.index }}.</span>
          <span class="question-expression">{{ question.expression }} =</span>
          <span v-if="showAnswers" class="question-answer">{{ question.answer }}</span>
          <span v-else class="question-placeholder">?</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement question display component with 4-column layout

import { computed } from 'vue';
import type { Question } from '@/types';

// Define props
const props = defineProps<{
  questions: Question[];
  showAnswers: boolean;
}>();

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
  gap: 20px;
}

.question-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  font-size: 16px;
  line-height: 1.6;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.question-number {
  font-weight: 600;
  color: #303133;
  min-width: 40px;
}

.question-expression {
  color: #303133;
  font-weight: 500;
}

.question-answer {
  color: #67c23a;
  font-weight: 600;
}

.question-placeholder {
  color: #909399;
  font-weight: 600;
  min-width: 40px;
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
