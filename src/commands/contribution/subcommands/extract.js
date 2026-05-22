import path from "path";
import { Command } from "../../../cli/command.js";
import { Extractor } from "../extractor.js";
import { HistoryStore } from "../history.js";
import { ScreenshotSet } from "../screenshots.js";
import { HISTORY_DIR, REPO_ROOT, SCREENSHOTS_DIR } from "../paths.js";

export class ExtractSubcommand extends Command {
  name = "extract";
  description = "Call Claude API on screenshots/ -> history/YYYY-MM-DD.json";

  async run() {
    const screenshots = ScreenshotSet.fromDir(SCREENSHOTS_DIR);
    if (screenshots.isEmpty()) {
      console.error(`No screenshots found in ${path.relative(REPO_ROOT, SCREENSHOTS_DIR)}/`);
      process.exit(1);
    }

    console.log(`Found ${screenshots.length} screenshot(s):`);
    for (const name of screenshots.basenames()) console.log(`  - ${name}`);

    console.log("\nCalling Claude API to extract contribution data...");
    const { members, usage } = await new Extractor().extract(screenshots);

    const outPath = new HistoryStore(HISTORY_DIR).write(new Date(), members);

    console.log(`\nWrote ${members.length} members to ${path.relative(REPO_ROOT, outPath)}`);
    console.log(`Usage: ${usage.input_tokens} input, ${usage.output_tokens} output tokens`);
    console.log("\nReview the file for OCR errors, then:");
    console.log("  npm run contribution diff      # weekly diff vs previous week");
    console.log("  npm run contribution archive   # move screenshots into processed/");
  }
}
