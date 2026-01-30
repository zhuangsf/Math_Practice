<template>
  <div class="battle-hud">
    <!-- Player HP Bar -->
    <div class="hud-section player-section">
      <div class="hud-header">
        <span class="hud-icon">🧙</span>
        <span class="hud-label">玩家</span>
      </div>
      <div class="hp-bar-container">
        <div
          class="hp-bar player-hp"
          :style="{ width: playerHPPercent + '%' }"
          :class="{ 'low': playerHPPercent <= 30, 'critical': playerHPPercent <= 15 }"
        ></div>
      </div>
      <div class="hp-text">
        {{ Math.round(currentPlayerHP) }} / {{ playerMaxHp }}
      </div>
    </div>

    <!-- Battle Stats -->
    <div class="hud-section stats-section">
      <div class="stat-item">
        <span class="stat-label">题目</span>
        <span class="stat-value">{{ currentQuestionCount }} / {{ totalQuestions }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">正确</span>
        <span class="stat-value correct">{{ currentCorrectCount }}</span>
      </div>
      <div class="stat-item" v-if="currentCombo > 1">
        <span class="stat-label">连击</span>
        <span class="stat-value combo">
          🔥 {{ currentCombo }}
        </span>
      </div>
    </div>

    <!-- Enemy HP Bar -->
    <div class="hud-section enemy-section">
      <div class="hud-header">
        <span class="hud-icon">⚡</span>
        <span class="hud-label">能量团</span>
      </div>
      <div class="hp-bar-container">
        <div
          class="hp-bar enemy-hp"
          :style="{ width: enemyHPPercent + '%' }"
          :class="{ 'low': enemyHPPercent <= 30, 'critical': enemyHPPercent <= 15 }"
        ></div>
      </div>
      <div class="hp-text enemy-hp-text">
        {{ Math.round(currentEnemyHP * 10) / 10 }} / {{ enemyMaxHp }}
      </div>
    </div>

    <!-- Enemy Attack Power -->
    <div class="hud-section attack-section">
      <div class="attack-label">攻击力</div>
      <div class="attack-value">{{ Math.round((state?.enemyAttack ?? 10) * 10) / 10 }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement battle HUD component showing player/enemy HP and battle stats

import { computed } from 'vue';
import type { BattleState } from '@/types';

interface Props {
  state: BattleState | null;
  playerMaxHp: number;
  enemyMaxHp: number;
  totalQuestions: number;
}

const props = defineProps<Props>();

// Computed properties with null safety
const playerHPPercent = computed(() => {
  if (!props.state) return 0;
  return Math.max(0, Math.min(100, (props.state.playerHP / props.playerMaxHp) * 100));
});

const enemyHPPercent = computed(() => {
  if (!props.state) return 0;
  return Math.max(0, Math.min(100, (props.state.enemyHP / props.enemyMaxHp) * 100));
});

// modify by jx: add computed properties for safe state access
const currentQuestionCount = computed(() => props.state?.questionCount ?? 0);
const currentCorrectCount = computed(() => props.state?.correctCount ?? 0);
const currentCombo = computed(() => props.state?.combo ?? 0);
const currentPlayerHP = computed(() => props.state?.playerHP ?? 100);
const currentEnemyHP = computed(() => props.state?.enemyHP ?? 50);
</script>

<style scoped>
.battle-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  margin-bottom: 8px;
  gap: 12px;
}

.hud-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.player-section {
  flex: 1;
  min-width: 200px;
}

.enemy-section {
  flex: 1;
  min-width: 200px;
}

.stats-section {
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.attack-section {
  padding: 8px 16px;
  background: rgba(255, 100, 100, 0.2);
  border-radius: 8px;
  min-width: 80px;
}

.hud-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.hud-icon {
  font-size: 20px;
}

.hud-label {
  color: #a0a0a0;
}

.hp-bar-container {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.hp-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.player-hp {
  background: linear-gradient(90deg, #67c23a 0%, #85ce61 100%);
}

.player-hp.low {
  background: linear-gradient(90deg, #e6a23c 0%, #f5c582 100%);
}

.player-hp.critical {
  background: linear-gradient(90deg, #f56c6c 0%, #f89898 100%);
  animation: pulse 0.5s ease infinite;
}

.enemy-hp {
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
}

.enemy-hp.low {
  background: linear-gradient(90deg, #e6a23c 0%, #f5c582 100%);
}

.enemy-hp.critical {
  background: linear-gradient(90deg, #f56c6c 0%, #f89898 100%);
  animation: pulse 0.5s ease infinite;
}

.hp-text {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.enemy-hp-text {
  color: #66b1ff;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #a0a0a0;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.stat-value.correct {
  color: #67c23a;
}

.stat-value.combo {
  color: #ff6b35;
  animation: glow 1s ease infinite;
}

.attack-label {
  font-size: 12px;
  color: #f89898;
}

.attack-value {
  font-size: 24px;
  font-weight: 700;
  color: #f56c6c;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 5px #ff6b35;
  }
  50% {
    text-shadow: 0 0 15px #ff6b35;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .battle-hud {
    flex-wrap: wrap;
    padding: 12px 16px;
  }

  .player-section,
  .enemy-section {
    min-width: 150px;
  }

  .stats-section {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 8px;
  }

  .attack-section {
    order: 4;
  }
}
</style>
