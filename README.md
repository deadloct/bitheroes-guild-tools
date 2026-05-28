# bitheroes-guild-tools

CLI tools for tracking a [Bit Heroes](https://www.bitheroes.com/) guild. Uses the Claude API to OCR the in-game `CONTRIBUTION` leaderboard from screenshots, stores weekly snapshots, and reports per-member week-over-week deltas.

## Why

The mobile game has no export for guild contribution history. Officers screenshot the leaderboard each week to decide kicks and promotions, and eyeballing diffs between 30+ rows of comma-formatted numbers is error-prone. This tool reads the screenshots once with Claude, persists a JSON snapshot per week, and diffs the latest two snapshots.

## Setup

```sh
npm install
export ANTHROPIC_API_KEY=sk-ant-...
```

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
   Prints a ranked list of weekly gains, plus new and departed members.
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
