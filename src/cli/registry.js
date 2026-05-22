export class CommandRegistry {
  constructor(programName) {
    this.programName = programName;
    this.commands = new Map();
  }

  register(command) {
    this.commands.set(command.name, command);
  }

  async run(name, args) {
    const command = this.commands.get(name);
    if (!command) {
      this.#printUsage();
      process.exit(name ? 1 : 0);
    }
    await command.run(args);
  }

  #printUsage() {
    console.error(`Usage: ${this.programName} <command> [args]`);
    console.error("");
    console.error("Commands:");
    const width = Math.max(...[...this.commands.values()].map((c) => c.name.length));
    for (const cmd of this.commands.values()) {
      console.error(`  ${cmd.name.padEnd(width)}   ${cmd.description}`);
    }
  }
}
