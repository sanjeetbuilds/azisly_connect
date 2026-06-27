# Azisly Recruit

A clickable prototype. React + Vite + Tailwind v4.

## Design philosophy

Calm, premium, minimal — in the spirit of Untitled UI and Linear. The interface
is almost entirely **ink on warm white**. Colour appears **only** to signal
meaning (a candidate's verdict), never for decoration.

### Tokens (`src/index.css`)

| Token        | Value     | Use                                   |
| ------------ | --------- | ------------------------------------- |
| `background` | `#FAFAF8` | warm off-white page                   |
| `surface`    | `#FFFFFF` | cards / panels                        |
| `ink`        | `#16161A` | primary text + primary buttons        |
| `secondary`  | `#6B6B72` | secondary text                        |
| `hairline`   | `#E7E7E3` | borders                               |
| `strong`     | `#2E7D55` | verdict only — strong (green)         |
| `attention`  | `#B7791F` | verdict only — look closer (amber)    |

- **Type:** Inter (medium-weight headings, not heavy), JetBrains Mono for
  numbers/scores and tiny uppercase metadata labels.
- **Shape:** pill buttons; cards at ~10px radius with a hairline border; **no
  shadows anywhere** — separation via whitespace and hairlines only.
- **Motion:** one signature motion — a gentle staggered fade-in for lists
  (`StaggerList`). Respects `prefers-reduced-motion`.

## Design system (`src/components/`)

`Button` · `Card` · `Input` · `CompetencyBar` · `ScoreDisplay` · `VerdictTag` ·
`Nav` · `EvidenceQuote` · `StaggerList`

`src/App.jsx` is a single demo page showing each component once.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Deploy

Vercel auto-detects the Vite framework (`vercel.json` is included). Push to a
Git remote and import the repo in Vercel, or run `vercel`.
