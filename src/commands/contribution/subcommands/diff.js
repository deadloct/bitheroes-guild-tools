import { Command } from "../../../cli/command.js";
import { WeekDiff } from "../diff.js";
import { HistoryStore } from "../history.js";
import { HISTORY_DIR } from "../paths.js";
import { renderDiff, renderWeekRecord } from "../render.js";

export class DiffSubcommand extends Command {
  name = "diff";
  description = "Compute diff between the latest two history files";

  async run() {
    const weeks = new HistoryStore(HISTORY_DIR).loadLatest(2);

    if (weeks.length === 0) {
      console.error("No history files. Run `npm run contribution extract` first.");
      process.exit(1);
    }

    if (weeks.length === 1) {
      console.log(`Only one week of data so far (${weeks[0].date}). No diff possible yet.\n`);
      console.log(renderWeekRecord(weeks[0]));
      return;
    }

    const [previous, current] = weeks;
    console.log(renderDiff(new WeekDiff(previous, current)));
  }
}
