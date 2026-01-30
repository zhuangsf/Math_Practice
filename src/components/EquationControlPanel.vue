<template>
  <div class="control-panel">
    <!-- Difficulty Selection -->
    <div class="control-section">
      <h3 class="section-title">难度等级</h3>
      <el-radio-group v-model="config.difficulty" size="large">
        <el-radio-button value="easy">简单</el-radio-button>
        <el-radio-button value="medium">中等</el-radio-button>
        <el-radio-button value="hard">复杂</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Question Count -->
    <div class="control-section">
      <h3 class="section-title">题目数量</h3>
      <el-radio-group v-model="config.questionCount" size="large">
        <el-radio-button :value="20">20题</el-radio-button>
        <el-radio-button :value="50">50题</el-radio-button>
        <el-radio-button :value="100">100题</el-radio-button>
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
// modify by jx: implement control panel component for equation configuration

import { reactive, watch } from 'vue';
import type { EquationConfig } from '@/types';

// Define props and emits
const props = defineProps<{
  modelValue: EquationConfig;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: EquationConfig): void;
}>();

// Reactive config
const config = reactive<EquationConfig>({ ...props.modelValue });

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
</style>
