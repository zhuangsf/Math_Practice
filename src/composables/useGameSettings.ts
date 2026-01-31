// Game settings state management
// modify by jx: implement global game settings for battle mode

import { ref } from 'vue';

// Global settings state
const settings = ref({
  shakeEnabled: false,  // modify by jx: default off to disable energy orb shake after starting battle
  musicEnabled: true,   // modify by jx: background music switch, default on
  soundEnabled: true   // modify by jx: sound effects (win/lost/attack etc) switch, default on
});

/**
 * Get current game settings
 */
export function useGameSettings() {
  return settings;
}

/**
 * Update shake animation setting
 */
export function setShakeEnabled(enabled: boolean) {
  settings.value.shakeEnabled = enabled;
}

/**
 * Update game settings (shake, music, sound)
 */
export function updateGameSettings(updates: Partial<typeof settings.value>) {
  Object.assign(settings.value, updates);
}
