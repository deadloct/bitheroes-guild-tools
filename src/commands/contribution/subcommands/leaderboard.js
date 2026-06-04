import { Command } from "../../../cli/command.js";
import { makeColorizer } from "../colors.js";
import { WeekDiff } from "../diff.js";
import { HistoryStore } from "../history.js";
import { loadNftHeroes, makeIsNft } from "../nftHeroes.js";
import { HISTORY_DIR } from "../paths.js";
import { renderLeaderboard } from "../render.js";
import { computeUnderThresholdStreaks } from "../streaks.js";
import { loadThresholds } from "../thresholds.js";

export class LeaderboardSubcommand extends Command {
  name = "leaderboard";
  description = "Show the top 10 weekly contributors (basic and NFT) that met requirements";

  async run() {
    const store = new HistoryStore(HISTORY_DIR);
    const weeks = store.loadLatest(2);
    const isNft = makeIsNft(loadNftHeroes());
    const thresholds = loadThresholds();
    const colorize = makeColorizer(thresholds);

    if (weeks.length < 2) {
      console.error("Need at least two weeks of data for a leaderboard. Run `npm run contribution extract` first.");
      process.exit(1);
    }

    const streaks = computeUnderThresholdStreaks(store, thresholds.green);
    const [previous, current] = weeks;
    console.log(
      renderLeaderboard(new WeekDiff(previous, current), {
        isNft,
        colorize,
        streaks,
        threshold: thresholds.green,
      }),
    );
  }
}
