export function computeUnderThresholdStreaks(historyStore, threshold) {
  const dates = historyStore.listDates();
  const streaks = new Map();
  if (dates.length === 0) return streaks;

  const latest = historyStore.load(dates[dates.length - 1]);
  const unresolved = new Map();
  for (const m of latest.members) {
    streaks.set(m.name, 0);
    unresolved.set(m.name, m.contribution);
  }

  for (let i = dates.length - 2; i >= 0 && unresolved.size > 0; i--) {
    const prev = historyStore.load(dates[i]);
    const prevMap = prev.memberMap();
    for (const [name, newerContrib] of [...unresolved]) {
      if (!prevMap.has(name)) {
        unresolved.delete(name);
        continue;
      }
      const prevContrib = prevMap.get(name);
      const delta = newerContrib - prevContrib;
      if (delta < threshold) {
        streaks.set(name, streaks.get(name) + 1);
        unresolved.set(name, prevContrib);
      } else {
        unresolved.delete(name);
      }
    }
  }

  return streaks;
}
