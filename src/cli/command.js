export class Command {
  name = "";
  description = "";

  async run(_args) {
    throw new Error(`${this.constructor.name}.run() not implemented`);
  }
}

export class CompositeCommand extends Command {
  constructor() {
    super();
    this.subcommands = new Map();
  }

  register(subcommand) {
    this.subcommands.set(subcommand.name, subcommand);
  }

  async run(args) {
    const [name, ...rest] = args;
    const sub = this.subcommands.get(name);
    if (!sub) {
      this.#printUsage();
      process.exit(name ? 1 : 0);
    }
    await sub.run(rest);
  }

  #printUsage() {
    console.error(`Usage: ${this.name} <subcommand>`);
    console.error("");
    if (this.description) {
      console.error(this.description);
      console.error("");
    }
    console.error("Subcommands:");
    const width = Math.max(...[...this.subcommands.values()].map((s) => s.name.length));
    for (const sub of this.subcommands.values()) {
      console.error(`  ${sub.name.padEnd(width)}   ${sub.description}`);
    }
  }
}
