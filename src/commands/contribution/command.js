import { CompositeCommand } from "../../cli/command.js";
import { ArchiveSubcommand } from "./subcommands/archive.js";
import { DiffSubcommand } from "./subcommands/diff.js";
import { ExtractSubcommand } from "./subcommands/extract.js";
import { LeaderboardSubcommand } from "./subcommands/leaderboard.js";

class ContributionCommand extends CompositeCommand {
  name = "contribution";
  description = "Track guild member weekly contribution from CONTRIBUTION-screen screenshots.";

  constructor() {
    super();
    this.register(new ExtractSubcommand());
    this.register(new DiffSubcommand());
    this.register(new LeaderboardSubcommand());
    this.register(new ArchiveSubcommand());
  }
}

export const contributionCommand = new ContributionCommand();
