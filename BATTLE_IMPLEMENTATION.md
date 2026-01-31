# 数学战斗模式 - 实现说明与扩展规划

本文档基于当前代码逻辑，详细描述战斗相关逻辑，并为后续在不同运算模式中统一实现战斗模式提供开发步骤与接口约定。

---

## 一、术语与概念

| 术语 | 含义 | 代码中的对应 |
|------|------|--------------|
| 征服者 | 玩家 | `playerHP`、战斗日志中的“征服者” |
| 能量团 | 敌人 | `enemyHP`、`enemyAttack`、战斗日志中的“能量团” |
| 战斗阶段 | 当前战斗所处状态 | `BattlePhase`: idle / preparing / answering / ended |

---

## 二、当前战斗逻辑总览

### 2.1 状态机

战斗由 **useBattleEngine** 管理，阶段流转如下：

```
idle（待命）
  → 用户点击「开始战斗」
  → preparing（准备，倒计时 prepareTime 秒）
  → 倒计时结束
  → answering（答题中）
  → 满足结束条件 或 用户撤退
  → ended（结束）
  → 用户「重新战斗」则回到 preparing，或「返回」回到 idle
```

- **idle**：未开始，可配置并点击开始。
- **preparing**：固定秒数倒计时（默认 3 秒），期间不答题。
- **answering**：出题 + 答题倒计时 + 能量团定时攻击同时进行。
- **ended**：已出结果（胜利/失败/撤退），弹结果弹窗。

### 2.2 核心参数（BattleConfig）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| playerHP | number | 100 | 征服者初始 HP |
| enemyHP | number | 50 | 能量团初始 HP（控制面板可配，约 20–100） |
| enemyBaseAttack | number | 10 | 能量团基础攻击力 |
| prepareTime | number | 3 | 准备阶段倒计时（秒） |
| questionTime | number | 10 | 单题答题时限（秒，可配 5–20） |
| enemyAttackInterval | number | 10 | 能量团攻击间隔（秒） |
| questionCount | number | 20 | 本局题目数量（用于 HUD 显示等，实际为“按需生成”） |

题目内容由各页面的「题目配置 + 题目生成器」决定，难度等不再在 BattleConfig 中单独维护。

### 2.3 伤害与攻击逻辑

- **答对**
  - 对能量团造成伤害：`damage = calculateDamage(timeSpent, questionTime)`
  - 公式：`remaining = questionTime - timeSpent`，`damage = max(0.1, ceil(remaining * 10) / 10)`（保留一位小数、向上取整，最小 0.1）。
  - 能量团 HP 减少；连击数 +1，并更新 maxCombo。
- **答错或超时**
  - 能量团攻击力提升：`enemyAttack = updateEnemyAttack(enemyAttack)`，即 `round(enemyAttack * 1.1 * 10) / 10`（约 +10%）。
  - 连击清零。
- **能量团攻击**
  - 在 answering 阶段，每隔 `enemyAttackInterval` 秒执行一次：`playerHP -= enemyAttack`（不低于 0）。
  - 若玩家 HP 归零，立即进入 ended，结果为 defeat。

### 2.4 结束条件与结果

- **victory**：能量团 HP ≤ 0（当前题目答对后结算时判断）。
- **defeat**：玩家 HP ≤ 0（可在能量团定时攻击或答错/超时后的某次结算时触发）。
- **retreat**：用户主动撤退（如 Esc 或撤退按钮），`isRetreated = true`，结果记为 retreat。

### 2.5 计时器与精度

- **准备倒计时**：每秒减 1，到 0 后清除并调用 `startBattle()`。
- **答题倒计时**：每 100ms 更新一次，`timeRemaining -= delta`（基于时间戳差值），精度 0.1 秒；到 0 触发 `handleTimeUp()`（视为超时，不判对错）。
- **能量团攻击**：`setInterval(enemyAttackInterval * 1000)`，周期触发 `handleEnemyAttack()`。

所有定时器在 `endBattle`、`resetBattle`、`clearAllTimers` 时会被清理；页面卸载时应在 `onUnmounted` 中调用 `clearAllTimers()`（当前在 BattlePage 中处理）。

### 2.6 战斗日志（battleLog）

- `state.battleLog` 为 `BattleLogEntry[]`，每条含：`id`、`type`、`message`、可选 `detail`、`timestamp`。
- `type`：phase / correct / wrong / timeout / enemy_attack / victory / defeat / retreat。
- 用于右侧「战斗信息」面板展示；新条目追加时建议滚动到底部（当前 BattlePage 已做 watch 滚动）。

---

## 三、数据流与接口约定

### 3.1 useBattleEngine 签名与约束

```ts
useBattleEngine(
  config: BattleConfig,
  questionType: string,        // 如 'arithmetic'
  questionTypeName: string,   // 如 '四则运算'
  questionGenerator: () => Question[]  // 每次返回至少一题的数组，当前仅支持 Question 类型
)
```

- **config**：上述战斗参数，只读使用。
- **questionType / questionTypeName**：写入战斗记录（BattleRecord），用于区分题型。
- **questionGenerator**：每次需要下一题时调用；应返回「当前题型」的题目数组。**当前实现中，引擎和 BattleQuestion 组件均假定题目为 `Question`（expression: string, answer: number）。**

返回对象包括：`state`（BattleState）、`playerHPPercent`、`enemyHPPercent`、`isPreparing`、`isAnswering`、`isEnded`、`isIdle`、`battleStarted`，以及方法：`initializeBattle`、`startBattle`、`startPrepareTimer`、`submitAnswer(answer: number | null)`、`retreat`、`resetBattle`、`getBattleRecord`、`clearAllTimers` 等。

### 3.2 题目类型与答案类型（当前与扩展）

- **当前**：仅支持 **四则运算**，题目类型为 `Question`（`src/types/index.ts`）：`id`、`expression`、`answer: number`、`numbers`、`operators`。
- **BattleState.currentQuestion** 类型为 `Question | null`；**submitAnswer** 参数为 `number | null`；**BattleQuestion.vue** 接收 `question: Question`，提交 `answer: number | null`。
- **其他题型**（方程、分数、小数、百分数、单位换算、几何、因数倍数、质数合数、比较、找规律）在 types 中已有 `BattleQuestionType` 枚举，但引擎与题目组件尚未抽象为「多题型通用」：
  - 各题型答案类型不一致：`number`、`Fraction`、`string`、`number[]`、`boolean` 等。
  - 若要在各运算模式中复用同一套战斗流程，需要约定「战斗用题目接口」与「答案校验/提交形态」（见下文扩展规划）。

### 3.3 页面集成方式（当前两种）

1. **ArithmeticPage.vue（内嵌战斗）**
   - 模式选择：ControlPanel 的 `answerMode` 为 `practice | answering | battle`；选「游戏模式」即 battle。
   - 战斗配置：`battleSettings`（enemyHP、questionTime） + 主面板的题目配置（如运算类型、范围等），合成为 `battleConfig`。
   - 流程：点击「开始战斗」 → `initBattleEngine()`（内部使用 `useQuestionGenerator` 生成四则题）→ `initializeBattle()` → `startPrepareTimer()`；答题时 `BattleQuestion` 触发 `@submit`，页面调用 `submitAnswer(answer)`，并根据结果刷新 HUD、能量团受击/攻击动画、结果弹窗等。
   - 结果：`BattleResult` 弹窗，可「重新战斗」或「返回」；返回后保持 battle 模式，可再次开始。

2. **BattlePage.vue（沉浸式战斗页）**
   - 通过 **useBattleNavigation** 进入：`enterBattleMode(questionType, questionTypeName, questionConfig, battleSettings)`，保存题型与配置；路由到 Battle 页后，用 `battleConfig`（由 questionConfig + battleSettings 推导）和 `questionConfig` 初始化引擎。
   - 题目生成：当前仅用 `useQuestionGenerator`（即四则运算），传入 `questionConfig` 且 `questionCount: 1` 每次取下一题。
   - 布局：左侧战斗区（HUD + 能量团 + 计时 + 题目 + 统计），右侧战斗信息（battleLog）；支持 Esc 撤退确认、结果弹窗的重新战斗/返回。
   - 返回路径：`getReturnPath()` 为 `/page/${questionType}`，例如 `/page/arithmetic`。

两处都应在组件卸载时清理定时器（BattlePage 已做；ArithmeticPage 若存在卸载战斗区域也需保证 clearAllTimers）。

---

## 四、文件与职责清单

| 路径 | 职责 |
|------|------|
| `src/types/index.ts` | BattlePhase、BattleResult、BattleConfig、BattleState、BattleRecord、BattleLogEntry、BattleSettings、BattleQuestionType、PracticeMode 等 |
| `src/composables/useBattleEngine.ts` | 状态机、计时器、伤害/攻击计算、submitAnswer、retreat、战斗记录生成、battleLog 写入 |
| `src/composables/useBattleNavigation.ts` | 沉浸式战斗的入口状态（题型、题目配置、战斗设置）、battleConfig 派生、返回路径 |
| `src/components/ControlPanel.vue` | 模式切换（练习/答题/游戏）、战斗设置（能量团 HP、答题时间）、战斗预览信息 |
| `src/components/battle/BattleHUD.vue` | 玩家/能量团血量条、题号进度、统计信息 |
| `src/components/battle/BattleEnemy.vue` | 能量团表现、受击/攻击动画、lastDamage 展示 |
| `src/components/battle/BattleTimer.vue` | 答题倒计时显示（0.1 秒精度） |
| `src/components/battle/BattleQuestion.vue` | 题目展示 + 答案输入 + 提交/撤退，**当前仅支持 Question + number 答案** |
| `src/components/battle/BattleResult.vue` | 结果弹窗（胜负/撤退）、统计、重新战斗/返回 |
| `src/views/ArithmeticPage.vue` | 四则运算页内嵌战斗：模式与配置、初始化引擎、题目生成、事件与结果处理 |
| `src/views/BattlePage.vue` | 沉浸式战斗页：导航状态、引擎初始化、题目生成（当前仅四则）、布局与撤退/结果 |

---

## 五、扩展到其他运算模式的开发步骤

目标：在不改变「一套战斗规则（伤害、攻击、阶段、日志）」的前提下，让方程、分数、小数等各运算模式都能使用同一套战斗流程，仅题目与答案形态不同。

### 5.1 抽象「战斗用题目」与「可提交答案」

- **方案 A（推荐先做）**：在 types 中定义战斗专用接口，例如：
  - `BattleQuestionBase { id: string; expression: string; answer: unknown }`，或
  - 泛型 `BattleQuestion<TAnswer>`，由各题型提供 `TAnswer`（number | Fraction | string 等）。
- 约定：引擎内部只关心「当前题目」、「用户提交的答案」和「是否正确」。  
  - 若保持现有 `submitAnswer(answer: number | null)`，可先让所有题型的「可提交形态」统一为 number 或 string（例如分数题在提交前转为 "a/b" 或数字比较结果），引擎内用各题型自己的校验函数比较。
- 或：**方案 B**：引擎改为 `submitAnswer(answer: unknown)`，内部根据 `questionType` 调用对应题型的 `checkAnswer(question, answer)`，这样题型可保留各自答案类型。

### 5.2 题目生成器注入

- 各页面（EquationPage、FractionPage、DecimalPage 等）已有各自的 generator（如 useEquationGenerator、useFractionGenerator）。
- 为战斗引擎提供「按需生成一道题」的函数：`() => OneQuestion[]`，其中 `OneQuestion` 满足上述战斗用题目接口（至少含 expression + 可校验的 answer）。
- 当前 useBattleEngine 的 `getNextQuestion()` 内部调用 `questionGenerator()[0]`，可保持「返回数组、取首项」的约定，仅把类型从 `Question` 泛化为 `BattleQuestionBase` 或联合类型。

### 5.3 题型与 BattleQuestion 组件

- **选项 1**：保留一个 BattleQuestion，通过 prop 传入「题目 + 题型」，组件内根据题型渲染不同输入（数字框、分数输入、选择等），并统一 emit 一种「可比较」的答案（如 string 或 number）。
- **选项 2**：每种题型一个 BattleQuestionXxx.vue（如 BattleQuestionFraction.vue），由父组件根据 `questionType` 动态挂载对应组件，各组件内部负责展示与答案格式，对父组件统一暴露 `@submit(payload)`。

### 5.4 推荐实施顺序

1. **类型与引擎解耦（不破坏现有四则）**
   - 在 `types/index.ts` 中增加 `BattleQuestionBase`（或泛型），让 `BattleState.currentQuestion` 可为该类型；增加 `CheckAnswerFn<T>` 或按题型注册的校验函数。
   - 在 useBattleEngine 中把 `Question` 改为上述基类/泛型，`submitAnswer` 仍可为 `number | null`，内部用「当前题型 + 校验函数」判断对错；四则仍传 number 并沿用现有校验。
2. **保持四则行为**
   - ArithmeticPage、BattlePage 的题目生成与 BattleQuestion 仍使用 `Question` 与 number，跑通现有测试与手动验证。
3. **第二种题型（建议选答案已是 number 的，如方程或小数）**
   - 为该题型实现「战斗用题目」适配（从 EquationQuestion/DecimalQuestion 转成 BattleQuestionBase 或当前引擎接受的形态）。
   - 在对应 Page 增加 battle 模式（或通过 BattlePage + useBattleNavigation 传入该题型配置），题目生成器改为该题型的 generator（每次 1 题）。
   - BattleQuestion 根据题型切换输入组件，或新建 BattleQuestionEquation / BattleQuestionDecimal，提交 number；引擎侧用该题型的校验逻辑。
4. **分数、百分数等答案非 number 的题型**
   - 确定统一提交形态（如 string "3/4" 或 "75%"），在引擎或校验层做归一比较；或采用方案 B，`submitAnswer(unknown)` + 题型校验函数。
5. **ControlPanel 与导航**
   - 若某页面新增 battle，需在该页的 ControlPanel 中支持 `answerMode === 'battle'` 及 battleSettings（可与 Arithmetic 共用同一 ControlPanel 接口）；从首页/列表进入沉浸式战斗时，通过 useBattleNavigation 传入对应 questionType 与 config，BattlePage 根据 questionType 选择题目生成器与题目展示组件。
6. **测试与文档**
   - 每个新题型的战斗：准备/答题/超时/答错/能量团攻击/胜利/失败/撤退、记录与日志均符合预期；更新本说明文档的「已支持题型」与「答案类型」表。

### 5.5 各运算模式对接检查表

对每种运算模式实现战斗时，可按下列项自检：

- [ ] 题目生成：能按需生成单题，并转换为引擎可接受的题目结构（含 expression + answer）。
- [ ] 答案校验：在引擎或校验层能根据该题型判断对错（含精度/格式约定）。
- [ ] 题目展示与输入：BattleQuestion 或题型子组件能正确显示题干并收集用户答案。
- [ ] 配置来源：battleConfig（HP、时间等）与题目难度/范围来自该页的配置与 battleSettings。
- [ ] 战斗记录：BattleRecord 的 questionType / questionTypeName 正确，stats 与战斗过程一致。
- [ ] 清理：页面卸载时 clearAllTimers，无定时器泄漏。

---

## 六、启动与快速验证

### 6.1 启动应用

```bash
cd d:\cursorspace\Math_Practice
npm run dev
```

### 6.2 内嵌战斗（四则运算）

1. 打开四则运算页，模式选择「游戏模式」。
2. 配置战斗设置（能量团 HP、答题时间）及题目配置。
3. 点击「开始战斗」→ 3 秒准备 → 答题，Enter 提交，Esc 可撤退。
4. 结束查看结果弹窗，可重新战斗或返回。

### 6.3 沉浸式战斗页（当前仅四则）

1. 在四则运算页选择游戏模式并配置后，若项目内提供「进入战斗页」入口，则通过 useBattleNavigation 进入 BattlePage。
2. 在战斗页点击「开始战斗」，流程同上；返回时回到对应题型页。

---

## 七、测试要点（可作清单）

- [ ] 模式切换：练习 / 答题 / 游戏 切换正常，战斗设置可见可改。
- [ ] 准备阶段：3 秒倒计时正常，结束后自动进入答题。
- [ ] 答题倒计时：精确到 0.1 秒，超时触发超时逻辑（攻击力上升、下一题）。
- [ ] 答对：伤害 = 剩余秒数（向上取整 0.1），能量团扣血，连击与 maxCombo 正确。
- [ ] 答错：能量团攻击力 +10%，连击清零。
- [ ] 能量团定时攻击：每 10 秒扣玩家 HP，扣到 0 即失败。
- [ ] 胜利/失败/撤退：条件与弹窗、记录一致；重新战斗、返回后状态与定时器正确。
- [ ] 战斗日志：correct/wrong/timeout/enemy_attack 等条目与详情正确，面板滚动正常。

---

**文档版本**：基于当前代码逻辑整理，便于多运算模式统一实现战斗模式。  
**最后更新**：2026-01-31
