<template>
  <div
    class="battle-enemy"
    :class="[
      { 'is-attacking': isAttacking },
      animationKey > 0 ? `hit-anim-${animationKey}` : ''
    ]"
  >
    <div class="enemy-container">
      <!-- Energy ball visual -->
      <div class="energy-ball">
        <div class="energy-core"></div>
        <div class="energy-ring ring-1"></div>
        <div class="energy-ring ring-2"></div>
        <div class="energy-ring ring-3"></div>
        <!-- Floating particles -->
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>

      <!-- Enemy info (right side) -->
      <div class="enemy-info">
        <div class="enemy-name">能量团</div>
        <div class="enemy-stats">
          <div class="stat">
            <span class="stat-label">HP</span>
            <span class="stat-value">{{ Math.round(hp * 10) / 10 }} / {{ maxHp }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">ATK</span>
            <span class="stat-value atk">{{ Math.round(attack * 10) / 10 }}</span>
          </div>
        </div>
      </div>

      <!-- Damage popup: show actual damage with minus sign in red; modify by jx: use lastDamage prop instead of random -->
      <Transition name="damage-popup">
        <div v-if="showDamage" class="damage-popup damage" :class="damageType">
          -{{ typeof damageValue === 'number' ? damageValue.toFixed(1) : damageValue }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement battle enemy (energy ball) display component with animations
// Terminology: 能量团=enemy (HP/ATK display, hit animation). See README 战斗模式术语.

import { ref, watch, onMounted, nextTick } from 'vue';

interface Props {
  hp: number;
  maxHp: number;
  attack: number;
  lastDamage?: number;  // modify by jx: actual damage dealt for popup display (from battle engine)
  isHit?: boolean;
  isAttacking?: boolean;
  shakeEnabled?: boolean;  // modify by jx: control shake animation
}

interface Emits {
  (e: 'hitAnimationEnd'): void;
  (e: 'attackAnimationEnd'): void;
}

const props = withDefaults(defineProps<Props>(), {
  lastDamage: 0,  // modify by jx: default 0 when not passed
  isHit: false,
  isAttacking: false,
  shakeEnabled: false  // modify by jx: default off to disable energy orb shake after starting battle
});

const emit = defineEmits<Emits>();

// Damage popup state
const showDamage = ref(false);
const damageValue = ref(0);
const damageType = ref<'damage' | 'buff'>('damage');

// Animation trigger state - modify by jx: use unique animation key for replay; template adds hit-anim-* only when >0 to avoid shake on mount
const animationKey = ref(0);

// Component ready state - modify by jx: prevent animation on initial mount
const isComponentReady = ref(false);

// Mark component as ready after mount
onMounted(() => {
  console.log('[BattleEnemy][SHAKE_DEBUG] onMounted start', { shakeEnabled: props.shakeEnabled, animationKey: animationKey.value, ts: Date.now() });
  // Use nextTick to ensure DOM is fully rendered
  nextTick(() => {
    isComponentReady.value = true;
    // modify by jx: when shake enabled, play one entrance shake on start battle (animationKey=1 adds hit-anim-1, no emit)
    if (props.shakeEnabled) {
      animationKey.value = 1;
    }
    console.log('[BattleEnemy][SHAKE_DEBUG] component ready', { isComponentReady: isComponentReady.value, shakeEnabled: props.shakeEnabled, animationKey: animationKey.value, ts: Date.now() });
  });
});

// Watch for hit animation
// #region BattleEnemy debug logging - modify by jx: key info for shake debug
watch(() => props.isHit, (newVal, oldVal) => {
  console.log('[BattleEnemy][SHAKE_DEBUG] isHit changed', {
    newVal,
    oldVal,
    animationKey: animationKey.value,
    isComponentReady: isComponentReady.value,
    shakeEnabled: props.shakeEnabled,
    willSkipNotReady: !isComponentReady.value,
    willSkipInitialMount: oldVal === undefined && newVal === false,
    ts: Date.now()
  });

  // modify by jx: skip if component not ready yet (prevent animation on initial mount)
  if (!isComponentReady.value) {
    console.log('[BattleEnemy][SHAKE_DEBUG] SKIP: component not ready (no shake)');
    return;
  }

  // modify by jx: skip if this is initial mount (oldVal is undefined)
  if (oldVal === undefined && newVal === false) {
    console.log('[BattleEnemy][SHAKE_DEBUG] SKIP: initial mount (no shake)');
    return;
  }

  // modify by jx: on correct answer (isHit true) always play hit shake + damage popup; shakeEnabled only controls entrance shake in onMounted
  if (newVal) {
    const nextKey = animationKey.value + 1;
    console.log('[BattleEnemy][SHAKE_DEBUG] PLAY: clearing class then re-add', { prevKey: animationKey.value, nextKey, ts: Date.now() });
    // modify by jx: remove hit-anim class then re-add next frame so browser restarts animation (same animation name does not replay otherwise)
    animationKey.value = 0;
    requestAnimationFrame(() => {
      animationKey.value = nextKey;
      console.log('[BattleEnemy][SHAKE_DEBUG] rAF done: animationKey set to', nextKey, 'class should be hit-anim-' + nextKey, { ts: Date.now() });
    });

    showDamagePopup(props.lastDamage, 'damage');  // modify by jx: use actual damage from engine
    setTimeout(() => {
      emit('hitAnimationEnd');
    }, 300);
  } else {
    console.log('[BattleEnemy][SHAKE_DEBUG] isHit false, no animation');
  }
});
// #endregion

// Watch for attack animation
watch(() => props.isAttacking, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('attackAnimationEnd');
    }, 500);
  }
});

function showDamagePopup(value: number, type: 'damage' | 'buff') {
  damageValue.value = value;
  damageType.value = type;
  showDamage.value = true;
  setTimeout(() => {
    showDamage.value = false;
  }, 800);
}
</script>

<style scoped>
.battle-enemy {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.enemy-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  position: relative;
}

/* Energy ball styles */
.energy-ball {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.energy-core {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle at 30% 30%, #66b1ff, #409eff, #1875e5);
  border-radius: 50%;
  box-shadow:
    0 0 30px rgba(64, 158, 255, 0.6),
    0 0 60px rgba(64, 158, 255, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  animation: core-pulse 2s ease infinite;
}

.energy-ring {
  position: absolute;
  border: 2px solid rgba(64, 158, 255, 0.5);
  border-radius: 50%;
  animation: ring-rotate 3s linear infinite;
}

.ring-1 {
  width: 70px;
  height: 70px;
  animation-duration: 3s;
}

.ring-2 {
  width: 85px;
  height: 85px;
  animation-duration: 4s;
  animation-direction: reverse;
}

.ring-3 {
  width: 100px;
  height: 100px;
  animation-duration: 5s;
}

/* Particle effects */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(64, 158, 255, 0.8);
  border-radius: 50%;
  animation: particle-float 2s ease-in-out infinite;
}

.particle-1 {
  top: 10%;
  left: 50%;
  animation-delay: 0s;
}

.particle-2 {
  top: 50%;
  right: 10%;
  animation-delay: 0.5s;
}

.particle-3 {
  bottom: 10%;
  left: 30%;
  animation-delay: 1s;
}

.particle-4 {
  top: 30%;
  right: 20%;
  animation-delay: 1.5s;
}

/* Hit animation - modify by jx: use hit-anim-* pattern for animation replay */
.battle-enemy[class*="hit-anim-"] {
  animation: hit-shake 0.3s ease;
}

.battle-enemy[class*="hit-anim-"] .energy-core {
  animation: hit-flash 0.3s ease;
}

/* Attack animation */
.battle-enemy.is-attacking .energy-core {
  animation: attack-charge 0.5s ease;
}

.battle-enemy.is-attacking {
  animation: attack-lunge 0.5s ease;
}

/* Enemy info */
.enemy-info {
  text-align: left;
}

.enemy-name {
  font-size: 16px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 8px;
}

.enemy-stats {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.stat-value.atk {
  color: #f56c6c;
}

/* Damage popup: red font with minus sign for actual damage; modify by jx: use red for damage type */
.damage-popup {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: damage-float 0.8s ease-out forwards;
  pointer-events: none;
}

.damage-popup.damage {
  color: #f56c6c;
}

.damage-popup.buff {
  color: #f56c6c;
}

/* Animations */
@keyframes core-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 0 30px rgba(64, 158, 255, 0.6),
      0 0 60px rgba(64, 158, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 0 40px rgba(64, 158, 255, 0.8),
      0 0 80px rgba(64, 158, 255, 0.6),
      inset 0 0 30px rgba(255, 255, 255, 0.5);
  }
}

@keyframes ring-rotate {
  from {
    transform: rotate(0deg) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.4;
  }
  to {
    transform: rotate(360deg) scale(1);
    opacity: 0.8;
  }
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

@keyframes hit-flash {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(2);
  }
}

@keyframes hit-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@keyframes attack-charge {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.2);
    filter: brightness(1.5);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

@keyframes attack-lunge {
  0% {
    transform: translateY(0) translateX(0);
  }
  20% {
    transform: translateY(-15px) translateX(-8px);
  }
  40% {
    transform: translateY(-25px) translateX(8px);
  }
  60% {
    transform: translateY(-20px) translateX(-5px);
  }
  80% {
    transform: translateY(-15px) translateX(5px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

@keyframes damage-float {
  0% {
    transform: translateX(-50%) translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-50px) scale(1.5);
    opacity: 0;
  }
}

/* Popup transition */
.damage-popup-enter-active {
  animation: damage-float 0.8s ease-out;
}

.damage-popup-leave-active {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .enemy-container {
    flex-direction: row;
    gap: 16px;
  }

  .energy-ball {
    width: 80px;
    height: 80px;
  }

  .energy-core {
    width: 40px;
    height: 40px;
  }

  .ring-1 {
    width: 60px;
    height: 60px;
  }

  .ring-2 {
    width: 70px;
    height: 70px;
  }

  .ring-3 {
    width: 80px;
    height: 80px;
  }

  .enemy-name {
    font-size: 14px;
  }

  .enemy-stats {
    gap: 16px;
  }

  .stat-value {
    font-size: 12px;
  }
}
</style>
