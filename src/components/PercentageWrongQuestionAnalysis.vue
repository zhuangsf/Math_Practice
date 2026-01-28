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

        <!-- By Question Type -->
        <div class="stats-section">
          <h4 class="section-title">按题目类型统计</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">小数转百分数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['decimal-to-percent'] > 0 }">
                {{ stats.byQuestionType['decimal-to-percent'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">百分数转小数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['percent-to-decimal'] > 0 }">
                {{ stats.byQuestionType['percent-to-decimal'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">分数转百分数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['fraction-to-percent'] > 0 }">
                {{ stats.byQuestionType['fraction-to-percent'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">百分数转分数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['percent-to-fraction'] > 0 }">
                {{ stats.byQuestionType['percent-to-fraction'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">求百分数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['find-percent'] > 0 }">
                {{ stats.byQuestionType['find-percent'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">求部分</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['find-part'] > 0 }">
                {{ stats.byQuestionType['find-part'] }}题
              </span>
            </div>
            <div class="stat-card">
              <span class="stat-label">求总数</span>
              <span class="stat-value" :class="{ 'has-error': stats.byQuestionType['find-total'] > 0 }">
                {{ stats.byQuestionType['find-total'] }}题
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement percentage wrong question analysis component showing statistics and categorization

import type { PercentageWrongQuestionStats, PercentageWrongQuestion } from '@/types';

// Define props
defineProps<{
  stats: PercentageWrongQuestionStats | null;
  wrongQuestions: PercentageWrongQuestion[];
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
