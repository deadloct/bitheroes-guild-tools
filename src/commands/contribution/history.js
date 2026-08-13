import fs from "fs";
import path from "path";

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

export class WeekRecord {
  constructor(date, members) {
    this.date = date;
    this.members = members;
  }

  memberMap() {
    return new Map(this.members.map((m) => [m.name, m.contribution]));
  }
}

export class HistoryStore {
  constructor(dir, { isIgnored = () => false } = {}) {
    this.dir = dir;
    this.isIgnored = isIgnored;
  }

  write(date, members) {
    fs.mkdirSync(this.dir, { recursive: true });
    const dateStr = toDateString(date);
    const outPath = path.join(this.dir, `${dateStr}.json`);
    fs.writeFileSync(outPath, JSON.stringify(members, null, 2) + "\n");
    return outPath;
  }

  listDates() {
    if (!fs.existsSync(this.dir)) return [];
    return fs
      .readdirSync(this.dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .map((f) => f.slice(0, 10));
  }

  load(dateStr) {
    const filePath = path.join(this.dir, `${dateStr}.json`);
    const rawMembers = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const members = rawMembers.filter((m) => !this.isIgnored(m.name));
    return new WeekRecord(dateStr, members);
  }

  loadLatest(n) {
    return this.listDates().slice(-n).map((d) => this.load(d));
  }
}
