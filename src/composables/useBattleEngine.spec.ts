// Unit tests for useBattleEngine - Battle Mode Core Logic
// modify by jx: add comprehensive tests for battle engine covering all battle scenarios
// Status: Ready for execution when vitest infrastructure is properly configured

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBattleEngine, calculateDamage, updateEnemyAttack, generateBattleRecordId, createBattleRecord } from './useBattleEngine';

// ============================================================================
// Mock Types (avoiding @/types import to prevent configuration issues)
// ============================================================================

interface MockQuestion {
  id: string;
  expression: string;
  answer: number;
  numbers: number[];
  operators: string[];
}

interface MockBattleState {
  phase: 'idle' | 'preparing' | 'answering' | 'ended';
  playerHP: number;
  enemyHP: number;
  enemyAttack: number;
  currentQuestion: MockQuestion | null;
  timeRemaining: number;
  battleResult: 'victory' | 'defeat' | 'retreat' | null;
  questionCount: number;
  correctCount: number;
  combo: number;
  maxCombo: number;
  totalDamage: number;
  isRetreated: boolean;
}

interface MockBattleConfig {
  playerHP: number;
  enemyHP: number;
  enemyBaseAttack: number;
  prepareTime: number;
  questionTime: number;
  enemyAttackInterval: number;
  questionCount: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

interface MockBattleRecord {
  id: string;
  timestamp: Date;
  duration: number;
  result: 'victory' | 'defeat' | 'retreat';
  questionType: string;
  questionTypeName: string;
  config: {
    playerHP: number;
    enemyHP: number;
    enemyBaseAttack: number;
    questionCount: number;
    difficulty: string;
  };
  stats: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    maxCombo: number;
    totalDamage: number;
    finalEnemyAttack: number;
    remainingPlayerHP: number;
  };
}

// ============================================================================
// Test Helpers
// ============================================================================

function createMockQuestion(answer: number): MockQuestion {
  return {
    id: `test-question-${Date.now()}-${Math.random()}`,
    expression: `10 + ${answer - 10} = ?`,
    answer,
    numbers: [10, answer - 10],
    operators: ['add']
  };
}

const defaultBattleConfig: MockBattleConfig = {
  playerHP: 100,
  enemyHP: 50,
  enemyBaseAttack: 10,
  prepareTime: 3,
  questionTime: 10.0,
  enemyAttackInterval: 10,
  questionCount: 20,
  difficulty: 'normal'
};

// ============================================================================
// Test Suites
// ============================================================================

describe('useBattleEngine - Utility Functions', () => {
  describe('calculateDamage', () => {
    it('should calculate damage based on remaining time', () => {
      // 5 seconds spent, 10 second limit = 5 seconds remaining
      expect(calculateDamage(5, 10)).toBe(5.0);
    });

    it('should return minimum 0.1 damage when time is almost up', () => {
      // 9.95 seconds spent, 10 second limit = 0.05 seconds remaining
      expect(calculateDamage(9.95, 10)).toBe(0.1);
    });

    it('should return full damage when answered immediately', () => {
      // 0 seconds spent, 10 second limit = 10 seconds remaining
      expect(calculateDamage(0, 10)).toBe(10.0);
    });

    it('should handle different max time values', () => {
      // 2 seconds spent, 5 second limit = 3 seconds remaining
      expect(calculateDamage(2, 5)).toBe(3.0);
    });

    it('should round damage to 1 decimal place', () => {
      // 3.33 seconds spent, 10 second limit = 6.67 seconds remaining
      expect(calculateDamage(3.33, 10)).toBe(6.7);
    });

    it('should cap damage at remaining time', () => {
      // Negative time spent should not give more than max damage
      expect(calculateDamage(-1, 10)).toBe(10.0);
    });
  });

  describe('updateEnemyAttack', () => {
    it('should increase attack by 10%', () => {
      expect(updateEnemyAttack(10)).toBe(11);
    });

    it('should round to 1 decimal place', () => {
      expect(updateEnemyAttack(15)).toBe(16.5);
    });

    it('should handle multiple increases correctly', () => {
      let attack = 10;
      attack = updateEnemyAttack(attack); // 11
      attack = updateEnemyAttack(attack); // 12.1
      attack = updateEnemyAttack(attack); // 13.3
      expect(attack).toBeCloseTo(13.3, 1);
    });

    it('should handle decimal base attack', () => {
      expect(updateEnemyAttack(10.5)).toBe(11.6);
    });
  });

  describe('generateBattleRecordId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateBattleRecordId();
      const id2 = generateBattleRecordId();
      expect(id1).not.toBe(id2);
    });

    it('should start with battle_ prefix', () => {
      const id = generateBattleRecordId();
      expect(id.startsWith('battle_')).toBe(true);
    });

    it('should include timestamp and random parts', () => {
      const id = generateBattleRecordId();
      const parts = id.split('_');
      expect(parts.length).toBe(3); // battle, timestamp, random
    });
  });

  describe('createBattleRecord', () => {
    it('should create a battle record with correct structure', () => {
      const state: MockBattleState = {
        phase: 'ended',
        playerHP: 80,
        enemyHP: 0,
        enemyAttack: 11,
        currentQuestion: null,
        timeRemaining: 0,
        battleResult: 'victory',
        questionCount: 5,
        correctCount: 4,
        combo: 2,
        maxCombo: 3,
        totalDamage: 25.5,
        isRetreated: false
      };

      const record = createBattleRecord(
        state as any,
        defaultBattleConfig as any,
        'arithmetic',
        '四则运算',
        45.5
      );

      expect(record.id).toBeDefined();
      expect(record.timestamp).toBeInstanceOf(Date);
      expect(record.result).toBe('victory');
      expect(record.questionType).toBe('arithmetic');
      expect(record.questionTypeName).toBe('四则运算');
      expect(record.stats.totalQuestions).toBe(5);
      expect(record.stats.correctAnswers).toBe(4);
      expect(record.stats.accuracy).toBe(80); // 4/5 = 80%
      expect(record.stats.maxCombo).toBe(3);
      expect(record.stats.totalDamage).toBe(25.5);
      expect(record.stats.finalEnemyAttack).toBe(11);
      expect(record.stats.remainingPlayerHP).toBe(80);
    });

    it('should calculate accuracy as 0 when no questions answered', () => {
      const state: MockBattleState = {
        phase: 'ended',
        playerHP: 0,
        enemyHP: 50,
        enemyAttack: 10,
        currentQuestion: null,
        timeRemaining: 0,
        battleResult: 'defeat',
        questionCount: 0,
        correctCount: 0,
        combo: 0,
        maxCombo: 0,
        totalDamage: 0,
        isRetreated: false
      };

      const record = createBattleRecord(
        state as any,
        defaultBattleConfig as any,
        'arithmetic',
        '四则运算',
        30
      );

      expect(record.stats.accuracy).toBe(0);
    });
  });
});

describe('useBattleEngine - Battle Initialization', () => {
  it('should initialize battle state correctly', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();

    expect(engine.state.phase).toBe('idle');
    expect(engine.state.playerHP).toBe(100);
    expect(engine.state.enemyHP).toBe(50);
    expect(engine.state.enemyAttack).toBe(10);
    expect(engine.state.currentQuestion).toBeNull();
    expect(engine.state.questionCount).toBe(0);
    expect(engine.state.correctCount).toBe(0);
    expect(engine.state.combo).toBe(0);
    expect(engine.state.totalDamage).toBe(0);
  });

  it('should reset battle state correctly', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();
    engine.resetBattle();

    expect(engine.state.phase).toBe('idle');
    expect(engine.state.playerHP).toBe(100);
    expect(engine.state.enemyHP).toBe(50);
    expect(engine.state.enemyAttack).toBe(10);
    expect(engine.state.currentQuestion).toBeNull();
  });

  it('should return correct computed values for idle state', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();

    expect(engine.isIdle.value).toBe(true);
    expect(engine.isPreparing.value).toBe(false);
    expect(engine.isAnswering.value).toBe(false);
    expect(engine.isEnded.value).toBe(false);
    expect(engine.battleStarted.value).toBe(false);
  });
});

describe('useBattleEngine - Prepare Timer', () => {
  it('should start prepare timer and change phase to preparing', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();
    engine.startPrepareTimer();

    expect(engine.state.phase).toBe('preparing');
    expect(engine.state.timeRemaining).toBe(3);
    expect(engine.isPreparing.value).toBe(true);

    vi.useRealTimers();
  });

  it('should decrement time remaining correctly during prepare', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();
    engine.startPrepareTimer();

    // Advance timer by 1 second
    vi.advanceTimersByTime(1000);
    expect(engine.state.timeRemaining).toBe(2);

    vi.advanceTimersByTime(1000);
    expect(engine.state.timeRemaining).toBe(1);

    vi.useRealTimers();
  });

  it('should start battle after prepare timer completes', () => {
    vi.useFakeTimers();
    const questionGenerator = vi.fn().mockReturnValue([createMockQuestion(25)]);

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();
    engine.startPrepareTimer();

    // Advance timer past prepare time (3 seconds + buffer)
    vi.advanceTimersByTime(3500);

    expect(engine.state.phase).toBe('answering');
    expect(engine.state.currentQuestion).not.toBeNull();
    expect(engine.isAnswering.value).toBe(true);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Question Timer', () => {
  it('should start question timer when battle begins', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    expect(engine.state.timeRemaining).toBe(10.0);
    expect(engine.isAnswering.value).toBe(true);

    vi.useRealTimers();
  });

  it('should decrement time remaining during answering', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialTime = engine.state.timeRemaining;

    // Advance timer by 1 second
    vi.advanceTimersByTime(1000);

    expect(engine.state.timeRemaining).toBeLessThan(initialTime);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Correct Answer', () => {
  it('should deal damage when answer is correct', () => {
    const correctAnswer = 25;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialEnemyHP = engine.state.enemyHP;

    // Submit correct answer
    engine.submitAnswer(correctAnswer);

    expect(engine.state.enemyHP).toBeLessThan(initialEnemyHP);
    expect(engine.state.correctCount).toBe(1);
    expect(engine.state.questionCount).toBe(1);
    expect(engine.state.combo).toBe(1);
    expect(engine.state.totalDamage).toBeGreaterThan(0);
  });

  it('should update max combo when combo increases', () => {
    const correctAnswer = 25;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // First correct answer
    engine.submitAnswer(correctAnswer);
    expect(engine.state.maxCombo).toBe(1);

    // Second correct answer (new question)
    engine.submitAnswer(correctAnswer);
    expect(engine.state.maxCombo).toBe(2);
  });

  it('should calculate damage based on time spent', () => {
    vi.useFakeTimers();
    const correctAnswer = 25;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Wait 2 seconds before answering
    vi.advanceTimersByTime(2000);

    const initialEnemyHP = engine.state.enemyHP;

    engine.submitAnswer(correctAnswer);

    // Damage should be approximately 8 (10 - 2 = 8 seconds remaining, rounded up)
    expect(engine.state.totalDamage).toBeCloseTo(8.0, 0);

    vi.useRealTimers();
  });

  it('should trigger victory when enemy HP reaches 0', () => {
    const correctAnswer = 25;
    // Create a config that allows victory in one hit
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 5 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    engine.submitAnswer(correctAnswer);

    expect(engine.state.enemyHP).toBe(0);
    expect(engine.state.battleResult).toBe('victory');
    expect(engine.state.phase).toBe('ended');
    expect(engine.isEnded.value).toBe(true);
  });
});

describe('useBattleEngine - Wrong Answer', () => {
  it('should increase enemy attack when answer is wrong', () => {
    const correctAnswer = 25;
    const wrongAnswer = 30;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialEnemyAttack = engine.state.enemyAttack;

    engine.submitAnswer(wrongAnswer);

    expect(engine.state.enemyAttack).toBeGreaterThan(initialEnemyAttack);
    expect(engine.state.combo).toBe(0);
  });

  it('should not deal damage when answer is wrong', () => {
    const correctAnswer = 25;
    const wrongAnswer = 30;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialEnemyHP = engine.state.enemyHP;

    engine.submitAnswer(wrongAnswer);

    expect(engine.state.enemyHP).toBe(initialEnemyHP);
    expect(engine.state.totalDamage).toBe(0);
  });

  it('should increment question count even for wrong answer', () => {
    const correctAnswer = 25;
    const wrongAnswer = 30;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    engine.submitAnswer(wrongAnswer);

    expect(engine.state.questionCount).toBe(1);
  });

  it('should not trigger end battle when answer is wrong', () => {
    const correctAnswer = 25;
    const wrongAnswer = 30;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    engine.submitAnswer(wrongAnswer);

    expect(engine.state.battleResult).toBeNull();
    expect(engine.state.phase).toBe('answering');
  });
});

describe('useBattleEngine - Null Answer', () => {
  it('should treat null answer as wrong', () => {
    const correctAnswer = 25;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialEnemyAttack = engine.state.enemyAttack;

    engine.submitAnswer(null);

    expect(engine.state.enemyAttack).toBeGreaterThan(initialEnemyAttack);
    expect(engine.state.combo).toBe(0);
  });
});

describe('useBattleEngine - Time Up Handling', () => {
  it('should increase enemy attack when time is up', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialEnemyAttack = engine.state.enemyAttack;

    // Advance timer past question time limit
    vi.advanceTimersByTime(11000);

    expect(engine.state.enemyAttack).toBeGreaterThan(initialEnemyAttack);
    expect(engine.state.combo).toBe(0);

    vi.useRealTimers();
  });

  it('should increment question count on timeout', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    vi.advanceTimersByTime(11000);

    expect(engine.state.questionCount).toBe(1);

    vi.useRealTimers();
  });

  it('should reset timer after timeout', () => {
    vi.useFakeTimers();
    const questionGenerator = vi.fn()
      .mockReturnValueOnce(createMockQuestion(25))
      .mockReturnValueOnce(createMockQuestion(30));

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // First timeout
    vi.advanceTimersByTime(11000);

    expect(engine.state.timeRemaining).toBe(10.0);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Enemy Attack', () => {
  it('should damage player based on enemy attack power', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialPlayerHP = engine.state.playerHP;

    // Advance timer past enemy attack interval
    vi.advanceTimersByTime(10000);

    expect(engine.state.playerHP).toBeLessThan(initialPlayerHP);
    expect(engine.state.playerHP).toBe(initialPlayerHP - engine.state.enemyAttack);

    vi.useRealTimers();
  });

  it('should trigger defeat when player HP reaches 0', () => {
    vi.useFakeTimers();
    // Create a config where player dies in one hit
    const config: MockBattleConfig = { ...defaultBattleConfig, playerHP: 10 };
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Advance timer past enemy attack interval
    vi.advanceTimersByTime(10000);

    expect(engine.state.playerHP).toBe(0);
    expect(engine.state.battleResult).toBe('defeat');
    expect(engine.state.phase).toBe('ended');

    vi.useRealTimers();
  });

  it('should continue attacking at regular intervals', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const initialPlayerHP = engine.state.playerHP;
    const attackDamage = engine.state.enemyAttack;

    // First attack after 10 seconds
    vi.advanceTimersByTime(10000);
    expect(engine.state.playerHP).toBe(initialPlayerHP - attackDamage);

    // Second attack after another 10 seconds
    vi.advanceTimersByTime(10000);
    expect(engine.state.playerHP).toBe(initialPlayerHP - (attackDamage * 2));

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Retreat', () => {
  it('should set isRetreated to true', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const record = engine.retreat();

    expect(engine.state.isRetreated).toBe(true);
    expect(engine.state.phase).toBe('ended');
    expect(record.result).toBe('retreat');
  });

  it('should return a battle record', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    const record = engine.retreat();

    expect(record).toBeDefined();
    expect(record.result).toBe('retreat');
    expect(record.stats).toBeDefined();
  });

  it('should clear all timers on retreat', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    engine.retreat();

    // Player HP should not decrease after retreat
    const playerHPAfterRetreat = engine.state.playerHP;
    vi.advanceTimersByTime(10000);
    expect(engine.state.playerHP).toBe(playerHPAfterRetreat);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Battle Record', () => {
  it('should generate correct battle record on victory', () => {
    const correctAnswer = 25;
    // Config that allows victory in one hit
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 5 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();
    engine.submitAnswer(correctAnswer);

    const record = engine.getBattleRecord();

    expect(record.result).toBe('victory');
    expect(record.stats.totalQuestions).toBe(1);
    expect(record.stats.correctAnswers).toBe(1);
    expect(record.stats.accuracy).toBe(100);
    expect(record.stats.finalEnemyAttack).toBe(10);
  });

  it('should generate correct battle record on defeat', () => {
    vi.useFakeTimers();
    // Config that causes immediate defeat
    const config: MockBattleConfig = { ...defaultBattleConfig, playerHP: 10 };
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Enemy attacks after 10 seconds
    vi.advanceTimersByTime(10000);

    const record = engine.getBattleRecord();

    expect(record.result).toBe('defeat');
    expect(record.stats.remainingPlayerHP).toBe(0);

    vi.useRealTimers();
  });

  it('should track max combo in battle record', () => {
    const correctAnswer = 25;
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 20 };
    // Return same question to simulate consecutive correct answers
    const question = createMockQuestion(correctAnswer);
    const questionGenerator = () => [question];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Submit 3 correct answers
    engine.submitAnswer(correctAnswer);
    engine.submitAnswer(correctAnswer);
    engine.submitAnswer(correctAnswer);

    const record = engine.getBattleRecord();

    expect(record.stats.maxCombo).toBe(3);
  });

  it('should track total damage in battle record', () => {
    vi.useFakeTimers();
    const correctAnswer = 25;
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 20 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Wait and answer quickly for max damage
    vi.advanceTimersByTime(500);
    engine.submitAnswer(correctAnswer);

    const record = engine.getBattleRecord();

    expect(record.stats.totalDamage).toBeGreaterThan(0);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Battle Reset', () => {
  it('should reset all battle state values', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Make some progress
    engine.submitAnswer(25);

    engine.resetBattle();

    expect(engine.state.phase).toBe('idle');
    expect(engine.state.playerHP).toBe(100);
    expect(engine.state.enemyHP).toBe(50);
    expect(engine.state.enemyAttack).toBe(10);
    expect(engine.state.questionCount).toBe(0);
    expect(engine.state.correctCount).toBe(0);
    expect(engine.state.combo).toBe(0);
    expect(engine.state.maxCombo).toBe(0);
    expect(engine.state.totalDamage).toBe(0);
  });

  it('should clear battle result', () => {
    const correctAnswer = 25;
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 5 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();
    engine.submitAnswer(correctAnswer);

    expect(engine.state.battleResult).toBe('victory');

    engine.resetBattle();

    expect(engine.state.battleResult).toBeNull();
  });

  it('should allow starting a new battle after reset', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();
    engine.resetBattle();
    engine.startBattle();

    expect(engine.state.phase).toBe('answering');
    expect(engine.state.currentQuestion).not.toBeNull();
  });
});

describe('useBattleEngine - Rematch', () => {
  it('should reset battle and start prepare timer again', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();
    engine.resetBattle();
    engine.startPrepareTimer();

    expect(engine.state.phase).toBe('preparing');
    expect(engine.state.timeRemaining).toBe(3);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Computed Properties', () => {
  it('should calculate HP percentages correctly', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    expect(engine.playerHPPercent.value).toBe(100);
    expect(engine.enemyHPPercent.value).toBe(100);
  });

  it('should update HP percentages during battle', () => {
    const correctAnswer = 25;
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 20 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Deal 10 damage (approximately)
    engine.submitAnswer(correctAnswer);

    expect(engine.enemyHPPercent.value).toBeLessThan(100);
  });

  it('should track battle phase correctly', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );

    expect(engine.isIdle.value).toBe(true);
    expect(engine.battleStarted.value).toBe(false);

    engine.startBattle();

    expect(engine.isIdle.value).toBe(false);
    expect(engine.isAnswering.value).toBe(true);
    expect(engine.battleStarted.value).toBe(true);
  });
});

describe('useBattleEngine - Question Generation', () => {
  it('should get next question from generator', () => {
    const question = createMockQuestion(25);
    const questionGenerator = () => [question];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    expect(engine.state.currentQuestion).toEqual(question);
  });

  it('should handle empty question generator gracefully', () => {
    const questionGenerator = () => [];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    expect(engine.state.currentQuestion).toBeUndefined();
  });

  it('should advance to next question after answering', () => {
    const question1 = createMockQuestion(25);
    const question2 = createMockQuestion(30);
    let callCount = 0;
    const questionGenerator = () => {
      callCount++;
      return callCount === 1 ? [question1] : [question2];
    };

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    expect(engine.state.currentQuestion).toEqual(question1);

    engine.submitAnswer(25);

    expect(engine.state.currentQuestion).toEqual(question2);
  });
});

describe('useBattleEngine - Clear Timers', () => {
  it('should clear all timers when clearing', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    engine.clearAllTimers();

    // Timer should be cleared, time should not decrease
    const timeBeforeWait = engine.state.timeRemaining;
    vi.advanceTimersByTime(2000);

    expect(engine.state.timeRemaining).toBe(timeBeforeWait);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Edge Cases', () => {
  it('should handle answer submission when not in answering phase', () => {
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.initializeBattle();

    // Try to submit answer before battle starts
    const result = engine.submitAnswer(25);

    expect(result).toBe(false);
    expect(engine.state.questionCount).toBe(0);
  });

  it('should handle answer submission when battle has ended', () => {
    const correctAnswer = 25;
    const config: MockBattleConfig = { ...defaultBattleConfig, enemyHP: 5 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();
    engine.submitAnswer(correctAnswer);

    // Battle has ended
    const result = engine.submitAnswer(correctAnswer);

    expect(result).toBe(false);
  });

  it('should handle enemy attack increase cascade', () => {
    const wrongAnswer = 30;
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Multiple wrong answers
    engine.submitAnswer(wrongAnswer); // 10 -> 11
    engine.submitAnswer(wrongAnswer); // 11 -> 12.1
    engine.submitAnswer(wrongAnswer); // 12.1 -> 13.3

    expect(engine.state.enemyAttack).toBeCloseTo(13.3, 1);
  });

  it('should handle combo reset correctly', () => {
    const correctAnswer = 25;
    const wrongAnswer = 30;
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Build up combo
    engine.submitAnswer(correctAnswer);
    engine.submitAnswer(correctAnswer);
    expect(engine.state.combo).toBe(2);
    expect(engine.state.maxCombo).toBe(2);

    // Wrong answer resets combo
    engine.submitAnswer(wrongAnswer);
    expect(engine.state.combo).toBe(0);

    // New correct answer starts fresh
    engine.submitAnswer(correctAnswer);
    expect(engine.state.combo).toBe(1);
  });

  it('should handle damage calculation precision', () => {
    vi.useFakeTimers();
    const correctAnswer = 25;
    const config: MockBattleConfig = { ...defaultBattleConfig, questionTime: 7.5 };
    const questionGenerator = () => [createMockQuestion(correctAnswer)];

    const engine = useBattleEngine(
      config as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Answer at exactly 3.33 seconds
    vi.advanceTimersByTime(3330);

    const initialEnemyHP = engine.state.enemyHP;
    engine.submitAnswer(correctAnswer);

    // Remaining time = 7.5 - 3.33 = 4.17, damage = 4.2
    const damageDealt = initialEnemyHP - engine.state.enemyHP;
    expect(damageDealt).toBeCloseTo(4.2, 1);

    vi.useRealTimers();
  });
});

describe('useBattleEngine - Cleanup', () => {
  it('should clean up timers on unmount', () => {
    vi.useFakeTimers();
    const questionGenerator = () => [createMockQuestion(25)];

    const engine = useBattleEngine(
      defaultBattleConfig as any,
      'arithmetic',
      '四则运算',
      questionGenerator
    );
    engine.startBattle();

    // Simulate unmount
    engine.clearAllTimers();

    // Verify timers are cleared
    expect(engine.state.timeRemaining).toBeCloseTo(10.0, 0);

    vi.useRealTimers();
  });
});
