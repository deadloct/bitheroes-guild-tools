export class WeekDiff {
  constructor(previous, current) {
    this.previous = previous;
    this.current = current;
    this.changes = [];
    this.newMembers = [];
    this.departed = [];
    this.#compute();
  }

  #compute() {
    const prevMap = this.previous.memberMap();
    const curMap = this.current.memberMap();

    for (const m of this.current.members) {
      if (prevMap.has(m.name)) {
        this.changes.push({
          name: m.name,
          weekly: m.contribution - prevMap.get(m.name),
          total: m.contribution,
        });
      } else {
        this.newMembers.push(m);
      }
    }
    for (const m of this.previous.members) {
      if (!curMap.has(m.name)) this.departed.push(m);
    }
    this.changes.sort((a, b) => b.weekly - a.weekly);
  }
}
