# 数学战斗模式 - MVP开发计划

## 1. 项目概述

### 1.1 目标
实现一个颠覆性的即时战斗模式数学答题游戏，将传统的枯燥练习转化为令人上瘾的战斗体验。玩家通过快速准确地解答数学题目来攻击能量团，同时需要在规定时间内躲避敌人的攻击。

### 1.2 核心创新点
- **世界观重构**：数学题目 = 宇宙能量团，解题速度 = 攻击力
- **即时战斗机制**：3秒准备 → 10秒答题 → 伤害结算 → 敌人反击
- **动态血量系统**：玩家100血，敌人50血，答对按剩余时间造成伤害
- **惩罚机制**：答错或超时，敌人攻击力增加10%

### 1.3 MVP验证目标
- 验证战斗模式是否能提升用户参与度和练习积极性
- 测试即时反馈机制对答题速度的影响
- 评估游戏化设计对学习效果的潜在影响

### 1.4 集成方式
游戏模式将作为**每个题型的子功能**集成，在现有"练习模式"和"答题模式"旁边**并列增加"游戏模式"选项**，而非作为首页的顶级页签。这样用户在任何题型下都可以选择进入战斗模式。

![模式选择示意](模式选择.png)

```
┌─────────────────────────────────────────┐
│ 运算元数量 | 数值范围 | 运算类型 | 题目数量 │
├─────────────────────────────────────────┤
│                                         │
│  答题模式                                 │
│  ┌───────────┬───────────┬───────────┐  │
│  │ 练习模式  │ 答题模式  │  ⚔️游戏模式 │  │
│  └───────────┴───────────┴───────────┘  │
│                                         │
│  游戏模式：在战斗中快速驯服能量团！       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 2. 核心游戏机制设计

### 2.1 战斗参数配置

| 参数 | 初始值 | 说明 |
|------|--------|------|
| 玩家血量 | 100 | 玩家生命值，初始100点 |
| 能量团血量 | 50 | 敌人生命值，初始50点 |
| 能量团攻击力 | 10 | 敌人每次攻击伤害，初始10点 |
| 准备倒计时 | 3秒 | 进入战斗前的准备时间（整数秒） |
| 题目倒计时 | 10.0秒 | 每道题的答题时间限制（精确到0.1秒） |
| 敌人攻击间隔 | 10秒 | 能量团攻击玩家的周期 |

### 2.2 伤害计算规则

**答对题目时**：
- 伤害值 = 剩余秒数（保留1位小数，向上取整）
- 例如：10.0秒倒计时，5.3秒时答对，伤害 = 5.3 → 取整为 6点
- 能量团血量减少相应数值

**答错或超时时**：
- 能量团攻击力增加 10%
- 新攻击力 = 原攻击力 × 1.1（保留1位小数）
- 例如：初始10.0点 → 11.0点 → 12.1点 → 13.3点...

### 2.3 战斗流程

```
开始战斗
    ↓
3秒准备倒计时
    ↓
抛出第1题 + 10秒倒计时开始
    ↓
玩家输入答案
    ↓
┌─────────────────────────────────────┐
│ 验证答案                             │
├─────────────────────────────────────┤
│ 正确 → 伤害 = 10 - 已用秒数          │
│         能量团血量 -= 伤害            │
│         抛出新题目 + 重置10秒倒计时    │
├─────────────────────────────────────┤
│ 错误/超时 → 能量团攻击力 *= 1.1      │
│            抛出新题目 + 重置10秒倒计时 │
└─────────────────────────────────────┘
    ↓
每10秒：能量团攻击玩家
    ↓
玩家血量 -= 能量团攻击力
    ↓
┌─────────────────────────────────────┐
│ 检查战斗结果                          │
├─────────────────────────────────────┤
│ 能量团血量 ≤ 0 → 玩家胜利             │
├─────────────────────────────────────┤
│ 玩家血量 ≤ 0 → 玩家失败               │
└─────────────────────────────────────┘
```

### 2.4 模式切换机制

游戏模式将作为每种题型的第三种模式选项，与练习模式和答题模式并列。用户可以在任何题型下选择进入战斗模式。

```typescript
// 模式类型扩展
type PracticeMode = 'practice' | 'answering' | 'battle';

// ControlPanel 将支持三种模式的切换
interface ControlPanelProps {
  // ... 现有配置
  mode: PracticeMode;  // 替换原来的 'practice' | 'answering'
}
```

### 2.5 战斗状态机

```typescript
type BattlePhase = 'idle' | 'preparing' | 'answering' | 'ended';
type BattleResult = 'victory' | 'defeat' | null;

interface BattleState {
  phase: BattlePhase;           // 当前阶段
  playerHP: number;             // 玩家血量
  enemyHP: number;              // 敌人血量
  enemyAttack: number;          // 敌人攻击力
  currentQuestion: Question | null;  // 当前题目
  timeRemaining: number;        // 当前题剩余时间
  battleResult: BattleResult;   // 战斗结果
  questionCount: number;        // 已答题数量
  correctCount: number;         // 正确数量
  combo: number;                // 连击数
}
```

---

## 3. 技术架构设计

### 3.1 集成策略

游戏模式将**深度集成到现有题型系统中**，而非独立入口。具体集成方式：

1. **修改 ControlPanel.vue**：将"练习模式/答题模式"的二选一改为三选一，增加"游戏模式"选项
2. **修改各题型页面**：支持三种模式的显示和逻辑切换
3. **新增战斗组件**：为战斗模式提供专用的UI组件
4. **复用现有逻辑**：题目生成、答案验证等核心逻辑复用现有模块

### 3.2 新增文件结构

```
src/
├── components/
│   └── battle/
│       ├── BattleHUD.vue           # 战斗HUD显示（多题型复用）
│       ├── BattleEnemy.vue         # 能量团显示组件
│       ├── BattleQuestion.vue      # 战斗题目显示
│       ├── BattleTimer.vue         # 倒计时组件
│       ├── BattleControls.vue      # 战斗控制按钮
│       └── BattleResult.vue        # 战斗结果展示
├── composables/
│   └── useBattleEngine.ts          # 战斗引擎核心逻辑
└── assets/
    └── styles/
        └── battle.css              # 战斗模式样式
```

**注意**：不再需要独立的 BattlePage.vue，因为战斗模式将内嵌到各题型页面中。

### 3.3 现有文件修改

```
src/
├── components/
│   └── ControlPanel.vue           # 增加游戏模式选项
├── views/
│   ├── ArithmeticPage.vue         # 支持游戏模式显示
│   ├── EquationPage.vue           # 支持游戏模式显示
│   ├── FractionPage.vue           # 支持游戏模式显示
│   ├── DecimalPage.vue            # 支持游戏模式显示
│   ├── PercentagePage.vue         # 支持游戏模式显示
│   ├── UnitConversionPage.vue     # 支持游戏模式显示
│   ├── GeometryPage.vue           # 支持游戏模式显示
│   ├── FactorMultiplePage.vue     # 支持游戏模式显示
│   ├── PrimeCompositePage.vue     # 支持游戏模式显示
│   ├── ComparisonPage.vue         # 支持游戏模式显示
│   └── PatternPage.vue            # 支持游戏模式显示
└── types/
    └── index.ts                   # 添加BattleState等类型
```

### 3.2 技术实现要点

#### 3.2.1 倒计时管理
- 使用 `requestAnimationFrame` 实现精确倒计时
- 支持暂停/恢复功能
- 倒计时结束时自动触发验证逻辑

#### 3.2.2 状态管理
- 使用 Vue 3 `reactive` 存储战斗状态
- 关键状态变更时触发相应的UI更新
- 战斗结束时保存战斗记录

#### 3.2.3 题目生成
- 复用现有的 `useQuestionGenerator` composable
- 根据配置动态生成题目
- 支持中断后继续答题（可选）

---

## 4. 界面设计

### 4.1 控制面板模式选择（核心改动）

每个题型的控制面板将增加游戏模式选项，与练习模式和答题模式并列：

```vue
<!-- ControlPanel.vue 模式选择区域 -->
<div class="control-section">
  <h3 class="section-title">答题模式</h3>
  <el-radio-group v-model="answerMode" size="large">
    <el-radio-button label="practice">练习模式</el-radio-button>
    <el-radio-button label="answering">答题模式</el-radio-button>
    <el-radio-button label="battle">
      <span>⚔️ 游戏模式</span>
    </el-radio-button>
  </el-radio-group>
  <div class="mode-description">
    <span v-if="answerMode === 'practice'">练习模式：仅显示题目，适合打印和导出</span>
    <span v-else-if="answerMode === 'answering'">答题模式：可在题目下方输入答案，支持在线答题</span>
    <span v-else>游戏模式：在战斗中快速驯服能量团，答得越快伤害越高！</span>
  </div>
</div>
```

### 4.2 战斗界面布局

各题型页面在选择游戏模式后，将切换到战斗界面布局：

```
┌─────────────────────────────────────────────────────┐
│ 四则运算题目生成                          ⚔️ 战斗中 │  [逃跑]
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │           ⚡ 能量团 ⚡                       │   │
│  │           ┌─────────┐                       │   │
│  │           │  ████   │                       │   │
│  │           │ ██████  │   HP: 50/50           │   │
│  │           │ ██████  │   ATK: 10             │   │
│  │           └─────────┘                       │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 倒计时: 8秒                                  │   │
│  │ [████████████████████░░░░░░░░░░░░░░]        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 玩家HP: 100/100                    连击: 5 🔥 │   │
│  │ [████████████████████████████████████████]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 第 5 题 / 总共 20 题                          │   │
│  │                                              │   │
│  │        25 + 37 = [  ___  ]                   │   │
│  │                                              │   │
│  │        [ 提交答案 (Enter) ]                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  统计: 正确 4/5 | 平均用时 2.3秒                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.3 准备阶段界面

```
┌─────────────────────────────────────────────────────┐
│ 四则运算题目生成                          ⚔️ 准备中 │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│         ⚡ 准备进入战斗 ⚡                           │
│                                                     │
│                                                     │
│              3                                      │
│                                                     │
│                                                     │
│           秒                                        │
│                                                     │
│                                                     │
│                                                     │
│         准备好了吗？                                 │
│                                                     │
│         快速解答题目来驯服能量团！                    │
│                                                     │
│                                                     │
│         [ 进入战斗 ]                                │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.4 结果展示界面

```
┌─────────────────────────────────────────────────────┐
│ 四则运算题目生成                          ⚔️ 战斗结束 │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│         ┌─────────────────────────────────┐        │
│         │                                 │        │
│         │      🎉 战斗胜利！ 🎉           │        │
│         │                                 │        │
│         │    ⚡ 能量团已被驯服 ⚡          │        │
│         │                                 │        │
│         └─────────────────────────────────┘        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 战斗统计                                      │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 用时: 45.2秒                                 │   │
│  │ 答题: 5/5                                    │   │
│  │ 正确: 5 (100%)                               │   │
│  │ 最大连击: 5                                  │   │
│  │ 剩余HP: 65/100                               │   │
│  │ 最终敌人攻击力: 10.0                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│         [ 再战一场 ]    [ 返回练习 ]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. 开发任务分解

### 5.1 第一阶段：类型定义与战斗引擎（Day 1-2）

#### 5.1.1 类型定义扩展
**文件**: `src/types/index.ts`

```typescript
// 模式类型扩展（三选一）
type PracticeMode = 'practice' | 'answering' | 'battle';

// 战斗配置
interface BattleConfig {
  playerHP: number;           // 玩家血量（默认100）
  enemyHP: number;            // 敌人血量（默认50）
  enemyBaseAttack: number;    // 敌人基础攻击力（默认10）
  prepareTime: number;        // 准备时间（默认3秒）
  questionTime: number;       // 答题时间（默认10秒）
  enemyAttackInterval: number;// 默认10秒）
敌人攻击间隔（  questionCount: number;      // 题目数量（默认20）
}

// 战斗状态
interface BattleState {
  phase: BattlePhase;
  playerHP: number;
  enemyHP: number;
  enemyAttack: number;
  currentQuestion: Question | null;
  timeRemaining: number;
  battleResult: BattleResult;
  questionCount: number;
  correctCount: number;
  combo: number;
  maxCombo: number;
}

// 战斗记录
interface BattleRecord {
  id: string;
  timestamp: Date;
  config: BattleConfig;
  result: BattleResult;
  totalTime: number;
  questionCount: number;
  correctCount: number;
  maxCombo: number;
  remainingPlayerHP: number;
  finalEnemyAttack: number;
  questionType: string;       // 题型标识（如 'arithmetic', 'fraction' 等）
}
```

#### 5.1.2 战斗引擎核心
**文件**: `src/composables/useBattleEngine.ts`

核心功能：
- 初始化战斗状态
- 管理倒计时（准备计时、答题计时、敌人攻击计时）
- 验证答案并计算伤害
- 处理敌人攻击逻辑
- 判断战斗结果
- 生成战斗记录
- 支持暂停/恢复/逃跑

#### 5.1.3 控制面板模式扩展
**文件**: `src/components/ControlPanel.vue`

修改内容：
```vue
<!-- 模式选择区域改为三选一 -->
<el-radio-group v-model="answerMode" size="large">
  <el-radio-button label="practice">练习模式</el-radio-button>
  <el-radio-button label="answering">答题模式</el-radio-button>
  <el-radio-button label="battle">⚔️ 游戏模式</el-radio-button>
</el-radio-group>

<!-- 模式说明 -->
<div class="mode-description">
  <span v-if="answerMode === 'battle'">
    游戏模式：在战斗中快速驯服能量团，答得越快伤害越高！
  </span>
</div>
```

**新增 props**:
```typescript
// ControlPanel 新增 props
interface BattleSettings {
  difficulty: 'easy' | 'normal' | 'hard';  // 难度选择
  enemyHP: number;                          // 自定义敌人血量
  questionTime: number;                     // 自定义答题时间
}
```

### 5.2 第二阶段：战斗界面组件（Day 3-4）

#### 5.2.1 战斗HUD组件
**文件**: `src/components/battle/BattleHUD.vue`

显示内容：
- 玩家血量条（带数字显示）
- 能量团血量条（带数字显示）
- 敌人攻击力显示
- 当前题目序号
- 正确/错误统计
- 连击数显示（带火焰特效）

#### 5.2.2 能量团显示组件
**文件**: `src/components/battle/BattleEnemy.vue`

显示内容：
- 能量团动画效果（粒子悬浮）
- 血量数字显示
- 攻击力数字显示
- 受击动画（答对时闪烁+震动）
- 攻击动画（每10秒发射攻击波）

#### 5.2.3 战斗题目组件
**文件**: `src/components/battle/BattleQuestion.vue`

功能：
- 显示当前题目（大字体居中）
- 答案输入框（自动聚焦）
- 提交按钮（支持 Enter 快捷键）
- 答题状态即时反馈
- 键盘快捷键支持（Enter 提交，Esc 逃跑）

#### 5.2.4 倒计时组件
**文件**: `src/components/battle/BattleTimer.vue`

功能：
- 大字体倒计时显示
- 进度条动画
- 时间预警（最后3秒变红闪烁）
- 时间到自动触发验证

### 5.3 第三阶段：战斗逻辑集成（Day 5-6）

#### 5.3.1 修改四则运算页面
**文件**: `src/views/ArithmeticPage.vue`

修改内容：
1. 模式切换逻辑扩展
```typescript
// 新增 battle 模式处理
const handleModeChange = (newMode: PracticeMode) => {
  if (newMode === 'battle') {
    // 进入战斗模式
    initializeBattle();
  } else {
    // 退出战斗模式
    endBattle();
  }
};

// 战斗引擎集成
const {
  battleState,
  startBattle,
  submitAnswer,
  retreat,
  getBattleRecord
} = useBattleEngine();
```

2. 模板条件渲染
```vue
<!-- 练习/答题模式：原有题目显示 -->
<div v-if="answerMode !== 'battle'" class="question-display-section">
  <QuestionDisplay ... />
</div>

<!-- 游戏模式：战斗界面 -->
<div v-else class="battle-section">
  <BattleHUD ... />
  <BattleEnemy ... />
  <BattleTimer ... />
  <BattleQuestion ... />
</div>

<!-- 战斗结果弹窗 -->
<BattleResult v-if="showBattleResult" ... />
```

#### 5.3.2 修改其他题型页面
参考 ArithmeticPage.vue 的修改方式，依次修改：
- `src/views/EquationPage.vue` - 一元一次方程
- `src/views/FractionPage.vue` - 分数运算
- `src/views/DecimalPage.vue` - 小数运算
- `src/views/PercentagePage.vue` - 百分数
- `src/views/UnitConversionPage.vue` - 单位换算
- `src/views/GeometryPage.vue` - 几何计算
- `src/views/FactorMultiplePage.vue` - 倍数与因数
- `src/views/PrimeCompositePage.vue` - 质数与合数
- `src/views/ComparisonPage.vue` - 比较大小
- `src/views/PatternPage.vue` - 找规律

**注意**：每个页面需要根据各自的题目类型，配置相应的 BattleConfig。

#### 5.3.3 战斗结果面板
**文件**: `src/components/battle/BattleResult.vue`

显示内容：
- 胜利/失败状态（大图标）
- 战斗统计卡片
- 战斗记录保存
- "再战一场"和"返回练习"按钮

### 5.4 第四阶段：样式与优化（Day 7）

#### 5.4.1 战斗模式样式
**文件**: `src/assets/styles/battle.css`

- 战斗主题样式（深色背景，科技感）
- 动画效果（受击、攻击、连击等）
- 响应式设计（适配不同屏幕尺寸）
- 音效配置（可选）

#### 5.4.2 全局样式调整
修改 `src/assets/styles/main.css`，添加：
- 模式切换动画过渡
- 战斗模式专用 CSS 变量

---

## 6. API设计

### 6.1 战斗引擎 composable

```typescript
// useBattleEngine.ts
export function useBattleEngine(
  config: BattleConfig,
  questionGenerator: () => Question[]
) {
  // 状态
  const state = reactive<BattleState>({
    phase: 'idle',
    playerHP: config.playerHP,
    enemyHP: config.enemyHP,
    enemyAttack: config.enemyBaseAttack,
    currentQuestion: null,
    timeRemaining: 0,
    battleResult: null,
    questionCount: 0,
    correctCount: 0,
    combo: 0,
    maxCombo: 0
  });

  // 计算属性
  const isPreparing = computed(() => state.phase === 'preparing');
  const isAnswering = computed(() => state.phase === 'answering');
  const isEnded = computed(() => state.phase === 'ended');
  const playerHPPercent = computed(() => (state.playerHP / config.playerHP) * 100);
  const enemyHPPercent = computed(() => (state.enemyHP / config.enemyHP) * 100);

  // 方法
  function initializeBattle(): void;
  function startBattle(): void;
  function submitAnswer(answer: number | null): void;
  function handleTimeUp(): void;
  function handleEnemyAttack(): void;
  function checkBattleEnd(): BattleResult | null;
  function retreat(): BattleRecord;
  function resetBattle(): void;
  function getBattleRecord(): BattleRecord;

  // 计时器管理
  let prepareTimer: number | null = null;
  let questionTimer: number | null = null;
  let enemyAttackTimer: number | null = null;

  function startPrepareTimer(): void;
  function startQuestionTimer(): void;
  function startEnemyAttackTimer(): void;
  function clearAllTimers(): void;

  return {
    state,
    isPreparing,
    isAnswering,
    isEnded,
    playerHPPercent,
    enemyHPPercent,
    initializeBattle,
    startBattle,
    submitAnswer,
    retreat,
    resetBattle,
    getBattleRecord
  };
}
```

### 6.2 组件 Props/Events

#### BattleHUD.vue
```typescript
interface Props {
  playerHP: number;
  playerMaxHP: number;
  enemyHP: number;
  enemyMaxHP: number;
  enemyAttack: number;
  questionNumber: number;
  totalQuestions: number;
  correctCount: number;
  combo: number;
}

interface Emits {
  (e: 'retreat'): void;
}
```

#### BattleEnemy.vue
```typescript
interface Props {
  hp: number;
  maxHP: number;
  attack: number;
  isHit: boolean;      // 是否被击中（用于动画）
  isAttacking: boolean; // 是否在攻击（用于动画）
}

interface Emits {
  (e: 'animationEnd', type: 'hit' | 'attack'): void;
}
```

#### BattleQuestion.vue
```typescript
interface Props {
  question: Question;
  timeRemaining: number;
  maxTime: number;
}

interface Emits {
  (e: 'submit', answer: number | null): void;
  (e: 'timeout'): void;
  (e: 'retreat'): void;
}
```

### 6.3 页面集成接口

每个题型页面需要实现以下集成接口：

```typescript
// ArithmeticPage.vue 集成示例
import { useBattleEngine } from '@/composables/useBattleEngine';
import { useQuestionGenerator } from '@/composables/useQuestionGenerator';

// 模式切换
watch(answerMode, (newMode) => {
  if (newMode === 'battle') {
    // 初始化战斗
    const { initializeBattle, startBattle } = useBattleEngine(
      battleConfig.value,
      () => generateQuestions(config.value)
    );
    initializeBattle();
    // 显示战斗界面
  } else {
    // 退出战斗
    endBattle();
    // 显示普通题目界面
  }
});

// 提交答案
const handleBattleAnswer = (answer: number | null) => {
  submitAnswer(answer);
  // 自动获取下一题
};
```

---

## 7. 数据存储设计

### 7.1 战斗记录结构

```typescript
interface BattleRecord {
  id: string;                    // 记录ID（时间戳+随机数）
  timestamp: Date;              // 战斗时间
  duration: number;             // 战斗持续时间（秒）
  result: 'victory' | 'defeat'; // 战斗结果
  questionType: string;         // 题型（如 'arithmetic', 'fraction', 'decimal' 等）
  config: {
    playerHP: number;           // 玩家初始血量
    enemyHP: number;            // 敌人初始血量
    enemyBaseAttack: number;    // 敌人基础攻击力
    questionCount: number;      // 题目数量
    difficulty: string;         // 难度级别
  };
  stats: {
    totalQuestions: number;     // 总答题数
    correctAnswers: number;     // 正确数
    accuracy: number;           // 正确率
    maxCombo: number;           // 最大连击
    finalEnemyAttack: number;   // 最终敌人攻击力
    remainingPlayerHP: number;  // 剩余玩家血量
  };
}
```

### 7.2 本地存储键

- `battle_records`: 战斗记录数组（按题型分组存储）
- `battle_best_${questionType}`: 各题型最佳战绩
- `battle_settings`: 用户设置（难度偏好等）
- `battle_stats_${questionType}`: 各题型统计数据

### 7.3 题型标识映射

```typescript
const QUESTION_TYPE_MAP: Record<string, string> = {
  'arithmetic': '四则运算',
  'equation': '一元一次方程',
  'fraction': '分数运算',
  'decimal': '小数运算',
  'percentage': '百分数',
  'unit-conversion': '单位换算',
  'geometry': '几何计算',
  'factor-multiple': '倍数与因数',
  'prime-composite': '质数与合数',
  'comparison': '比较大小',
  'pattern': '找规律'
};
```

---

## 8. 动画与反馈设计

### 8.1 倒计时动画
- 最后3秒：红色闪烁 + 警告音效
- 时间到：震动效果 + 错误音效

### 8.2 答题反馈动画
- 答对：绿色对勾 + 烟花特效 + 成功音效
- 答错：红色叉号 + 抖动效果 + 错误音效

### 8.3 伤害显示动画
- 伤害数字从题目位置飞向能量团
- 能量团受击闪烁
- 能量团血量减少动画

### 8.4 敌人攻击动画
- 能量团发射攻击波
- 玩家血条减少动画
- 玩家受击闪烁

### 8.5 战斗结果动画
- 胜利：庆祝动画 + 奖章展示
- 失败：鼓励动画 + 复仇按钮

---

## 9. 测试计划

### 9.1 单元测试
- 伤害计算逻辑测试
- 倒计时准确性测试
- 状态转换测试
- 战斗结束判断测试

### 9.2 集成测试
- 完整战斗流程测试
- 组件交互测试
- 数据存储测试

### 9.3 手动测试
- 不同难度级别测试
- 边界情况测试（血量归零、时间归零等）
- 响应式布局测试
- 性能测试（大量连续操作）

---

## 10. 里程碑与时间安排

### Day 1-2: 类型定义与战斗引擎
- [ ] 完成类型定义扩展（BattleState, BattleConfig, BattleRecord）
- [ ] 实现战斗引擎核心逻辑（useBattleEngine.ts）
- [ ] 修改 ControlPanel.vue 添加游戏模式选项
- [ ] 修改 ControlPanel.vue 添加难度和设置选项

### Day 3-4: 战斗界面组件
- [ ] 实现战斗HUD组件
- [ ] 实现能量团显示组件
- [ ] 实现战斗题目组件
- [ ] 实现倒计时组件
- [ ] 实现战斗结果面板组件
- [ ] 编写战斗模式样式

### Day 5-6: 页面集成
- [ ] 修改 ArithmeticPage.vue 支持游戏模式（四则运算）
- [ ] 修改 EquationPage.vue 支持游戏模式（一元一次方程）
- [ ] 修改 FractionPage.vue 支持游戏模式（分数运算）
- [ ] 修改 DecimalPage.vue 支持游戏模式（小数运算）
- [ ] 修改其他题型页面（Percentage, UnitConversion, Geometry, FactorMultiple, PrimeComposite, Comparison, Pattern）

### Day 7: 测试与优化
- [ ] 整体功能测试
- [ ] 跨题型兼容性测试
- [ ] 响应式布局测试
- [ ] 性能优化
- [ ] 文档完善

### 验收标准
- [ ] 在任意题型下可切换到游戏模式
- [ ] 完整战斗流程可运行
- [ ] 倒计时精确无误
- [ ] 伤害计算正确
- [ ] 界面响应式适配
- [ ] 动画效果流畅
- [ ] 无明显bug

---

## 11. 风险与应对

### 11.1 技术风险
- **倒计时不准确**：使用 `requestAnimationFrame` 替代 `setInterval`，定期同步系统时间
- **状态同步问题**：使用 Vue 3 响应式系统，确保状态变更及时反映到UI

### 11.2 用户体验风险
- **难度过高**：提供简单/普通/困难三档选择
- **时间压力过大**：允许跳过题目（放弃当前题，不造成额外伤害）
- **负反馈过强**：答错不直接扣血，而是增加敌人攻击力

### 11.3 性能风险
- **动画卡顿**：使用 CSS 动画替代 JS 动画，减少重绘
- **内存泄漏**：及时清理定时器，避免内存累积

---

## 12. 后续扩展方向（Phase 2）

- [ ] 连击系统（连续答对获得伤害加成）
- [ ] 技能系统（使用道具增加伤害或减少敌人攻击）
- [ ] Boss战模式（多阶段能量团）
- [ ] 排行榜系统（战斗成绩排名）
- [ ] 成就系统（解锁特殊成就）
- [ ] 多人对战（实时PVP）

---

## 13. 关键代码片段

### 13.1 伤害计算示例

```typescript
function calculateDamage(timeSpent: number, maxTime: number): number {
  const remaining = maxTime - timeSpent;
  return Math.ceil(remaining * 10) / 10; // 剩余时间保留1位小数，向上取整
}

// 示例：10.0秒倒计时，5.3秒时答对
// remaining = 10.0 - 5.3 = 4.7
// damage = Math.ceil(4.7) = 5点
```

### 13.2 敌人攻击力更新

```typescript
function updateEnemyAttack(currentAttack: number): number {
  return Math.round(currentAttack * 1.1 * 10) / 10; // 增加10%，保留1位小数
}

// 示例：初始10.0 → 11.0 → 12.1 → 13.3 → 14.6 → 16.1
```

### 13.3 战斗流程控制

```typescript
function handleAnswerSubmit(answer: number | null) {
  if (!currentQuestion.value) return;
  
  const isCorrect = answer === currentQuestion.value.answer;
  const timeSpent = maxTime.value - timeRemaining.value;
  
  if (isCorrect) {
    // 答对：计算伤害
    const damage = calculateDamage(timeSpent, maxTime.value);
    enemyHP.value -= damage;
    combo.value += 1;
    maxCombo.value = Math.max(maxCombo.value, combo.value);
    
    // 生成新题目
    nextQuestion();
  } else {
    // 答错：敌人攻击力增加
    enemyAttack.value = updateEnemyAttack(enemyAttack.value);
    combo.value = 0;
    
    // 生成新题目
    nextQuestion();
  }
  
  // 检查战斗结束
  checkBattleEnd();
}
```

---

**文档版本**: 1.0
**创建日期**: 2026-01-30
**负责人**: 数学星球产品团队
