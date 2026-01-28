<template>
  <div v-if="plan" class="tutoring-plan">
    <div class="plan-card">
      <div class="plan-header">
        <h3 class="plan-title">个性化辅导计划</h3>
      </div>
      
      <div class="plan-content">
        <!-- Suggestions -->
        <div v-if="plan.suggestions.length > 0" class="suggestions-section">
          <h4 class="section-title">学习建议</h4>
          <ul class="suggestions-list">
            <li v-for="(suggestion, index) in plan.suggestions" :key="index" class="suggestion-item">
              <span class="suggestion-icon">💡</span>
              <span class="suggestion-text">{{ suggestion }}</span>
            </li>
          </ul>
        </div>

        <!-- Recommended Configuration -->
        <div v-if="plan.recommendedConfig" class="recommendation-section">
          <h4 class="section-title">推荐练习配置</h4>
          <div class="recommended-config">
            <div v-if="plan.recommendedConfig.unitTypes" class="config-item">
              <span class="config-label">单位类型：</span>
              <span class="config-value">
                {{ formatUnitTypes(plan.recommendedConfig.unitTypes) }}
              </span>
            </div>
            <div class="config-item">
              <span class="config-label">题目数量：</span>
              <span class="config-value">{{ plan.recommendedConfig.questionCount || 20 }}题</span>
            </div>
          </div>
          <el-button
            type="primary"
            size="default"
            @click="emit('apply-recommended-config', plan.recommendedConfig)"
          >
            应用推荐配置
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement unit conversion tutoring plan component showing personalized learning suggestions

import type { UnitConversionTutoringPlan } from '@/types';

// Define props
defineProps<{
  plan: UnitConversionTutoringPlan | null;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'apply-recommended-config', config: Partial<any>): void;
}>();

// Format unit types array to display string
const formatUnitTypes = (types: ('length' | 'weight' | 'area' | 'volume' | 'time')[]): string => {
  const nameMap: Record<string, string> = {
    'length': '长度',
    'weight': '重量',
    'area': '面积',
    'volume': '体积',
    'time': '时间'
  };
  return types.map(type => nameMap[type] || type).join('、');
};
</script>

<style scoped>
.tutoring-plan {
  margin-bottom: 24px;
}

.plan-card {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.plan-header {
  margin-bottom: 20px;
}

.plan-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.plan-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.suggestions-section {
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

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.suggestion-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.recommendation-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.recommended-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-label {
  font-size: 14px;
  color: #606266;
  min-width: 100px;
}

.config-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

/* Responsive design */
@media (max-width: 768px) {
  .config-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .config-label {
    min-width: auto;
  }
}
</style>
