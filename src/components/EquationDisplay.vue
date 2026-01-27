<template>
  <div class="equation-display">
    <div v-if="equations.length === 0" class="empty-state">
      <el-empty description="请生成题目"></el-empty>
    </div>
    <div v-else class="equation-grid">
      <div
        v-for="(column, colIndex) in columns"
        :key="colIndex"
        class="equation-column"
      >
        <div
          v-for="equation in column"
          :key="equation.id"
          class="equation-item"
        >
          <div class="equation-row">
            <span class="equation-number">{{ equation.index }}.</span>
            <span class="equation-expression">{{ equation.equation }}</span>
          </div>
          <div class="equation-row">
            <span v-if="showAnswers" class="equation-answer">x = {{ equation.answer }}</span>
            <span v-else class="equation-placeholder">x = ?</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement equation display component with 4-column layout, x=? always displayed on second line

import { computed } from 'vue';
import type { EquationQuestion } from '@/types';

// Define props
const props = defineProps<{
  equations: EquationQuestion[];
  showAnswers: boolean;
}>();

// Calculate columns for display
// Distribute equations into 4 columns
const columns = computed(() => {
  const columns: Array<{ index: number } & EquationQuestion>[] = [[], [], [], []];
  const total = props.equations.length;
  
  // Distribute equations column by column
  for (let i = 0; i < total; i++) {
    const colIndex = i % 4;
    columns[colIndex].push({
      ...props.equations[i],
      index: i + 1
    });
  }
  
  return columns;
});
</script>

<style scoped>
.equation-display {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.equation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.equation-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.equation-item {
  font-size: 16px;
  line-height: 1.6;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equation-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.equation-number {
  font-weight: 600;
  color: #303133;
  min-width: 40px;
}

.equation-expression {
  color: #303133;
  font-weight: 500;
  font-family: 'Courier New', monospace;
}

.equation-answer {
  color: #67c23a;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.equation-placeholder {
  color: #909399;
  font-weight: 600;
  min-width: 60px;
  font-family: 'Courier New', monospace;
}

/* Responsive design */
@media (max-width: 1200px) {
  .equation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .equation-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .equation-item {
    font-size: 14px;
  }
}
</style>
