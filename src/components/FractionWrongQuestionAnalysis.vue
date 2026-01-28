<template>
  <div v-if="stats && stats.total > 0" class="wrong-question-analysis">
    <div class="analysis-card">
      <div class="analysis-header">
        <h3 class="analysis-title">错题分析</h3>
        <el-button
          v-if="wrongQuestions.length > 0"
          type="primary"
          size="small"
          @click="handleViewWrongQuestions"
        >
          查看错题
        </el-button>
      </div>
      
      <div class="analysis-content">
        <!-- Statistics Summary -->
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-label">错题总数：</span>
            <span class="stat-value error">{{ stats.total }}题</span>
          </div>
        </div>

        <!-- By Operation Type -->
        <div class="stats-section">
          <h4 class="section-title">按运算类型统计</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">加法</span>
              <span class="stat-value" :class="{ 'has-error': stats.byOperationType.add > 0 }">
                {{ stats.byOperationType.add }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">减法</span>
              <span class="stat-value" :class="{ 'has-error': stats.byOperationType.subtract > 0 }">
                {{ stats.byOperationType.subtract }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">乘法</span>
              <span class="stat-value" :class="{ 'has-error': stats.byOperationType.multiply > 0 }">
                {{ stats.byOperationType.multiply }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">除法</span>
              <span class="stat-value" :class="{ 'has-error': stats.byOperationType.divide > 0 }">
                {{ stats.byOperationType.divide }}题
              </span>
            </div>
          </div>
        </div>

        <!-- By Question Type -->
        <div class="stats-section">
          <h4 class="section-title">按题目类型统计</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">同分母</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['same-denominator'] > 0 }">
                {{ stats.byQuestionType['same-denominator'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">异分母</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['different-denominator'] > 0 }">
                {{ stats.byQuestionType['different-denominator'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">带分数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['mixed'] > 0 }">
                {{ stats.byQuestionType['mixed'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">分数化简</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['simplify'] > 0 }">
                {{ stats.byQuestionType['simplify'] }}题
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement fraction wrong question analysis component showing statistics and categorization

import type { FractionWrongQuestionStats, FractionWrongQuestion } from '@/types';

// Define props
defineProps<{
  stats: FractionWrongQuestionStats | null;
  wrongQuestions: FractionWrongQuestion[];
}>();

// Define emits
const emit = defineEmits<{
  (e: 'view-wrong-questions'): void;
}>();

// Handle view wrong questions
const handleViewWrongQuestions = () => {
  emit('view-wrong-questions');
};
</script>

<style scoped>
.wrong-question-analysis {
  margin-bottom: 24px;
}

.analysis-card {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analysis-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-summary {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.stat-value.error {
  color: #f56c6c;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: #e6f7ff;
}

.stat-card .stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-card .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-card .stat-value.has-error {
  color: #f56c6c;
}

/* Responsive design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .analysis-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
