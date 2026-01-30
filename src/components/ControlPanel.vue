<template>
  <div class="control-panel">
    <!-- Operand Count Selection -->
    <div class="control-section">
      <h3 class="section-title">运算元数量</h3>
      <el-radio-group v-model="config.operandCount" size="large">
        <el-radio-button :value="2">二元运算</el-radio-button>
        <el-radio-button :value="3">三元运算</el-radio-button>
        <el-radio-button :value="4">四元运算</el-radio-button>
        <el-radio-button value="mixed">混合模式</el-radio-button>
      </el-radio-group>
      <div v-if="config.operandCount === 'mixed'" class="mode-description">
        混合模式：随机生成二元、三元、四元运算题目
      </div>
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
        <el-checkbox-button value="add">加法</el-checkbox-button>
        <el-checkbox-button value="subtract">减法</el-checkbox-button>
        <el-checkbox-button value="multiply">乘法</el-checkbox-button>
        <el-checkbox-button value="divide">除法</el-checkbox-button>
      </el-checkbox-group>
      <div v-if="config.operations.length === 0" class="warning-text">
        请至少选择一种运算类型
      </div>
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

    <!-- Answer Mode Selection -->
    <div class="control-section">
      <h3 class="section-title">答题模式</h3>
      <el-radio-group 
        v-model="answerMode" 
        size="large"
        @change="handleAnswerModeChange"
      >
        <el-radio-button value="practice">练习模式</el-radio-button>
        <el-radio-button value="answering">答题模式</el-radio-button>
        <el-radio-button value="battle">
          <span>⚔️ 游戏模式</span>
        </el-radio-button>
      </el-radio-group>
      <div class="mode-description">
        <span v-if="answerMode === 'practice'">练习模式：仅显示题目，适合打印和导出</span>
        <span v-else-if="answerMode === 'answering'">答题模式：可在题目下方输入答案，支持在线答题</span>
        <span v-else>游戏模式：在战斗中快速驯服能量团，答得越快伤害越高！</span>
      </div>
    </div>

    <!-- Battle Settings (only visible in battle mode) -->
    <div v-if="answerMode === 'battle'" class="control-section battle-settings">
      <h3 class="section-title">⚔️ 战斗设置</h3>
      <div class="battle-settings-grid">
        <div class="setting-item">
          <span class="setting-label">能量团HP</span>
          <el-input-number 
            v-model="battleSettings.enemyHP" 
            :min="20" 
            :max="100" 
            :step="10"
            size="large" 
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">答题时间</span>
          <el-input-number 
            v-model="battleSettings.questionTime" 
            :min="5" 
            :max="20" 
            :step="1"
            size="large" 
          />
          <span class="setting-unit">秒</span>
        </div>
      </div>
      <div class="battle-preview">
        <div class="preview-item">
          <span>初始伤害：</span>
          <span class="preview-value">{{ calculateMinDamage() }}-{{ calculateMaxDamage() }}</span>
        </div>
        <div class="preview-item">
          <span>预计击败需要：</span>
          <span class="preview-value">{{ calculateExpectedQuestions() }}题</span>
        </div>
      </div>
      <div class="battle-config-info">
        <span>题目配置：{{ config.operandCount }}个运算元，{{ config.operations.join('、') }}，{{ config.questionCount }}题</span>
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
// modify by jx: implement control panel component for user configuration with battle mode navigation

import { reactive, ref, watch, computed } from 'vue';
import type { QuestionConfig, BattleSettings } from '@/types';
import { useBattleNavigation } from '@/composables/useBattleNavigation';

// Debug logging
function logDebug(...args: any[]) {
  console.log('[ControlPanel]', ...args);
}

// Define props and emits
const props = defineProps<{
  modelValue: QuestionConfig;
  showAnswers?: boolean;
  answerMode?: 'practice' | 'answering' | 'battle';
  battleSettings: BattleSettings;
  questionType?: string;      // Question type identifier (e.g., 'arithmetic', 'equation')
  questionTypeName?: string;  // Question type display name (e.g., '四则运算', '一元一次方程')
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionConfig): void;
  (e: 'update:showAnswers', value: boolean): void;
  (e: 'update:answerMode', value: 'practice' | 'answering' | 'battle'): void;
  (e: 'update:battleSettings', value: BattleSettings): void;
  (e: 'enterBattle'): void;  // Emit when entering battle mode
}>();

// Get battle navigation functions
const { enterBattleMode } = useBattleNavigation();

// Log initial props
logDebug('Initial props:', {
  showAnswers: props.showAnswers,
  answerMode: props.answerMode,
  battleSettings: props.battleSettings,
  questionType: props.questionType,
  questionTypeName: props.questionTypeName
});

const config = reactive<QuestionConfig>({ ...props.modelValue });

// Show answers state
const showAnswers = ref(props.showAnswers ?? false);

// Answer mode state
const answerMode = ref<'practice' | 'answering' | 'battle'>(props.answerMode ?? 'practice');

// Battle settings
const battleSettings = reactive<BattleSettings>({ ...props.battleSettings });

// Get question type info (from props or use defaults)
const currentQuestionType = computed(() => props.questionType || 'arithmetic');
const currentQuestionTypeName = computed(() => props.questionTypeName || '四则运算');

// Handle answer mode change
function handleAnswerModeChange(value: string) {
  const newMode = value as 'practice' | 'answering' | 'battle';
  logDebug('Answer mode changed to:', newMode);
  answerMode.value = newMode;
  emit('update:answerMode', newMode);
  
  // Enter battle mode when battle is selected
  if (newMode === 'battle') {
    enterBattleMode(
      currentQuestionType.value as any,
      currentQuestionTypeName.value,
      { ...config },
      { ...battleSettings }
    );
    emit('enterBattle');
  }
}

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
    logDebug('External modelValue changed:', newValue);
    Object.assign(config, newValue);
  },
  { deep: true }
);

// Watch for showAnswers changes and emit
watch(showAnswers, (newValue) => {
  logDebug('showAnswers changed:', newValue);
  emit('update:showAnswers', newValue);
});

// Watch for answerMode changes and emit
watch(answerMode, (newValue) => {
  logDebug('answerMode watched change:', newValue);
  emit('update:answerMode', newValue);
});

// Watch for battle settings changes and emit
watch(
  battleSettings,
  (newValue) => {
    logDebug('battleSettings changed:', newValue);
    emit('update:battleSettings', { ...newValue });
  },
  { deep: true }
);

// Calculate minimum possible damage
function calculateMinDamage(): number {
  // Minimum damage is 1 (when time is almost up)
  return 1;
}

// Calculate maximum possible damage
function calculateMaxDamage(): number {
  // Maximum damage is the question time (when answered immediately)
  return Math.floor(battleSettings.questionTime);
}

// Calculate expected number of questions to defeat enemy
function calculateExpectedQuestions(): number {
  const avgDamage = (calculateMinDamage() + calculateMaxDamage()) / 2;
  return Math.ceil(battleSettings.enemyHP / avgDamage);
}
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

.mode-description {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}

/* Battle settings styles */
.battle-settings {
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  border: 2px solid #409eff;
}

.battle-settings .section-title {
  color: #409eff;
}

.battle-settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.setting-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 8px;
}

.battle-preview {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
}

.preview-item {
  font-size: 14px;
  color: #909399;
}

.preview-value {
  font-size: 18px;
  font-weight: 700;
  color: #67c23a;
  margin-left: 8px;
}

.battle-config-info {
  margin-top: 12px;
  padding: 12px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
  font-size: 13px;
  color: #909399;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .battle-settings-grid {
    grid-template-columns: 1fr;
  }
  
  .battle-preview {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}
</style>
