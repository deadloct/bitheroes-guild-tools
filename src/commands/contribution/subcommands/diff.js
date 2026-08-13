import { Command } from "../../../cli/command.js";
import { makeColorizer } from "../colors.js";
import { WeekDiff } from "../diff.js";
import { HistoryStore } from "../history.js";
import { loadIgnoredHeroes, makeIsIgnored as makeIsIgnoredHero } from "../ignoreHeroes.js";
import { loadNftHeroes, makeIsNft } from "../nftHeroes.js";
import { HISTORY_DIR } from "../paths.js";
import { renderDiff, renderWeekRecord } from "../render.js";
import { computeUnderThresholdStreaks } from "../streaks.js";
import { loadThresholds } from "../thresholds.js";

export class DiffSubcommand extends Command {
  name = "diff";
  description = "Compute diff between the latest two history files";

  async run() {
    const isIgnored = makeIsIgnoredHero(loadIgnoredHeroes());
    const store = new HistoryStore(HISTORY_DIR, { isIgnored });
    const weeks = store.loadLatest(2);
    const isNft = makeIsNft(loadNftHeroes());
    const thresholds = loadThresholds();
    const colorize = makeColorizer(thresholds);

    if (weeks.length === 0) {
      console.error("No history files. Run `npm run contribution extract` first.");
      process.exit(1);
    }

    if (weeks.length === 1) {
      console.log(`Only one week of data so far (${weeks[0].date}). No diff possible yet.\n`);
      console.log(renderWeekRecord(weeks[0], { isNft, isIgnored }));
      return;
    }

    const streaks = computeUnderThresholdStreaks(store, thresholds.green);
    const [previous, current] = weeks;
    console.log(renderDiff(new WeekDiff(previous, current), { isNft, isIgnored, colorize, streaks }));
  }
}
