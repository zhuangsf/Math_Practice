<template>
  <div class="battle-page" @keydown.escape="handleEscapeKey">
    <!-- Retreat Confirmation Dialog -->
    <el-dialog
      v-model="showRetreatDialog"
      title="确认撤退"
      width="400px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="retreat-dialog-content">
        <el-icon class="warning-icon"><Warning /></el-icon>
        <p>确定要撤退吗？</p>
        <p class="retreat-hint">撤退后将会返回练习页面</p>
      </div>
      <template #footer>
        <el-button @click="showRetreatDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmRetreat">确认撤退</el-button>
      </template>
    </el-dialog>

    <!-- Battle Result Dialog: only render when record and result exist to avoid null prop warning -->
    <BattleResult
      v-if="battleRecord && battleResult"
      v-model="showBattleResult"
      :record="battleRecord"
      :result="battleResult"
      @rematch="handleRematch"
      @return="handleReturnFromBattle"
    />

    <!-- Main Battle Container -->
    <div class="battle-container">
      <!-- Battle Header -->
      <div class="battle-header">
        <div class="battle-title">
          <span class="title-icon">⚔️</span>
          <span class="title-text">征服四则运算</span>
        </div>
        <div class="battle-status">
          <span v-if="battleState.phase === 'preparing'" class="status-preparing">
            准备中... {{ battleState.timeRemaining }}秒
          </span>
          <span v-else-if="battleState.phase === 'answering'" class="status-fighting">
            战斗中
          </span>
          <span v-else-if="battleState.phase === 'ended'" class="status-ended">
            战斗结束
          </span>
          <span v-else class="status-idle">
            待命中
          </span>
        </div>
      </div>

      <!-- Battle Start Screen (when idle) -->
      <div v-if="battleState.phase === 'idle'" class="battle-start-screen">
        <div class="start-content">
          <div class="energy-ball-preview">
            <div class="energy-core"></div>
            <div class="energy-ring"></div>
            <div class="energy-ring delay-1"></div>
            <div class="energy-ring delay-2"></div>
          </div>
          
          <h2 class="start-title">⚡ 准备驯服能量团 ⚡</h2>
          
          <div class="battle-preview-info">
            <div class="preview-item">
              <span class="label">能量团HP</span>
              <span class="value">{{ battleConfig.enemyHP }}</span>
            </div>
            <div class="preview-item">
              <span class="label">答题时间</span>
              <span class="value">{{ battleConfig.questionTime }}秒</span>
            </div>
            <div class="preview-item">
              <span class="label">题目数量</span>
              <span class="value">{{ battleConfig.questionCount }}题</span>
            </div>
          </div>
          
          <p class="start-hint">快速解答题目来驯服能量团！</p>
          
          <el-button 
            type="primary" 
            size="large" 
            class="start-button"
            @click="handleStartBattle"
          >
            ⚔️ 开始战斗
          </el-button>
        </div>
      </div>

      <!-- Active Battle Screen: left arena + right battle log; modify by jx: add right-side battle info panel -->
      <div v-else class="battle-active-screen">
        <div class="battle-active-main">
          <!-- Battle HUD -->
          <BattleHUD
            :state="battleState"
            :player-max-hp="battleConfig.playerHP"
            :enemy-max-hp="battleConfig.enemyHP"
            :total-questions="battleConfig.questionCount"
          />

          <!-- Battle Arena -->
          <div class="battle-arena">
          <!-- Enemy (Energy Ball) -->
          <BattleEnemy
            :key="hitAnimationKey"
            :hp="battleState.enemyHP"
            :max-hp="battleConfig.enemyHP"
            :attack="battleState.enemyAttack"
            :last-damage="battleState.lastDamage ?? 0"
            :is-hit="isEnemyHit"
            :is-attacking="isEnemyAttacking"
            :shake-enabled="shakeEnabled"
            @hit-animation-end="handleHitAnimationEnd"
            @attack-animation-end="isEnemyAttacking = false"
          />

          <!-- Timer -->
          <BattleTimer
            :time-remaining="battleState.timeRemaining"
            :max-time="battleConfig.questionTime"
          />

          <!-- Question -->
          <BattleQuestion
            v-if="battleState.currentQuestion"
            :question="battleState.currentQuestion"
            :question-number="battleState.questionCount + 1"
            :is-submitting="isSubmittingAnswer"
            @submit="handleBattleAnswer"
            @retreat="handleRetreat"
            ref="battleQuestionRef"
          />

          <!-- Battle Stats -->
          <div class="battle-stats">
            <span>总伤害: <strong>{{ battleState.totalDamage.toFixed(1) }}</strong></span>
            <span>正确: <strong>{{ battleState.correctCount }}</strong></span>
            <span v-if="battleState.combo > 1" class="combo-display">
              🔥 {{ battleState.combo }} 连击
            </span>
          </div>
          </div>
        </div>

        <!-- Right: Battle Log Panel -->
        <aside class="battle-log-panel">
          <div class="battle-log-title">战斗信息</div>
          <div class="battle-log-list" ref="battleLogListRef">
            <div
              v-for="entry in battleState.battleLog"
              :key="entry.id"
              class="battle-log-entry"
              :class="`log-${entry.type}`"
            >
              <span class="log-message">{{ entry.message }}</span>
            </div>
            <div v-if="battleState.battleLog.length === 0" class="battle-log-empty">
              暂无战斗记录
            </div>
          </div>
        </aside>
      </div>

      <!-- ESC Hint (always visible during battle) -->
      <div v-if="battleState.phase !== 'idle' && battleState.phase !== 'ended'" class="esc-hint">
        按 <kbd>Esc</kbd> 撤退
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement immersive battle page component with full-screen layout
// Terminology: 征服四则运算=page title (title-text, document.title). 征服者/能量团 see README 战斗模式术语.

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';
import BattleHUD from '@/components/battle/BattleHUD.vue';
import BattleEnemy from '@/components/battle/BattleEnemy.vue';
import BattleTimer from '@/components/battle/BattleTimer.vue';
import BattleQuestion from '@/components/battle/BattleQuestion.vue';
import BattleResult from '@/components/battle/BattleResult.vue';
import { useBattleEngine } from '@/composables/useBattleEngine';
import { useBattleNavigation } from '@/composables/useBattleNavigation';
import { useQuestionGenerator } from '@/composables/useQuestionGenerator';
import { useGameSettings } from '@/composables/useGameSettings';
import type { BattleRecord, BattleResult as BattleResultType } from '@/types';

// Get battle navigation state
const {
  currentQuestionType,
  currentQuestionTypeName,
  questionConfig,
  battleConfig,
  exitBattleMode
} = useBattleNavigation();

// Use question generator
const { generateQuestions } = useQuestionGenerator();

// Battle state
const battleEngine = ref<ReturnType<typeof useBattleEngine> | null>(null);
const battleRecord = ref<BattleRecord | null>(null);
const battleResult = ref<BattleResultType>(null);
const showBattleResult = ref(false);
const isEnemyHit = ref(false);
const isEnemyAttacking = ref(false);
const isSubmittingAnswer = ref(false);
const showRetreatDialog = ref(false);
const battleQuestionRef = ref<InstanceType<typeof BattleQuestion> | null>(null);
const hitAnimationKey = ref(0);  // modify by jx: use unique key for each hit animation
const battleLogListRef = ref<HTMLElement | null>(null);  // modify by jx: ref for auto-scroll battle log

// Get game settings - keep ref structure for proper reactivity
// modify by jx: fix destructuring issue that causes undefined error
const gameSettingsRef = useGameSettings();
const shakeEnabled = computed(() => gameSettingsRef.value?.shakeEnabled ?? false);  // modify by jx: default off to disable energy orb shake after starting battle

// Get battle state from engine
const battleState = computed(() => {
  if (battleEngine.value?.state) {
    return battleEngine.value.state;
  }
  // Default idle state; modify by jx: include battleLog for right panel
  return {
    phase: 'idle' as const,
    playerHP: battleConfig.value.playerHP,
    enemyHP: battleConfig.value.enemyHP,
    enemyAttack: battleConfig.value.enemyBaseAttack,
    currentQuestion: null,
    timeRemaining: 0,
    battleResult: null,
    questionCount: 0,
    correctCount: 0,
    combo: 0,
    maxCombo: 0,
    totalDamage: 0,
    isRetreated: false,
    battleLog: []
  };
});

// modify by jx: auto-scroll battle log to bottom when new entry is added
watch(
  () => battleState.value.battleLog.length,
  () => {
    nextTick(() => {
      const el = battleLogListRef.value;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
);

// modify by jx: when engine ends with defeat (e.g. player HP<=0 from enemy attack timer), show result dialog immediately
watch(
  () => ({ phase: battleState.value.phase, battleResult: battleState.value.battleResult }),
  ({ phase, battleResult: result }) => {
    if (phase !== 'ended' || result !== 'defeat') return;
    if (showBattleResult.value) return;
    if (!battleEngine.value) return;
    battleRecord.value = battleEngine.value.getBattleRecord();
    battleResult.value = 'defeat';
    showBattleResult.value = true;
  },
  { flush: 'sync' }
);

// Question type name for display
const questionTypeName = computed(() => currentQuestionTypeName.value || '四则运算');

// Initialize battle engine
function initBattleEngine() {
  const config = questionConfig.value;
  if (!config) {
    ElMessage.error('未找到题目配置');
    return;
  }

  const engine = useBattleEngine(
    battleConfig.value,
    currentQuestionType.value || 'arithmetic',
    questionTypeName.value,
    () => {
      // Create a mutable config object with mutable operations array
      const mutableConfig = {
        ...config,
        operations: [...config.operations] as any,  // Convert to mutable array
        questionCount: 1
      };
      const generated = generateQuestions(mutableConfig);
      return generated.length > 0 ? generated : [];
    }
  );
  
  battleEngine.value = engine;
}

// Start battle
function handleStartBattle() {
  initBattleEngine();
  if (battleEngine.value) {
    battleEngine.value.initializeBattle();
    battleEngine.value.startPrepareTimer();
    ElMessage.info('准备进入战斗！');
  }
}

// Handle battle answer submission
// modify by jx: save expected answer BEFORE submitAnswer (it advances currentQuestion); do NOT increment hitAnimationKey on correct (would destroy BattleEnemy and skip shake)
function handleBattleAnswer(answer: number | null) {
  if (!battleEngine.value || isSubmittingAnswer.value) return;

  const expectedAnswer = battleEngine.value.state.currentQuestion?.answer ?? null;
  const isCorrect = answer !== null && answer === expectedAnswer;

  isSubmittingAnswer.value = true;
  const result = battleEngine.value.submitAnswer(answer);

  if (result && battleEngine.value.state.enemyHP <= 0) {
    // Victory - trigger hit then show result
    isEnemyHit.value = false;
    nextTick(() => {
      isEnemyHit.value = true;
    });
    setTimeout(() => {
      isSubmittingAnswer.value = false;
      showBattleResult.value = true;
      battleRecord.value = battleEngine.value?.getBattleRecord() || null;
      battleResult.value = 'victory';
    }, 500);
  } else if (battleEngine.value.state.playerHP <= 0) {
    isSubmittingAnswer.value = false;
    showBattleResult.value = true;
    battleRecord.value = battleEngine.value?.getBattleRecord() || null;
    battleResult.value = 'defeat';
  } else {
    // Continue - trigger energy orb shake on correct (same instance, no key change)
    if (isCorrect) {
      isEnemyHit.value = false;
      nextTick(() => {
        isEnemyHit.value = true;
      });
    }
    setTimeout(() => {
      isEnemyHit.value = false;
      isSubmittingAnswer.value = false;
      nextTick(() => {
        battleQuestionRef.value?.focus();
      });
    }, 400);
  }
}

// modify by jx: handle hit animation end - reset state for next animation
function handleHitAnimationEnd() {
  console.log('[BattlePage][SHAKE_DEBUG] handleHitAnimationEnd', { isEnemyHitBefore: isEnemyHit.value, hitAnimationKey: hitAnimationKey.value, ts: Date.now() });
  isEnemyHit.value = false;
}

// Handle retreat request
function handleRetreat() {
  showRetreatDialog.value = true;
}

// Handle escape key press
function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    const phase = battleState.value.phase;
    if (phase === 'idle' || phase === 'ended') {
      // Just return without dialog
      exitBattleMode();
    } else {
      // Show retreat confirmation dialog (phase is 'preparing' or 'answering')
      showRetreatDialog.value = true;
    }
  }
}

// Confirm retreat
function confirmRetreat() {
  showRetreatDialog.value = false;
  
  if (battleEngine.value) {
    battleRecord.value = battleEngine.value.retreat();
    battleResult.value = 'retreat';
    showBattleResult.value = true;
  } else {
    exitBattleMode();
  }
}

// Handle rematch
function handleRematch() {
  if (!battleEngine.value) return;
  battleEngine.value.resetBattle();
  battleEngine.value.startPrepareTimer();
  showBattleResult.value = false;
}

// Handle return from battle (after result dialog)
function handleReturnFromBattle() {
  showBattleResult.value = false;
  exitBattleMode();
}

// Handle global keydown
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleEscapeKey(event);
  }
}

// modify by jx: set page title when entering battle, restore when leaving
const defaultDocumentTitle = '小学数学四则运算出题工具';

// Lifecycle hooks
onMounted(() => {
  document.title = '征服四则运算';
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.title = defaultDocumentTitle;
  window.removeEventListener('keydown', handleKeydown);
  if (battleEngine.value) {
    battleEngine.value.clearAllTimers();
  }
});
</script>

<style scoped>
.battle-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  z-index: 9999;
  overflow: hidden;
}

.battle-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Battle Header */
.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.battle-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.title-text {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.battle-status {
  font-size: 16px;
  font-weight: 600;
}

.status-preparing {
  color: #e6a23c;
}

.status-fighting {
  color: #67c23a;
  animation: pulse 1s infinite;
}

.status-ended {
  color: #909399;
}

.status-idle {
  color: #409eff;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Battle Start Screen */
.battle-start-screen {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.start-content {
  text-align: center;
  padding: 60px;
}

/* Energy Ball Preview */
.energy-ball-preview {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 40px;
}

.energy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #67c23a 0%, #409eff 50%, #1a1a2e 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(103, 194, 58, 0.6),
              0 0 80px rgba(64, 158, 255, 0.4),
              inset 0 0 30px rgba(255, 255, 255, 0.3);
  animation: core-glow 2s ease-in-out infinite;
}

.energy-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 2px solid rgba(103, 194, 58, 0.5);
  border-radius: 50%;
  animation: ring-pulse 2s ease-out infinite;
}

.energy-ring.delay-1 {
  width: 160px;
  height: 160px;
  animation-delay: 0.3s;
  border-color: rgba(64, 158, 255, 0.4);
}

.energy-ring.delay-2 {
  width: 200px;
  height: 200px;
  animation-delay: 0.6s;
  border-color: rgba(103, 194, 58, 0.3);
}

@keyframes core-glow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 40px rgba(103, 194, 58, 0.6),
                0 0 80px rgba(64, 158, 255, 0.4),
                inset 0 0 30px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 60px rgba(103, 194, 58, 0.8),
                0 0 100px rgba(64, 158, 255, 0.6),
                inset 0 0 40px rgba(255, 255, 255, 0.5);
  }
}

@keyframes ring-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

.start-title {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 32px;
}

.battle-preview-info {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 24px;
}

.preview-item {
  text-align: center;
}

.preview-item .label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.preview-item .value {
  font-size: 28px;
  font-weight: 700;
  color: #67c23a;
}

.start-hint {
  font-size: 16px;
  color: #909399;
  margin-bottom: 32px;
}

.start-button {
  height: 72px;
  padding: 0 64px;
  font-size: 28px;
  font-weight: 700;
  border-radius: 16px;
}

/* Active Battle Screen: left main + right log; modify by jx: add right panel layout */
.battle-active-screen {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 12px;
  min-height: 0;
}

.battle-active-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.battle-arena {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  gap: 8px;
}

.battle-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.battle-stats strong {
  color: #fff;
  font-weight: 600;
}

.combo-display {
  color: #e6a23c;
  font-weight: 600;
}

/* Right: Battle Log Panel; modify by jx: detailed battle info panel */
.battle-log-panel {
  width: 320px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  margin-left: 12px;
  border-radius: 0 12px 12px 0;
  overflow: hidden;
}

.battle-log-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.battle-log-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.battle-log-entry {
  padding: 8px 10px;
  font-size: 13px;
  line-height: 1.4;
  border-radius: 8px;
  word-break: break-word;
}

.log-phase {
  color: #409eff;
  background: rgba(64, 158, 255, 0.12);
}

.log-correct {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.12);
}

.log-wrong {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.12);
}

.log-timeout {
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.12);
}

.log-enemy_attack {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.15);
}

.log-victory {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.2);
  font-weight: 600;
}

.log-defeat {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.2);
  font-weight: 600;
}

.log-retreat {
  color: #909399;
  background: rgba(144, 147, 153, 0.15);
}

.battle-log-empty {
  padding: 24px 16px;
  font-size: 14px;
  color: #909399;
  text-align: center;
}

/* ESC Hint */
.esc-hint {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  font-size: 14px;
  color: #909399;
}

.esc-hint kbd {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-family: monospace;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-right: 8px;
}

/* Retreat Dialog */
.retreat-dialog-content {
  text-align: center;
  padding: 20px;
}

.warning-icon {
  font-size: 48px;
  color: #e6a23c;
  margin-bottom: 16px;
}

.retreat-dialog-content p {
  font-size: 18px;
  color: #303133;
  margin: 0;
}

.retreat-hint {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .battle-header {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
  }

  .title-text {
    font-size: 20px;
  }

  .start-content {
    padding: 20px;
  }

  .start-title {
    font-size: 24px;
  }

  .battle-preview-info {
    flex-direction: column;
    gap: 16px;
  }

  .preview-item .value {
    font-size: 24px;
  }

  .start-button {
    height: 56px;
    padding: 0 32px;
    font-size: 20px;
  }

  .battle-stats {
    flex-wrap: wrap;
    gap: 16px;
  }

  /* modify by jx: stack battle log below arena on small screens */
  .battle-active-screen {
    flex-direction: column;
  }

  .battle-log-panel {
    width: 100%;
    min-width: 0;
    margin-left: 0;
    margin-top: 12px;
    max-height: 200px;
    border-radius: 12px;
  }
}
</style>
