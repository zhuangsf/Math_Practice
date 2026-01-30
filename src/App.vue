<template>
  <div id="app">
    <!-- Main Home Page -->
    <div v-if="!isInBattleMode" class="main-app">
      <Home />
      <div class="footer">
        <p>&copy; 2026 小学数学四则运算出题工具</p>
      </div>
    </div>

    <!-- Battle Page (full-screen immersive) -->
    <BattlePage v-else />
  </div>
</template>

<script setup lang="ts">
// modify by jx: implement root app component with battle mode support

import Home from '@/views/Home.vue';
import BattlePage from '@/views/BattlePage.vue';
import { useBattleNavigation } from '@/composables/useBattleNavigation';

// Get battle mode state
const { isInBattleMode } = useBattleNavigation();
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  padding: 20px 0;
}

.main-app {
  min-height: 100vh;
}

.footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.footer p {
  margin: 0;
}
</style>
