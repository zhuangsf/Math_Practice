// modify by jx: battle sound effects composable - play sounds only when resources exist, avoid overlap and multiple play issues

import { useGameSettings } from '@/composables/useGameSettings';

// Eager-load all mp3 files in battle dir; only files that exist will be in the result
const globModules = import.meta.glob<string>(
  '../assets/sounds/battle/*.mp3',
  { query: '?url', import: 'default', eager: true }
);

/** Map basename (e.g. win_1) -> resolved URL. Only includes files that exist. */
const soundUrlMap = new Map<string, string>();
for (const [path, url] of Object.entries(globModules)) {
  const basename = path.split('/').pop()?.replace(/\.mp3$/, '') ?? '';
  if (basename) soundUrlMap.set(basename, url as string);
}

/** Cached Audio instances by key. Reused to avoid creating many instances. */
const audioCache = new Map<string, HTMLAudioElement>();

/** Currently playing audio key (for win group - stop previous before playing next). */
let currentWinKey: string | null = null;

/** Background music Audio instance - separate from cache for loop control. */
let bgAudio: HTMLAudioElement | null = null;

/** Stop any playing win_* sound to avoid overlap with lost/attack/defeat. */
function stopWinSounds(): void {
  if (currentWinKey) {
    const prev = audioCache.get(currentWinKey);
    prev?.pause();
    prev && (prev.currentTime = 0);
    currentWinKey = null;
  }
}

/**
 * Get or create Audio instance for a sound key.
 * Returns null if the sound resource does not exist.
 */
function getAudio(key: string): HTMLAudioElement | null {
  const url = soundUrlMap.get(key);
  if (!url) return null;

  let audio = audioCache.get(key);
  if (!audio) {
    audio = new Audio(url);
    audioCache.set(key, audio);
  }
  return audio;
}

/**
 * Play a sound by key. Does nothing if resource is missing.
 * For win_* group: stops any playing win sound before starting the new one to avoid overlap.
 * For lost/attack/defeat: stops win sounds first to avoid overlap.
 */
function playSound(key: string): void {
  const audio = getAudio(key);
  if (!audio) return;

  try {
    if (key.startsWith('win_')) {
      // modify by jx: stop previous win sound when playing another win sound to avoid overlap
      if (currentWinKey && currentWinKey !== key) {
        const prev = audioCache.get(currentWinKey);
        prev?.pause();
        prev && (prev.currentTime = 0);
      }
      currentWinKey = key;
      audio.onended = () => {
        if (currentWinKey === key) currentWinKey = null;
      };
    } else {
      // modify by jx: stop win sounds when playing lost/attack/defeat to avoid overlap
      stopWinSounds();
    }

    audio.currentTime = 0;
    audio.volume = 0.8;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        // Autoplay may be blocked; ignore silently
      });
    }
  } catch {
    // Ignore playback errors (e.g. not user-activated yet)
  }
}

/**
 * Battle sounds composable.
 * Only plays when the corresponding resource exists in src/assets/sounds/battle/.
 * modify by jx: musicEnabled controls bg music, soundEnabled controls win/lost/attack etc.
 */
export function useBattleSounds() {
  const settings = useGameSettings();

  return {
    /** Play sound for correct answer. combo: 1~7+, uses win_1..win_7 (7+ capped to win_7). */
    playCorrect(combo: number): void {
      if (!settings.value.soundEnabled) return;
      const n = Math.min(Math.max(1, Math.floor(combo)), 7);
      playSound(`win_${n}`);
    },

    /** Play sound for wrong answer or timeout. */
    playWrong(): void {
      if (!settings.value.soundEnabled) return;
      playSound('lost');
    },

    /** Play sound when enemy attacks. */
    playAttack(): void {
      if (!settings.value.soundEnabled) return;
      playSound('attack');
    },

    /** Play sound when battle ends in defeat. */
    playDefeat(): void {
      if (!settings.value.soundEnabled) return;
      playSound('defeat');
    },

    /** Play sound when battle ends in victory. Uses find.mp3. */
    playVictory(): void {
      if (!settings.value.soundEnabled) return;
      playSound('find');
    },

    /** Start battle background music (loops). Only plays if battle_bg.mp3 exists. */
    playBattleBg(): void {
      if (!settings.value.musicEnabled) return;
      const url = soundUrlMap.get('battle_bg');
      if (!url) return;
      try {
        stopBgMusic();
        bgAudio = new Audio(url);
        bgAudio.loop = true;
        bgAudio.volume = 0.5;
        const p = bgAudio.play();
        if (p !== undefined) p.catch(() => {});
      } catch {
        bgAudio = null;
      }
    },

    /** Stop battle background music. */
    stopBattleBg(): void {
      stopBgMusic();
    }
  };
}

/** Stop background music (module-level helper). */
function stopBgMusic(): void {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    bgAudio = null;
  }
}

/** Export for external use - e.g. when user disables music in settings. */
export function stopBattleBgMusic(): void {
  stopBgMusic();
}
