#!/usr/bin/env node
import { CommandRegistry } from "./src/cli/registry.js";
import { contributionCommand } from "./src/commands/contribution/command.js";

const registry = new CommandRegistry("guild-tools");
registry.register(contributionCommand);

const [, , commandName, ...rest] = process.argv;

try {
  await registry.run(commandName, rest);
} catch (err) {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
}
