<template>
  <div class="control-panel">
    <!-- Denominator Range -->
    <div class="control-section">
      <h3 class="section-title">分母范围</h3>
      <div class="range-inputs">
        <div class="range-input">
          <span class="label">最小值：</span>
          <el-input-number
            v-model="config.denominatorRange[0]"
            :min="2"
            :max="config.denominatorRange[1] - 1"
            :step="1"
            controls-position="right"
          />
        </div>
        <div class="range-input">
          <span class="label">最大值：</span>
          <el-input-number
            v-model="config.denominatorRange[1]"
            :min="config.denominatorRange[0] + 1"
            :max="100"
            :step="1"
            controls-position="right"
          />
        </div>
      </div>
    </div>

    <!-- Numerator Range -->
    <div class="control-section">
      <h3 class="section-title">分子范围</h3>
      <div class="range-inputs">
        <div class="range-input">
          <span class="label">最小值：</span>
          <el-input-number
            v-model="config.numeratorRange[0]"
            :min="1"
            :max="config.numeratorRange[1] - 1"
            :step="1"
            controls-position="right"
          />
        </div>
        <div class="range-input">
          <span class="label">最大值：</span>
          <el-input-number
            v-model="config.numeratorRange[1]"
            :min="config.numeratorRange[0] + 1"
            :max="100"
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

    <!-- Question Types -->
    <div class="control-section">
      <h3 class="section-title">题目类型</h3>
      <el-checkbox-group v-model="config.questionTypes" size="large">
        <el-checkbox-button label="same-denominator">同分母</el-checkbox-button>
        <el-checkbox-button label="different-denominator">异分母</el-checkbox-button>
        <el-checkbox-button label="simplify">分数化简</el-checkbox-button>
      </el-checkbox-group>
      <div v-if="config.questionTypes.length === 0" class="warning-text">
        请至少选择一种题目类型
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

    <!-- Answer Mode Selection -->
    <div class="control-section">
      <h3 class="section-title">答题模式</h3>
      <el-radio-group v-model="answerMode" size="large">
        <el-radio-button label="practice">练习模式</el-radio-button>
        <el-radio-button label="answering">答题模式</el-radio-button>
      </el-radio-group>
      <div class="mode-description">
        <span v-if="answerMode === 'practice'">练习模式：仅显示题目，适合打印和导出</span>
        <span v-else>答题模式：可在题目下方输入答案，支持在线答题</span>
      </div>
    </div>

    <!-- Show Answers Option -->
    <div class="control-section">
      <el-checkbox v-model="showAnswers" size="large" :disabled="answerMode === 'answering'">
        显示答案
      </el-checkbox>
      <div v-if="answerMode === 'answering'" class="mode-description">
        答题模式下，答案将在提交后显示
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement fraction control panel component for user configuration

import { reactive, ref, watch } from 'vue';
import type { FractionConfig, AnswerMode } from '@/types';

// Define props and emits
const props = defineProps<{
  modelValue: FractionConfig;
  showAnswers: boolean;
  answerMode: AnswerMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: FractionConfig];
  'update:showAnswers': [value: boolean];
  'update:answerMode': [value: AnswerMode];
}>();

// Local reactive config
const config = reactive<FractionConfig>({ ...props.modelValue });
const showAnswers = ref(props.showAnswers);
const answerMode = ref<AnswerMode>(props.answerMode);

// Watch for changes and emit updates
watch(() => config, (newConfig) => {
  emit('update:modelValue', { ...newConfig });
}, { deep: true });

watch(showAnswers, (newValue) => {
  emit('update:showAnswers', newValue);
});

watch(answerMode, (newValue) => {
  emit('update:answerMode', newValue);
});

// Watch for prop changes
watch(() => props.modelValue, (newConfig) => {
  Object.assign(config, newConfig);
}, { deep: true });

watch(() => props.showAnswers, (newValue) => {
  showAnswers.value = newValue;
});

watch(() => props.answerMode, (newValue) => {
  answerMode.value = newValue;
});
</script>

<style scoped>
.control-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  gap: 16px;
  align-items: center;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.warning-text {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 8px;
}

.mode-description {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}
</style>
