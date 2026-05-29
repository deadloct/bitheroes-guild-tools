# bitheroes-guild-tools

CLI tools for tracking a [Bit Heroes](https://www.bitheroes.com/) guild. Uses the Claude API to OCR the in-game `CONTRIBUTION` leaderboard from screenshots, stores weekly snapshots, and reports per-member week-over-week deltas.

## Why

The mobile game has no export for guild contribution history. Officers screenshot the leaderboard each week to decide kicks and promotions, and eyeballing diffs between 30+ rows of comma-formatted numbers is error-prone. This tool reads the screenshots once with Claude, persists a JSON snapshot per week, and diffs the latest two snapshots.

## Setup

```sh
npm install
export ANTHROPIC_API_KEY=sk-ant-...
```

Optionally, create a gitignored `.env.local` to flag NFT heroes (separate diff table, own ranking) and set weekly contribution colour thresholds:

```sh
# .env.local
NFT_HEROES=Hero1,Hero2,Hero3
CONTRIBUTION_GREEN_THRESHOLD=500000   # weekly >= this is green
CONTRIBUTION_YELLOW_THRESHOLD=250000  # weekly >= this is yellow; below is red
```

Names are matched case-insensitively against the leaderboard. Heroes not listed are treated as basic. Threshold defaults are 500k / 250k. Colour is auto-disabled when output is not a TTY or when `NO_COLOR` is set. Process environment takes precedence over `.env.local`.

## Workflow

1. Drop one or more leaderboard screenshots into [screenshots/](screenshots/). Multiple paginated screenshots of the same leaderboard are fine — members appearing in more than one are deduplicated.
2. Extract the data:
   ```sh
   npm run contribution extract
   ```
   This calls Claude with all images in [screenshots/](screenshots/) and writes [history/](history/)`YYYY-MM-DD.json` with `{ name, contribution }` rows sorted by contribution desc. Token usage is printed so you can sanity-check cost.
3. Review the file for OCR errors (rare, but worth a glance for unusual names).
4. Diff against the previous week:
   ```sh
   npm run contribution diff
   ```
   Prints a ranked list of weekly gains, plus new and departed members. Rows under the green threshold are tagged with `(under reqs: Nw)` — the number of consecutive weeks (including this one) the player's weekly delta has stayed below green. Computed by walking back through history files only as far as needed.
5. Archive the processed screenshots:
   ```sh
   npm run contribution archive
   ```
   Moves everything in [screenshots/](screenshots/) into `screenshots/processed/YYYY-MM-DD/`.

## Commands

| Command | Description |
| --- | --- |
| `npm run contribution extract` | OCR screenshots/ via Claude, write history/YYYY-MM-DD.json |
| `npm run contribution diff` | Compute diff between the latest two history files |
| `npm run contribution archive` | Move processed screenshots into screenshots/processed/YYYY-MM-DD/ |

## Layout

```
cli.js                       # entry point
src/cli/                     # generic command + registry plumbing
src/commands/contribution/   # the contribution command and its subcommands
history/                     # per-week snapshots (committed)
screenshots/                 # current week's input (gitignored)
screenshots/processed/       # archived screenshots, grouped by date
```
