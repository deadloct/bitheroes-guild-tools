import fs from "fs";
import path from "path";
import { Command } from "../../../cli/command.js";
import { PROCESSED_DIR, REPO_ROOT, SCREENSHOTS_DIR } from "../paths.js";
import { ScreenshotSet } from "../screenshots.js";

export class ArchiveSubcommand extends Command {
  name = "archive";
  description = "Move processed screenshots into screenshots/processed/YYYY-MM-DD/";

  async run() {
    const screenshots = ScreenshotSet.fromDir(SCREENSHOTS_DIR);
    if (screenshots.isEmpty()) {
      console.log("No screenshots in screenshots/ to archive.");
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const dest = path.join(PROCESSED_DIR, dateStr);
    fs.mkdirSync(dest, { recursive: true });

    for (const file of screenshots.files) {
      const target = path.join(dest, path.basename(file));
      fs.renameSync(file, target);
      console.log(`  ${path.basename(file)} -> ${path.relative(REPO_ROOT, target)}`);
    }
    console.log(`\nMoved ${screenshots.length} screenshot(s) to ${path.relative(REPO_ROOT, dest)}/`);
  }
}
