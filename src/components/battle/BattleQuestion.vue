<template>
  <div class="battle-question">
    <!-- Question display -->
    <div class="question-container">
      <div class="question-number">第 {{ questionNumber }} 题</div>
      <div class="question-expression">{{ question.expression }} = ?</div>
    </div>

    <!-- Answer input -->
    <div class="answer-container">
      <el-input-number
        v-model="answerValue"
        :min="-1000000"
        :max="1000000"
        :precision="0"
        :controls="false"
        placeholder="输入答案"
        class="answer-input"
        @keyup.enter="handleSubmit"
        @keyup.escape="handleRetreat"
        ref="answerInput"
      />
      <el-button
        type="primary"
        size="large"
        class="submit-button"
        :class="{ 'is-loading': isSubmitting }"
        @click="handleSubmit"
      >
        <span class="spinner-placeholder"></span>
        <span class="btn-text">提交答案 (Enter)</span>
      </el-button>
    </div>

    <!-- Keyboard hints -->
    <div class="keyboard-hints">
      <span class="hint">
        <kbd>Enter</kbd> 提交答案
      </span>
      <span class="hint">
        <kbd>Esc</kbd> 逃跑
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement battle question display and answer input component

import { ref, watch, onMounted, nextTick } from 'vue';
import type { Question } from '@/types';

interface Props {
  question: Question;
  questionNumber: number;
  isSubmitting?: boolean;
}

interface Emits {
  (e: 'submit', answer: number | null): void;
  (e: 'retreat'): void;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
});

const emit = defineEmits<Emits>();

// Answer value
const answerValue = ref<number | null>(null);
const answerInput = ref<HTMLInputElement | null>(null);

// Focus input on mount
onMounted(() => {
  nextTick(() => {
    answerInput.value?.focus();
  });
});

// Watch for question change to clear input
watch(() => props.question, () => {
  answerValue.value = null;
  nextTick(() => {
    answerInput.value?.focus();
  });
});

// Handle submit
function handleSubmit() {
  if (props.isSubmitting) return;
  emit('submit', answerValue.value);
}

// Handle retreat
function handleRetreat() {
  emit('retreat');
}

// Expose focus method
defineExpose({
  focus: () => answerInput.value?.focus()
});
</script>

<style scoped>
.battle-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 10px;
  min-width: 360px;
  max-width: 480px;
  width: 100%;
  box-sizing: border-box;
}

.question-container {
  text-align: center;
}

.question-number {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.question-expression {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}

.answer-container {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.answer-input {
  width: 160px;
  flex-shrink: 0;
}

.answer-input :deep(.el-input) {
  --el-input-border-radius: 12px;
}

.answer-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 4px 12px;
  transition: all 0.2s ease;
}

.answer-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.4) inset !important;
  border-color: rgba(64, 158, 255, 0.4);
}

.answer-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) inset !important;
  border-color: #409eff !important;
}

.answer-input :deep(.el-input__inner) {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  height: 36px;
  background: transparent !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
}

.answer-input :deep(.el-input__inner::placeholder) {
  color: #606266;
}

.answer-input :deep(.el-input__prefix),
.answer-input :deep(.el-input__suffix) {
  color: #909399;
}

.submit-button {
  height: 44px;
  width: 160px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  position: relative;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* Layout: spinner on left, text on right */
.submit-button .spinner-placeholder {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.submit-button .btn-text {
  flex: 1;
  text-align: center;
}

/* Hide Element Plus loading spinner */
.submit-button .el-loading-spinner {
  display: none !important;
}

/* Custom loading spinner */
.submit-button.is-loading .spinner-placeholder::before {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ffffff' d='M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zm448 192a32 32 0 0 1-32 32h-192a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zm-448-640a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zm192 320a32 32 0 0 1-32 32H288a32 32 0 0 1 0-64h416a32 32 0 0 1 32 32zm-192-192a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h416a32 32 0 0 1 32 32z'/%3E%3C/svg%3E") center/contain no-repeat;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.keyboard-hints {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #909399;
}

.hint {
  display: flex;
  align-items: center;
  gap: 6px;
}

kbd {
  display: inline-block;
  padding: 3px 6px;
  font-size: 11px;
  font-family: monospace;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .question-expression {
    font-size: 28px;
    letter-spacing: 2px;
  }

  .answer-container {
    flex-direction: column;
    width: 100%;
  }

  .answer-input {
    width: 100%;
  }

  .submit-button {
    width: 100%;
  }

  .keyboard-hints {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>
