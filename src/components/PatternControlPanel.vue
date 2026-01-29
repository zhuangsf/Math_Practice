<template>
  <div class="control-panel">
    <!-- Pattern Types -->
    <div class="control-section">
      <h3 class="section-title">规律类型</h3>
      <el-checkbox-group v-model="config.patternTypes" size="large">
        <el-checkbox-button label="arithmetic">等差数列</el-checkbox-button>
        <el-checkbox-button label="geometric">等比数列</el-checkbox-button>
        <el-checkbox-button label="fibonacci">斐波那契</el-checkbox-button>
        <el-checkbox-button label="square">平方数列</el-checkbox-button>
        <el-checkbox-button label="cube">立方数列</el-checkbox-button>
      </el-checkbox-group>
      <div v-if="config.patternTypes.length === 0" class="warning-text">
        请至少选择一种规律类型
      </div>
    </div>

    <!-- Terms Count -->
    <div class="control-section">
      <h3 class="section-title">显示项数</h3>
      <el-input-number
        v-model="config.termsCount"
        :min="3"
        :max="6"
        :step="1"
        controls-position="right"
      />
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
// modify by jx: implement pattern control panel component for user configuration

import { reactive, ref, watch } from 'vue';
import type { PatternConfig, AnswerMode } from '@/types';

// Define props and emits
const props = defineProps<{
  modelValue: PatternConfig;
  showAnswers: boolean;
  answerMode: AnswerMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: PatternConfig];
  'update:showAnswers': [value: boolean];
  'update:answerMode': [value: AnswerMode];
}>();

// Local reactive config
const config = reactive<PatternConfig>({ ...props.modelValue });
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
