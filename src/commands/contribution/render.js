function formatNumber(n) {
  return n.toLocaleString("en-US");
}

export function renderDiff(diff) {
  const header = `Weekly contribution: ${diff.previous.date} -> ${diff.current.date}`;
  const lines = [header, "=".repeat(header.length)];

  const longest = Math.max(20, ...diff.changes.map((c) => c.name.length));
  diff.changes.forEach((c, i) => {
    const rank = String(i + 1).padStart(3);
    const name = c.name.padEnd(longest);
    const weekly = ((c.weekly >= 0 ? "+" : "") + formatNumber(c.weekly)).padStart(16);
    lines.push(`  ${rank}. ${name}  ${weekly}   (total: ${formatNumber(c.total)})`);
  });

  if (diff.newMembers.length > 0) {
    lines.push("", "New members (no prior data):");
    for (const m of diff.newMembers) {
      lines.push(`  - ${m.name} (total: ${formatNumber(m.contribution)})`);
    }
  }
  if (diff.departed.length > 0) {
    lines.push("", "Members in previous week but not current:");
    for (const m of diff.departed) lines.push(`  - ${m.name}`);
  }
  return lines.join("\n");
}

export function renderWeekRecord(week) {
  const lines = [`Current totals (${week.members.length} members):`];
  const longest = Math.max(20, ...week.members.map((m) => m.name.length));
  week.members.forEach((m, i) => {
    const rank = String(i + 1).padStart(3);
    lines.push(`  ${rank}. ${m.name.padEnd(longest)}  ${formatNumber(m.contribution)}`);
  });
  return lines.join("\n");
}
