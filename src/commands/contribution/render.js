function formatNumber(n) {
  return n.toLocaleString("en-US");
}

const noopColorize = (_weekly, text) => text;

function appendRankedChanges(lines, changes, colorize, streaks, { showNewNote = true } = {}) {
  const longest = Math.max(20, ...changes.map((c) => c.name.length));
  changes.forEach((c, i) => {
    const rank = String(i + 1).padStart(3);
    const name = c.name.padEnd(longest);
    const weekly = ((c.weekly >= 0 ? "+" : "") + formatNumber(c.weekly)).padStart(16);
    const streak = streaks.get(c.name) ?? 0;
    const note =
      c.isNew && showNewNote
        ? "  (new member)"
        : streak >= 1
          ? `  (under reqs: ${streak}w)`
          : "";
    const row = `  ${rank}. ${name}  ${weekly}   (total: ${formatNumber(c.total)})${note}`;
    lines.push(colorize(c.weekly, row));
  });
}

function appendRankedMembers(lines, members) {
  const longest = Math.max(20, ...members.map((m) => m.name.length));
  members.forEach((m, i) => {
    const rank = String(i + 1).padStart(3);
    lines.push(`  ${rank}. ${m.name.padEnd(longest)}  ${formatNumber(m.contribution)}`);
  });
}

function mergeNewMembers(diff) {
  const newAsChanges = diff.newMembers.map((m) => ({
    name: m.name,
    weekly: m.contribution,
    total: m.contribution,
    isNew: true,
  }));
  return [...diff.changes, ...newAsChanges].sort((a, b) => b.weekly - a.weekly);
}

export function renderDiff(
  diff,
  { isNft = () => false, isIgnored = () => false, colorize = noopColorize, streaks = new Map() } = {},
) {
  const header = `Weekly contribution: ${diff.previous.date} -> ${diff.current.date}`;
  const lines = [header, "=".repeat(header.length)];

  const allChanges = mergeNewMembers(diff).filter((c) => !isIgnored(c.name));

  const basicChanges = allChanges.filter((c) => !isNft(c.name));
  const nftChanges = allChanges.filter((c) => isNft(c.name));

  lines.push("", `Basic heroes (${basicChanges.length}):`);
  if (basicChanges.length > 0) appendRankedChanges(lines, basicChanges, colorize, streaks);
  else lines.push("  (none)");

  lines.push("", `NFT heroes (${nftChanges.length}):`);
  if (nftChanges.length > 0) appendRankedChanges(lines, nftChanges, colorize, streaks);
  else lines.push("  (none)");

  const departed = diff.departed.filter((m) => !isIgnored(m.name));
  if (departed.length > 0) {
    lines.push("", "Members in previous week but not current:");
    for (const m of departed) {
      const label = isNft(m.name) ? " [NFT]" : "";
      lines.push(`  - ${m.name}${label}`);
    }
  }
  return lines.join("\n");
}

export function renderLeaderboard(
  diff,
  { isNft = () => false, isIgnored = () => false, colorize = noopColorize, streaks = new Map(), threshold = 0, top = 10 } = {},
) {
  const header = `Leaderboard: ${diff.previous.date} -> ${diff.current.date}`;
  const lines = [header, "=".repeat(header.length)];

  const qualifying = mergeNewMembers(diff)
    .filter((c) => !isIgnored(c.name))
    .filter((c) => c.weekly >= threshold);
  const basic = qualifying.filter((c) => !isNft(c.name)).slice(0, top);
  const nft = qualifying.filter((c) => isNft(c.name)).slice(0, top);

  lines.push("", `Basic heroes (${basic.length}):`);
  if (basic.length > 0) appendRankedChanges(lines, basic, colorize, streaks, { showNewNote: false });
  else lines.push("  (none)");

  lines.push("", `NFT heroes (${nft.length}):`);
  if (nft.length > 0) appendRankedChanges(lines, nft, colorize, streaks, { showNewNote: false });
  else lines.push("  (none)");

  return lines.join("\n");
}

export function renderWeekRecord(week, { isNft = () => false, isIgnored = () => false } = {}) {
  const activeMembers = week.members.filter((m) => !isIgnored(m.name));
  const basic = activeMembers.filter((m) => !isNft(m.name));
  const nft = activeMembers.filter((m) => isNft(m.name));
  const lines = [`Current totals (${activeMembers.length} members):`];

  lines.push("", `Basic heroes (${basic.length}):`);
  if (basic.length > 0) appendRankedMembers(lines, basic);
  else lines.push("  (none)");

  lines.push("", `NFT heroes (${nft.length}):`);
  if (nft.length > 0) appendRankedMembers(lines, nft);
  else lines.push("  (none)");

  return lines.join("\n");
}
