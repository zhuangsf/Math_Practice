<template>
  <div v-if="score" class="score-display">
    <div class="score-card">
      <div class="score-header">
        <h3 class="score-title">答题结果</h3>
      </div>
      <div class="score-content">
        <div class="score-main">
          <div class="score-value">
            <span class="score-number">{{ score.correct }}</span>
            <span class="score-divider">/</span>
            <span class="score-total">{{ score.total }}</span>
          </div>
          <div class="score-percentage" :style="{ color: gradeDisplay.color }">
            {{ score.percentage }}%
          </div>
          <div class="score-grade" :style="{ color: gradeDisplay.color }">
            <span class="grade-icon">{{ gradeDisplay.icon }}</span>
            <span class="grade-text">{{ gradeDisplay.text }}</span>
          </div>
        </div>
        <div class="score-stats">
          <div class="stat-item">
            <span class="stat-label">答题用时：</span>
            <span class="stat-value">{{ formattedTime }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均每题：</span>
            <span class="stat-value">{{ formattedAverageTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement score display component showing score result with grade and statistics

import { computed } from 'vue';
import type { ScoreResult } from '@/types';
import { formatTime, getGradeDisplay } from '@/composables/useScoring';

// Define props
const props = defineProps<{
  score: ScoreResult | null;
}>();

// Get grade display info
const gradeDisplay = computed(() => {
  if (!props.score) {
    return { text: '', color: '#303133', icon: '' };
  }
  return getGradeDisplay(props.score.grade);
});

// Format time
const formattedTime = computed(() => {
  if (!props.score) {
    return '0秒';
  }
  return formatTime(props.score.timeSpent);
});

// Format average time
const formattedAverageTime = computed(() => {
  if (!props.score) {
    return '0秒';
  }
  return `${formatTime(Math.round(props.score.averageTime))}/题`;
});
</script>

<style scoped>
.score-display {
  margin-bottom: 24px;
}

.score-card {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-header {
  margin-bottom: 20px;
}

.score-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.score-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.score-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #303133;
}

.score-divider {
  font-size: 32px;
  font-weight: 600;
  color: #909399;
}

.score-total {
  font-size: 32px;
  font-weight: 600;
  color: #909399;
}

.score-percentage {
  font-size: 24px;
  font-weight: 600;
}

.score-grade {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.grade-icon {
  font-size: 24px;
}

.grade-text {
  font-weight: 600;
}

.score-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* Responsive design */
@media (max-width: 768px) {
  .score-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .score-number {
    font-size: 36px;
  }
  
  .score-total {
    font-size: 24px;
  }
}
</style>
