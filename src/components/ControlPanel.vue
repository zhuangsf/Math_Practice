<template>
  <div class="control-panel">
    <!-- Operand Count Selection -->
    <div class="control-section">
      <h3 class="section-title">运算元数量</h3>
      <el-radio-group v-model="config.operandCount" size="large">
        <el-radio-button :label="2">二元运算</el-radio-button>
        <el-radio-button :label="3">三元运算</el-radio-button>
        <el-radio-button :label="4">四元运算</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Number Range -->
    <div class="control-section">
      <h3 class="section-title">数值范围</h3>
      <div class="range-inputs">
        <div class="range-input">
          <span class="label">最小值：</span>
          <el-input-number
            v-model="config.minValue"
            :min="0"
            :max="config.maxValue - 1"
            :step="1"
            controls-position="right"
          />
        </div>
        <div class="range-input">
          <span class="label">最大值：</span>
          <el-input-number
            v-model="config.maxValue"
            :min="config.minValue + 1"
            :max="10000"
            :step="1"
            controls-position="right"
          />
        </div>
      </div>
    </div>

    <!-- Operation Types -->
    <div class="control-section">
      <h3 class="section-title">运算类型</h3>
      <el-checkbox-group v-model="config.operations" size="large">
        <el-checkbox-button label="add">加法</el-checkbox-button>
        <el-checkbox-button label="subtract">减法</el-checkbox-button>
        <el-checkbox-button label="multiply">乘法</el-checkbox-button>
        <el-checkbox-button label="divide">除法</el-checkbox-button>
      </el-checkbox-group>
      <div v-if="config.operations.length === 0" class="warning-text">
        请至少选择一种运算类型
      </div>
    </div>

    <!-- Question Count -->
    <div class="control-section">
      <h3 class="section-title">题目数量</h3>
      <el-radio-group v-model="config.questionCount" size="large">
        <el-radio-button :label="20">20题</el-radio-button>
        <el-radio-button :label="50">50题</el-radio-button>
        <el-radio-button :label="100">100题</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Show Answers Option -->
    <div class="control-section">
      <el-checkbox v-model="showAnswers" size="large">
        显示答案
      </el-checkbox>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement control panel component for user configuration

import { reactive, watch } from 'vue';
import type { QuestionConfig } from '@/types';

// Define props and emits
const props = defineProps<{
  modelValue: QuestionConfig;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionConfig): void;
}>();

// Reactive config
const config = reactive<QuestionConfig>({ ...props.modelValue });

// Watch for changes and emit
watch(
  () => config,
  (newValue) => {
    emit('update:modelValue', { ...newValue });
  },
  { deep: true }
);

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(config, newValue);
  },
  { deep: true }
);

// Show answers state
const showAnswers = defineModel<boolean>('showAnswers');
</script>

<style scoped>
.control-panel {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-section {
  margin-bottom: 24px;
}

.control-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.range-inputs {
  display: flex;
  gap: 24px;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: #606266;
}

.warning-text {
  margin-top: 8px;
  font-size: 14px;
  color: #f56c6c;
}
</style>
