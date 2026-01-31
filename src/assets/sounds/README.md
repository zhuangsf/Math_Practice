# Sound Effects for Game Mode

## Directory Structure

```
sounds/
├── battle/          # Battle mode sound effects
└── README.md
```

## Battle Mode Sounds (`battle/`)

### win_*.mp3 — Consecutive Correct Answers

| File    | Usage                                      |
|---------|--------------------------------------------|
| win_1.mp3 | 1st correct answer                         |
| win_2.mp3 | 2nd consecutive correct                    |
| win_3.mp3 | 3rd consecutive correct                    |
| win_4.mp3 | 4th consecutive correct                    |
| win_5.mp3 | 5th consecutive correct                    |
| win_6.mp3 | 6th consecutive correct                    |
| win_7.mp3 | 7th or more consecutive correct (capped)   |

- Combo resets on wrong answer or timeout.
- For 7+ consecutive correct, always use `win_7.mp3`.

### Other Sounds

| File        | Usage                    |
|-------------|--------------------------|
| lost.mp3    | Wrong answer / timeout   |
| attack.mp3  | Enemy attack             |
| defeat.mp3  | Battle defeat            |
| find.mp3    | Battle victory           |
| battle_bg.mp3 | Battle background music (optional) |

## Supported Formats

- MP3, WAV, OGG (browser compatible)
- Keep file size small for quick loading
