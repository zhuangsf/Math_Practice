# 数学战斗模式 - 实现总结

## 已完成的功能

### 1. 类型定义扩展 (`src/types/index.ts`)
- 添加了 `PracticeMode` 类型（practice | answering | battle）
- 添加了 `BattleConfig` 接口（战斗配置）
- 添加了 `BattleState` 接口（战斗状态）
- 添加了 `BattleRecord` 接口（战斗记录）
- 添加了 `BattleSettings` 接口（战斗设置）
- 添加了 `BattleQuestionType` 类型（支持的题型）

### 2. 战斗引擎 (`src/composables/useBattleEngine.ts`)
- 核心战斗逻辑实现
- 倒计时管理（准备3秒 + 答题10秒）
- 伤害计算（剩余时间作为伤害值）
- 敌人攻击力更新（答错增加10%）
- 战斗状态机管理
- 战斗记录生成

### 3. 战斗组件 (`src/components/battle/`)
- `BattleHUD.vue` - 战斗HUD显示（玩家/敌人血量、统计信息）
- `BattleEnemy.vue` - 能量团显示（动画效果）
- `BattleQuestion.vue` - 战斗题目显示（输入框、提交按钮）
- `BattleTimer.vue` - 倒计时组件（精确到0.1秒）
- `BattleResult.vue` - 战斗结果展示

### 4. 控制面板修改 (`src/components/ControlPanel.vue`)
- 新增游戏模式选项（三选一：练习/答题/游戏）
- 新增战斗设置面板（难度、能量团HP、答题时间）
- 战斗预览信息显示

### 5. 四则运算页面集成 (`src/views/ArithmeticPage.vue`)
- 战斗模式完整集成
- 战斗流程管理
- 战斗结果显示
- 重新战斗/返回功能

## 核心机制

### 战斗参数
| 参数 | 初始值 | 说明 |
|------|--------|------|
| 玩家HP | 100 | 玩家生命值 |
| 能量团HP | 50 | 敌人生命值（可配置20-100） |
| 能量团攻击力 | 10 | 敌人每次攻击伤害 |
| 准备倒计时 | 3秒 | 进入战斗前的准备时间 |
| 题目倒计时 | 10秒 | 每道题的答题时间限制（可配置5-20秒） |
| 敌人攻击间隔 | 10秒 | 能量团攻击玩家的周期 |

### 伤害计算
- **答对题目时**：伤害 = 剩余秒数（保留1位小数，向上取整）
  - 例如：10.0秒倒计时，5.3秒时答对，伤害 = 5.3 → 取整为 6点
  
- **答错或超时时**：能量团攻击力增加 10%
  - 例如：初始10.0 → 11.0 → 12.1 → 13.3...

### 胜利条件
- 能量团HP ≤ 0：玩家胜利
- 玩家HP ≤ 0：玩家失败

## 使用方法

### 1. 启动应用
```bash
cd d:\cursorspace\Math_Practice
npm run dev
```

### 2. 进入战斗模式
1. 切换到"四则运算"页签
2. 在答题模式选择中选择"游戏模式"（第三个选项）
3. 配置战斗设置（难度、能量团HP、答题时间）
4. 点击"开始战斗"按钮

### 3. 战斗流程
1. 3秒准备倒计时
2. 题目出现 + 10秒倒计时开始
3. 输入答案，按 Enter 提交
4. 答对：能量团扣血，获得伤害值
5. 答错：能量团攻击力增加10%
6. 每10秒：能量团攻击玩家
7. 战斗结束：显示结果弹窗

## 下一步工作

### 扩展到其他题型
参考 `ArithmeticPage.vue` 的修改方式，依次修改：
- `EquationPage.vue` - 一元一次方程
- `FractionPage.vue` - 分数运算
- `DecimalPage.vue` - 小数运算
- `PercentagePage.vue` - 百分数
- `UnitConversionPage.vue` - 单位换算
- `GeometryPage.vue` - 几何计算
- `FactorMultiplePage.vue` - 倍数与因数
- `PrimeCompositePage.vue` - 质数与合数
- `ComparisonPage.vue` - 比较大小
- `PatternPage.vue` - 找规律

### 后续功能扩展
- 连击系统（连续答对获得伤害加成）
- 技能系统（使用道具增加伤害或减少敌人攻击）
- Boss战模式（多阶段能量团）
- 排行榜系统（战斗成绩排名）
- 成就系统（解锁特殊成就）

## 文件清单

```
src/
├── types/
│   └── index.ts                    # 已更新：添加战斗相关类型
├── composables/
│   ├── useQuestionGenerator.ts     # 现有：题目生成
│   ├── useBattleEngine.ts          # 新增：战斗引擎
│   └── ...
├── components/
│   ├── ControlPanel.vue            # 已更新：添加游戏模式选项
│   ├── battle/
│   │   ├── BattleHUD.vue           # 新增：战斗HUD
│   │   ├── BattleEnemy.vue         # 新增：能量团显示
│   │   ├── BattleQuestion.vue      # 新增：题目显示
│   │   ├── BattleTimer.vue         # 新增：倒计时
│   │   └── BattleResult.vue        # 新增：结果展示
│   └── ...
└── views/
    ├── ArithmeticPage.vue          # 已更新：集成战斗模式
    └── ...
```

## 测试清单

- [ ] 模式切换正常（练习/答题/游戏）
- [ ] 战斗设置生效（难度、HP、答题时间）
- [ ] 3秒准备倒计时正常
- [ ] 10秒答题倒计时精确到0.1秒
- [ ] 答对计算伤害正确
- [ ] 答错增加敌人攻击力
- [ ] 敌人每10秒攻击玩家
- [ ] 战斗结束判断正确（胜利/失败）
- [ ] 结果弹窗显示正确
- [ ] 重新战斗功能正常
- [ ] 返回功能正常

---

**实现日期**: 2026-01-30
**版本**: 1.0 (MVP)
